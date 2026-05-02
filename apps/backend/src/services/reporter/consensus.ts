import { getReportsForConstituency, type UserReport } from '../db/reports-store.js';

interface ConsensusResult {
  stage: string;
  totalWeight: number;
  thresholdMet: boolean;
  reportCount: number;
}

const THRESHOLD_SUM = 10.0;
const THRESHOLD_PERCENT = 0.6;

export async function calculateConsensus(acId: string): Promise<ConsensusResult | null> {
  const reports = await getReportsForConstituency(acId);
  
  if (reports.length === 0) {
    return null;
  }

  const now = Date.now();
  const windowMs = 12 * 60 * 60 * 1000;
  const recent = reports.filter(r => {
    const reportTime = new Date(r.timestamp).getTime();
    return (now - reportTime) < windowMs;
  });

  if (recent.length === 0) {
    return null;
  }

  const stageWeights = new Map<string, number>();
  
  for (const report of recent) {
    const current = stageWeights.get(report.reportedStage) || 0;
    stageWeights.set(report.reportedStage, current + report.trustScore);
  }

  let bestStage = '';
  let bestWeight = 0;
  let totalWeight = 0;

  for (const [stage, weight] of stageWeights) {
    totalWeight += weight;
    if (weight > bestWeight) {
      bestWeight = weight;
      bestStage = stage;
    }
  }

  const thresholdMet = bestWeight >= THRESHOLD_SUM && 
    (bestWeight / totalWeight) >= THRESHOLD_PERCENT;

  return {
    stage: bestStage,
    totalWeight: bestWeight,
    thresholdMet,
    reportCount: recent.length,
  };
}

export function updateInferredStage(
  acId: string, 
  consensus: ConsensusResult
): void {
  if (!consensus.thresholdMet) {
    return;
  }
  
  console.log(`[Consensus] Updating AC ${acId} inferred stage to: ${consensus.stage}`);
}