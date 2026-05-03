import { point, booleanPointInPolygon } from '@turf/turf';
import fs from 'fs';
import path from 'path';

type GeoJSONGeometry = {
  type: string;
  coordinates: number[][][] | number[][][][];
};

type ConstituencyFeature = {
  type: string;
  geometry: GeoJSONGeometry;
  properties: Record<string, unknown>;
};

const constituencyCache = new Map<string, ConstituencyFeature>();

export async function loadConstituencyData(): Promise<void> {
  const dataPath = path.join(process.cwd(), 'data', 'maps', 'india_ac_pc.json');
  
  if (!fs.existsSync(dataPath)) {
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  
  if (data.features) {
    for (const f of data.features) {
      const props = f.properties as Record<string, unknown>;
      const id = (props?.id as string) || (props?.AC_ID as string) || (props?.PC_ID as string);
      if (id && f.geometry) {
        constituencyCache.set(id, f as ConstituencyFeature);
      }
    }
  }
}

export function getConstituencyByCoords(lat: number, lng: number): {
  acId: string | null;
  pcId: string | null;
  state: string | null;
  confidence: number;
} {
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return { acId: null, pcId: null, state: null, confidence: 0 };
  }
  
  const pt = point([lng, lat]);
  let bestMatch: { id: string; type: string; state: string } | null = null;
  let highestConfidence = 0;
  
  for (const [id, feat] of constituencyCache) {
    const props = feat.properties;
    const geometry = feat.geometry;
    
    if (!geometry) continue;
    
    let matches = false;
    if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
      matches = booleanPointInPolygon(pt, feat as never);
    }
    
    if (matches) {
      const state = (props?.state as string) || (props?.State as string) || '';
      const type = (props?.type as string) || (props?.TYPE as string) || 'AC';
      
      let confidence = 0.9;
      if (type === 'AC') confidence = 0.95;
      
      if (confidence > highestConfidence) {
        highestConfidence = confidence;
        bestMatch = { id, type, state };
      }
    }
  }
  
  if (bestMatch) {
    const isAC = bestMatch.type === 'AC';
    return {
      acId: isAC ? bestMatch.id : null,
      pcId: isAC ? null : bestMatch.id,
      state: bestMatch.state,
      confidence: highestConfidence,
    };
  }
  
  return { acId: null, pcId: null, state: null, confidence: 0 };
}