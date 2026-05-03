export async function getYouTubeVideos(countryCode: string, stageId: string) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.warn('YouTube API key not configured, returning mock data');
    return [
      {
        id: 'dQw4w9WgXcQ',
        title: `Understanding ${countryCode} Elections`,
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        url: 'https://youtube.com/watch?v=dQw4w9WgXcQ'
      }
    ];
  }

  const query = `${countryCode} election ${stageId}`;
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=5&key=${apiKey}`
  );
  
  const data = await response.json();
  if (!data.items) return [];

  return data.items.map((item: any) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    thumbnailUrl: item.snippet.thumbnails.high.url,
    url: `https://youtube.com/watch?v=${item.id.videoId}`
  }));
}

