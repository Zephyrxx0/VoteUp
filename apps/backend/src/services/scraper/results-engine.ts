import { chromium } from 'playwright';
import type { CandidateResult } from '../db/results-cache.ts';

const RESULTS_BASE_URL = 'https://results.eci.gov.in/ResultAcGenMay2026';
const ID_PATTERN = /^S\d{4}$/;

function parseVoteCount(input: string): number {
  const normalized = input.replace(/,/g, '').trim();
  const parsed = Number.parseInt(normalized, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function parseCandidateResultsFromHtml(html: string): CandidateResult[] {
  const tableMatch = html.match(/<table[\s\S]*?<\/table>/i);
  if (!tableMatch) return [];

  const tableHtml = tableMatch[0];
  const headerMatches = [...tableHtml.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)].map((m) =>
    m[1].replace(/<[^>]*>/g, '').trim(),
  );

  const nameIndex = headerMatches.findIndex((h) => /candidate|name/i.test(h));
  const partyIndex = headerMatches.findIndex((h) => /party/i.test(h));
  const votesIndex = headerMatches.findIndex((h) => /vote/i.test(h));
  const statusIndex = headerMatches.findIndex((h) => /status|lead|won/i.test(h));

  if (nameIndex < 0 || partyIndex < 0 || votesIndex < 0 || statusIndex < 0) return [];

  const rows = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].slice(1);
  const parsed: CandidateResult[] = [];

  for (const rowMatch of rows) {
    const row = rowMatch[1];
    const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((m) =>
      m[1].replace(/<[^>]*>/g, '').trim(),
    );

    if (cells.length === 0) continue;

    const status = cells[statusIndex] ?? '';
    if (!/leading|won/i.test(status)) continue;

    parsed.push({
      candidate: cells[nameIndex] ?? '',
      party: cells[partyIndex] ?? '',
      votes: parseVoteCount(cells[votesIndex] ?? '0'),
      status,
    });
  }

  return parsed;
}

export async function scrapeConstituencyResults(constituencyId: string): Promise<CandidateResult[]> {
  if (!ID_PATTERN.test(constituencyId)) {
    throw new Error('Invalid constituency id');
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    extraHTTPHeaders: {
      'Accept-Language': 'en-IN,en;q=0.9',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    },
  });

  try {
    const url = `${RESULTS_BASE_URL}/Constituencywise${constituencyId}.htm`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const html = await page.content();
    return parseCandidateResultsFromHtml(html);
  } finally {
    await page.close();
    await browser.close();
  }
}
