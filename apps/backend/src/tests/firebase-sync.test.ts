import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { __resetGetFirestoreForTest, __setGetFirestoreForTest, getStageCompletionCount } from '../services/db/pulse-store.ts';
import { initializeAuditDb, logAction } from '../services/db/audit-log.ts';

describe('firebase sync', () => {
  it('keeps fallback path available when credentials are missing', async () => {
    __setGetFirestoreForTest(() => {
      throw new Error('missing credentials');
    });

    const count = await getStageCompletionCount('S2477', 8);
    assert.equal(count, 0);
    __resetGetFirestoreForTest();
  });

  it('reads pulse count from firestore when configured', async () => {
    const fakeDb = {
      collection: () => ({
        where: () => ({
          where: () => ({
            count: () => ({
              get: async () => ({
                data: () => ({ count: 42 }),
              }),
            }),
          }),
        }),
      }),
    };

    __setGetFirestoreForTest(() => fakeDb as never);
    const count = await getStageCompletionCount('S2477', 8);
    assert.equal(count, 42);
    __resetGetFirestoreForTest();
  });

  it('writes audit logs when firestore is configured', async () => {
    let writes = 0;
    const fakeDb = {
      collection: (name: string) => {
        assert.equal(name, 'audit_logs');
        return {
          add: async (doc: unknown) => {
            const payload = doc as Record<string, unknown>;
            assert.equal(payload.action, 'update_stage');
            assert.equal(payload.targetId, 'S2477');
            assert.equal(payload.adminId, 'admin-1');
            assert.equal(typeof payload.timestamp, 'string');
            writes += 1;
          },
        };
      },
    };

    initializeAuditDb(fakeDb);
    await logAction({
      adminId: 'admin-1',
      action: 'update_stage',
      targetId: 'S2477',
      oldValue: null,
      newValue: { stage: 'Result Declared' },
    });

    assert.equal(writes, 1);
  });
});
