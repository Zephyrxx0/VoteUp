import express from 'express';
import { resolveCurrentStage, type Stage } from '../services/db/constituency-store.ts';
import { resultsCache, type CandidateResult } from '../services/db/results-cache.ts';
import { scrapeConstituencyResults } from '../services/scraper/results-engine.ts';

const router = express.Router();
const CONSTITUENCY_PATTERN = /^S\d{4}$/;

router.get('/:id/status', async (req, res) => {
  const constituencyId = String(req.params.id ?? '').trim().toUpperCase();

  if (!CONSTITUENCY_PATTERN.test(constituencyId)) {
    return res.status(400).json({
      error: 'Invalid constituency id',
      message: 'Expected format S#### (e.g., S2477)',
    });
  }

  const stage: Stage = resolveCurrentStage({});
  let results: CandidateResult[] = resultsCache.get(constituencyId) ?? [];

  if (results.length === 0 && stage === 'Counting') {
    try {
      results = await scrapeConstituencyResults(constituencyId);
      resultsCache.set(constituencyId, results);
    } catch (error) {
      return res.status(502).json({
        error: 'Failed to fetch live results',
        message: error instanceof Error ? error.message : 'Unknown scraper error',
      });
    }
  }

  return res.json({ stage, results });
});

export default router;
