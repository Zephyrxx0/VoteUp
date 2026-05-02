import express from 'express';
import { getConstituencyByCoords } from '../services/geo/mapper.ts';

const router = express.Router();

router.post('/api/geo/map', function(req, res) {
  const { lat, lng } = req.body;
  
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ 
      error: 'Invalid coordinates',
      message: 'lat and lng must be numbers'
    });
  }
  
  const result = getConstituencyByCoords(lat, lng);
  
  res.json(result);
});

export default router;
