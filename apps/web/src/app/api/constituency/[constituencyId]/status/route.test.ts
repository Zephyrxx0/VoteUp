import { describe, expect, it } from 'vitest';

import { GET } from './route';

describe('constituency status route', () => {
  it('returns status payload for valid constituency id', async () => {
    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ constituencyId: 's2477' }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.stage).toBe('Counting');
    expect(Array.isArray(body.results)).toBe(true);
    expect(body.results.length).toBeGreaterThan(0);
  });

  it('rejects invalid constituency id', async () => {
    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ constituencyId: 'BAD' }),
    });

    expect(response.status).toBe(400);
  });
});
