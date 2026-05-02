export interface UserReport {
  id: string;
  userId: string;
  acId: string;
  reportedStage: string;
  timestamp: string;
  trustScore: number;
}

export interface ReportInput {
  userId: string;
  acId: string;
  reportedStage: string;
  trustScore?: number;
}

let reportsDb: unknown = null;
const reportsByAc = new Map<string, UserReport[]>();

export function initializeReportsDb(credentials: unknown): void {
  reportsDb = credentials;
}

export async function submitUserReport(input: ReportInput): Promise<UserReport | null> {
  if (!reportsDb) {
    console.log('[ReportsStore] Firebase not configured - skipping report submission');
    console.log('[ReportsStore] Add Firebase credentials to enable community reporting');
    return null;
  }

  const report: UserReport = {
    id: `${input.acId}-${input.userId}-${Date.now()}`,
    userId: input.userId,
    acId: input.acId,
    reportedStage: input.reportedStage,
    timestamp: new Date().toISOString(),
    trustScore: input.trustScore || 1.0,
  };

  console.log(`[ReportsStore] Would save: ${report.id}`);
  return report;
}

export async function getReportsForConstituency(acId: string): Promise<UserReport[]> {
  const seeded = reportsByAc.get(acId);
  if (seeded) return seeded;
  if (!reportsDb) return [];
  return [];
}

export function __setReportsForTest(acId: string, reports: UserReport[]): void {
  reportsByAc.set(acId, reports);
}

export function __clearReportsForTest(): void {
  reportsByAc.clear();
}

export async function getUserTrustScore(userId: string): Promise<number> {
  return 1.0;
}
