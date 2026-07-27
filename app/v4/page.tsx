"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
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
  InstagramLogo,
  LinkSimpleHorizontal,
  LockKey,
  ShieldCheck,
  Sparkle,
  X,
  YoutubeLogo,
} from "@phosphor-icons/react";
import styles from "./v4.module.css";

type Frequency = "once" | "monthly";
type CauseId = "families" | "children" | "food" | "community" | "torah";
type Locale = "en" | "es";

type Campaign = {
  id: string;
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
    id: "emergency-lifeline",
    cause: "families",
    eyebrow: "Emergency relief",
    eyebrowEs: "Ayuda de emergencia",
    title: "Israel’s Emergency Lifeline",
    titleEs: "Ayuda vital para familias en Israel",
    description: "Help families regain stability through timely, practical relief.",
    descriptionEs: "Ayuda a las familias a recuperar estabilidad con apoyo práctico y oportuno.",
    image: "/images/v2-family-crisis.png",
  },
  {
    id: "next-step",
    cause: "children",
    eyebrow: "Children & family",
    eyebrowEs: "Niños y familia",
    title: "The Next Step Initiative",
    titleEs: "Iniciativa El Próximo Paso",
    description: "Help children with special needs access therapeutic care and greater opportunity.",
    descriptionEs: "Ayuda a niños con necesidades especiales a recibir atención terapéutica y nuevas oportunidades.",
    image: "/images/v2-child-therapy.png",
  },
  {
    id: "tzedakah-box",
    cause: "families",
    eyebrow: "Everyday tzedakah",
    eyebrowEs: "Tzedaká cotidiana",
    title: "Tzedakah Box",
    titleEs: "Caja de tzedaká",
    description: "Turn a daily mitzvah into steady support for families who need it.",
    descriptionEs: "Convierte una mitzvá diaria en apoyo constante para familias que lo necesitan.",
    image: "/images/v2-global-community.png",
  },
  {
    id: "birkat-parnassah",
    cause: "torah",
    eyebrow: "Torah & prayer",
    eyebrowEs: "Torá y plegaria",
    title: "Birkat Parnassah - Parashat HaMan",
    titleEs: "Birkat Parnasá - Parashat HaMan",
    description: "Join prayer and tzedakah in support of families seeking stability.",
    descriptionEs: "Une la oración y la tzedaká para apoyar a familias que buscan estabilidad.",
    image: "/images/v2-global-community.png",
  },
  {
    id: "hafatzat-hamayanot",
    cause: "torah",
    eyebrow: "Torah & prayer",
    eyebrowEs: "Torá y plegaria",
    title: "Hafatzat HaMayanot",
    titleEs: "Hafatzat HaMayanot",
    description: "Help bring accessible Torah learning and Jewish connection to communities worldwide.",
    descriptionEs: "Ayuda a llevar un estudio de Torá accesible y conexión judía a comunidades de todo el mundo.",
    image: "/images/v2-torah-prayer.png",
  },
  {
    id: "birkat-habanim",
    cause: "children",
    eyebrow: "Children & family",
    eyebrowEs: "Niños y familia",
    title: "Birkat HaBanim",
    titleEs: "Birkat HaBanim",
    description: "Strengthen the next generation through prayer and support for Jewish families.",
    descriptionEs: "Fortalece a la próxima generación mediante la oración y el apoyo a familias judías.",
    image: "/images/v2-child-therapy.png",
  },
  {
    id: "kaparot",
    cause: "food",
    eyebrow: "Our focus now · Elul",
    eyebrowEs: "Nuestro enfoque · Elul",
    title: "Kaparot",
    titleEs: "Kaparot",
    description: "Turn Pidyon Kapparot into food, care, and dignity for families before the New Year.",
    descriptionEs: "Convierte Pidyon Kaparot en alimentos, cuidado y dignidad para familias antes del Año Nuevo.",
    image: "/images/elul-volunteers-featured.jpg",
  },
  {
    id: "eighteen",
    cause: "families",
    eyebrow: "A meaningful first gift",
    eyebrowEs: "Un primer donativo significativo",
    title: "$18",
    titleEs: "$18",
    description: "A small gift can become part of a much larger circle of care.",
    descriptionEs: "Un pequeño donativo puede formar parte de una red de ayuda mucho más amplia.",
    image: "/images/v2-food-relief.png",
  },
  {
    id: "southern-israel",
    cause: "community",
    eyebrow: "Jewish community",
    eyebrowEs: "Comunidad judía",
    title: "Southern Israel Unity Center",
    titleEs: "Centro de Unidad del Sur de Israel",
    description: "Help communities in southern Israel grow stronger, more connected, and more resilient.",
    descriptionEs: "Ayuda a las comunidades del sur de Israel a ser más fuertes, unidas y resilientes.",
    image: "/images/v2-southern-community.png",
  },
  {
    id: "general",
    cause: "families",
    eyebrow: "Where needed most",
    eyebrowEs: "Donde más se necesita",
    title: "Where It's Needed Most",
    titleEs: "Donde más se necesita",
    description: "Give Hameir Laarets the flexibility to respond where help is needed most.",
    descriptionEs: "Da a Hameir Laarets la flexibilidad de responder allí donde más se necesita.",
    image: "/images/v2-food-relief.png",
  },
];

const amounts = [36, 72, 180, 360];
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
const ELUL_CAMPAIGN_URL = "https://elul.hameirlaarets.org/";
const HERO_MEDIA = {
  poster: "/media/hameir-global-hero-poster-clean.png",
  mp4: "/media/hameir-global-hero-4k.mp4",
  videoReady: true,
} as const;
const HERO_START_TIME_SECONDS = 0.9;
const HERO_REVEAL_TIME_SECONDS = 5;
const MOBILE_HERO_REVEAL_DELAY_MS = 2600;
const SOLICITORS: Record<string, { name: string; defaultLocale: Locale }> = {
  "yehuda-dayan": { name: "Yehuda Dayan", defaultLocale: "en" },
  "shachar-shalom": { name: "Shachar Shalom", defaultLocale: "en" },
  "elvira-rozillio": { name: "Elvira Rozillio", defaultLocale: "es" },
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
    give: "Give",
    languageLabel: "Language",
    identityEyebrow: "Hameir Laarets",
    identityTitle: "Light Jewish Lives",
    identityTitleAccent: "Through Torah and Chesed",
    identityBody: "Your gift helps bring Torah, food, therapeutic care, and dignified support to Jewish families in Israel and around the world.",
    supportCurrent: "Bring care to a family this Elul",
    discover: "See the mission behind the work",
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
    elulTitle: "The Path to",
    elulTitleAccent: "Shaarei Ha'rachamim",
    elulPhotoBody: "Before the New Year, your Kaparot gift can bring food, care, and dignity to a Jewish family.",
    elulBody: "Before the New Year, your Kaparot gift can bring food, care, and dignity to a Jewish family.",
    fullElul: "Help a family this Elul",
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
    campaignsLink: "Explore all 10 ways to help",
    campaignsEyebrow: "Choose your impact",
    campaignsTitle: "Choose how your gift brings light.",
    campaignsTitleAccent: "Every cause meets a real need.",
    campaignsBody: "Support the cause closest to your heart. If a fundraiser invited you, they’ll receive credit automatically—whichever cause you choose.",
    viewKaparot: "Give to Kaparot",
    chooseCampaign: "Choose this cause",
    showFewer: "Show fewer ways to help",
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
    volunteersAlt: "Volunteers preparing food packages for Jewish families before the New Year",
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
    give: "Donar",
    languageLabel: "Idioma",
    identityEyebrow: "Hameir Laarets",
    identityTitle: "Ilumina vidas judías",
    identityTitleAccent: "con Torá y Jesed",
    identityBody: "Tu donativo ayuda a brindar Torá, alimentos, atención terapéutica y apoyo digno a familias judías en Israel y en todo el mundo.",
    supportCurrent: "Lleva ayuda a una familia este Elul",
    discover: "Conoce la misión",
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
    elulTitle: "El camino hacia",
    elulTitleAccent: "Shaarei Ha'rachamim",
    elulPhotoBody: "Antes del Año Nuevo, tu donativo de Kaparot puede llevar alimentos, cuidado y dignidad a una familia judía.",
    elulBody: "Antes del Año Nuevo, tu donativo de Kaparot puede llevar alimentos, cuidado y dignidad a una familia judía.",
    fullElul: "Ayuda a una familia este Elul",
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
    campaignsLink: "Explora las 10 formas de ayudar",
    campaignsEyebrow: "Elige tu impacto",
    campaignsTitle: "Elige cómo tu donativo lleva luz.",
    campaignsTitleAccent: "Cada causa responde a una necesidad real.",
    campaignsBody: "Apoya la causa más cercana a tu corazón. Si un promotor te invitó, recibirá el crédito automáticamente, sin importar qué causa elijas.",
    viewKaparot: "Donar a Kaparot",
    chooseCampaign: "Elegir esta causa",
    showFewer: "Ver menos formas de ayudar",
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
    volunteersAlt: "Voluntarios preparando paquetes de alimentos para familias judías antes del Año Nuevo",
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
const passthroughParams = [
  "solicitor",
  "fundraiser",
  "ref",
  "collector",
  "lang",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];
const campaignDisplayOrder = [
  campaigns[6],
  ...campaigns.slice(0, 6),
  ...campaigns.slice(7),
];

export default function DonationExperienceV4() {
  const [fundraiser, setFundraiser] = useState("");
  const [solicitor, setSolicitor] = useState("");
  const [locale, setLocale] = useState<Locale>("en");
  const [trackingParams, setTrackingParams] = useState<Record<string, string>>({});
  const [urlReady, setUrlReady] = useState(false);
  const [campaignId, setCampaignId] = useState("kaparot");
  const [amount, setAmount] = useState(180);
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("once");
  const [expanded, setExpanded] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(!HERO_MEDIA.videoReady);
  const [heroVideoUnavailable, setHeroVideoUnavailable] = useState(false);
  const [heroVideoActive, setHeroVideoActive] = useState(false);
  const [donationDockVisible, setDonationDockVisible] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const mobileHeroRevealTimerRef = useRef<number | null>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const t = COPY[locale];

  useEffect(() => {
    if (!HERO_MEDIA.videoReady) return;
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
  }, []);

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
      const requestedSolicitor = params.get("solicitor") || "";
      const solicitorProfile = SOLICITORS[requestedSolicitor];
      const requestedFundraiser = params.get("fundraiser") || params.get("ref") || params.get("collector") || "";
      const requestedLocale = params.get("lang");

      setSolicitor(requestedSolicitor);
      setFundraiser(solicitorProfile?.name || requestedFundraiser || requestedSolicitor);
      setLocale(requestedLocale === "es" || requestedLocale === "en"
        ? requestedLocale
        : solicitorProfile?.defaultLocale || "en");
      setTrackingParams(Object.fromEntries(
        passthroughParams
          .map((key) => [key, params.get(key) || ""] as const)
          .filter(([, value]) => value),
      ));
      setUrlReady(true);
      const requested = params.get("campaign");
      if (campaigns.some((campaign) => campaign.id === requested)) {
        setCampaignId(requested || "kaparot");
      }
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

  useEffect(() => {
    if (!checkoutOpen && !storyOpen) return;

    const focusTimer = window.setTimeout(() => {
      document.querySelector<HTMLElement>('[role="dialog"] button')?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setCheckoutOpen(false);
      setStoryOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      lastFocusedElement.current?.focus();
    };
  }, [checkoutOpen, storyOpen]);

  const activeCampaign = useMemo(
    () => campaigns.find((campaign) => campaign.id === campaignId) || campaigns[6],
    [campaignId],
  );
  const displayedCampaigns = expanded ? campaignDisplayOrder : campaignDisplayOrder.slice(0, 6);
  const activeCampaignTitle = locale === "es" ? activeCampaign.titleEs : activeCampaign.title;
  const activeCampaignImpact = IMPACT_BY_CAUSE[activeCampaign.cause][locale];
  const elulCampaignHref = useMemo(() => {
    const url = new URL(ELUL_CAMPAIGN_URL);
    const params = new URLSearchParams(trackingParams);
    if (solicitor) params.set("solicitor", solicitor);
    if (fundraiser) params.set("fundraiser", fundraiser);
    params.set("lang", locale);
    url.hash = params.toString();
    return url.toString();
  }, [fundraiser, locale, solicitor, trackingParams]);
  const elulCheckoutHref = useMemo(() => {
    const url = new URL(elulCampaignHref);
    const params = new URLSearchParams(url.hash.slice(1));
    params.set("campaign", "kaparot");
    params.set("amount", String(amount));
    params.set("frequency", frequency);
    params.set("lang", locale);
    url.hash = params.toString();
    return url.toString();
  }, [amount, elulCampaignHref, frequency, locale]);

  const scrollToGift = () => {
    document.getElementById("v4-give")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const rememberFocus = () => {
    lastFocusedElement.current = document.activeElement as HTMLElement | null;
  };

  const chooseCampaign = (campaign: Campaign) => {
    setCampaignId(campaign.id);
    window.setTimeout(scrollToGift, 0);
  };

  const continueDonation = () => {
    if (activeCampaign.id === "kaparot") {
      window.location.assign(elulCheckoutHref);
      return;
    }
    rememberFocus();
    setCompleted(false);
    setCheckoutOpen(true);
  };

  const submitGift = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCompleted(true);
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hameir-laarets-logo-new.png" alt="" width="1024" height="1024" />
          <span>
            <strong>HAMEIR LAARETS</strong>
            <small>{t.tagline}</small>
          </span>
        </a>
        <nav className={styles.nav} aria-label={t.mainNavigation}>
          <a href="#v4-campaigns">{t.ourWork}</a>
          <a href="#v4-trust">{t.whyTrust}</a>
        </nav>
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
        <b>{t.give} ${amount} <ArrowRight size={18} weight="bold" aria-hidden="true" /></b>
      </button>

      <section className={styles.globalHero} id="v4-main" aria-labelledby="global-hero-title">
        <div className={styles.heroMedia} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_MEDIA.poster} alt="" />
          {HERO_MEDIA.videoReady && (
            <video
              ref={heroVideoRef}
              className={`${heroVideoActive ? styles.heroVideoActive : ""} ${heroVideoUnavailable ? styles.heroVideoUnavailable : ""}`}
              autoPlay
              muted
              playsInline
              disablePictureInPicture
              preload="auto"
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.heroLogo} src="/images/hameir-laarets-logo-new.png" alt="" />
          <span>{t.tagline}</span>
          <h1 id="global-hero-title">
            <span className={styles.heroTitleLine}>{t.identityTitle}</span>
            <strong>{t.identityTitleAccent}</strong>
          </h1>
          <p>{t.identityBody}</p>
          <div className={styles.heroActions}>
            <a href="#v4-featured">{t.supportCurrent} <ArrowDown size={18} weight="bold" /></a>
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

      <section className={styles.legacySection} id="v4-legacy" aria-labelledby="legacy-title">
        <h2 className={styles.visuallyHidden} id="legacy-title">{t.legacyTitle} {t.legacyTitleAccent}</h2>

        <div className={styles.legacyEditorial}>
          <div className={styles.rabbisTogether}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/rabbis-together-final.png"
              alt={t.rabbisAlt}
              loading="lazy"
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

      <section className={styles.seasonalHero} id="v4-featured">
        <div className={styles.photoPanel}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/elul-volunteers-featured.jpg" alt={t.volunteersAlt} />
          <div className={styles.photoScrim} />
          <div className={styles.photoCopy}>
            <span>{t.featured}</span>
            <h2>{t.elulTitle}<br />{t.elulTitleAccent}</h2>
            <p>{t.elulPhotoBody}</p>
            <a href={elulCampaignHref}>
              {t.fullElul} <ArrowRight size={20} weight="bold" />
            </a>
          </div>
        </div>

        <div className={styles.storyPanel}>
          <Sparkle size={25} weight="light" aria-hidden="true" />
          <span>{t.featured}</span>
          <h2>{t.elulTitle}<br />{t.elulTitleAccent}</h2>
          <p>{t.elulBody}</p>
          <a className={styles.seasonalCta} href={elulCampaignHref}>
            {t.fulfill} <ArrowRight size={21} weight="bold" />
          </a>
          <button
            className={styles.storyLink}
            onClick={() => {
              rememberFocus();
              setStoryOpen(true);
            }}
          >
            {t.readStory}
          </button>
        </div>

        <div className={styles.composerFrame} id="v4-give">
          <section className={styles.composer} aria-label={t.buildDonation}>
            <div className={styles.campaignIdentity}>
              <span className={styles.campaignMark}><Heart size={25} weight="regular" /></span>
              <div>
                <small>{t.selectedCampaign}</small>
                <strong>{activeCampaignTitle}</strong>
              </div>
            </div>

            <div className={styles.frequency} role="group" aria-label={t.donationFrequency}>
              <button
                type="button"
                className={frequency === "once" ? styles.selectedFrequency : ""}
                aria-pressed={frequency === "once"}
                onClick={() => setFrequency("once")}
              >
                {t.once}
              </button>
              <button
                type="button"
                className={frequency === "monthly" ? styles.selectedFrequency : ""}
                aria-pressed={frequency === "monthly"}
                onClick={() => setFrequency("monthly")}
              >
                {t.monthly}
              </button>
            </div>

            <div className={styles.amountBlock}>
              <span>{t.chooseGift}</span>
              <div className={styles.amounts} role="group" aria-label={t.chooseAmountAria}>
                {amounts.map((gift) => (
                  <button
                    type="button"
                    key={gift}
                    className={amount === gift ? styles.selectedAmount : ""}
                    aria-pressed={amount === gift}
                    onClick={() => {
                      setAmount(gift);
                      setCustomAmount("");
                    }}
                  >
                    ${gift}
                  </button>
                ))}
              </div>
              <label className={`${styles.customAmount} ${customAmount ? styles.customAmountSelected : ""}`}>
                <span>{t.otherAmount}</span>
                <div>
                  <b aria-hidden="true">$</b>
                  <input
                    type="number"
                    min="1"
                    inputMode="decimal"
                    value={customAmount}
                    placeholder={t.otherAmount}
                    aria-label={t.otherAmount}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setCustomAmount(nextValue);
                      const parsed = Number(nextValue);
                      if (Number.isFinite(parsed) && parsed >= 1) setAmount(parsed);
                    }}
                  />
                  <small>USD</small>
                </div>
              </label>
              <p className={styles.amountImpact}>
                <CheckCircle size={16} weight="fill" aria-hidden="true" />
                <span><small>{t.giftImpact}</small>{activeCampaignImpact}</span>
              </p>
            </div>

            <button
              className={styles.continueButton}
              onClick={continueDonation}
            >
              {t.continueWith} ${amount} <ArrowRight size={22} weight="bold" />
            </button>
          </section>
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
            <article key={campaign.id} className={`${styles.campaignCard} ${index === 0 ? styles.featuredCard : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={campaign.image} alt="" loading="lazy" />
              <div className={styles.cardScrim} />
              <div className={styles.cardCopy}>
                <span>{locale === "es" ? campaign.eyebrowEs : campaign.eyebrow}</span>
                <h3>{locale === "es" ? campaign.titleEs : campaign.title}</h3>
                <p>{locale === "es" ? campaign.descriptionEs : campaign.description}</p>
                <div className={styles.campaignImpact}>
                  <CheckCircle size={18} weight="fill" aria-hidden="true" />
                  <span>
                    <small>{t.annualImpactContext}</small>
                    {IMPACT_BY_CAUSE[campaign.cause][locale]}
                  </span>
                </div>
                {campaign.id === "kaparot" ? (
                  <a href={elulCampaignHref}>
                    {t.viewKaparot} <ArrowRight size={18} weight="bold" />
                  </a>
                ) : (
                  <button onClick={() => chooseCampaign(campaign)}>
                    {t.chooseCampaign} <ArrowRight size={18} weight="bold" />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>

        <button className={styles.allCampaigns} onClick={() => setExpanded((current) => !current)}>
          {expanded ? t.showFewer : t.campaignsLink}
          <ArrowRight size={18} weight="bold" />
        </button>
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hameir-laarets-logo-new.png" alt="" />
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

      {storyOpen && (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setStoryOpen(false);
          }}
        >
          <section className={`${styles.modal} ${styles.storyModal}`} role="dialog" aria-modal="true" aria-labelledby="story-title">
            <button className={styles.closeModal} onClick={() => setStoryOpen(false)} aria-label={t.closeStory}>
              <X size={22} />
            </button>
            <span className={styles.modalEyebrow}>{t.storyEyebrow}</span>
            <h2 id="story-title">{t.storyTitle}</h2>
            <p>{t.storyOne}</p>
            <p>{t.storyTwo}</p>
            <p>{t.storyThree}</p>
            <a className={styles.modalPrimary} href={elulCampaignHref}>
              {t.fulfill} <ArrowRight size={19} weight="bold" />
            </a>
          </section>
        </div>
      )}

      {checkoutOpen && (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCheckoutOpen(false);
          }}
        >
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
            aria-describedby={!completed ? "checkout-security-note" : undefined}
          >
            <button className={styles.closeModal} onClick={() => setCheckoutOpen(false)} aria-label={t.closeCheckout}>
              <X size={22} />
            </button>
            {!completed ? (
              <>
                <span className={styles.modalEyebrow}>{t.yourGift}</span>
                <h2 id="checkout-title">{t.lastStep}</h2>
                <div className={styles.giftSummary}>
                  <div><span>{t.campaign}</span><strong>{activeCampaignTitle}</strong></div>
                  <div><span>{t.gift}</span><strong>${amount} · {frequency === "monthly" ? t.monthly : t.once}</strong></div>
                  {fundraiser && <div><span>{t.fundraiser}</span><strong>{fundraiser}</strong></div>}
                </div>
                <form className={styles.checkoutForm} onSubmit={submitGift}>
                  <label>{t.fullName}<input required autoComplete="name" name="name" /></label>
                  <label>{t.email}<input required type="email" autoComplete="email" name="email" /></label>
                  <button type="submit">{t.securePayment} <ArrowRight size={19} weight="bold" /></button>
                </form>
                <p className={styles.modalNote} id="checkout-security-note"><LockKey size={15} /> {t.paymentNote}</p>
              </>
            ) : (
              <div className={styles.successState}>
                <CheckCircle size={50} weight="fill" />
                <span>{t.ready}</span>
                <h2 id="checkout-title">{t.takingShape}</h2>
                <p>{t.handoff}</p>
                <button onClick={() => setCheckoutOpen(false)}>{t.returnPage}</button>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
