import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { storeImage } from "@/lib/storage";

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
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ciselure2026";
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

    const filename = await storeImage(file);

    const image = await prisma.image.create({
      data: { title, description: description ?? null, filename },
    });

    return NextResponse.json(image, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
