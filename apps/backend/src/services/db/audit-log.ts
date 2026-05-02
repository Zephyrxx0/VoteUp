export interface AuditLogEntry {
  id: string;
  adminId: string;
  action: string;
  targetId: string;
  oldValue: unknown;
  newValue: unknown;
  timestamp: string;
}

let auditDb: unknown = null;

export function initializeAuditDb(credentials: unknown): void {
  auditDb = credentials;
}

export async function writeAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
  if (!auditDb) {
    console.log('[AuditLog] Firebase not configured - skipping audit log');
    return;
  }
  
  const logEntry: AuditLogEntry = {
    ...entry,
    id: `${entry.targetId}-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  
  console.log('[AuditLog] Would write:', logEntry);
}

export async function getAuditLogs(targetId: string): Promise<AuditLogEntry[]> {
  if (!auditDb) return [];
  return [];
}

export async function getAllAuditLogs(limit = 100): Promise<AuditLogEntry[]> {
  if (!auditDb) return [];
  return [];
}