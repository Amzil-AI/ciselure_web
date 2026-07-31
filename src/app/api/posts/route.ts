import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function checkAdmin(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ciselure2026";
  return request.headers.get("x-admin-password") === adminPassword;
}

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
  if (!checkAdmin(request)) return unauthorized();

  try {
    const body = await request.json();
    const topic = String(body.topic ?? "").trim();
    const title = String(body.title ?? "").trim();
    const caption = String(body.caption ?? "").trim();
    const article = String(body.article ?? "").trim();
    const hashtags = body.hashtags ? String(body.hashtags).trim() : null;
    const imageIds: number[] = Array.isArray(body.imageIds)
      ? body.imageIds.map((id: unknown) => Number(id)).filter((id: number) => !Number.isNaN(id))
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
