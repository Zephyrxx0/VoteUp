'use client';

import { useEffect, useMemo, useRef } from 'react';

import { getCurrentUser } from '@/lib/auth';
import { encryptSensitive } from '@/lib/encryption';
import { updateUserProfile, type UserProfileUpdate } from '@/lib/user-service';
import { useChecklistStore } from '@/lib/stores/checklist-store';

const DEBOUNCE_MS = 2_000;

interface FirestoreSyncProps {
  epicId?: string;
  acId?: string;
}

function buildProfilePayload(items: Record<string, { completed: boolean }>): Pick<UserProfileUpdate, 'history' | 'badges'> {
  const completedStages = Object.entries(items)
    .filter(([, item]) => item.completed)
    .map(([id]) => id)
    .sort();

  const badges = completedStages.length > 0 ? [`stage-${completedStages.length}-complete`] : [];

  return {
    history: completedStages,
    badges,
  };
}

export function FirestoreSync({ epicId, acId }: FirestoreSyncProps) {
  const checklistItems = useChecklistStore((state) => state.items);
  const payload = useMemo(() => buildProfilePayload(checklistItems), [checklistItems]);
  const payloadKey = useMemo(() => JSON.stringify(payload), [payload]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousPayloadKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user?.uid || user.isAnonymous) {
      previousPayloadKeyRef.current = payloadKey;
      return;
    }

    if (previousPayloadKeyRef.current === null) {
      previousPayloadKeyRef.current = payloadKey;
      return;
    }

    if (previousPayloadKeyRef.current === payloadKey) {
      return;
    }

    previousPayloadKeyRef.current = payloadKey;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      void (async () => {
        const updatePayload: UserProfileUpdate = { ...payload };
        const sensitiveParts = [epicId?.trim(), acId?.trim()].filter(Boolean);
        if (sensitiveParts.length > 0) {
          updatePayload.encryptedVoterData = await encryptSensitive(user.uid, sensitiveParts.join('|'));
        }

        await updateUserProfile(user.uid, updatePayload);
      })();
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [acId, epicId, payload, payloadKey]);

  return null;
}
