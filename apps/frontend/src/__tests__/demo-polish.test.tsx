import { describe, expect, it } from 'vitest';
import { buildShareJourneyMessage, shouldShowShareJourney } from '../app/[locale]/dashboard/page';

describe('demo polish', () => {
  it('shows share journey affordance only for result declared stage', () => {
    expect(shouldShowShareJourney('Result Declared')).toBe(true);
    expect(shouldShowShareJourney('Counting')).toBe(false);
  });

  it('builds the expected share message with constituency and winner', () => {
    const message = buildShareJourneyMessage('S2477', 'Jane Doe');
    expect(message).toContain('S2477');
    expect(message).toContain('Jane Doe won!');
  });
});
