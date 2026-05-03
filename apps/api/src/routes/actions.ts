import express from 'express';
import { generateActions, translateContent } from '../services/gemini.ts';
import { getCachedData, setCachedData } from '../services/db/cache-service.ts';
import { PersonalisedActions } from '@voteup/contracts';

const router = express.Router();

router.post('/actions', async (req, res) => {
  try {
    const { homeCountry, newCountry, stageId, language, registrationStatus, lat, lng } = req.body;
    
    if (!newCountry || !stageId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Check cache first
    const cacheKey = [newCountry, stageId, language || 'en', registrationStatus || 'unknown'];
    const cached = await getCachedData<PersonalisedActions>('actions_cache', cacheKey);
    
    if (cached) {
      return res.json(cached);
    }

    // Generate fresh actions
    const actions = await generateActions(newCountry, stageId, stageId);
    
    let result: PersonalisedActions = actions;

    // Handle mandatory registration check if unknown
    if (registrationStatus === 'unknown' || !registrationStatus) {
      result.items.unshift({
        id: 'registration_check',
        priority: 'urgent',
        title: 'Check your voter registration',
        description: `Ensure you are eligible to vote in the upcoming election in ${newCountry}.`,
        ctaType: 'external_url',
        ctaPayload: `https://www.google.com/search?q=voter+registration+check+${newCountry}`
      });
    }

    if (language && language !== 'en') {
      const translatedString = await translateContent(JSON.stringify(result), language);
      try {
        result = JSON.parse(translatedString);
      } catch (e) {
        console.error("Failed to parse translated JSON", e);
      }
    }

    // Store in cache
    await setCachedData('actions_cache', cacheKey, result);

    res.json(result);
  } catch (error) {
    console.error('Actions error:', error);
    res.status(500).json({ error: 'Failed to generate actions' });
  }
});

export default router;

