import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const image = await prisma.image.findUnique({
      where: { id: parseInt(id) },
      include: {
        comments: { orderBy: { createdAt: "desc" } },
        _count: { select: { comments: true } },
      },
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json(image);
  } catch {
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 404 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ciselure2026";
  const authHeader = request.headers.get("x-admin-password");

  if (authHeader !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const image = await prisma.image.findUnique({
      where: { id: parseInt(id) },
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    await deleteFromCloudinary(image.filename);
    await prisma.image.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
