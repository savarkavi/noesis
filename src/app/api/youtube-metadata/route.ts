import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    const videoId = extractYouTubeVideoId(url as string);

    if (!videoId) {
      return Response.json(
        { error: "Invalid youtube video ID" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${process.env.GOOGLE_API_KEY}&part=snippet`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch metadata from YouTube");
    }

    const data = await response.json();
    const snippet = data.items?.[0]?.snippet;

    if (!snippet) {
      return Response.json({ error: "Video not found" }, { status: 400 });
    }

    return Response.json({
      id: videoId,
      title: snippet.title,
      description: snippet.description,
      thumbnail: snippet.thumbnails.high.url,
    });
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: "Failed to fetch youtube video metadata" },
      { status: 500 },
    );
  }
}

function extractYouTubeVideoId(url: string): string | null {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}
