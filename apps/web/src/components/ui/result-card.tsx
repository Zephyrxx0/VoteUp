import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface CandidateResultView {
  name: string;
  party: string;
  votes: number;
  status: string;
}

const STATUS_LABELS = new Set(['Leading', 'Won']);

function normalizeStatus(status: string): 'Leading' | 'Won' | 'Unknown' {
  const clean = status.trim();
  if (clean === 'Won') return 'Won';
  if (clean === 'Leading') return 'Leading';
  return 'Unknown';
}

export function sanitizeResult(candidate: CandidateResultView): CandidateResultView {
  return {
    name: candidate.name.trim(),
    party: candidate.party.trim(),
    votes: Number.isFinite(candidate.votes) ? Math.max(0, Math.floor(candidate.votes)) : 0,
    status: candidate.status.trim(),
  };
}

export function ResultCard({ candidate }: { candidate: CandidateResultView }) {
  const sanitized = sanitizeResult(candidate);
  const status = normalizeStatus(sanitized.status);
  const showStatus = STATUS_LABELS.has(status);

  return (
    <Card size="sm" className="w-full">
      <CardHeader className="gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{sanitized.name}</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">{sanitized.party}</p>
          </div>
          {status === 'Won' ? (
            <Badge variant="default" aria-label="Winner badge">
              Winner
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Votes</span>
          <span className="font-semibold tabular-nums">{sanitized.votes.toLocaleString('en-IN')}</span>
        </div>
        {showStatus ? (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium">{status}</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
