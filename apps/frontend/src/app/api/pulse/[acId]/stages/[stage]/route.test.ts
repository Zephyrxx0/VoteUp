import { describe, expect, it } from 'vitest';

import { GET } from './route';

describe('pulse stage route', () => {
  it('returns count payload for valid params', async () => {
    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ acId: 'AC-100', stage: '3' }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.acId).toBe('AC-100');
    expect(body.stage).toBe(3);
    expect(typeof body.count).toBe('number');
  });

  it('rejects invalid stage', async () => {
    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ acId: 'AC-100', stage: '99' }),
    });

    expect(response.status).toBe(400);
  });
});
