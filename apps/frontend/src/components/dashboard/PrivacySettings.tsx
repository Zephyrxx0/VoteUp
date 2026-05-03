'use client';

import { useState } from 'react';

import { getCurrentUser } from '@/lib/auth';
import { deleteAllUserData } from '@/lib/user-service';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function PrivacySettings() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function handleDelete(): Promise<void> {
    const user = getCurrentUser();
    if (!user?.uid) {
      setStatus('Sign in required before deleting account data.');
      return;
    }

    setBusy(true);
    setStatus(null);
    try {
      await deleteAllUserData(user.uid);
      setStatus('All profile data deleted. Local progress was reset.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to delete profile data.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-xl border bg-card p-4 sm:p-5">
      <h2 className="text-lg font-semibold">Privacy Settings</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Delete all your profile data from cloud storage and clear synced local progress.
      </p>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="mt-4" variant="destructive" disabled={busy}>
            Delete All My Data
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete all profile data?</AlertDialogTitle>
            <AlertDialogDescription>
              This action is irreversible. Your cloud profile document and synced local progress will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                void handleDelete();
              }}
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {status ? <p className="mt-3 text-sm text-muted-foreground">{status}</p> : null}
    </section>
  );
}
