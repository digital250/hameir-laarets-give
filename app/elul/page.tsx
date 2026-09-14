"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  CheckCircle,
  BookOpen,
  FacebookLogo,
  GlobeHemisphereWest,
  HandHeart,
  Heart,
  House,
  InstagramLogo,
  LinkSimpleHorizontal,
  LockKey,
  ShieldCheck,
  Sparkle,
  YoutubeLogo,
} from "@phosphor-icons/react";
import styles from "../v4/v4.module.css";

type CauseId = "families" | "children" | "food" | "community" | "torah";
type Locale = "en" | "es" | "fr";
type LocalizedText = Record<Locale, string>;

type DoubleCheckoutOptions = {
  campaign: string;
  fundraiser?: string;
  solicitor?: string;
};

declare global {
  interface Window {
    Double?: {
      openCheckout: (options: DoubleCheckoutOptions) => Promise<void> | void;
      closeCheckout?: () => Promise<void> | void;
    };
  }
}

type Campaign = {
  id: string;
  doubleCampaign: string;
  cause: CauseId;
  eyebrow: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  image: string;
};

// Elul-only edition: only the two campaigns we want people donating to this month.
// The full multi-campaign experience still lives, untouched, at app/v4/page.tsx.
const campaigns: Campaign[] = [
  {
    id: "food-relief",
    doubleCampaign: "kaparotelul-2026",
    cause: "food",
    eyebrow: {
      en: "High Holidays 5786 · Our goal: 1,100 baskets",
      es: "Altas Fiestas 5786 · Nuestra meta: 1,100 canastas",
      fr: "Grandes Fêtes 5786 · Notre objectif : 1 100 paniers",
    },
    title: {
      en: "High Holiday Food Baskets for Families in the South",
      es: "Canastas de alimentos de Altas Fiestas para familias del sur",
      fr: "Paniers alimentaires des Grandes Fêtes pour les familles du Sud",
    },
    description: {
      en: "Help us pack and deliver 1,100 festive food baskets to families in southern Israel before the holidays.",
      es: "Ayúdanos a preparar y entregar 1,100 canastas de alimentos festivas a familias del sur de Israel antes de las festividades.",
      fr: "Aidez-nous à préparer et à livrer 1 100 paniers alimentaires de fête à des familles du sud d'Israël avant les fêtes.",
    },
    image: "/images/elul-volunteers-featured.jpg",
  },
  {
    id: "kaparot",
    doubleCampaign: "kaparot-2026",
    cause: "families",
    eyebrow: {
      en: "Before Yom Kippur · Pidyon Kaparot",
      es: "Antes de Yom Kipur · Pidyon Kaparot",
      fr: "Avant Yom Kippour · Pidyon Kapparot",
    },
    title: {
      en: "Fulfill Your Family’s Pidyon Kapparot",
      es: "Cumple el Pidyon Kapparot de tu familia",
      fr: "Accomplissez le Pidyon Kapparot de votre famille",
    },
    description: {
      en: "A meaningful act of tzedakah before Yom Kippur, carrying your family’s names in tefillah at the Kotel.",
      es: "Un acto significativo de tzedaká antes de Yom Kipur, llevando los nombres de tu familia en tefilá al Kotel.",
      fr: "Un acte de tsédaka porteur de sens avant Yom Kippour, avec les noms de votre famille en téfila au Kotel.",
    },
    image: "/images/kapparot-yom-kippur-hero-v1.png",
  },
];

const IMPACT_BY_CAUSE: Record<CauseId, Record<Locale, string>> = {
  families: {
    en: "14,500 food baskets distributed through Chesed last year",
    es: "14,500 canastas de alimentos entregadas mediante Jesed el año pasado",
    fr: "14 500 paniers alimentaires distribués grâce au Hessed l'an dernier",
  },
  children: {
    en: "76,000 people guided and strengthened last year",
    es: "76,000 personas recibieron orientación y apoyo el año pasado",
    fr: "76 000 personnes accompagnées et soutenues l'an dernier",
  },
  food: {
    en: "14,500 food baskets distributed through Chesed last year",
    es: "14,500 canastas de alimentos entregadas mediante Jesed el año pasado",
    fr: "14 500 paniers alimentaires distribués grâce au Hessed l'an dernier",
  },
  community: {
    en: "Communities in 136 countries reached through Hameir Laarets’ work last year",
    es: "El trabajo de Hameir Laarets llegó a comunidades en 136 países el año pasado",
    fr: "L'action de Hameir Laarets a touché des communautés dans 136 pays l'an dernier",
  },
  torah: {
    en: "6.5M Torah publications distributed last year",
    es: "6.5 millones de publicaciones de Torá distribuidas el año pasado",
    fr: "6,5 millions de publications de Torah distribuées l'an dernier",
  },
};
const DOUBLE_EMBED_URL = "https://embed.double.giving/652a15b0-2417-11f0-80b5-ed6216307745";
const HERO_MEDIA = {
  poster: "/media/hameir-global-hero-poster-clean.png",
  mp4: "/media/hameir-global-hero-4k.mp4",
  videoReady: true,
} as const;
const HERO_START_TIME_SECONDS = 2.9;
const HERO_REVEAL_TIME_SECONDS = 5;
const MOBILE_HERO_REVEAL_DELAY_MS = 2600;
const SOLICITORS: Record<string, { name: string; defaultLocale: Locale }> = {
  "abigail-sagor": { name: "Abigail Sagor", defaultLocale: "en" },
  "karine-blatman": { name: "Karine Blatman", defaultLocale: "en" },
  "yehuda-dayan": { name: "Yehuda Dayan", defaultLocale: "en" },
  "shachar-shalom": { name: "Shachar Shalom", defaultLocale: "en" },
  "elvira-rozillio": { name: "Elvira Rozillio", defaultLocale: "es" },
};
const SOLICITOR_PATHS: Record<string, string> = {
  abi: "abigail-sagor",
  karine: "karine-blatman",
  yehuda: "yehuda-dayan",
  shachar: "shachar-shalom",
  elvira: "elvira-rozillio",
};
const COPY = {
  en: {
    skip: "Skip to main content",
    homeLabel: "Hameir Laarets donation center home",
    mainNavigation: "Main navigation",
    securityInfo: "Donation security information",
    creditedPrefix: "You’re giving with",
    creditedSuffix: "Your gift will be credited to them automatically.",
    tagline: "Pidyon Kapparot · Tzedakah · Chesed",
    secure: "Secure checkout",
    deductible: "Tax-deductible",
    ourWork: "Ways to help",
    whyTrust: "Why give here",
    mainSite: "Main website",
    give: "Give",
    languageLabel: "Language",
    identityTitle: "Fulfill Your Family’s Pidyon",
    identityTitleAccent: "A meaningful moment before Yom Kippur",
    identityBody: "A $180 Family Pidyon brings personal reflection together with tzedakah and practical chesed for families in Southern Israel.",
    supportCurrent: "Fulfill Your Family Pidyon",
    discover: "See the mission behind the work",
    namesEyebrow: "Your Names, Carried in Tefillah",
    namesBody: "Before Yom Kippur, the names entrusted to us will be carried in a special tefillah at the Kotel.",
    namesInscribed: "May this act of tzedakah bring",
    namesBookOfLifePhrase: "merit and blessing to your family",
    namesPortraitAlt: "Rabbi Yisrael Abergel shlit’a",
    torah: "Torah",
    torahBody: "Making Torah wisdom accessible through books, learning, and guidance.",
    chesed: "Chesed",
    chesedBody: "Standing with families through food, therapeutic care, and practical assistance, including hundreds of orphans, widows, and young couples every year.",
    community: "Community",
    communityBody: "Strengthening Jewish connection across Israel and communities worldwide.",
    legacyTitle: "From Jerusalem, a Light of Torah",
    legacyTitleAccent: "Continues Across the World",
    founderRole: "Founder",
    founderBody: "His vision united Torah learning with practical acts of Chesed.",
    founderQuote: "The whole world was created only for the sake of kindness.",
    leaderRole: "Continuing the mission",
    leaderBody: "Advancing his father’s vision through faith, responsibility, and action.",
    impactEyebrow: "Our impact",
    impactTitle: "A year of Torah.",
    impactTitleAccent: "A year of care.",
    titlesLabel: "Countries reached",
    languagesLabel: "Torah publications distributed",
    basketsLabel: "Food baskets distributed through Chesed",
    studentsLabel: "People guided & strengthened",
    officialSource: "Annual impact figures supplied by Hameir Laarets.",
    featured: "Last days before Yom Kippur · Pidyon Kapparot",
    elulTitle: "Fulfill Your Family’s",
    elulTitleAccent: "Pidyon Kapparot",
    elulPhotoBody: "A quiet act of tzedakah before Yom Kippur — given on behalf of your family.",
    elulBody: "A $180 Family Pidyon offers a meaningful way to unite personal reflection with tzedakah and chesed. Your gift helps provide food assistance, essential needs, and care that preserves dignity for families in Southern Israel.",
    seasonalCta: "Fulfill Your Family Pidyon",
    donationConfidenceEyebrow: "Give with confidence",
    donationConfidenceTitle: "Your gift joins a proven, worldwide mission.",
    donationConfidenceFamilies: "14,500 food baskets delivered",
    donationConfidenceCountries: "136 countries reached",
    donationConfidenceSecure: "Secure checkout",
    donationConfidenceTax: "Tax-deductible giving",
    campaignsLink: "Explore other ways to help",
    campaignsEyebrow: "More ways to support",
    campaignsTitle: "Support the work",
    campaignsTitleAccent: "that continues all year.",
    campaignsBody: "If a fundraiser invited you, they’ll be credited automatically, whichever cause you choose.",
    viewKaparot: "Give to Kaparot",
    chooseCampaign: "Donate to this cause",
    confidence: "Give with clarity",
    trustTitle: "Know where you’re giving.",
    trustTitleAccent: "Feel confident at every step.",
    established: "Registered & accountable",
    establishedBody: "Hameir Laarets is a registered U.S. nonprofit. Donations are tax-deductible in Israel and the United States.",
    secureDesign: "Secure payment",
    secureDesignBody: "You’ll complete your donation through the organization’s secure payment provider.",
    choiceClear: "Your choices stay with you",
    choiceClearBody: "Review your cause, amount, frequency, and fundraiser credit before you continue.",
    footerTagline: "Torah · Compassion · Community",
    stayConnected: "Stay connected",
    contactUs: "Contact us",
    privacyPolicy: "Privacy policy",
    mailingAddress: "P.O. Box 345 · Netivot 8771301 · Israel",
    nonprofit: "Hameir Laarets · Registered 501(c)(3) · EIN 84-5083012",
    taxStatus: "Donations are tax-deductible in Israel and the USA.",
    rights: "© 2026 Hameir Laarets. All rights reserved.",
    rabbisAlt: "Rabbi Yoram Michael Abergel zt’l and Rabbi Yisrael Abergel together",
    volunteersAlt: "A Hameir Laarets volunteer carrying a holiday food box for families in Israel",
    onlineNav: "Hameir Laarets online",
    elulFormTitle: "Elul donation form",
    officialInfoLabel: "Official information",
    bankWireToggle: "Bank wire details",
    bankWireBeneficiary: "Beneficiary",
    bankWireBank: "Bank",
    bankWireAccount: "Account number",
    bankWireRouting: "Routing number",
    bankWireAddress: "Beneficiary address",
    bankWireEin: "EIN",
    bankWireCopy: "Copy bank details",
    bankWireCopied: "Copied ✓",
  },
  es: {
    skip: "Saltar al contenido principal",
    homeLabel: "Inicio del centro de donativos de Hameir Laarets",
    mainNavigation: "Navegación principal",
    securityInfo: "Información de seguridad del donativo",
    creditedPrefix: "Donas junto a",
    creditedSuffix: "Tu donativo quedará acreditado a su nombre automáticamente.",
    tagline: "Pidión Kaparot · Tzedaká · Jesed",
    secure: "Pago seguro",
    deductible: "Deducible de impuestos",
    ourWork: "Formas de ayudar",
    whyTrust: "Por qué donar aquí",
    mainSite: "Sitio principal",
    give: "Donar",
    languageLabel: "Idioma",
    identityTitle: "Cumple el Pidión de tu familia",
    identityTitleAccent: "Un momento de sentido antes de Yom Kipur",
    identityBody: "Un Pidión Familiar de $180 une la reflexión personal con la tzedaká y el jesed para familias del sur de Israel.",
    supportCurrent: "Cumple el Pidión familiar",
    discover: "Conoce la misión",
    namesEyebrow: "Tu nombre, llevado en tefilá",
    namesBody: "Antes de Yom Kipur, los nombres que se nos confíen serán llevados en una tefilá especial en el Kotel.",
    namesInscribed: "Que este acto de tzedaká traiga",
    namesBookOfLifePhrase: "mérito y bendición a tu familia",
    namesPortraitAlt: "Rabino Yisrael Abergel shlit’a",
    torah: "Torá",
    torahBody: "Hacemos accesible la sabiduría de la Torá mediante libros, estudio y orientación.",
    chesed: "Jesed",
    chesedBody: "Acompañamos a familias con alimentos, atención terapéutica y ayuda práctica, incluyendo a cientos de huérfanos, viudas y parejas jóvenes cada año.",
    community: "Comunidad",
    communityBody: "Fortalecemos la conexión judía en Israel y en comunidades de todo el mundo.",
    legacyTitle: "Desde Jerusalén, una luz de Torá",
    legacyTitleAccent: "continúa por todo el mundo",
    founderRole: "Fundador",
    founderBody: "Su visión unió el estudio de la Torá con actos concretos de Jesed.",
    founderQuote: "El mundo entero fue creado únicamente por el mérito del Jesed.",
    leaderRole: "Continuando la misión",
    leaderBody: "Continúa la visión de su padre con fe, responsabilidad y acción.",
    impactEyebrow: "Nuestro impacto",
    impactTitle: "Un año de Torá.",
    impactTitleAccent: "Un año de ayuda.",
    titlesLabel: "Países alcanzados",
    languagesLabel: "Publicaciones de Torá distribuidas",
    basketsLabel: "Canastas de alimentos entregadas mediante Jesed",
    studentsLabel: "Personas orientadas y fortalecidas",
    officialSource: "Cifras anuales proporcionadas por Hameir Laarets.",
    featured: "Últimos días antes de Yom Kipur · Pidión Kaparot",
    elulTitle: "Cumple el Pidión",
    elulTitleAccent: "de tu familia",
    elulPhotoBody: "Un acto sereno de tzedaká antes de Yom Kipur.",
    elulBody: "Un Pidión Familiar de $180 convierte la reflexión en jesed práctico para familias del sur de Israel.",
    seasonalCta: "Cumple el Pidión familiar",
    donationConfidenceEyebrow: "Dona con confianza",
    donationConfidenceTitle: "Tu donativo se suma a una misión comprobada en todo el mundo.",
    donationConfidenceFamilies: "14,500 canastas de alimentos entregadas",
    donationConfidenceCountries: "136 países alcanzados",
    donationConfidenceSecure: "Pago seguro",
    donationConfidenceTax: "Donativo deducible de impuestos",
    campaignsLink: "Explora otras formas de ayudar",
    campaignsEyebrow: "Más formas de apoyar",
    campaignsTitle: "Dona mediante Pidyon Kaparot.",
    campaignsTitleAccent: "Una tradición de tzedaká antes del Año Nuevo.",
    campaignsBody: "Si un promotor te invitó, recibirá el crédito automáticamente, sin importar qué causa elijas.",
    viewKaparot: "Donar a Kaparot",
    chooseCampaign: "Donar a esta causa",
    confidence: "Dona con claridad",
    trustTitle: "Conoce el destino de tu donativo.",
    trustTitleAccent: "Dona con confianza en cada paso.",
    established: "Registrada y responsable",
    establishedBody: "Hameir Laarets es una organización sin fines de lucro registrada en Estados Unidos. Los donativos son deducibles de impuestos en Israel y Estados Unidos.",
    secureDesign: "Pago seguro",
    secureDesignBody: "Completarás tu donativo mediante el proveedor de pagos seguro de la organización.",
    choiceClear: "Tu elección se respeta",
    choiceClearBody: "Antes de continuar, revisa la causa, el monto, la frecuencia y el crédito del promotor.",
    footerTagline: "Torá · Compasión · Comunidad",
    stayConnected: "Mantente conectado",
    contactUs: "Contáctanos",
    privacyPolicy: "Política de privacidad",
    mailingAddress: "Apartado postal 345 · Netivot 8771301 · Israel",
    nonprofit: "Hameir Laarets · Organización 501(c)(3) · EIN 84-5083012",
    taxStatus: "Los donativos son deducibles de impuestos en Israel y Estados Unidos.",
    rights: "© 2026 Hameir Laarets. Todos los derechos reservados.",
    rabbisAlt: "El rabino Yoram Michael Abergel zt’l junto al rabino Yisrael Abergel",
    volunteersAlt: "Un voluntario de Hameir Laarets llevando una caja de alimentos festivos para familias en Israel",
    onlineNav: "Hameir Laarets en línea",
    elulFormTitle: "Formulario de donación de Elul",
    officialInfoLabel: "Información oficial",
    bankWireToggle: "Datos para transferencia bancaria",
    bankWireBeneficiary: "Beneficiario",
    bankWireBank: "Banco",
    bankWireAccount: "Número de cuenta",
    bankWireRouting: "Número de ruta (routing)",
    bankWireAddress: "Dirección del beneficiario",
    bankWireEin: "EIN",
    bankWireCopy: "Copiar datos bancarios",
    bankWireCopied: "Copiado ✓",
  },
  fr: {
    skip: "Passer au contenu principal",
    homeLabel: "Accueil du centre de dons Hameir Laarets",
    mainNavigation: "Navigation principale",
    securityInfo: "Informations sur la sécurité du don",
    creditedPrefix: "Vous donnez avec",
    creditedSuffix: "Votre don leur sera automatiquement crédité.",
    tagline: "Pidyon Kapparot · Tsedaka · Hessed",
    secure: "Paiement sécurisé",
    deductible: "Déductible des impôts",
    ourWork: "Comment aider",
    whyTrust: "Pourquoi donner ici",
    mainSite: "Site principal",
    give: "Faire un don",
    languageLabel: "Langue",
    identityTitle: "Accomplissez le Pidyon de votre famille",
    identityTitleAccent: "Un moment de sens avant Yom Kippour",
    identityBody: "Un Pidyon familial de 180 $ relie la réflexion personnelle à la tsedaka et au hessed pour des familles du sud d’Israël.",
    supportCurrent: "Accomplir le Pidyon familial",
    discover: "Découvrir la mission derrière notre action",
    namesEyebrow: "Vos noms, portés dans la tefila",
    namesBody: "Avant Yom Kippour, les noms qui nous seront confiés seront portés dans une tefila spéciale au Kotel.",
    namesInscribed: "Que cet acte de tsedaka apporte",
    namesBookOfLifePhrase: "mérite et bénédiction à votre famille",
    namesPortraitAlt: "Rabbin Yisrael Abergel chlita",
    torah: "Torah",
    torahBody: "Rendre la sagesse de la Torah accessible par les livres, l’étude et l’accompagnement.",
    chesed: "Hessed",
    chesedBody: "Soutenir les familles par l’aide alimentaire, les soins thérapeutiques et une assistance concrète, y compris des centaines d’orphelins, de veuves et de jeunes couples chaque année.",
    community: "Communauté",
    communityBody: "Renforcer les liens juifs en Israël et au sein des communautés du monde entier.",
    legacyTitle: "Depuis Jérusalem, une lumière de Torah",
    legacyTitleAccent: "se poursuit à travers le monde",
    founderRole: "Fondateur",
    founderBody: "Sa vision a uni l’étude de la Torah à des actes concrets de Hessed.",
    founderQuote: "Le monde entier n’a été créé que pour le mérite du Hessed.",
    leaderRole: "Poursuit la mission",
    leaderBody: "Fait avancer la vision de son père par la foi, la responsabilité et l’action.",
    impactEyebrow: "Notre impact",
    impactTitle: "Une année de Torah.",
    impactTitleAccent: "Une année de soutien.",
    titlesLabel: "Pays touchés",
    languagesLabel: "Publications de Torah distribuées",
    basketsLabel: "Paniers alimentaires distribués grâce au Hessed",
    studentsLabel: "Personnes accompagnées et soutenues",
    officialSource: "Chiffres d’impact annuels communiqués par Hameir Laarets.",
    featured: "Derniers jours avant Yom Kippour · Pidyon Kapparot",
    elulTitle: "Accomplissez le Pidyon",
    elulTitleAccent: "de votre famille",
    elulPhotoBody: "Un acte de tsedaka serein avant Yom Kippour.",
    elulBody: "Un Pidyon familial de 180 $ transforme la réflexion en hessed concret pour des familles du sud d’Israël.",
    seasonalCta: "Accomplir le Pidyon familial",
    donationConfidenceEyebrow: "Donnez en toute confiance",
    donationConfidenceTitle: "Votre don rejoint une mission mondiale éprouvée.",
    donationConfidenceFamilies: "14 500 paniers alimentaires distribués",
    donationConfidenceCountries: "136 pays touchés",
    donationConfidenceSecure: "Paiement sécurisé",
    donationConfidenceTax: "Don déductible des impôts",
    campaignsLink: "Découvrir d’autres manières d’aider",
    campaignsEyebrow: "D’autres manières de soutenir",
    campaignsTitle: "Donnez via le Pidyon Kapparot.",
    campaignsTitleAccent: "Une tradition de tsedaka avant le Nouvel An.",
    campaignsBody: "Si une personne vous a invité à donner, elle recevra automatiquement le crédit de votre don, quelle que soit la cause choisie.",
    viewKaparot: "Donner pour les Kapparot",
    chooseCampaign: "Donner pour cette cause",
    confidence: "Donnez en toute clarté",
    trustTitle: "Sachez où va votre don.",
    trustTitleAccent: "Avancez en confiance à chaque étape.",
    established: "Enregistrée et responsable",
    establishedBody: "Hameir Laarets est une association à but non lucratif enregistrée aux États-Unis. Les dons sont déductibles des impôts en Israël et aux États-Unis.",
    secureDesign: "Paiement sécurisé",
    secureDesignBody: "Vous finaliserez votre don via le prestataire de paiement sécurisé de l’organisation.",
    choiceClear: "Vos choix restent entre vos mains",
    choiceClearBody: "Vérifiez la cause, le montant, la fréquence et le crédit du collecteur avant de continuer.",
    footerTagline: "Torah · Compassion · Communauté",
    stayConnected: "Restez connectés",
    contactUs: "Nous contacter",
    privacyPolicy: "Politique de confidentialité",
    mailingAddress: "B.P. 345 · Netivot 8771301 · Israël",
    nonprofit: "Hameir Laarets · Association enregistrée 501(c)(3) · EIN 84-5083012",
    taxStatus: "Les dons sont déductibles des impôts en Israël et aux États-Unis.",
    rights: "© 2026 Hameir Laarets. Tous droits réservés.",
    rabbisAlt: "Le Rabbi Yoram Michael Abergel zt’l et le Rabbi Yisrael Abergel ensemble",
    volunteersAlt: "Un bénévole de Hameir Laarets portant un colis alimentaire de fête pour des familles en Israël",
    onlineNav: "Hameir Laarets en ligne",
    elulFormTitle: "Formulaire de don d’Eloul",
    officialInfoLabel: "Informations officielles",
    bankWireToggle: "Coordonnées de virement bancaire",
    bankWireBeneficiary: "Bénéficiaire",
    bankWireBank: "Banque",
    bankWireAccount: "Numéro de compte",
    bankWireRouting: "Numéro de routage",
    bankWireAddress: "Adresse du bénéficiaire",
    bankWireEin: "EIN",
    bankWireCopy: "Copier les coordonnées",
    bankWireCopied: "Copié ✓",
  },
} as const;
const SOCIAL_LINKS: { label: LocalizedText; href: string; icon: typeof GlobeHemisphereWest }[] = [
  {
    label: {
      en: "Hameir Laarets website",
      es: "Sitio web de Hameir Laarets",
      fr: "Site web de Hameir Laarets",
    },
    href: "https://hameirlaarets.org/",
    icon: GlobeHemisphereWest,
  },
  {
    label: {
      en: "Hameir Laarets on Instagram",
      es: "Hameir Laarets en Instagram",
      fr: "Hameir Laarets sur Instagram",
    },
    href: "https://www.instagram.com/hameirlaarets/",
    icon: InstagramLogo,
  },
  {
    label: {
      en: "Rabbi Yisrael Abergel on Facebook",
      es: "Rabino Yisrael Abergel en Facebook",
      fr: "Rabbi Yisrael Abergel sur Facebook",
    },
    href: "https://www.facebook.com/haravisraelabergel/",
    icon: FacebookLogo,
  },
  {
    label: {
      en: "Hameir Laarets on YouTube",
      es: "Hameir Laarets en YouTube",
      fr: "Hameir Laarets sur YouTube",
    },
    href: "https://www.youtube.com/channel/UC2FAfGOU_D8jgT1E3p1KJog",
    icon: YoutubeLogo,
  },
];

// Kaparot leads the page; the ongoing food-support campaign remains available below.
const campaignDisplayOrder = [...campaigns].sort((a, b) => Number(b.id === "kaparot") - Number(a.id === "kaparot"));

// The campaign featured in the hero, the story section, and the main donation form.
const SEASONAL_CAMPAIGN_ID = "kaparot";
const seasonalCampaign = campaigns.find((campaign) => campaign.id === SEASONAL_CAMPAIGN_ID) ?? campaigns[0];

export default function ElulDonationExperience() {
  const [fundraiser, setFundraiser] = useState("");
  const [fundraiserSlug, setFundraiserSlug] = useState("");
  const [solicitor, setSolicitor] = useState("");
  const [locale, setLocale] = useState<Locale>("en");
  const [urlReady, setUrlReady] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [isMobileHero, setIsMobileHero] = useState(true);
  const [heroVideoUnavailable, setHeroVideoUnavailable] = useState(false);
  const [heroVideoActive, setHeroVideoActive] = useState(false);
  const [bankDetailsCopied, setBankDetailsCopied] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const mobileHeroRevealTimerRef = useRef<number | null>(null);
  const t = COPY[locale];

  useEffect(() => {
    if (document.querySelector(`script[src="${DOUBLE_EMBED_URL}"]`)) return;
    const script = document.createElement("script");
    script.src = DOUBLE_EMBED_URL;
    script.async = true;
    script.referrerPolicy = "strict-origin-when-cross-origin";
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 520px)");
    const syncHeroMode = () => {
      const mobile = media.matches;
      setIsMobileHero(mobile);
      if (mobile) setHeroRevealed(true);
    };
    syncHeroMode();
    media.addEventListener("change", syncHeroMode);
    return () => media.removeEventListener("change", syncHeroMode);
  }, []);

  useEffect(() => {
    if (!HERO_MEDIA.videoReady || isMobileHero) return;
    const video = heroVideoRef.current;
    if (!video) return;

    let cancelled = false;
    const showPosterFallback = () => {
      if (cancelled) return;
      setHeroVideoUnavailable(true);
      setHeroRevealed(true);
    };

    const playAttempt = video.play();
    playAttempt?.catch(showPosterFallback);

    const playbackWatchdog = window.setTimeout(() => {
      if (video.paused || video.readyState < 2) showPosterFallback();
    }, 4500);

    return () => {
      cancelled = true;
      window.clearTimeout(playbackWatchdog);
      if (mobileHeroRevealTimerRef.current !== null) {
        window.clearTimeout(mobileHeroRevealTimerRef.current);
      }
    };
  }, [isMobileHero]);

  useEffect(() => {
    const syncFromUrl = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const pathCandidate = window.location.pathname.split("/").filter(Boolean)[0] || "";
      const pathSolicitor = SOLICITOR_PATHS[pathCandidate] || (SOLICITORS[pathCandidate] ? pathCandidate : "");
      const storedSolicitor = window.sessionStorage.getItem("hameir-solicitor") || "";
      const requestedSolicitor = params.get("solicitor") || pathSolicitor || storedSolicitor;
      const solicitorProfile = SOLICITORS[requestedSolicitor];
      const requestedFundraiser = params.get("fundraiser") || params.get("ref") || params.get("collector") || "";
      const requestedLocale = params.get("lang");

      if (requestedSolicitor) window.sessionStorage.setItem("hameir-solicitor", requestedSolicitor);
      setSolicitor(requestedSolicitor);
      setFundraiserSlug(requestedFundraiser);
      setFundraiser(solicitorProfile?.name || requestedFundraiser || requestedSolicitor);
      setLocale(requestedLocale === "es" || requestedLocale === "en" || requestedLocale === "fr"
        ? requestedLocale
        : solicitorProfile?.defaultLocale || "en");
      setUrlReady(true);
    }, 0);
    return () => window.clearTimeout(syncFromUrl);
  }, []);

  useEffect(() => {
    if (!urlReady) return;
    document.documentElement.lang = locale;

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("lang", locale);
    window.history.replaceState({}, "", currentUrl);
  }, [locale, urlReady]);

  const displayedCampaigns = campaignDisplayOrder;
  const scrollToGift = () => {
    document.getElementById("v4-give")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const bankWireText = [
    "American Friends of Hameir Laarets Inc.",
    "Beacon Bank",
    "Account number: 5111002571",
    "Routing number: 211371489",
    "American Friends of Hameir Laarets Inc.",
    "111 North Central Avenue, Ste 425",
    "Hartsdale, NY 10530",
    "EIN 84-5083012",
  ].join("\n");

  const copyBankDetails = () => {
    navigator.clipboard?.writeText(bankWireText).then(() => {
      setBankDetailsCopied(true);
      window.setTimeout(() => setBankDetailsCopied(false), 2500);
    });
  };

  const resetDoubleCheckout = () => new Promise<void>((resolve, reject) => {
    window.Double?.closeCheckout?.();
    document.querySelectorAll(".double-app").forEach((element) => element.remove());
    document.querySelectorAll(`script[src="${DOUBLE_EMBED_URL}"]`).forEach((element) => element.remove());
    delete window.Double;

    const handleReady = () => {
      resolve();
    };
    const script = document.createElement("script");
    script.src = DOUBLE_EMBED_URL;
    script.async = true;
    script.referrerPolicy = "strict-origin-when-cross-origin";
    script.addEventListener("error", () => {
      document.removeEventListener("Double.ready", handleReady);
      reject(new Error("Double checkout failed to reload."));
    }, { once: true });
    document.addEventListener("Double.ready", handleReady, { once: true });
    document.head.appendChild(script);
  });

  const openDoubleCheckout = (campaign: Campaign) => {
    const openDouble = () => {
      window.Double?.openCheckout({
        campaign: campaign.doubleCampaign,
        ...(fundraiserSlug ? { fundraiser: fundraiserSlug } : {}),
        ...(solicitor ? { solicitor } : {}),
      });
    };
    resetDoubleCheckout()
      .then(openDouble)
      .catch(() => {
        if (window.Double?.openCheckout) openDouble();
      });
  };

  const chooseCampaign = (campaign: Campaign) => {
    openDoubleCheckout(campaign);
  };

  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#v4-main">{t.skip}</a>

      {fundraiser && (
        <div className={styles.fundraiserStrip}>
          <LinkSimpleHorizontal size={16} weight="bold" aria-hidden="true" />
          <span>{t.creditedPrefix} <strong>{fundraiser}</strong>. {t.creditedSuffix}</span>
        </div>
      )}

      <header className={styles.header}>
        <a href="#v4-main" className={styles.brand} aria-label={t.homeLabel}>
          <Image src="/images/hameir-laarets-logo-new.png" alt="" width={1024} height={1024} priority />
          <span>
            <strong>HAMEIR LAARETS</strong>
            <small>{t.tagline}</small>
          </span>
        </a>
        <nav className={styles.nav} aria-label={t.mainNavigation}>
          <a href="#v4-campaigns">{t.ourWork}</a>
          <a href="#v4-trust">{t.whyTrust}</a>
        </nav>
        <a
          className={styles.mainSiteLink}
          href="https://hameirlaarets.org/"
          aria-label={t.mainSite}
        >
          <House size={17} weight="regular" aria-hidden="true" />
          <span>{t.mainSite}</span>
        </a>
        <div className={styles.languageSwitch} role="group" aria-label={t.languageLabel}>
          <button type="button" aria-pressed={locale === "en"} onClick={() => setLocale("en")}>EN</button>
          <button type="button" aria-pressed={locale === "es"} onClick={() => setLocale("es")}>ES</button>
          <button type="button" aria-pressed={locale === "fr"} onClick={() => setLocale("fr")}>FR</button>
        </div>
        <button className={styles.headerGive} onClick={scrollToGift}>
          {t.give} <Heart size={18} weight="regular" aria-hidden="true" />
        </button>
      </header>

      <section className={styles.globalHero} id="v4-main" aria-labelledby="global-hero-title">
        <div className={styles.heroMedia} aria-hidden="true">
          <Image src={HERO_MEDIA.poster} alt="" fill priority sizes="100vw" />
          {HERO_MEDIA.videoReady && !isMobileHero && (
            <video
              ref={heroVideoRef}
              className={`${heroVideoActive ? styles.heroVideoActive : ""} ${heroVideoUnavailable ? styles.heroVideoUnavailable : ""}`}
              autoPlay
              muted
              playsInline
              disablePictureInPicture
              preload="metadata"
              poster={HERO_MEDIA.poster}
              onLoadedMetadata={(event) => {
                event.currentTarget.currentTime = HERO_START_TIME_SECONDS;
              }}
              onCanPlay={() => setHeroVideoActive(true)}
              onPlaying={() => {
                setHeroVideoActive(true);
                if (!window.matchMedia("(max-width: 520px)").matches) return;
                if (mobileHeroRevealTimerRef.current !== null) return;
                mobileHeroRevealTimerRef.current = window.setTimeout(() => {
                  setHeroRevealed(true);
                  mobileHeroRevealTimerRef.current = null;
                }, MOBILE_HERO_REVEAL_DELAY_MS);
              }}
              onTimeUpdate={(event) => {
                if (window.matchMedia("(max-width: 520px)").matches) return;
                if (event.currentTarget.currentTime >= HERO_REVEAL_TIME_SECONDS) {
                  setHeroRevealed(true);
                }
              }}
              onEnded={(event) => {
                event.currentTarget.currentTime = HERO_START_TIME_SECONDS;
                event.currentTarget.play().catch(() => {
                  setHeroVideoUnavailable(true);
                  setHeroRevealed(true);
                });
              }}
              onError={() => {
                setHeroVideoUnavailable(true);
                setHeroRevealed(true);
              }}
            >
              <source src={HERO_MEDIA.mp4} type="video/mp4" />
            </video>
          )}
          <span className={styles.heroScrim} />
        </div>
        <span className={styles.mobileHeroAtmosphere} aria-hidden="true" />
        <div className={`${styles.heroContent} ${heroRevealed ? styles.heroContentVisible : ""}`}>
          <Image className={styles.heroLogo} src="/images/hameir-laarets-logo-new.png" alt="" width={1024} height={1024} priority />
          <span>{t.tagline}</span>
          <h1 id="global-hero-title">
            <span className={styles.heroTitleLine}>{t.identityTitle}</span>
            <strong>{t.identityTitleAccent}</strong>
          </h1>
          <p>{t.identityBody}</p>
          <div className={styles.heroActions}>
            <button type="button" onClick={() => openDoubleCheckout(seasonalCampaign)}>
              {t.supportCurrent} <ArrowRight size={18} weight="bold" />
            </button>
            <a href="#v4-legacy">{t.discover}</a>
          </div>
        </div>
        <a
          className={`${styles.heroScrollCue} ${heroRevealed ? styles.heroScrollCueVisible : ""}`}
          href="#v4-featured"
          aria-hidden="true"
          tabIndex={-1}
        >
          <ArrowDown size={18} weight="bold" />
        </a>
      </section>

      <section className={`${styles.seasonalHero} ${styles.featuredTop}`} id="v4-featured" aria-labelledby="featured-title">
        <div className={styles.photoPanel}>
          <Image
            src={seasonalCampaign.image}
            alt={seasonalCampaign.title[locale]}
            fill
            sizes="(max-width: 520px) 100vw, 58vw"
          />
          <div className={styles.photoScrim} />
          <div className={styles.photoCopy} aria-hidden="true">
            <span>{t.featured}</span>
            <h2 id="featured-title">{t.elulTitle}<br />{t.elulTitleAccent}</h2>
            <p>{t.elulPhotoBody}</p>
          </div>
        </div>

        <div className={styles.storyPanel}>
          <Sparkle size={25} weight="light" aria-hidden="true" />
          <span>{t.featured}</span>
          <h2>{t.elulTitle}<br />{t.elulTitleAccent}</h2>
          <p>{t.elulBody}</p>
          <button type="button" className={styles.seasonalCtaButton} onClick={() => openDoubleCheckout(seasonalCampaign)}>
            {t.seasonalCta} <ArrowRight size={18} weight="bold" />
          </button>
        </div>
      </section>

      <section className={styles.namesSection} aria-labelledby="names-title">
       <div className={styles.namesInner}>
        <div className={styles.namesCopy}>
          <span>{t.namesEyebrow}</span>
          <h2 id="names-title" className={styles.visuallyHidden}>{t.namesEyebrow}</h2>
          <span className={styles.namesDivider} aria-hidden="true" />
          <p>{t.namesBody}</p>
          <div className={styles.namesBookOfLife}>
            <span>{t.namesInscribed}</span>
            <strong>{t.namesBookOfLifePhrase}</strong>
          </div>
        </div>
        <div className={styles.namesPortrait}>
          <Image
            src="/images/rabbi-yisrael-cutout.png"
            alt={t.namesPortraitAlt}
            width={352}
            height={528}
          />
        </div>
       </div>
      </section>

      <section className={styles.legacySection} id="v4-legacy" aria-labelledby="legacy-title">
        <h2 className={styles.visuallyHidden} id="legacy-title">{t.legacyTitle} {t.legacyTitleAccent}</h2>

        <div className={styles.legacyEditorial}>
          <div className={styles.rabbisTogether}>
            <Image
              src="/images/rabbis-together-final.png"
              alt={t.rabbisAlt}
              width={1596}
              height={985}
              sizes="(max-width: 760px) 82vw, 520px"
            />
          </div>

          <article className={styles.founderStory}>
            <div className={styles.legacyCopy}>
              <small>{t.founderRole}</small>
              <h3>Rabbi Yoram Michael Abergel zt&apos;l</h3>
              <p>{t.founderBody}</p>
              <p className={styles.legacyQuote}>“{t.founderQuote}”</p>
            </div>
          </article>

          <article className={styles.leaderStory}>
            <div className={styles.legacyCopy}>
              <small>{t.leaderRole}</small>
              <h3>Rabbi Yisrael Abergel shlit&apos;a</h3>
              <p>{t.leaderBody}</p>
            </div>
          </article>
        </div>

        <div className={styles.pillarsGrid}>
          <article>
            <span className={styles.pillarIcon}><BookOpen size={32} weight="light" aria-hidden="true" /></span>
            <div><strong>{t.torah}</strong><p>{t.torahBody}</p></div>
          </article>
          <article>
            <span className={styles.pillarIcon}><HandHeart size={32} weight="light" aria-hidden="true" /></span>
            <div><strong>{t.chesed}</strong><p>{t.chesedBody}</p></div>
          </article>
          <article>
            <span className={styles.pillarIcon}><GlobeHemisphereWest size={32} weight="light" aria-hidden="true" /></span>
            <div><strong>{t.community}</strong><p>{t.communityBody}</p></div>
          </article>
        </div>
      </section>

      <section className={styles.impactSection} aria-labelledby="impact-title">
        <div className={styles.impactLead}>
          <span>{t.impactEyebrow}</span>
          <h2 id="impact-title">{t.impactTitle}<strong>{t.impactTitleAccent}</strong></h2>
          <p className={styles.impactSourceNote}>{t.officialSource}</p>
        </div>
        <div className={styles.impactGrid}>
          <article><strong>136</strong><span>{t.titlesLabel}</span></article>
          <article><strong>6.5M</strong><span>{t.languagesLabel}</span></article>
          <article><strong>14,500</strong><span>{t.basketsLabel}</span></article>
          <article><strong>76,000</strong><span>{t.studentsLabel}</span></article>
        </div>
      </section>

      <section className={`${styles.seasonalHero} ${styles.donationSection}`} id="v4-donation">
        <div className={styles.donationConfidence}>
          <div>
            <span>{t.donationConfidenceEyebrow}</span>
            <h2>{t.donationConfidenceTitle}</h2>
          </div>
          <div className={styles.donationConfidencePoints}>
            <p><CheckCircle size={18} weight="fill" aria-hidden="true" />{t.donationConfidenceFamilies}</p>
            <p><GlobeHemisphereWest size={18} weight="fill" aria-hidden="true" />{t.donationConfidenceCountries}</p>
            <p><LockKey size={18} weight="fill" aria-hidden="true" />{t.donationConfidenceSecure}</p>
            <p><ShieldCheck size={18} weight="fill" aria-hidden="true" />{t.donationConfidenceTax}</p>
          </div>
        </div>
        <div className={styles.doubleEmbedFrameShell} id="v4-give">
          <button type="button" className={styles.seasonalCtaButton} onClick={() => openDoubleCheckout(seasonalCampaign)}>
            {t.supportCurrent} <ArrowRight size={18} weight="bold" />
          </button>
        </div>

        <div className={styles.trustLine} aria-label={t.securityInfo}>
          <span><LockKey size={17} /> {t.secure}</span><i />
          <span><CheckCircle size={17} /> {t.deductible}</span><i />
          <span><ShieldCheck size={18} /> 501(c)(3)</span>
        </div>

        <div className={styles.donationLinks}>
          <a className={styles.exploreCampaigns} href="#bank-wire">
            {t.bankWireToggle} <ArrowDown size={16} weight="bold" />
          </a>
          <a className={styles.exploreCampaigns} href="#v4-campaigns">
            {t.campaignsLink} <ArrowDown size={18} weight="bold" />
          </a>
        </div>
      </section>

      <section className={styles.campaignSection} id="v4-campaigns">
        <div className={styles.sectionLead}>
          <span>{t.campaignsEyebrow}</span>
          <h2>{t.campaignsTitle}<br />{t.campaignsTitleAccent}</h2>
        </div>

        <div className={styles.campaignGrid}>
          {displayedCampaigns.map((campaign, index) => (
            <article
              key={campaign.id}
              className={`${styles.campaignCard} ${styles.featuredCard}`}
            >
              <button
                type="button"
                className={styles.cardClickTarget}
                onClick={() => chooseCampaign(campaign)}
                aria-label={`${t.chooseCampaign}: ${campaign.title[locale]}`}
              />
              <Image
                src={campaign.image}
                alt={campaign.title[locale]}
                fill
                sizes={index === 0 ? "100vw" : "(max-width: 760px) 100vw, 50vw"}
              />
              <div className={styles.cardScrim} />
              <div className={styles.cardCopy}>
                <span>{campaign.eyebrow[locale]}</span>
                <h3>{campaign.title[locale]}</h3>
                <p>{campaign.description[locale]}</p>
                <div className={styles.campaignImpact}>
                  <CheckCircle size={18} weight="fill" aria-hidden="true" />
                  <span>
                    <small>{t.donationConfidenceEyebrow}</small>
                    {IMPACT_BY_CAUSE[campaign.cause][locale]}
                  </span>
                </div>
                <button onClick={() => chooseCampaign(campaign)}>
                  {t.viewKaparot} <ArrowRight size={18} weight="bold" />
                </button>
              </div>
            </article>
          ))}
        </div>

      </section>

      <section className={styles.trustSection} id="v4-trust">
        <div>
          <span>{t.confidence}</span>
          <h2>{t.trustTitle}<br />{t.trustTitleAccent}</h2>
        </div>
        <div className={styles.trustGrid}>
          <article>
            <ShieldCheck size={30} weight="light" />
            <h3>{t.established}</h3>
            <p>{t.establishedBody}</p>
          </article>
          <article>
            <LockKey size={30} weight="light" />
            <h3>{t.secureDesign}</h3>
            <p>{t.secureDesignBody}</p>
          </article>
          <article>
            <Check size={30} weight="light" />
            <h3>{t.choiceClear}</h3>
            <p>{t.choiceClearBody}</p>
          </article>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <Image src="/images/hameir-laarets-logo-new.png" alt="" width={1024} height={1024} />
          <div>
            <strong>HAMEIR LAARETS</strong>
            <span>{t.footerTagline}</span>
          </div>
        </div>

        <div className={styles.footerConnect}>
          <small>{t.stayConnected}</small>
          <nav aria-label={t.onlineNav}>
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => {
              const localizedLabel = label[locale];
              return (
              <a key={label.en} href={href} target="_blank" rel="noreferrer" aria-label={localizedLabel} title={localizedLabel}>
                <Icon size={26} weight="regular" aria-hidden="true" />
              </a>
              );
            })}
          </nav>
        </div>

        <div className={styles.footerLegal}>
          <nav aria-label={t.officialInfoLabel}>
            <a href="https://hameirlaarets.org/contact-us/" target="_blank" rel="noreferrer">{t.contactUs}</a>
            <a href="https://hameirlaarets.org/privacy-policy/" target="_blank" rel="noreferrer">{t.privacyPolicy}</a>
          </nav>
          <small className={styles.footerRegistered}><ShieldCheck size={14} weight="fill" aria-hidden="true" /> {t.nonprofit}</small>
          <small>{t.mailingAddress}</small>
          <small>{t.taxStatus}</small>
          <div className={styles.footerBankWire} id="bank-wire">
            <small>{t.bankWireToggle}</small>
            <small>{t.bankWireBeneficiary}: American Friends of Hameir Laarets Inc. · {t.bankWireBank}: Beacon Bank · {t.bankWireAccount}: 5111002571 · {t.bankWireRouting}: 211371489</small>
            <small>{t.bankWireAddress}: American Friends of Hameir Laarets Inc., 111 North Central Avenue, Ste 425, Hartsdale, NY 10530 · {t.bankWireEin}: 84-5083012</small>
            <button type="button" className={styles.bankWireCopyButton} onClick={copyBankDetails}>
              {bankDetailsCopied ? t.bankWireCopied : t.bankWireCopy}
            </button>
          </div>
          <small>{t.rights}</small>
        </div>
      </footer>

    </main>
  );
}
