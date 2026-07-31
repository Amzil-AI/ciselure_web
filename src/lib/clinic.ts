/** Identité Médecine Esthétique Ciselure — site outils galerie / contenu social */

export const CLINIC = {
  name: "Médecine Esthétique Ciselure",
  shortName: "Ciselure",
  doctor: "Dr Bendif",
  city: "La Madeleine",
  region: "près de Marcq-en-Barœul et Saint-André-lez-Lille",
  address: "249 Av. de la République, 59110 La Madeleine",
  phone: "06 50 99 67 40",
  website: "https://www.medecinesthetiqueciselure.fr",
  treatments: [
    "Injection acide hyaluronique",
    "Peeling",
    "Radiofréquence",
    "Médecine régénérative",
    "Mésothérapie",
    "Rhinoplastie médicale",
    "Inducteurs collagéniques",
    "Skinbooster",
    "Photobiomodulation",
    "HIFU",
    "Hydrafacial",
    "Fils tenseurs",
    "Épilation laser définitive",
    "Épilation définitive électrolyse",
  ],
} as const;

export const CLINIC_AI_CONTEXT = `Tu écris pour le Centre de ${CLINIC.name} à ${CLINIC.city} (${CLINIC.region}), dirigé par le ${CLINIC.doctor}.
Site officiel : ${CLINIC.website}

Le centre propose des soins esthétiques médicaux sur mesure, dans une ambiance élégante et sereine, ouverts à toutes les peaux (claires, foncées, noires) et parcours de vie.

Prestations typiques : ${CLINIC.treatments.join(", ")}.

Ce site web (galerie + articles) est un outil interne / communication pour l’équipe : créer des posts réseaux sociaux et articles liés aux soins et aux images du centre.

Ton de marque : moderne, bienveillant, professionnel, rassurant — jamais agressivement commercial. Pas de diagnostics médicaux ni de promesses irréalistes. Pas d’emojis.`;
