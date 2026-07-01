import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const comments = await prisma.comment.findMany({
      where: { imageId: parseInt(id) },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(comments);
  } catch {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { name, content } = body;

    if (!name?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Name and feedback are required" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        name: name.trim(),
        content: content.trim(),
        imageId: parseInt(id),
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}
