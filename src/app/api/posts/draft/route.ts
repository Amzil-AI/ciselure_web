import { NextRequest, NextResponse } from "next/server";
import { generateSocialDraft } from "@/lib/openai-draft";

export async function POST(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ciselure2026";
  const authHeader = request.headers.get("x-admin-password");

  if (authHeader !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const topic = String(body.topic ?? "").trim();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const draft = await generateSocialDraft(topic);
    return NextResponse.json({
      ...draft,
      source: process.env.OPENAI_API_KEY ? "openai" : "template",
    });
  } catch (error) {
    console.error("Draft generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate draft. Check your OpenAI API key." },
      { status: 500 }
    );
  }
}
