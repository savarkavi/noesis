import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const imageUrl = req.nextUrl.searchParams.get("url");

    if (!imageUrl) {
      return Response.json({ error: "Image URL is required" }, { status: 400 });
    }

    if (!isValidImageUrl(imageUrl)) {
      return new Response("Invalid image URL", { status: 400 });
    }

    const imageRes = await fetch(imageUrl);

    if (!imageRes.ok) {
      return Response.json(
        { error: "Failed to fetch the image" },
        { status: 404 },
      );
    }

    const imageData = await imageRes.arrayBuffer();
    const contentType = imageRes.headers.get("content-type") || "image/jpeg";

    return new Response(imageData, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error processing image" }, { status: 500 });
  }
}

function isValidImageUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.protocol !== "https:") return false;

    const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    return validExtensions.some((ext) =>
      parsedUrl.pathname.toLowerCase().endsWith(ext),
    );
  } catch {
    return false;
  }
}
