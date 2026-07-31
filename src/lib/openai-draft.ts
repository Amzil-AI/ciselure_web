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
        content: `Tu écris du contenu social et éditorial élégant pour Ciselure, une marque qui crée des images génératives raffinées pour les cliniques esthétiques / soins de la peau.

IMPORTANT : TOUT le contenu doit être en FRANÇAIS (titre, légende, article, hashtags). Jamais en anglais.

Retourne UNIQUEMENT un JSON valide avec ces clés :
- title : titre court et élégant
- caption : légende Instagram / LinkedIn (2 à 4 courts paragraphes, ton chaleureux et premium, pas commercial agressif)
- article : article plus long (4 à 7 courts paragraphes) pour un site ou une newsletter ; explique le ressenti du soin, les bénéfices en langage simple, et comment l’image raconte l’histoire
- hashtags : hashtags séparés par des espaces, incluant le sujet et #ciselure #soin #estheticienne #beaute

Ton : calme, éditorial, féminin-premium. Pas de diagnostics médicaux. Pas d’emojis.`,
      },
      {
        role: "user",
        content: `Crée un pack de contenu social en français sur le sujet : ${clean}`,
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
