import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { storeImage } from "@/lib/storage";

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
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const { title, description, imageUrl } = await request.json();

      if (!title?.trim() || !imageUrl?.trim()) {
        return NextResponse.json(
          { error: "Title and image URL are required" },
          { status: 400 }
        );
      }

      if (!isCloudinaryUrl(imageUrl)) {
        return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
      }

      const image = await prisma.image.create({
        data: {
          title: title.trim(),
          description: description?.trim() || null,
          filename: imageUrl.trim(),
        },
      });

      return NextResponse.json(image, { status: 201 });
    }

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
