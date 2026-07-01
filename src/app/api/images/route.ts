import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const images = await prisma.image.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { comments: true } } },
    });
    return NextResponse.json(images);
  } catch {
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ciselure2024";
  const authHeader = request.headers.get("x-admin-password");

  if (authHeader !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;

    if (!file || !title) {
      return NextResponse.json({ error: "File and title are required" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const uploadDir = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "public", "uploads");
    await writeFile(path.join(uploadDir, filename), buffer);

    const image = await prisma.image.create({
      data: { title, description: description ?? null, filename },
    });

    return NextResponse.json(image, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
