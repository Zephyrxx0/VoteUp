import { NextResponse } from 'next/server';

type Params = {
  acId: string;
  stage: string;
};

function parseStage(value: string): number | null {
  const stage = Number.parseInt(value, 10);
  if (!Number.isInteger(stage) || stage < 1 || stage > 8) {
    return null;
  }
  return stage;
}

function buildStageCount(acId: string, stage: number): number {
  const seed = Array.from(acId).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return (seed % 60) + stage * 15;
}

export async function GET(_request: Request, context: { params: Promise<Params> }) {
  const params = await context.params;
  const acId = params.acId.trim();
  const stage = parseStage(params.stage);

  if (!acId) {
    return NextResponse.json({ error: 'acId is required' }, { status: 400 });
  }

  if (stage === null) {
    return NextResponse.json({ error: 'stage must be between 1 and 8' }, { status: 400 });
  }

  return NextResponse.json({
    acId,
    stage,
    count: buildStageCount(acId, stage),
  });
}
