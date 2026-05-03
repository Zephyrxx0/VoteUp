import { NextResponse } from 'next/server';

type ChecklistItem = {
  id: string;
  title: string;
  description: string;
  stage: number;
  category: string;
};

function getApiBaseUrl(): string {
  return (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');
}

function buildFallback(stage: number, constituency: string) {
  const items: ChecklistItem[] = [
    {
      id: `s${stage}-verify-roll`,
      title: 'Verify voter roll details',
      description: `Confirm your details for ${constituency} in voter roll and fix mismatches early.`,
      stage,
      category: 'Verification',
    },
    {
      id: `s${stage}-booth-check`,
      title: 'Check polling booth and timing',
      description: 'Verify booth location and polling hours before election day.',
      stage,
      category: 'Preparation',
    },
  ];

  return {
    stage,
    stageName: 'Customized Checklist',
    items,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { stage?: number; constituency?: string };
    const stage = Number.isInteger(body.stage) ? (body.stage as number) : 1;
    const constituency = typeof body.constituency === 'string' && body.constituency.trim().length > 0
      ? body.constituency.trim()
      : 'your constituency';

    const response = await fetch(`${getApiBaseUrl()}/api/checklist/customize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer dashboard-user',
      },
      body: JSON.stringify({ stage, constituency }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(buildFallback(stage, constituency));
    }

    const text = await response.text();
    return new NextResponse(text, {
      status: 200,
      headers: { 'Content-Type': response.headers.get('Content-Type') || 'application/json' },
    });
  } catch {
    return NextResponse.json(buildFallback(1, 'your constituency'));
  }
}
