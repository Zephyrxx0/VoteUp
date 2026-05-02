import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';
import * as firestore from 'firebase-admin/firestore';
import { getStageCompletionCount } from '../services/db/pulse-store.ts';

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

    const getFirestoreMock = mock.method(firestore, 'getFirestore', () => ({
      collection: collectionSpy,
    }) as never);

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

    getFirestoreMock.mock.restore();
  });
});
