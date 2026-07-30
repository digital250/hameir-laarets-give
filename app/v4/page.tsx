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
import styles from "./v4.module.css";

type CauseId = "families" | "children" | "food" | "community" | "torah";
type Locale = "en" | "es";

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
  eyebrow: string;
  eyebrowEs: string;
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
  image: string;
};

const campaigns: Campaign[] = [
  {
    id: "kaparot",
    doubleCampaign: "kaparotelul-2026",
    cause: "families",
    eyebrow: "Our focus now · Elul",
    eyebrowEs: "Nuestro enfoque · Elul",
    title: "Prepare a Family for the New Year",
    titleEs: "Prepara a una familia para el Año Nuevo",
    description: "Your Elul gift can bring food, care, and dignity to a Jewish family.",
    descriptionEs: "Tu donativo de Elul puede llevar alimentos, cuidado y dignidad a una familia judía.",
    image: "/images/elul-volunteers-hero-v3.jpg",
  },
  {
    id: "mesilot",
    doubleCampaign: "mesilot",
    cause: "torah",
    eyebrow: "Torah in every language",
    eyebrowEs: "Torá en todos los idiomas",
    title: "Mesilot EL Ha'Nefesh",
    titleEs: "Mesilot EL Ha'Nefesh",
    description: "Help print and send Torah booklets around the world, in the languages people can receive.",
    descriptionEs: "Ayuda a imprimir y enviar folletos de Torá por todo el mundo, en los idiomas que las personas pueden recibir.",
    image: "/images/mesilot.png",
  },
  {
    id: "torah-scholars",
    doubleCampaign: "avraichim",
    cause: "torah",
    eyebrow: "Support Torah learning",
    eyebrowEs: "Apoya el estudio de Torá",
    title: "Sustain a Kollel Scholar",
    titleEs: "Sostén a un estudioso de Torá",
    description: "Help dedicated Torah scholars learn throughout the year and keep a living tradition strong.",
    descriptionEs: "Ayuda a estudiosos de Torá dedicados a aprender durante todo el año y mantener viva la tradición.",
    image: "/images/kollel.png",
  },
  {
    id: "next-step",
    doubleCampaign: "the-next-step-initiative",
    cause: "children",
    eyebrow: "The Next Step Initiative",
    eyebrowEs: "The Next Step Initiative",
    title: "The Next Step Initiative",
    titleEs: "The Next Step Initiative",
    description: "Help children in southern Israel access hydrotherapy, equine therapy, and compassionate emotional care.",
    descriptionEs: "Ayuda a niños del sur de Israel a recibir hidroterapia, terapia con caballos y apoyo emocional compasivo.",
    image: "/images/horse-therapy.png",
  },
  {
    id: "food-relief",
    doubleCampaign: "food-packages",
    cause: "food",
    eyebrow: "Dignity at the table",
    eyebrowEs: "Dignidad en la mesa",
    title: "Food Baskets for Families",
    titleEs: "Canastas de alimentos para familias",
    description: "Help volunteers pack nourishing food baskets for families who need practical support.",
    descriptionEs: "Ayuda a voluntarios a preparar canastas nutritivas para familias que necesitan apoyo práctico.",
    image: "/images/food-packing.png",
  },
  {
    id: "general",
    doubleCampaign: "donate",
    cause: "families",
    eyebrow: "Where needed most",
    eyebrowEs: "Donde más se necesita",
    title: "Where It's Needed Most",
    titleEs: "Donde más se necesita",
    description: "Trust Hameir Laarets to direct your gift wherever the need is greatest.",
    descriptionEs: "Da a Hameir Laarets la flexibilidad de responder allí donde más se necesita.",
    image: "/images/v2-food-relief.png",
  },
];

const IMPACT_BY_CAUSE: Record<CauseId, Record<Locale, string>> = {
  families: {
    en: "14,500 families supported through Chesed last year",
    es: "14,500 familias recibieron apoyo mediante Jesed el año pasado",
  },
  children: {
    en: "76,000 people guided and strengthened last year",
    es: "76,000 personas recibieron orientación y apoyo el año pasado",
  },
  food: {
    en: "14,500 families supported through Chesed last year",
    es: "14,500 familias recibieron apoyo mediante Jesed el año pasado",
  },
  community: {
    en: "Communities in 136 countries reached through Hameir Laarets’ work last year",
    es: "El trabajo de Hameir Laarets llegó a comunidades en 136 países el año pasado",
  },
  torah: {
    en: "6.5M Torah publications distributed last year",
    es: "6.5 millones de publicaciones de Torá distribuidas el año pasado",
  },
};
const IMPACT_BY_CAMPAIGN: Partial<Record<string, Record<Locale, string>>> = {
  "torah-scholars": {
    en: "220 Avreichim across 5 kollelim",
    es: "220 avrejim en 5 kollelim",
  },
};
const DOUBLE_EMBED_URL = "https://embed.double.giving/652a15b0-2417-11f0-80b5-ed6216307745";
const HERO_MEDIA = {
  poster: "/media/hameir-global-hero-poster-clean.png",
  mp4: "/media/hameir-global-hero-4k.mp4",
  videoReady: true,
} as const;
const HERO_START_TIME_SECONDS = 0.9;
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
    buildDonation: "Build your donation",
    chooseAmountAria: "Choose donation amount",
    securityInfo: "Donation security information",
    creditedPrefix: "You’re giving with",
    creditedSuffix: "Your gift will be credited to them automatically.",
    tagline: "Torah · Chesed · Community",
    ourWork: "Ways to help",
    whyTrust: "Why give here",
    mainSite: "Main website",
    give: "Give",
    languageLabel: "Language",
    identityEyebrow: "Hameir Laarets",
    identityTitle: "Light Jewish Lives",
    identityTitleAccent: "Through Torah and Chesed",
    identityBody: "Your gift helps bring Torah, food, therapeutic care, and dignified support to Jewish families in Israel and around the world.",
    supportCurrent: "Bring care to a family this Elul",
    discover: "See the mission behind the work",
    quickEyebrow: "Give in the way that feels right",
    quickTitle: "Choose a path. Choose an amount.",
    quickBody: "Start with a focused gift, then review the full cause before you continue.",
    quickFood: "Food & family relief",
    quickTorah: "Torah & learning",
    quickChildren: "Children’s care",
    quickGeneral: "Where needed most",
    quickChooseAmount: "Choose a gift",
    ourStory: "Our Story",
    founded: "Founded upon the vision of",
    continued: "Continued today by",
    torah: "Torah",
    torahBody: "Making Torah wisdom accessible through books, learning, and guidance.",
    chesed: "Chesed",
    chesedBody: "Standing with families through food, therapeutic care, and practical assistance.",
    community: "Community",
    communityBody: "Strengthening Jewish connection across Israel and communities worldwide.",
    world: "Around the world",
    worldBody: "Connecting Jews in Israel and across the globe through Torah and kindness.",
    legacyEyebrow: "Our foundation",
    legacyTitle: "From Jerusalem, a Light of Torah",
    legacyTitleAccent: "Continues Across the World",
    founderRole: "Founder",
    founderBody: "His vision united Torah learning with practical acts of Chesed.",
    leaderRole: "Continuing the mission",
    leaderBody: "Advancing his father’s vision through faith, responsibility, and action.",
    pillarsEyebrow: "One mission · Three living pillars",
    pillarsTitle: "Light becomes action.",
    impactEyebrow: "Our impact",
    impactTitle: "A year of Torah.",
    impactTitleAccent: "A year of care.",
    titlesLabel: "Countries reached",
    languagesLabel: "Torah publications distributed",
    basketsLabel: "Families supported through Chesed",
    studentsLabel: "People guided & strengthened",
    officialSource: "Annual impact figures supplied by Hameir Laarets.",
    featured: "Elul 5786 · Our focus now",
    elulTitle: "Prepare Your Heart",
    elulTitleAccent: "for the New Year",
    elulPhotoBody: "Before the New Year, your Elul gift can bring food, care, and dignity to a Jewish family.",
    elulBody: "Elul is a time to prepare our hearts through acts of kindness and generosity. Your support helps Jewish families celebrate the New Year with dignity by providing food and essential assistance when they need it most.",
    fulfill: "Give Pidyon Kapparot",
    readStory: "Why Kaparot matters",
    selectedCampaign: "Your chosen cause",
    donationFrequency: "How would you like to give?",
    once: "One-time",
    monthly: "Monthly",
    chooseGift: "Choose an amount",
    otherAmount: "Other amount",
    giftDockLabel: "Your gift",
    giftImpact: "Part of Hameir Laarets’ wider impact",
    annualImpactContext: "Organization-wide annual impact",
    continueWith: "Continue with",
    secure: "Secure checkout",
    deductible: "Tax-deductible",
    donationConfidenceEyebrow: "Give with confidence",
    donationConfidenceTitle: "Your gift joins a proven, worldwide mission.",
    donationConfidenceFamilies: "14,500 families supported",
    donationConfidenceCountries: "136 countries reached",
    donationConfidenceSecure: "Secure checkout",
    donationConfidenceTax: "Tax-deductible giving",
    campaignsLink: "See the ways to help",
    campaignsEyebrow: "Choose your impact",
    campaignsTitle: "Choose how your gift brings light.",
    campaignsTitleAccent: "Every cause meets a real need.",
    campaignsBody: "Support the cause closest to your heart. If a fundraiser invited you, they’ll receive credit automatically—whichever cause you choose.",
    viewKaparot: "Give to Kaparot",
    chooseCampaign: "Donate to this cause",
    donateMesilot: "Donate to Mesilot",
    mesilotCommunity: "Bring Mesilot to your Community",
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
    closeStory: "Close Elul story",
    storyEyebrow: "Elul · Tzedakah · Pidyon Kapparot",
    storyTitle: "Elul is a time to return—and to give.",
    storyOne: "Before the New Year, we pause, reflect, and bring our hopes and prayers before Hashem.",
    storyTwo: "Pidyon Kapparot turns that inward return into an outward act of compassion. Through tzedakah, tradition becomes food, care, and dignity for another Jewish home.",
    storyThree: "Your gift helps Hameir Laarets support families preparing for the holy days. Names shared with the organization are carried in heartfelt tefillah.",
    closeCheckout: "Close checkout",
    yourGift: "Your gift",
    lastStep: "Review your gift.",
    campaign: "Cause",
    gift: "Gift",
    fundraiser: "Fundraiser",
    fullName: "Full name",
    email: "Email address",
    securePayment: "Continue securely",
    paymentNote: "You’ll complete payment securely with the organization’s payment provider.",
    ready: "Selection saved",
    takingShape: "Your gift is ready to continue.",
    handoff: "On the live site, your cause, amount, frequency, and fundraiser credit will continue to the organization’s secure payment provider.",
    returnPage: "Keep exploring",
    rabbisAlt: "Rabbi Yoram Michael Abergel zt’l and Rabbi Yisrael Abergel together",
    volunteersAlt: "A Hameir Laarets volunteer carrying a holiday food box for families in Israel",
    onlineNav: "Hameir Laarets online",
  },
  es: {
    skip: "Saltar al contenido principal",
    homeLabel: "Inicio del centro de donativos de Hameir Laarets",
    mainNavigation: "Navegación principal",
    buildDonation: "Prepara tu donativo",
    chooseAmountAria: "Elige el monto del donativo",
    securityInfo: "Información de seguridad del donativo",
    creditedPrefix: "Donas junto a",
    creditedSuffix: "Tu donativo quedará acreditado a su nombre automáticamente.",
    tagline: "Torá · Jesed · Comunidad",
    ourWork: "Formas de ayudar",
    whyTrust: "Por qué donar aquí",
    mainSite: "Sitio principal",
    give: "Donar",
    languageLabel: "Idioma",
    identityEyebrow: "Hameir Laarets",
    identityTitle: "Ilumina vidas judías",
    identityTitleAccent: "con Torá y Jesed",
    identityBody: "Tu donativo ayuda a brindar Torá, alimentos, atención terapéutica y apoyo digno a familias judías en Israel y en todo el mundo.",
    supportCurrent: "Lleva ayuda a una familia este Elul",
    discover: "Conoce la misión",
    quickEyebrow: "Dona de la manera que sientas correcta",
    quickTitle: "Elige un camino. Elige un monto.",
    quickBody: "Comienza con un donativo enfocado y revisa la causa completa antes de continuar.",
    quickFood: "Alimentos y familias",
    quickTorah: "Torá y estudio",
    quickChildren: "Cuidado infantil",
    quickGeneral: "Donde más se necesita",
    quickChooseAmount: "Elige un donativo",
    ourStory: "Nuestra historia",
    founded: "Fundada sobre la visión de",
    continued: "Continuada hoy por",
    torah: "Torá",
    torahBody: "Hacemos accesible la sabiduría de la Torá mediante libros, estudio y orientación.",
    chesed: "Jesed",
    chesedBody: "Acompañamos a familias con alimentos, atención terapéutica y ayuda práctica.",
    community: "Comunidad",
    communityBody: "Fortalecemos la conexión judía en Israel y en comunidades de todo el mundo.",
    world: "En todo el mundo",
    worldBody: "Conectamos a judíos en Israel y en todo el mundo mediante Torá y bondad.",
    legacyEyebrow: "Nuestra base",
    legacyTitle: "Desde Jerusalén, una luz de Torá",
    legacyTitleAccent: "continúa por todo el mundo",
    founderRole: "Fundador",
    founderBody: "Su visión unió el estudio de la Torá con actos concretos de Jesed.",
    leaderRole: "Continuando la misión",
    leaderBody: "Continúa la visión de su padre con fe, responsabilidad y acción.",
    pillarsEyebrow: "Una misión · Tres pilares vivos",
    pillarsTitle: "La luz se convierte en acción.",
    impactEyebrow: "Nuestro impacto",
    impactTitle: "Un año de Torá.",
    impactTitleAccent: "Un año de ayuda.",
    titlesLabel: "Países alcanzados",
    languagesLabel: "Publicaciones de Torá distribuidas",
    basketsLabel: "Familias apoyadas mediante Jesed",
    studentsLabel: "Personas orientadas y fortalecidas",
    officialSource: "Cifras anuales proporcionadas por Hameir Laarets.",
    featured: "Elul 5786 · Nuestro enfoque",
    elulTitle: "Prepara tu corazón",
    elulTitleAccent: "para el Año Nuevo",
    elulPhotoBody: "Antes del Año Nuevo, tu donativo de Elul puede llevar alimentos, cuidado y dignidad a una familia judía.",
    elulBody: "Elul es un tiempo para preparar nuestros corazones mediante actos de bondad y generosidad. Tu apoyo ayuda a familias judías a celebrar el Año Nuevo con dignidad, proporcionando alimentos y asistencia esencial cuando más lo necesitan.",
    fulfill: "Haz tu Pidyon Kaparot",
    readStory: "Conoce el significado de Kaparot",
    selectedCampaign: "La causa que elegiste",
    donationFrequency: "¿Cómo deseas donar?",
    once: "Una vez",
    monthly: "Mensual",
    chooseGift: "Elige un monto",
    otherAmount: "Otro monto",
    giftDockLabel: "Tu donativo",
    giftImpact: "Parte del impacto general de Hameir Laarets",
    annualImpactContext: "Impacto anual de toda la organización",
    continueWith: "Continuar con",
    secure: "Pago seguro",
    deductible: "Deducible de impuestos",
    donationConfidenceEyebrow: "Dona con confianza",
    donationConfidenceTitle: "Tu donativo se suma a una misión comprobada en todo el mundo.",
    donationConfidenceFamilies: "14,500 familias apoyadas",
    donationConfidenceCountries: "136 países alcanzados",
    donationConfidenceSecure: "Pago seguro",
    donationConfidenceTax: "Donativo deducible de impuestos",
    campaignsLink: "Explora las formas de ayudar",
    campaignsEyebrow: "Elige tu impacto",
    campaignsTitle: "Elige cómo tu donativo lleva luz.",
    campaignsTitleAccent: "Cada causa responde a una necesidad real.",
    campaignsBody: "Apoya la causa más cercana a tu corazón. Si un promotor te invitó, recibirá el crédito automáticamente, sin importar qué causa elijas.",
    viewKaparot: "Donar a Kaparot",
    chooseCampaign: "Donar a esta causa",
    donateMesilot: "Donar a Mesilot",
    mesilotCommunity: "Lleva Mesilot a tu comunidad",
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
    closeStory: "Cerrar la historia de Elul",
    storyEyebrow: "Elul · Tzedaká · Pidyon Kaparot",
    storyTitle: "Elul es tiempo de volver y de dar.",
    storyOne: "Antes del Año Nuevo, hacemos una pausa, reflexionamos y presentamos nuestras esperanzas y oraciones ante Hashem.",
    storyTwo: "Pidyon Kaparot convierte ese retorno interior en un acto de compasión. Mediante la tzedaká, la tradición se transforma en alimentos, cuidado y dignidad para otro hogar judío.",
    storyThree: "Tu donativo ayuda a Hameir Laarets a apoyar a familias que se preparan para los días sagrados. Los nombres compartidos con la organización son incluidos en una tefilá sincera.",
    closeCheckout: "Cerrar el proceso de donación",
    yourGift: "Tu donativo",
    lastStep: "Revisa tu donativo.",
    campaign: "Causa",
    gift: "Donativo",
    fundraiser: "Recaudador",
    fullName: "Nombre completo",
    email: "Correo electrónico",
    securePayment: "Continuar de forma segura",
    paymentNote: "Completarás el pago de forma segura con el proveedor de pagos de la organización.",
    ready: "Selección guardada",
    takingShape: "Tu donativo está listo para continuar.",
    handoff: "En el sitio activo, tu causa, monto, frecuencia y crédito del promotor continuarán al proveedor de pagos seguro de la organización.",
    returnPage: "Seguir explorando",
    rabbisAlt: "El rabino Yoram Michael Abergel zt’l junto al rabino Yisrael Abergel",
    volunteersAlt: "Un voluntario de Hameir Laarets llevando una caja de alimentos festivos para familias en Israel",
    onlineNav: "Hameir Laarets en línea",
  },
} as const;
const SOCIAL_LINKS = [
  {
    label: "Hameir Laarets website",
    labelEs: "Sitio web de Hameir Laarets",
    href: "https://hameirlaarets.org/",
    icon: GlobeHemisphereWest,
  },
  {
    label: "Hameir Laarets on Instagram",
    labelEs: "Hameir Laarets en Instagram",
    href: "https://www.instagram.com/hameirlaarets/",
    icon: InstagramLogo,
  },
  {
    label: "Rabbi Yisrael Abergel on Facebook",
    labelEs: "Rabino Yisrael Abergel en Facebook",
    href: "https://www.facebook.com/haravisraelabergel/",
    icon: FacebookLogo,
  },
  {
    label: "Hameir Laarets on YouTube",
    labelEs: "Hameir Laarets en YouTube",
    href: "https://www.youtube.com/channel/UC2FAfGOU_D8jgT1E3p1KJog",
    icon: YoutubeLogo,
  },
];
const generalCampaign = campaigns.find((campaign) => campaign.id === "general");
const campaignDisplayOrder = generalCampaign
  ? [generalCampaign, ...campaigns.filter((campaign) => campaign.id !== "kaparot" && campaign.id !== "general")]
  : campaigns.filter((campaign) => campaign.id !== "kaparot");

export default function DonationExperienceV4() {
  const [fundraiser, setFundraiser] = useState("");
  const [fundraiserSlug, setFundraiserSlug] = useState("");
  const [solicitor, setSolicitor] = useState("");
  const [locale, setLocale] = useState<Locale>("en");
  const [urlReady, setUrlReady] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [isMobileHero, setIsMobileHero] = useState(true);
  const [heroVideoUnavailable, setHeroVideoUnavailable] = useState(false);
  const [heroVideoActive, setHeroVideoActive] = useState(false);
  const [donationDockVisible, setDonationDockVisible] = useState(false);
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
    let animationFrame = 0;
    const updateDockVisibility = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        const hero = document.getElementById("v4-main");
        const composer = document.getElementById("v4-give");
        if (!hero || !composer) return;

        const heroBottom = hero.getBoundingClientRect().bottom;
        const composerTop = composer.getBoundingClientRect().top;
        setDonationDockVisible(heroBottom < 160 && composerTop > window.innerHeight - 90);
      });
    };

    updateDockVisibility();
    window.addEventListener("scroll", updateDockVisibility, { passive: true });
    window.addEventListener("resize", updateDockVisibility);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateDockVisibility);
      window.removeEventListener("resize", updateDockVisibility);
    };
  }, []);

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
      setLocale(requestedLocale === "es" || requestedLocale === "en"
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

  const activeCampaign = campaigns[0];
  const displayedCampaigns = campaignDisplayOrder;
  const activeCampaignTitle = locale === "es" ? activeCampaign.titleEs : activeCampaign.title;
  const elulEmbedSrc = `/double-elul?lang=${locale}${solicitor ? `&solicitor=${encodeURIComponent(solicitor)}` : ""}${fundraiserSlug ? `&fundraiser=${encodeURIComponent(fundraiserSlug)}` : ""}`;
  const scrollToGift = () => {
    document.getElementById("v4-give")?.scrollIntoView({ behavior: "smooth", block: "center" });
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
        </div>
        <button className={styles.headerGive} onClick={scrollToGift}>
          {t.give} <Heart size={18} weight="regular" aria-hidden="true" />
        </button>
      </header>

      <button
        className={`${styles.mobileDonationDock} ${donationDockVisible ? styles.mobileDonationDockVisible : ""}`}
        type="button"
        onClick={scrollToGift}
        aria-hidden={!donationDockVisible}
        tabIndex={donationDockVisible ? 0 : -1}
      >
        <span>
          <small>{t.giftDockLabel}</small>
          <strong>{activeCampaignTitle}</strong>
        </span>
        <b>{t.give} <ArrowRight size={18} weight="bold" aria-hidden="true" /></b>
      </button>

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
            <a href="#v4-donation">{t.supportCurrent} <ArrowDown size={18} weight="bold" /></a>
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
            src="/images/elul-volunteers-hero-v3.jpg"
            alt={t.volunteersAlt}
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
          <iframe
            className={styles.doubleEmbedFrame}
            src={elulEmbedSrc}
            title={locale === "es" ? "Formulario de donación de Elul" : "Elul donation form"}
            loading="eager"
          />
        </div>

        <div className={styles.trustLine} aria-label={t.securityInfo}>
          <span><LockKey size={17} /> {t.secure}</span><i />
          <span><CheckCircle size={17} /> {t.deductible}</span><i />
          <span><ShieldCheck size={18} /> 501(c)(3)</span>
        </div>

        <a className={styles.exploreCampaigns} href="#v4-campaigns">
          {t.campaignsLink} <ArrowDown size={18} weight="bold" />
        </a>
      </section>

      <section className={styles.campaignSection} id="v4-campaigns">
        <div className={styles.sectionLead}>
          <span>{t.campaignsEyebrow}</span>
          <h2>{t.campaignsTitle}<br />{t.campaignsTitleAccent}</h2>
          <p>{t.campaignsBody}</p>
        </div>

        <div className={styles.campaignGrid}>
          {displayedCampaigns.map((campaign, index) => (
            <article
              key={campaign.id}
              className={`${styles.campaignCard} ${index === 0 ? styles.featuredCard : ""} ${campaign.id === "mesilot" ? styles.productCard : ""}`}
            >
              <button
                type="button"
                className={styles.cardClickTarget}
                onClick={() => chooseCampaign(campaign)}
                aria-label={`${t.chooseCampaign}: ${locale === "es" ? campaign.titleEs : campaign.title}`}
              />
              {campaign.id === "mesilot" ? (
                <div className={styles.mesilotStack} aria-label={locale === "es" ? campaign.titleEs : campaign.title}>
                  <Image src={campaign.image} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" />
                  <Image src={campaign.image} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" />
                  <Image src={campaign.image} alt={locale === "es" ? campaign.titleEs : campaign.title} fill sizes="(max-width: 760px) 100vw, 50vw" />
                </div>
              ) : (
                <Image
                  src={campaign.image}
                  alt={locale === "es" ? campaign.titleEs : campaign.title}
                  fill
                  sizes={index === 0 ? "100vw" : "(max-width: 760px) 100vw, 50vw"}
                />
              )}
              <div className={styles.cardScrim} />
              <div className={styles.cardCopy}>
                <span>{locale === "es" ? campaign.eyebrowEs : campaign.eyebrow}</span>
                <h3>{locale === "es" ? campaign.titleEs : campaign.title}</h3>
                <p>{locale === "es" ? campaign.descriptionEs : campaign.description}</p>
                <div className={styles.campaignImpact}>
                  <CheckCircle size={18} weight="fill" aria-hidden="true" />
                  <span>
                    <small>{t.annualImpactContext}</small>
                    {(IMPACT_BY_CAMPAIGN[campaign.id] ?? IMPACT_BY_CAUSE[campaign.cause])[locale]}
                  </span>
                </div>
                {campaign.id === "kaparot" ? (
                  <button onClick={() => chooseCampaign(campaign)}>
                    {t.viewKaparot} <ArrowRight size={18} weight="bold" />
                  </button>
                ) : (
                  <div className={styles.cardActions}>
                    <button onClick={() => chooseCampaign(campaign)}>
                      {campaign.id === "mesilot" ? t.donateMesilot : t.chooseCampaign}
                      <ArrowRight size={18} weight="bold" />
                    </button>
                    {campaign.id === "mesilot" && (
                      <a
                        href="https://mesilot-el-hanefesh.vercel.app/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t.mesilotCommunity}
                        <ArrowRight size={18} weight="bold" />
                      </a>
                    )}
                  </div>
                )}
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
            {SOCIAL_LINKS.map(({ label, labelEs, href, icon: Icon }) => {
              const localizedLabel = locale === "es" ? labelEs : label;
              return (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={localizedLabel} title={localizedLabel}>
                <Icon size={21} weight="regular" aria-hidden="true" />
              </a>
              );
            })}
          </nav>
        </div>

        <div className={styles.footerLegal}>
          <nav aria-label={locale === "es" ? "Información oficial" : "Official information"}>
            <a href="https://hameirlaarets.org/contact-us/" target="_blank" rel="noreferrer">{t.contactUs}</a>
            <a href="https://hameirlaarets.org/privacy-policy/" target="_blank" rel="noreferrer">{t.privacyPolicy}</a>
          </nav>
          <small>{t.mailingAddress}</small>
          <small>{t.nonprofit}</small>
          <small>{t.taxStatus}</small>
          <small>{t.rights}</small>
        </div>
      </footer>

    </main>
  );
}
