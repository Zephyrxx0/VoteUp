export interface AuditLogEntry {
  id: string;
  adminId: string;
  action: string;
  targetId: string;
  oldValue: unknown;
  newValue: unknown;
  timestamp: string;
}

type FirestoreDb = import('firebase-admin/firestore').Firestore;
let auditDb: FirestoreDb | null = null;

const FIRESTORE_DISABLED_MESSAGE = '[AuditLog] Firebase not configured - skipping audit log';
const FIRESTORE_SETUP_MESSAGE = '[AuditLog] Add Firebase credentials to enable audit logging';

export function initializeAuditDb(credentials: unknown): void {
  auditDb = (credentials as FirestoreDb) ?? null;
}

export async function logAction(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
  if (!auditDb) {
    console.log(FIRESTORE_DISABLED_MESSAGE);
    console.log(FIRESTORE_SETUP_MESSAGE);
    return;
  }

  const logEntry: AuditLogEntry = {
    ...entry,
    id: `${entry.targetId}-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };

  try {
    await auditDb.collection('audit_logs').add(logEntry);
  } catch (error) {
    console.error('[AuditLog] Failed to write Firestore audit log:', error);
  }
}

export async function writeAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
  await logAction(entry);
}

export async function getAuditLogs(targetId: string): Promise<AuditLogEntry[]> {
  if (!auditDb) return [];
  return [];
}

export async function getAllAuditLogs(limit = 100): Promise<AuditLogEntry[]> {
  if (!auditDb) return [];
  return [];
}
