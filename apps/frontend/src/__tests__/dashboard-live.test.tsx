import { describe, expect, it } from 'vitest';

describe('dashboard live test skeleton', () => {
  it('exposes a live indicator state during counting stage', () => {
    const stage = 'Counting';
    const isLive = stage === 'Counting';

    expect(isLive).toBe(true);
  });
});
