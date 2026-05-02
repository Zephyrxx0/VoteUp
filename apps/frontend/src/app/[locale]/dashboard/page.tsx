'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChecklistContainer } from '@/components/checklist/ChecklistContainer';
import { getCurrentUser } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user?.uid) {
      router.replace('/');
    }
  }, [router, user?.uid]);

  const mockStageData = useMemo(
    () => ({
      stage: 5,
      stageName: 'Campaigning',
      constituency: 'New Delhi',
    }),
    [],
  );

  if (!user?.uid) {
    return (
      <main className="mx-auto min-h-screen max-w-4xl p-4 sm:p-6">
        <p className="text-sm text-muted-foreground">Redirecting to onboarding…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl p-4 sm:p-6">
      <section className="mb-6 rounded-xl border bg-card p-4 sm:p-5">
        <h1 className="text-2xl font-semibold">Personalized Action Plan</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Current stage: <span className="font-medium text-foreground">{mockStageData.stageName}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Constituency: <span className="font-medium text-foreground">{mockStageData.constituency}</span>
        </p>
      </section>

      <ChecklistContainer stage={mockStageData.stage} constituency={mockStageData.constituency} />
    </main>
  );
}
