import { beforeEach, describe, expect, it } from 'vitest';
import { useChecklistStore } from './checklist-store';

describe('checklist-store', () => {
  beforeEach(() => {
    localStorage.clear();
    useChecklistStore.setState({ items: {} });
  });

  it('toggles an item and sets completedAt timestamp', () => {
    useChecklistStore.getState().toggleItem('eci-register');

    const item = useChecklistStore.getState().items['eci-register'];

    expect(item.completed).toBe(true);
    expect(item.completedAt).toEqual(expect.any(String));
  });

  it('toggles an item off and clears completedAt', () => {
    useChecklistStore.getState().toggleItem('eci-register');
    useChecklistStore.getState().toggleItem('eci-register');

    const item = useChecklistStore.getState().items['eci-register'];

    expect(item.completed).toBe(false);
    expect(item.completedAt).toBeNull();
  });

  it('persists to localStorage under voteup-checklist', async () => {
    useChecklistStore.getState().toggleItem('proof-of-address');

    await useChecklistStore.persist.rehydrate();

    const rawPersisted = localStorage.getItem('voteup-checklist');
    expect(rawPersisted).toBeTruthy();

    const parsed = JSON.parse(rawPersisted as string) as {
      state: { items: Record<string, { completed: boolean; completedAt: string | null }> };
    };

    expect(parsed.state.items['proof-of-address'].completed).toBe(true);
    expect(parsed.state.items['proof-of-address'].completedAt).toEqual(expect.any(String));
  });
});
