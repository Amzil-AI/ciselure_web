/** Draft templates for social posts around a treatment / topic */

export function draftFromTopic(topic: string) {
  const clean = topic.trim();
  const label = clean.charAt(0).toUpperCase() + clean.slice(1);

  return {
    title: `${label} — a closer look`,
    caption: `Discover ${label} with Ciselure.\n\nA refined treatment moment, captured through AI imagery — soft light, calm detail, and the quiet ritual of care.`,
    article: `${label} is one of those treatments that feels as considered as it looks.

In clinic, it is often chosen for a deep cleanse, a glow, and that fresh, rested finish. Through Ciselure, we translate that feeling into imagery you can share — before / after mood, texture, and atmosphere — so your audience sees the experience, not just the name.

Use this post with your favourite visuals from the gallery. Pair the caption for Instagram or LinkedIn, keep the longer article for your site or newsletter, and tag the treatment so people searching for ${label} find you.

What to highlight:
• The ritual and the result
• Skin that looks calm, clear, and cared for
• A soft, editorial look that matches your brand

Edit this draft freely — then attach the pictures that tell the story.`,
    hashtags: `#${clean.replace(/\s+/g, "")} #skincare #aesthetic #ciselure #beauty`,
  };
}
