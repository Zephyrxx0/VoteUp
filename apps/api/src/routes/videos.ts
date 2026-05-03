import express from 'express';
import { getYouTubeVideos } from '../services/youtube.ts';

const router = express.Router();

router.get('/videos', async (req, res) => {
  try {
    const { countryCode, stageId } = req.query;
    
    if (!countryCode || !stageId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const videos = await getYouTubeVideos(countryCode as string, stageId as string);
    res.json(videos);
  } catch (error) {
    console.error('Videos error:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

export default router;
