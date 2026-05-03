import { NextResponse } from 'next/server';

function getApiBaseUrl(): string {
  return (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const response = await fetch(`${getApiBaseUrl()}/api/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (!response.ok) {
      const country = payload?.newCountry || 'India';
      const stageId = payload?.stageId || 'registration';
      return NextResponse.json({
        stageId,
        items: [
          {
            id: 'fallback-1',
            priority: 'urgent',
            title: 'Check voter registration status',
            description: `Verify registration details for ${country} on official election portal.`,
            ctaType: 'external_url',
            ctaPayload: 'https://voters.eci.gov.in/',
          },
          {
            id: 'fallback-2',
            priority: 'high',
            title: 'Confirm polling station and timing',
            description: 'Check booth details before polling day to avoid last-minute issues.',
            ctaType: 'none',
          },
        ],
        mapLocations: [],
      });
    }

    const text = await response.text();
    return new NextResponse(text, {
      status: 200,
      headers: { 'Content-Type': response.headers.get('Content-Type') || 'application/json' },
    });
  } catch {
    return NextResponse.json({
      stageId: 'registration',
      items: [
        {
          id: 'fallback-1',
          priority: 'urgent',
          title: 'Check voter registration status',
          description: 'Verify details on official election portal.',
          ctaType: 'external_url',
          ctaPayload: 'https://voters.eci.gov.in/',
        },
      ],
      mapLocations: [],
    });
  }
}
