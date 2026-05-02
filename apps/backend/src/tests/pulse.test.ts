import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';
import {
  __resetGetFirestoreForTest,
  __setGetFirestoreForTest,
  getStageCompletionCount,
} from '../services/db/pulse-store.ts';

afterEach(() => {
  __resetGetFirestoreForTest();
});

describe('getStageCompletionCount', () => {
  it('returns aggregated count for matching acId and stage', async () => {
    const getSpy = mock.fn(async () => ({
      data: () => ({ count: 7 }),
    }));

    const countSpy = mock.fn(() => ({
      get: getSpy,
    }));

    const whereStageSpy = mock.fn(() => ({
      count: countSpy,
    }));

    const whereAcSpy = mock.fn(() => ({
      where: whereStageSpy,
    }));

    const collectionSpy = mock.fn(() => ({
      where: whereAcSpy,
    }));

    const getFirestoreMock = mock.fn(() => ({
      collection: collectionSpy,
    }) as never);
    __setGetFirestoreForTest(getFirestoreMock as never);

    const count = await getStageCompletionCount('ac-123', 3);

    assert.equal(count, 7);
    assert.equal(collectionSpy.mock.calls.length, 1);
    assert.deepEqual(collectionSpy.mock.calls[0]?.arguments, ['reports']);
    assert.equal(whereAcSpy.mock.calls.length, 1);
    assert.deepEqual(whereAcSpy.mock.calls[0]?.arguments, ['acId', '==', 'ac-123']);
    assert.equal(whereStageSpy.mock.calls.length, 1);
    assert.deepEqual(whereStageSpy.mock.calls[0]?.arguments, ['reportedStage', '==', '3']);
    assert.equal(countSpy.mock.calls.length, 1);
    assert.equal(getSpy.mock.calls.length, 1);

    assert.equal(getFirestoreMock.mock.calls.length, 1);
  });
});
