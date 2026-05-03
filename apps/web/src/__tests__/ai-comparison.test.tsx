import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAiComparisonStore } from '@/lib/stores/ai-comparison-store';

describe('ai comparison store caching', () => {
  beforeEach(() => {
    useAiComparisonStore.setState({
      cache: {},
      loading: false,
      error: null,
    });
    vi.restoreAllMocks();
  });

  it('caches comparison data locally and avoids repeated API calls', async () => {
    const mockResponse = {
      comparison: [
        {
          category: 'Election Authority',
          homeCountryValue: 'Federal Election Commission',
          indiaValue: 'Election Commission of India',
        },
      ],
    };

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const first = await useAiComparisonStore.getState().fetchComparison('USA');
    const second = await useAiComparisonStore.getState().fetchComparison('USA');

    expect(first).toEqual(mockResponse.comparison);
    expect(second).toEqual(mockResponse.comparison);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
