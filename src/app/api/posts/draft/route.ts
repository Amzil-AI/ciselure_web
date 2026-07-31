import { NextRequest, NextResponse } from "next/server";
import { generateSocialDraft } from "@/lib/openai-draft";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const topic = String(body.topic ?? "").trim().slice(0, 80);

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
      { error: "Failed to generate draft. Please try again." },
      { status: 500 }
    );
  }
}
