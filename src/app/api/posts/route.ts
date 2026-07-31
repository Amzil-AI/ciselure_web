import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const postInclude = {
  images: {
    orderBy: { sortOrder: "asc" as const },
    include: { image: true },
  },
};

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

    if (!topic || !title || !caption || !article) {
      return NextResponse.json(
        { error: "Topic, title, caption, and article are required" },
        { status: 400 }
      );
    }

    const post = await prisma.socialPost.create({
      data: {
        topic,
        title,
        caption,
        article,
        hashtags,
        images: {
          create: imageIds.map((imageId, index) => ({
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
