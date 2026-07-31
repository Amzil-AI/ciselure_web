/** Brouillons locaux (sans OpenAI) pour un sujet / traitement */

export function draftFromTopic(topic: string) {
  const clean = topic.trim();
  const label = clean.charAt(0).toUpperCase() + clean.slice(1);
  const tag = clean.replace(/\s+/g, "");

  return {
    title: `${label} — un regard plus près`,
    caption: `Découvrez ${label} avec Ciselure.\n\nUn moment de soin raffiné, capturé en images génératives — lumière douce, détails calmes, et le rituel discret du bien-être de la peau.`,
    article: `${label} est l’un de ces soins qui se ressent autant qu’il se voit.

En institut, on le choisit souvent pour un nettoyage en profondeur, un teint plus lumineux, et cette finition fraîche, reposée. Avec Ciselure, nous traduisons cette sensation en images à partager — ambiance avant / après, texture, atmosphère — pour que votre audience voie l’expérience, pas seulement le nom du soin.

Utilisez ce post avec vos visuels préférés. La légende convient à Instagram ou LinkedIn ; l’article plus long peut nourrir votre site ou votre newsletter. Mentionnez ${label} pour que celles et ceux qui le recherchent vous trouvent.

À mettre en avant :
• Le rituel et le résultat
• Une peau calme, nette, choyée
• Une esthétique douce, éditoriale, fidèle à votre marque

Modifiez librement ce texte — puis ajoutez les photos qui racontent l’histoire.`,
    hashtags: `#${tag} #soin #estheticienne #ciselure #beaute #peau`,
  };
}
