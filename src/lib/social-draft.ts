import { CLINIC } from "./clinic";

/** Brouillons locaux (sans OpenAI) pour un sujet / traitement */

export function draftFromTopic(topic: string) {
  const clean = topic.trim();
  const label = clean.charAt(0).toUpperCase() + clean.slice(1);
  const tag = clean.replace(/\s+/g, "");

  return {
    title: `${label} au Centre ${CLINIC.shortName}`,
    caption: `${label} au Centre de ${CLINIC.name}, à ${CLINIC.city}.\n\nUn soin pensé pour votre confort, dans une ambiance élégante et sereine — sous l’expertise du ${CLINIC.doctor}.\n\nEn savoir plus : ${CLINIC.website}`,
    article: `Au Centre de ${CLINIC.name} à ${CLINIC.city}, ${label} s’inscrit dans une approche sur mesure, bienveillante et professionnelle.

Dirigé par le ${CLINIC.doctor}, le centre accueille toutes les peaux et tous les parcours. Chaque prestation — dont ${label} — est adaptée à vos besoins, avec écoute et sécurité.

${label} fait partie des soins proposés pour sublimer votre peau ou accompagner vos objectifs esthétiques, dans un espace moderne près de Marcq-en-Barœul et Saint-André-lez-Lille.

Ce post est conçu pour vos réseaux : associez-y vos images (avant / après, ambiance du centre, détail du soin) pour raconter l’expérience, pas seulement le nom du traitement.

À mettre en avant :
• Le confort et le résultat
• L’expertise médicale du centre
• Une esthétique douce, fidèle à ${CLINIC.shortName}

Adresse : ${CLINIC.address}
Téléphone : ${CLINIC.phone}
Site : ${CLINIC.website}

Modifiez librement ce texte — puis ajoutez les photos qui racontent l’histoire.`,
    hashtags: `#${tag} #ciselure #medecineesthetique #LaMadeleine #Lille #beaute #soin`,
  };
}
