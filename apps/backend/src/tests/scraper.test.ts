import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('scraper test skeleton', () => {
  it('loads custom-table fixture with expected result fields', () => {
    const fixturePath = join(
      process.cwd(),
      'apps/backend/src/tests/fixtures/eci_results_mock.html',
    );
    const html = readFileSync(fixturePath, 'utf-8');

    assert.equal(html.includes('custom-table'), true);
    assert.equal(html.includes('Name'), true);
    assert.equal(html.includes('Party'), true);
    assert.equal(html.includes('Votes'), true);
    assert.equal(html.includes('Status'), true);
  });
});
