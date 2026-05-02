'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useChecklistStore } from '@/lib/stores/checklist-store';
import { ChecklistItem, type DashboardChecklistItem } from './ChecklistItem';

interface ChecklistApiItem {
  id: string;
  title: string;
  description: string;
  stage: number;
  category?: string;
}

interface ChecklistApiResponse {
  stage: number;
  stageName?: string;
  items: ChecklistApiItem[];
}

interface ChecklistContainerProps {
  stage: number;
  constituency: string;
}

const FALLBACK: ChecklistApiResponse = {
  stage: 1,
  stageName: 'Registration',
  items: [
    {
      id: 's1-submit-form6',
      title: 'Submit Form 6',
      description: 'Apply online or visit your local ERO office to register as a voter.',
      stage: 1,
      category: 'Application',
    },
  ],
};

export function ChecklistContainer({ stage, constituency }: ChecklistContainerProps) {
  const storeItems = useChecklistStore((state) => state.items);
  const toggleItem = useChecklistStore((state) => state.toggleItem);

  const [apiChecklist, setApiChecklist] = useState<ChecklistApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadChecklist() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/checklist/customize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer dashboard-user',
          },
          body: JSON.stringify({ stage, constituency }),
        });

        if (!response.ok) throw new Error('Customization request failed');

        const data = (await response.json()) as ChecklistApiResponse;
        if (!cancelled) {
          setApiChecklist(data);
        }
      } catch {
        if (!cancelled) {
          setApiChecklist({ ...FALLBACK, stage });
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadChecklist();
    return () => {
      cancelled = true;
    };
  }, [stage, constituency]);

  const mergedItems = useMemo<DashboardChecklistItem[]>(() => {
    const source = apiChecklist ?? { ...FALLBACK, stage };

    return source.items.map((item) => {
      const state = storeItems[item.id] ?? { completed: false, completedAt: null };
      const overdue = !state.completed && item.stage < stage;

      return {
        ...item,
        completed: state.completed,
        overdue,
      };
    });
  }, [apiChecklist, stage, storeItems]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your stage checklist</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading your personalized tasks…</p>
        ) : (
          <div className="space-y-3">
            {mergedItems.map((item) => (
              <ChecklistItem key={item.id} item={item} onToggle={toggleItem} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
