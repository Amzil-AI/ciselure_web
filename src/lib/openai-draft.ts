import OpenAI from "openai";
import { CLINIC, CLINIC_AI_CONTEXT } from "./clinic";
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
        content: `${CLINIC_AI_CONTEXT}

IMPORTANT : TOUT le contenu doit être en FRANÇAIS (titre, légende, article, hashtags). Jamais en anglais.

Quand c’est pertinent, mentionne naturellement le centre (${CLINIC.shortName}, ${CLINIC.city}) ou le ${CLINIC.doctor}, sans répéter trop souvent. Tu peux renvoyer vers le site ${CLINIC.website} dans l’article si cela aide.

Retourne UNIQUEMENT un JSON valide avec ces clés :
- title : titre court et élégant
- caption : légende Instagram / LinkedIn (2 à 4 courts paragraphes, ton chaleureux et premium)
- article : article plus long (4 à 7 courts paragraphes) pour le site, une newsletter ou les réseaux ; explique le soin, le ressenti, les bénéfices en langage simple, dans le contexte du centre
- hashtags : hashtags séparés par des espaces, incluant le sujet, #ciselure #medecineesthetique #LaMadeleine #Lille #beaute`,
      },
      {
        role: "user",
        content: `Crée un pack de contenu social en français pour le Centre ${CLINIC.shortName}, sur le sujet / soin : ${clean}`,
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
