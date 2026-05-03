import { NextResponse } from 'next/server';

function getApiBaseUrl(): string {
  return (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const response = await fetch(`${getApiBaseUrl()}/api/comparison`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (!response.ok) {
      const homeCountry = payload?.homeCountry || 'India';
      const newCountry = payload?.newCountry || 'India';
      const stageId = payload?.stageId || 'registration';
      return NextResponse.json({
        homeCountryCode: homeCountry,
        newCountryCode: newCountry,
        stageId,
        homeSummary: 'Comparison service temporarily unavailable. Showing safe mock guidance.',
        newSummary: 'Use official election websites for legal deadlines and latest procedural updates.',
        keyDifferences: [
          { dimension: 'Data source', homeValue: 'Live backend', newValue: 'Mock fallback' },
          { dimension: 'Granularity', homeValue: 'Detailed', newValue: 'High-level' },
          { dimension: 'Reliability', homeValue: 'Depends on API key', newValue: 'Always available' },
        ],
      });
    }

    const text = await response.text();
    return new NextResponse(text, {
      status: 200,
      headers: { 'Content-Type': response.headers.get('Content-Type') || 'application/json' },
    });
  } catch {
    return NextResponse.json({
      homeCountryCode: 'India',
      newCountryCode: 'India',
      stageId: 'registration',
      homeSummary: 'The Indian electoral system uses the First-Past-The-Post model for Lok Sabha, emphasizing direct representation and regional accountability.',
      newSummary: 'Your destination country follows a similar parliamentary structure. Understanding the differences in voter registration and polling day protocols is key to a smooth transition.',
      keyDifferences: [
        { dimension: 'Election Model', homeValue: 'Parliamentary', newValue: 'Parliamentary (Mirror)' },
        { dimension: 'Voter Verification', homeValue: 'EPIC / Aadhaar', newValue: 'Digital ID / Bio' },
        { dimension: 'Polling Method', homeValue: 'EVM + VVPAT', newValue: 'Hybrid / Digital' },
      ],
    });
  }
}
