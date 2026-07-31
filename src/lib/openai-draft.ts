import OpenAI from "openai";
import { draftFromTopic } from "./social-draft";

export type SocialDraft = {
  title: string;
  caption: string;
  article: string;
  hashtags: string;
};

export async function generateSocialDraft(topic: string): Promise<SocialDraft> {
  const clean = topic.trim();
  if (!clean) {
    throw new Error("Topic is required");
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return draftFromTopic(clean);
  }

  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    response_format: { type: "json_object" },
    temperature: 0.8,
    messages: [
      {
        role: "system",
        content: `You write elegant social and editorial content for Ciselure, a brand that creates refined AI-generated imagery for aesthetic / skin clinics.

Return ONLY valid JSON with these keys:
- title: short elegant headline
- caption: Instagram / LinkedIn caption (2-4 short paragraphs, warm and premium, not salesy)
- article: longer article (4-7 short paragraphs) useful for a website or newsletter; explain the treatment feel, benefits in plain language, and how imagery can tell the story
- hashtags: space-separated hashtags including the topic and #ciselure #skincare #aesthetic

Write in English unless the topic is clearly French — then write in French.
Tone: calm, editorial, feminine-premium. No medical claims that sound like a diagnosis. No emojis.`,
      },
      {
        role: "user",
        content: `Create a social post package about: ${clean}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    return draftFromTopic(clean);
  }

  try {
    const parsed = JSON.parse(raw) as Partial<SocialDraft>;
    return {
      title: String(parsed.title ?? "").trim() || draftFromTopic(clean).title,
      caption: String(parsed.caption ?? "").trim() || draftFromTopic(clean).caption,
      article: String(parsed.article ?? "").trim() || draftFromTopic(clean).article,
      hashtags: String(parsed.hashtags ?? "").trim() || draftFromTopic(clean).hashtags,
    };
  } catch {
    return draftFromTopic(clean);
  }
}
