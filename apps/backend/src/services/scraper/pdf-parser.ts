import fs from 'fs';
import https from 'https';
import http from 'http';

export interface ExtractedSchedule {
  state: string;
  constituency: string;
  acId?: string;
  pcId?: string;
  stages: {
    notification?: string;
    nominationLast?: string;
    scrutiny?: string;
    withdrawal?: string;
    polling?: string;
    counting?: string;
  };
}

interface ParsedPDFText {
  text: string;
  pageCount: number;
}

const STAGE_PATTERNS = {
  notification: /issue\s*(?:of\s*)?notification/i,
  nominationLast: /last\s*date\s*(?:for\s*)?nomination/i,
  scrutiny: /scrutiny/i,
  withdrawal: /withdrawal/i,
  polling: /polling/i,
  counting: /counting/i,
};

const EIGHT_STAGES = [
  'Notification Issued',
  'Nomination Last Date',
  'Scrutiny',
  'Withdrawal',
  'Polling',
  'Counting',
  'Result Declared',
  'Bye-election Complete',
] as const;

function downloadPDF(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          downloadPDF(redirectUrl).then(resolve).catch(reject);
          return;
        }
      }
      
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      
      const chunks: Buffer[] = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
    
    req.on('error', reject);
    req.setTimeout(30000);
  });
}

async function parsePDFText(buffer: Buffer): Promise<ParsedPDFText> {
  try {
    const pdfParseModule = await import('pdf-parse');
    const defaultExport = (pdfParseModule as unknown as { default: (buf: Buffer) => Promise<{ text: string; numpages: number }> }).default;
    const data = await defaultExport(buffer);
    return {
      text: data.text || '',
      pageCount: data.numpages || 0,
    };
  } catch {
    return { text: buffer.toString('utf-8'), pageCount: 1 };
  }
}

export async function parseECISchedulePDF(url: string): Promise<ExtractedSchedule[]> {
  const schedules: ExtractedSchedule[] = [];
  
  try {
    const pdfBuffer = await downloadPDF(url);
    const parsed = await parsePDFText(pdfBuffer);
    
    const lines = parsed.text.split('\n').map(l => l.trim()).filter(Boolean);
    
    let currentState = '';
    let currentConstituency = '';
    
    for (const line of lines) {
      if (looksLikeState(line)) {
        currentState = line;
        continue;
      }
      
      if (looksLikeConstituency(line)) {
        currentConstituency = line;
        continue;
      }
      
      const dates = extractDates(line);
      if (dates && dates.polling) {
        schedules.push({
          state: currentState,
          constituency: currentConstituency,
          stages: dates,
        });
      }
    }
    
    if (schedules.length === 0) {
      const fallback = parseGenericText(parsed.text);
      schedules.push(...fallback);
    }
  } catch (error) {
    console.error('Error parsing PDF:', error);
  }
  
  return schedules;
}

function looksLikeState(text: string): boolean {
  const states = /^(andhra\s*pradesh|arunachal|assam|bihar|chhattisgarh|goa|gujarat|haryana|himachal|jharkhand|karnataka|kerala|madhya\s*pradesh|maharashtra|manipur|meghalaya|mizoram|nagaland|odisha|punjab|rajasthan|sikkim|tamil\s*nadu|telangana|tripura|uttar\s*pradesh|uttarakhand|west\s*bengal|delhi|puducherry|jammu|kashmir|ladakh)$/i;
  return states.test(text.trim());
}

function looksLikeConstituency(text: string): boolean {
  return /^(ac|pc|constituency|assembly|parliament)/i.test(text.trim()) || 
         /\d{2,4}$/.test(text);
}

function extractDates(line: string): ExtractedSchedule['stages'] | null {
  const datePattern = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/g;
  const dates: string[] = [];
  let match: RegExpExecArray | null;
  
  while ((match = datePattern.exec(line)) !== null) {
    dates.push(match[0]);
  }
  
  if (dates.length === 0) return null;
  
  return {
    polling: dates[0] || undefined,
    counting: dates[1] || undefined,
  };
}

function parseGenericText(text: string): ExtractedSchedule[] {
  const schedules: ExtractedSchedule[] = [];
  
  const datePattern = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/g;
  const allDates: string[] = [];
  let match: RegExpExecArray | null;
  
  while ((match = datePattern.exec(text)) !== null) {
    allDates.push(match[0]);
  }
  
  if (allDates.length >= 2) {
    schedules.push({
      state: 'Multiple States',
      constituency: 'All',
      stages: {
        polling: allDates[0],
        counting: allDates[1],
      },
    });
  }
  
  return schedules;
}

export { EIGHT_STAGES };