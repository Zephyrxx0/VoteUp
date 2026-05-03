import express from 'express';
import { translateContent } from '../services/gemini.ts';

const router = express.Router();

router.post('/translate', async (req, res) => {
  try {
    const { content, targetLanguage } = req.body;
    
    if (!content || !targetLanguage) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const translated = await translateContent(content, targetLanguage);
    res.json({ translated });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Failed to translate' });
  }
});

export default router;
