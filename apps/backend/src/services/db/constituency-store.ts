import 'dotenv/config';
import admin from 'firebase-admin';

const EIGHT_STAGES = [
  'Not Scheduled',
  'Notification Issued',
  'Nomination Last Date',
  'Scrutiny',
  'Withdrawal',
  'Polling',
  'Counting',
  'Result Declared',
] as const;

export type Stage = typeof EIGHT_STAGES[number];

const DEFAULT_COUNTING_DATE = '2026-05-04T00:00:00.000Z';
const DEMO_CONSTITUENCY_IDS = new Set(['S2477']);

interface FirestoreInput {
  state: string;
  type: 'AC' | 'PC';
  name: string;
  stage: Stage;
  notification_date?: string;
  nomination_last_date?: string;
  scrutiny_date?: string;
  withdrawal_date?: string;
  polling_date?: string;
  counting_date?: string;
  result_date?: string;
  last_synced_at: string;
  source_url?: string;
}

let firestoreDb: import('firebase-admin/firestore').Firestore | null = null;

// Auto-initialize from environment variables
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  initializeFirestore({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  });
}

export function initializeFirestore(credentials: {
  projectId: string;
  privateKey: string;
  clientEmail: string;
}): void {
  if (credentials.projectId && credentials.privateKey && credentials.clientEmail) {
    try {
      if (admin.apps.length === 0) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: credentials.projectId,
            privateKey: credentials.privateKey.replace(/\\n/g, '\n'),
            clientEmail: credentials.clientEmail,
          }),
        });
      }
      firestoreDb = admin.firestore();
      console.log('[ConstituencyStore] Firebase initialized');
    } catch (err) {
      console.error('[ConstituencyStore] Failed to initialize Firebase:', err);
    }
  }
}

function ensureInitialized(): void {
  if (!firestoreDb) {
    throw new Error('Firebase not initialized. Add credentials to enable sync.');
  }
}

function mapToStage(dates: Record<string, string | undefined>): Stage {
  if (dates.counting) return 'Counting';
  if (dates.polling) return 'Polling';
  if (dates.withdrawal) return 'Withdrawal';
  if (dates.scrutiny) return 'Scrutiny';
  if (dates.nominationLast) return 'Nomination Last Date';
  if (dates.notification) return 'Notification Issued';
  return 'Not Scheduled';
}

export function resolveCurrentStage(dates: {
  notification_date?: string;
  nomination_last_date?: string;
  scrutiny_date?: string;
  withdrawal_date?: string;
  polling_date?: string;
  counting_date?: string;
  result_date?: string;
}, now = new Date(), constituencyId?: string): Stage {
  const checkpoints: Array<[keyof typeof dates, Stage]> = [
    ['result_date', 'Result Declared'],
    ['counting_date', 'Counting'],
    ['polling_date', 'Polling'],
    ['withdrawal_date', 'Withdrawal'],
    ['scrutiny_date', 'Scrutiny'],
    ['nomination_last_date', 'Nomination Last Date'],
    ['notification_date', 'Notification Issued'],
  ];

  const normalizedConstituencyId = constituencyId?.trim().toUpperCase();
  const fallbackCountingDate = dates.counting_date
    ?? (!normalizedConstituencyId || DEMO_CONSTITUENCY_IDS.has(normalizedConstituencyId)
      ? DEFAULT_COUNTING_DATE
      : undefined);

  if (fallbackCountingDate) {
    const countingDate = new Date(fallbackCountingDate);
    if (!Number.isNaN(countingDate.getTime()) && now >= countingDate) {
      return 'Counting';
    }
  }

  for (const [key, stage] of checkpoints) {
    if (key === 'counting_date') continue;
    const value = dates[key];
    if (!value) continue;

    const dt = new Date(value);
    if (!Number.isNaN(dt.getTime()) && now >= dt) {
      return stage;
    }
  }

  return 'Not Scheduled';
}

export async function upsertConstituencyData(scheduleData: {
  state: string;
  constituency: string;
  stages: Record<string, string | undefined>;
}[]): Promise<number> {
  if (!firestoreDb) {
    console.log('[ConstituencyStore] Firebase not configured - skipping upsert');
    console.log('[ConstituencyStore] Add Firebase credentials to enable sync');
    return 0;
  }
  
  const db = firestoreDb;
  const batch = db.batch();
  let upserted = 0;
  
  for (const record of scheduleData) {
    const docRef = db.collection('constituencies').doc(record.constituency);
    
    const doc: FirestoreInput = {
      state: record.state,
      type: 'AC',
      name: record.constituency,
      stage: mapToStage(record.stages),
      notification_date: record.stages.notification,
      nomination_last_date: record.stages.nominationLast,
      scrutiny_date: record.stages.scrutiny,
      withdrawal_date: record.stages.withdrawal,
      polling_date: record.stages.polling,
      counting_date: record.stages.counting,
      last_synced_at: new Date().toISOString(),
    };
    
    batch.set(docRef, doc, { merge: true });
    upserted++;
  }
  
  await batch.commit();
  console.log(`[ConstituencyStore] Upserted ${upserted} constituencies`);
  
  return upserted;
}

export async function markStaleConstituencies(): Promise<number> {
  if (!firestoreDb) return 0;
  
  const db = firestoreDb;
  const now = new Date();
  const staleTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const snapshot = await db.collection('constituencies')
    .where('last_synced_at', '<', staleTime.toISOString())
    .get();
  
  if (snapshot.empty) return 0;
  
  const batch = db.batch();
  for (const doc of snapshot.docs) {
    batch.update(doc.ref, { is_stale: true });
  }
  await batch.commit();
  
  console.log(`[ConstituencyStore] Marked ${snapshot.size} stale`);
  return snapshot.size;
}
