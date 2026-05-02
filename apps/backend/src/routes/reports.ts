import express from 'express';
import type { Express } from 'express';
import { submitUserReport, getUserTrustScore } from '../services/db/reports-store.js';
import { calculateConsensus, updateInferredStage } from '../services/reporter/consensus.js';

const router = express.Router();

router.post('/api/reports', async (req, res) => {
  try {
    const { userId, acId, reportedStage } = req.body;
    
    if (!userId || !acId || !reportedStage) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['userId', 'acId', 'reportedStage']
      });
    }
    
    const trustScore = await getUserTrustScore(userId);
    
    const report = await submitUserReport({
      userId,
      acId,
      reportedStage,
      trustScore,
    });
    
    if (!report) {
      return res.status(503).json({ 
        error: 'Reporting temporarily unavailable',
        hint: 'Configure Firebase to enable community reporting'
      });
    }
    
    const consensus = await calculateConsensus(acId);
    if (consensus?.thresholdMet) {
      updateInferredStage(acId, consensus);
    }
    
    res.status(201).json({ success: true, report });
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ error: 'Internal error' });
  }
});

export default router;