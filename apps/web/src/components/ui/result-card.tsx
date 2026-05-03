import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

export interface CandidateResultView {
  name: string;
  party: string;
  votes: number;
  status: string;
  image?: string;
  sourceUrl?: string;
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
    image: candidate.image,
    sourceUrl: candidate.sourceUrl,
  };
}

export function ResultCard({ candidate }: { candidate: CandidateResultView }) {
  const sanitized = sanitizeResult(candidate);
  const status = normalizeStatus(sanitized.status);
  const showStatus = STATUS_LABELS.has(status);

  const CardBody = (
    <Card size="sm" className={`w-full transition-shadow ${sanitized.sourceUrl ? 'hover:shadow-md cursor-pointer' : ''}`}>
      <CardHeader className="gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {sanitized.image && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img 
                src={sanitized.image} 
                alt={`${sanitized.name} portrait`} 
                className="h-10 w-10 rounded-full object-cover border border-civic-border"
              />
            )}
            <div>
              <CardTitle className="flex items-center gap-1.5">
                {sanitized.name}
                {sanitized.sourceUrl && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">{sanitized.party}</p>
            </div>
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

  if (sanitized.sourceUrl) {
    return (
      <a href={sanitized.sourceUrl} target="_blank" rel="noopener noreferrer" className="block focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent rounded-xl">
        {CardBody}
      </a>
    );
  }

  return CardBody;
}
