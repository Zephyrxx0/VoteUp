import { beforeEach, test } from 'node:test';
import assert from 'node:assert';
import * as reportsStore from '../src/services/db/reports-store.ts';

const mockReports = [
  { id: '1', acId: 'AC01', reportedStage: 'Queueing', timestamp: new Date().toISOString(), trustScore: 7.0 },
  { id: '2', acId: 'AC01', reportedStage: 'Queueing', timestamp: new Date().toISOString(), trustScore: 5.0 },
  { id: '3', acId: 'AC01', reportedStage: 'Voting', timestamp: new Date().toISOString(), trustScore: 4.0 },
];

import { calculateConsensus } from '../src/services/reporter/consensus.ts';

beforeEach(() => {
  reportsStore.__clearReportsForTest();
});

test('RPT-01: calculateConsensus - trust-weighted agreement', async () => {
  reportsStore.__setReportsForTest('AC01', mockReports as any);
  const result = await calculateConsensus('AC01');
  
  assert.ok(result);
  assert.strictEqual(result.stage, 'Queueing');
  assert.strictEqual(result.totalWeight, 12.0); // 7 + 5
  assert.strictEqual(result.thresholdMet, true); // (12 >= 10) && (12/16 >= 0.6)
});
