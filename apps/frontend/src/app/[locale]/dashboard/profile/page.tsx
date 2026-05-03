'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { ProfileView } from '@/components/dashboard/ProfileView';
import { getCurrentUser } from '@/lib/auth';

export default function ProfilePage() {
  const router = useRouter();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user?.uid) {
      router.replace('/');
    }
  }, [router, user?.uid]);

  if (!user?.uid) {
    return (
      <main className="mx-auto min-h-screen max-w-4xl p-4 sm:p-6">
        <p className="text-sm text-muted-foreground">Redirecting to onboarding…</p>
      </main>
    );
  }

  return (
    <>
      <div className="mx-auto mt-4 max-w-4xl px-4 sm:px-6">
        <Link href="/dashboard" className="text-sm text-primary underline-offset-4 hover:underline">
          Back to dashboard
        </Link>
      </div>
      <ProfileView />
    </>
  );
}
