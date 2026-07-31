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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const post = await prisma.socialPost.findUnique({
      where: { id: parseInt(id) },
      include: postInclude,
    });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdmin(request)) return unauthorized();
  const { id } = await params;

  try {
    const body = await request.json();
    const topic = String(body.topic ?? "").trim();
    const title = String(body.title ?? "").trim();
    const caption = String(body.caption ?? "").trim();
    const article = String(body.article ?? "").trim();
    const hashtags = body.hashtags ? String(body.hashtags).trim() : null;
    const imageIds: number[] = Array.isArray(body.imageIds)
      ? body.imageIds.map((x: unknown) => Number(x)).filter((n: number) => !Number.isNaN(n))
      : [];

    if (!topic || !title || !caption || !article) {
      return NextResponse.json(
        { error: "Topic, title, caption, and article are required" },
        { status: 400 }
      );
    }

    await prisma.socialPostImage.deleteMany({ where: { socialPostId: parseInt(id) } });

    const post = await prisma.socialPost.update({
      where: { id: parseInt(id) },
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

    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdmin(request)) return unauthorized();
  const { id } = await params;

  try {
    await prisma.socialPost.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
