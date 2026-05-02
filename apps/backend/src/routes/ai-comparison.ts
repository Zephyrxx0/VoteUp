import express from 'express';
import { z } from 'zod';
import { generateComparison } from '../services/ai/comparison-generator.ts';

const router = express.Router();

const compareRequestSchema = z.object({
  homeCountry: z.string().trim().min(2).max(80),
});

router.post('/api/compare', async (req, res) => {
  const parsed = compareRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid request payload',
      message: 'homeCountry must be a string between 2 and 80 characters',
    });
  }

  try {
    const comparison = await generateComparison(parsed.data.homeCountry);
    return res.json(comparison);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[AIComparison] failed to generate comparison', message);
    return res.status(500).json({
      error: 'Unable to generate AI comparison',
    });
  }
});

export default router;
