import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('stage resolution test skeleton', () => {
  it('resolves to counting stage when now is at counting date', () => {
    const countingDate = new Date('2026-05-04T08:00:00Z');
    const now = new Date('2026-05-04T08:00:00Z');

    const stage = now >= countingDate ? 'Counting' : 'Polling';

    assert.equal(stage, 'Counting');
  });
});
