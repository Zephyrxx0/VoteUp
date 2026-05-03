import { NextResponse } from 'next/server';

type Params = {
  constituencyId: string;
};

const CONSTITUENCY_ID_PATTERN = /^S\d{4}$/;

type CandidateStatus = {
  candidate: string;
  party: string;
  votes: number;
  status: string;
};

function buildMockResults(seed: number): CandidateStatus[] {
  const base = 10000 + seed * 17;
  return [
    { candidate: 'Asha Verma', party: 'Civic Front', votes: base + 3200, status: 'Won' },
    { candidate: 'Rohan Mehta', party: 'People Alliance', votes: base + 2100, status: 'Leading' },
    { candidate: 'Nisha Rao', party: 'Independent', votes: base + 1400, status: 'Trailing' },
  ];
}

export async function GET(_request: Request, context: { params: Promise<Params> }) {
  const params = await context.params;
  const constituencyId = params.constituencyId.trim().toUpperCase();

  if (!CONSTITUENCY_ID_PATTERN.test(constituencyId)) {
    return NextResponse.json({ error: 'constituencyId must match S#### format' }, { status: 400 });
  }

  const seed = Number.parseInt(constituencyId.slice(1), 10);
  return NextResponse.json({
    stage: 'Counting',
    results: buildMockResults(seed),
  });
}
