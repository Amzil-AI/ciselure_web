import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { name, content } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Suggestion content is required" },
        { status: 400 }
      );
    }

    const suggestion = await prisma.suggestion.create({
      data: {
        name: name?.trim() || null,
        content: content.trim(),
      },
    });

    return NextResponse.json(suggestion, { status: 201 });
  } catch (error) {
    console.error("Failed to create suggestion:", error);
    return NextResponse.json(
      { error: "Failed to submit suggestion" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const adminPassword = request.headers.get("x-admin-password");
    const expectedPassword = process.env.ADMIN_PASSWORD ?? "ciselure2026";

    if (adminPassword !== expectedPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const suggestions = await prisma.suggestion.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Failed to fetch suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 }
    );
  }
}
