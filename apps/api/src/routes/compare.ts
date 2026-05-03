import express from 'express';
import { generateComparison, translateContent } from '../services/gemini.ts';
import { getCachedData, setCachedData } from '../services/db/cache-service.ts';
import { StageComparison } from '@voteup/contracts';

const router = express.Router();

router.post('/comparison', async (req, res) => {
  try {
    const { homeCountry, newCountry, stageId, homeSystemName, newSystemName, language } = req.body;
    
    if (!homeCountry || !newCountry || !stageId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Check cache first
    const cacheKey = [homeCountry, newCountry, stageId, language || 'en'];
    const cached = await getCachedData<StageComparison>('gemini_cache', cacheKey);
    
    if (cached) {
      return res.json(cached);
    }

    // Generate fresh comparison
    const comparison = await generateComparison(
      homeCountry, 
      newCountry, 
      stageId, 
      homeSystemName || 'Electoral System', 
      newSystemName || 'Electoral System'
    );

    let result: StageComparison = comparison;

    if (language && language !== 'en') {
      const translatedString = await translateContent(JSON.stringify(comparison), language);
      try {
        result = JSON.parse(translatedString);
      } catch (e) {
        console.error("Failed to parse translated JSON", e);
      }
    }

    // Store in cache
    await setCachedData('gemini_cache', cacheKey, result);

    res.json(result);
  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({ error: 'Failed to generate comparison' });
  }
});

export default router;

