import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const postInclude = {
  images: {
    orderBy: { sortOrder: "asc" as const },
    include: { image: true },
  },
};

function isCloudinaryUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const posts = await prisma.socialPost.findMany({
      orderBy: { createdAt: "desc" },
      include: postInclude,
    });
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const topic = String(body.topic ?? "").trim().slice(0, 80);
    const title = String(body.title ?? "").trim().slice(0, 160);
    const caption = String(body.caption ?? "").trim().slice(0, 2000);
    const article = String(body.article ?? "").trim().slice(0, 12000);
    const hashtags = body.hashtags ? String(body.hashtags).trim().slice(0, 400) : null;
    const imageIds: number[] = Array.isArray(body.imageIds)
      ? body.imageIds
          .map((id: unknown) => Number(id))
          .filter((id: number) => !Number.isNaN(id))
          .slice(0, 12)
      : [];

    const newImagesRaw = Array.isArray(body.newImages) ? body.newImages : [];
    const newImages = newImagesRaw
      .slice(0, 8)
      .map((item: { title?: unknown; imageUrl?: unknown }) => ({
        title: String(item?.title ?? title).trim().slice(0, 120) || title,
        imageUrl: String(item?.imageUrl ?? "").trim(),
      }))
      .filter((item: { imageUrl: string }) => isCloudinaryUrl(item.imageUrl));

    if (!topic || !title || !caption || !article) {
      return NextResponse.json(
        { error: "Topic, title, caption, and article are required" },
        { status: 400 }
      );
    }

    const createdImageIds: number[] = [];
    for (const item of newImages) {
      const image = await prisma.image.create({
        data: {
          title: item.title,
          description: `Shared with article: ${topic}`,
          filename: item.imageUrl,
        },
      });
      createdImageIds.push(image.id);
    }

    const allImageIds = [...createdImageIds, ...imageIds].slice(0, 12);

    const post = await prisma.socialPost.create({
      data: {
        topic,
        title,
        caption,
        article,
        hashtags,
        images: {
          create: allImageIds.map((imageId, index) => ({
            imageId,
            sortOrder: index,
          })),
        },
      },
      include: postInclude,
    });

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
