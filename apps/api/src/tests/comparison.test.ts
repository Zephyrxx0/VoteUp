import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateComparison } from '../services/ai/comparison-generator.ts';

describe('generateComparison', () => {
  afterEach(() => {
    mock.restoreAll();
    delete process.env.GEMINI_API_KEY;
  });

  it('produces validated JSON matching comparison schema', async () => {
    process.env.GEMINI_API_KEY = 'test-key';

    const mockGenerateContent = mock.fn(async () => ({
      response: {
        text: () => JSON.stringify({
          comparison: [
            {
              category: 'Election Authority',
              homeCountryValue: 'Federal Election Commission',
              indiaValue: 'Election Commission of India',
            },
          ],
        }),
      },
    }));

    const getModelMock = mock.method(
      GoogleGenerativeAI.prototype,
      'getGenerativeModel',
      () => ({
        generateContent: mockGenerateContent,
      }) as never,
    );

    const result = await generateComparison('United States');

    assert.equal(getModelMock.mock.calls.length, 1);
    assert.equal(mockGenerateContent.mock.calls.length, 1);
    assert.equal(Array.isArray(result.comparison), true);
    assert.equal(result.comparison.length, 1);
    assert.equal(result.comparison[0]?.category, 'Election Authority');
    assert.equal(result.comparison[0]?.homeCountryValue, 'Federal Election Commission');
    assert.equal(result.comparison[0]?.indiaValue, 'Election Commission of India');
  });
});
