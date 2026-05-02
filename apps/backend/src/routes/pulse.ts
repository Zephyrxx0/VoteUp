import express from 'express';
import { getStageCompletionCount } from '../services/db/pulse-store.ts';

const router = express.Router();

router.get('/:acId/stages/:stage', async (req, res) => {
  const { acId, stage } = req.params;
  const parsedStage = Number(stage);

  if (!acId || acId.trim().length === 0) {
    return res.status(400).json({
      error: 'Invalid acId parameter',
      message: 'acId must be a non-empty string',
    });
  }

  if (!Number.isInteger(parsedStage) || parsedStage < 1 || parsedStage > 8) {
    return res.status(400).json({
      error: 'Invalid stage parameter',
      message: 'stage must be an integer between 1 and 8',
    });
  }

  try {
    const count = await getStageCompletionCount(acId.trim(), parsedStage);
    return res.json({
      acId: acId.trim(),
      stage: parsedStage,
      count,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Unable to fetch pulse count',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
