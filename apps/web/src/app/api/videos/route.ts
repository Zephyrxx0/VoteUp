import { NextResponse } from 'next/server';

function getApiBaseUrl(): string {
  return (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const countryCode = url.searchParams.get('countryCode') || 'India';
    const stageId = url.searchParams.get('stageId') || 'registration';

    const response = await fetch(
      `${getApiBaseUrl()}/api/videos?countryCode=${encodeURIComponent(countryCode)}&stageId=${encodeURIComponent(stageId)}`,
      { cache: 'no-store' },
    );

    if (!response.ok) {
      return NextResponse.json([
        {
          id: 'eci-how-to-vote',
          title: 'Step-by-Step Guide: How to Vote using EVM and VVPAT',
          source: 'youtube',
          thumbnailUrl: 'https://img.youtube.com/vi/S8pBOn4I1kM/maxresdefault.jpg',
          url: 'https://www.youtube.com/watch?v=S8pBOn4I1kM',
        },
      ]);
    }

    const text = await response.text();
    return new NextResponse(text, {
      status: 200,
      headers: { 'Content-Type': response.headers.get('Content-Type') || 'application/json' },
    });
  } catch {
    return NextResponse.json([]);
  }
}
