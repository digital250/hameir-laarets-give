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
    eyebrow: "Humanitarian aid",
    eyebrowEs: "Ayuda humanitaria",
    title: "Hameir Laarets - Israel's Emergency Lifeline",
    titleEs: "Hameir Laarets - Ayuda de emergencia para Israel",
    description: "Practical relief and stability for families facing a crisis.",
    descriptionEs: "Ayuda práctica y estabilidad para familias que atraviesan una crisis.",
    image: "/images/v2-family-crisis.png",
  },
  {
    id: "next-step",
    cause: "children",
    eyebrow: "Children & family",
    eyebrowEs: "Niños y familia",
    title: "The Next Step Initiative",
    titleEs: "La iniciativa El Próximo Paso",
    description: "Therapeutic care and opportunity for children with special needs.",
    descriptionEs: "Atención terapéutica y oportunidades para niños con necesidades especiales.",
    image: "/images/v2-child-therapy.png",
  },
  {
    id: "tzedakah-box",
    cause: "families",
    eyebrow: "Everyday giving",
    eyebrowEs: "Tzedaká cotidiana",
    title: "Tzedaka Box",
    titleEs: "Caja de Tzedaká",
    description: "Turn a timeless mitzvah into consistent, practical support.",
    descriptionEs: "Convierte una mitzvá eterna en apoyo constante y práctico.",
    image: "/images/v2-global-community.png",
  },
  {
    id: "birkat-parnassah",
    cause: "torah",
    eyebrow: "Torah & prayer",
    eyebrowEs: "Torá y plegaria",
    title: "Birkat Parnassah - Parashat HaMan",
    titleEs: "Birkat Parnasá - Parashat HaMan",
    description: "Join a tradition of prayer, generosity, and support for stability.",
    descriptionEs: "Únete a una tradición de plegaria, generosidad y apoyo para la estabilidad.",
    image: "/images/v2-global-community.png",
  },
  {
    id: "hafatzat-hamayanot",
    cause: "torah",
    eyebrow: "Torah & prayer",
    eyebrowEs: "Torá y plegaria",
    title: "Hafatzat HaMayanot",
    titleEs: "Hafatzat HaMayanot",
    description: "Bring Torah learning and Jewish connection to more communities.",
    descriptionEs: "Lleva el estudio de Torá y la conexión judía a más comunidades.",
    image: "/images/v2-torah-prayer.png",
  },
  {
    id: "birkat-habanim",
    cause: "children",
    eyebrow: "Children & family",
    eyebrowEs: "Niños y familia",
    title: "Birkat HaBanim",
    titleEs: "Birkat HaBanim",
    description: "Strengthen Jewish families and the next generation through prayer.",
    descriptionEs: "Fortalece a las familias judías y a la próxima generación mediante la plegaria.",
    image: "/images/v2-child-therapy.png",
  },
  {
    id: "kaparot",
    cause: "food",
    eyebrow: "Featured now · Elul",
    eyebrowEs: "Destacada ahora · Elul",
    title: "Kaparot",
    titleEs: "Kaparot",
    description: "Transform a sacred tradition into food, dignity, and hope.",
    descriptionEs: "Transforma una tradición sagrada en alimento, dignidad y esperanza.",
    image: "/images/elul-volunteers-featured.jpg",
  },
  {
    id: "eighteen",
    cause: "families",
    eyebrow: "Accessible giving",
    eyebrowEs: "Donación accesible",
    title: "18$",
    titleEs: "18$",
    description: "Make a meaningful gift that turns a small act into lasting impact.",
    descriptionEs: "Haz un donativo significativo que convierta un pequeño acto en un impacto duradero.",
    image: "/images/v2-food-relief.png",
  },
  {
    id: "southern-israel",
    cause: "community",
    eyebrow: "Jewish community",
    eyebrowEs: "Comunidad judía",
    title: "Southern Israel Unity Center",
    titleEs: "Centro de Unidad del Sur de Israel",
    description: "Build resilience and a thriving future throughout Israel's south.",
    descriptionEs: "Construye resiliencia y un futuro próspero en todo el sur de Israel.",
    image: "/images/v2-southern-community.png",
  },
  {
    id: "general",
    cause: "families",
    eyebrow: "Where needed most",
    eyebrowEs: "Donde más se necesita",
    title: "Where It's Needed Most",
    titleEs: "Donde más se necesita",
    description: "Let your gift meet the most urgent need with speed and flexibility.",
    descriptionEs: "Permite que tu donativo responda con rapidez y flexibilidad a la necesidad más urgente.",
    image: "/images/v2-food-relief.png",
  },
];

const amounts = [36, 72, 180, 360];
const ELUL_CAMPAIGN_URL = "https://elul.hameirlaarets.org/";
const HERO_MEDIA = {
  poster: "/media/hameir-global-hero-poster-clean.png",
  mp4: "/media/hameir-global-hero-4k.mp4",
  videoReady: true,
} as const;
const HERO_REVEAL_TIME_SECONDS = 3.8;
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
    creditedPrefix: "You're giving through",
    creditedSuffix: "Your gift will be credited automatically.",
    tagline: "Torah · Chesed · Community",
    ourWork: "Ways to help",
    whyTrust: "Why trust us",
    give: "Give",
    languageLabel: "Language",
    identityEyebrow: "Hameir Laarets",
    identityTitle: "Lighting Jewish Lives",
    identityTitleAccent: "Through Torah and Chesed",
    identityBody: "Strengthening Jewish families in Israel and around the world through Torah, prayer, dignity, and acts of kindness.",
    supportCurrent: "Support families this Elul",
    discover: "Discover Hameir Laarets",
    ourStory: "Our Story",
    founded: "Founded upon the vision of",
    continued: "Continued today by",
    torah: "Torah",
    torahBody: "Inspiring Jewish lives through learning, lectures, and education.",
    chesed: "Chesed",
    chesedBody: "Providing food, therapy, support, and dignity to families in need.",
    community: "Community",
    communityBody: "Building stronger Jewish communities together.",
    world: "Around the world",
    worldBody: "Connecting Jews in Israel and across the globe through Torah and kindness.",
    legacyEyebrow: "Our foundation",
    legacyTitle: "From Jerusalem, a Light of Torah",
    legacyTitleAccent: "Continues Across the World",
    founderRole: "Founder",
    founderBody: "The visionary leader whose light began this mission.",
    leaderRole: "Continuing the mission",
    leaderBody: "Carrying his father's vision forward with faith and dedication.",
    pillarsEyebrow: "One mission · Three living pillars",
    pillarsTitle: "Light becomes action.",
    impactEyebrow: "Torah · Chesed · Community",
    impactTitle: "Our impact",
    impactTitleAccent: "over the past year.",
    titlesLabel: "Countries reached",
    languagesLabel: "Torah publications distributed",
    basketsLabel: "Families supported through Chesed",
    studentsLabel: "People guided & strengthened",
    officialSource: "Annual impact figures provided by Hameir Laarets",
    featured: "Elul 5786 · This season's focus",
    elulTitle: "The Path to",
    elulTitleAccent: "Shaarei Ha'rachamim",
    elulPhotoBody: "Tzedakah can carry mercy and care into another Jewish home.",
    elulBody: "Before the New Year, tzedakah can carry mercy and care into another Jewish home.",
    fullElul: "Support Kaparot this Elul",
    fulfill: "Fulfill Your Pidyon Kapparot",
    readStory: "Read the full Elul story",
    selectedCampaign: "Your chosen cause",
    donationFrequency: "Donation frequency",
    once: "One-time",
    monthly: "Monthly",
    chooseGift: "Choose your gift",
    continueWith: "Continue with",
    secure: "Secure checkout",
    deductible: "Tax-deductible",
    campaignsLink: "See all 10 ways to help",
    campaignsEyebrow: "10 meaningful ways to give",
    campaignsTitle: "Every gift has a purpose.",
    campaignsTitleAccent: "Choose where yours can help.",
    campaignsBody: "Choose the cause that speaks to you. If you arrived through a fundraiser, your gift will still be credited to them automatically.",
    viewKaparot: "Support Kaparot",
    chooseCampaign: "Support this cause",
    showFewer: "Show fewer ways to help",
    confidence: "Give with confidence",
    trustTitle: "Care should feel clear",
    trustTitleAccent: "from beginning to end.",
    established: "Established & trusted",
    establishedBody: "Hameir Laarets is a recognized 501(c)(3) nonprofit serving Jewish communities in the U.S., Israel, and beyond.",
    secureDesign: "Secure by design",
    secureDesignBody: "Your information is protected through a secure payment experience, with a receipt sent automatically.",
    choiceClear: "Your choice stays clear",
    choiceClearBody: "Your chosen cause, gift frequency, and fundraiser credit remain visible throughout the donation process.",
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
    storyTitle: "Elul turns the heart toward home.",
    storyOne: "Before the New Year, we come before Hashem carrying the prayers, hopes, and longing that the year has held.",
    storyTwo: "Pidyon Kapparot joins that inward return with an outward act of compassion. Through tzedakah, a sacred tradition becomes food, dignity, and care for another Jewish home.",
    storyThree: "Your gift helps Hameir Laarets bring practical support to families preparing for the holy days, while the names shared with us are carried in heartfelt tefillah.",
    closeCheckout: "Close checkout",
    yourGift: "Your gift",
    lastStep: "One last, simple step.",
    campaign: "Cause",
    gift: "Gift",
    fundraiser: "Fundraiser",
    fullName: "Full name",
    email: "Email address",
    securePayment: "Continue to secure payment",
    paymentNote: "Payment details will be completed securely with the organization's payment provider.",
    ready: "Ready for secure payment",
    takingShape: "Your gift is taking shape.",
    handoff: "The live site will hand this selection to the organization's secure payment provider while preserving your chosen cause and fundraiser credit.",
    returnPage: "Return to the page",
  },
  es: {
    skip: "Saltar al contenido principal",
    homeLabel: "Inicio del centro de donativos de Hameir Laarets",
    mainNavigation: "Navegación principal",
    buildDonation: "Prepara tu donativo",
    chooseAmountAria: "Elige el monto del donativo",
    securityInfo: "Información de seguridad del donativo",
    creditedPrefix: "Estás donando a través de",
    creditedSuffix: "Tu donativo se acreditará automáticamente.",
    tagline: "Torá · Jesed · Comunidad",
    ourWork: "Formas de ayudar",
    whyTrust: "Por qué confiar",
    give: "Donar",
    languageLabel: "Idioma",
    identityEyebrow: "Hameir Laarets",
    identityTitle: "Iluminando vidas judías",
    identityTitleAccent: "A través de Torá y Jesed",
    identityBody: "Fortalecemos a familias judías en Israel y en todo el mundo mediante Torá, plegaria, dignidad y actos de bondad.",
    supportCurrent: "Apoya a familias este Elul",
    discover: "Descubre Hameir Laarets",
    ourStory: "Nuestra historia",
    founded: "Fundada sobre la visión de",
    continued: "Continuada hoy por",
    torah: "Torá",
    torahBody: "Inspiramos vidas judías mediante estudio, conferencias y educación.",
    chesed: "Jesed",
    chesedBody: "Brindamos alimentos, terapia, apoyo y dignidad a familias necesitadas.",
    community: "Comunidad",
    communityBody: "Construimos juntos comunidades judías más fuertes.",
    world: "En todo el mundo",
    worldBody: "Conectamos a judíos en Israel y alrededor del mundo a través de Torá y bondad.",
    legacyEyebrow: "Nuestra base",
    legacyTitle: "Desde Jerusalén, una luz de Torá",
    legacyTitleAccent: "continúa por todo el mundo",
    founderRole: "Fundador",
    founderBody: "El líder visionario cuya luz dio origen a esta misión.",
    leaderRole: "Continuando la misión",
    leaderBody: "Llevando adelante la visión de su padre con fe y dedicación.",
    pillarsEyebrow: "Una misión · Tres pilares vivos",
    pillarsTitle: "La luz se convierte en acción.",
    impactEyebrow: "Torá · Jesed · Comunidad",
    impactTitle: "Nuestro impacto",
    impactTitleAccent: "durante el último año.",
    titlesLabel: "Países alcanzados",
    languagesLabel: "Publicaciones de Torá distribuidas",
    basketsLabel: "Familias apoyadas mediante Jesed",
    studentsLabel: "Personas orientadas y fortalecidas",
    officialSource: "Cifras anuales proporcionadas por Hameir Laarets",
    featured: "Elul 5786 · La causa de esta temporada",
    elulTitle: "El camino hacia",
    elulTitleAccent: "Shaarei Ha'rachamim",
    elulPhotoBody: "La tzedaká puede llevar misericordia y cuidado a otro hogar judío.",
    elulBody: "Antes del Año Nuevo, la tzedaká puede llevar misericordia y cuidado a otro hogar judío.",
    fullElul: "Apoya Kaparot este Elul",
    fulfill: "Cumple tu Pidyon Kaparot",
    readStory: "Leer la historia completa de Elul",
    selectedCampaign: "La causa que elegiste",
    donationFrequency: "Frecuencia del donativo",
    once: "Una vez",
    monthly: "Mensual",
    chooseGift: "Elige tu donativo",
    continueWith: "Continuar con",
    secure: "Pago seguro",
    deductible: "Deducible de impuestos",
    campaignsLink: "Ver las 10 formas de ayudar",
    campaignsEyebrow: "10 formas significativas de ayudar",
    campaignsTitle: "Cada donativo tiene un propósito.",
    campaignsTitleAccent: "Elige dónde puede ayudar el tuyo.",
    campaignsBody: "Elige la causa que más te inspire. Si llegaste a través de un recaudador, tu donativo se acreditará automáticamente.",
    viewKaparot: "Apoyar Kaparot",
    chooseCampaign: "Apoyar esta causa",
    showFewer: "Ver menos formas de ayudar",
    confidence: "Dona con confianza",
    trustTitle: "La ayuda debe sentirse clara",
    trustTitleAccent: "de principio a fin.",
    established: "Establecida y confiable",
    establishedBody: "Hameir Laarets es una organización 501(c)(3) reconocida que sirve a comunidades judías en Estados Unidos, Israel y otros países.",
    secureDesign: "Seguridad desde el diseño",
    secureDesignBody: "Tu información está protegida mediante una experiencia de pago segura y recibirás tu comprobante automáticamente.",
    choiceClear: "Tu elección permanece clara",
    choiceClearBody: "La causa elegida, la frecuencia y el crédito del recaudador permanecen visibles durante todo el proceso.",
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
    storyTitle: "Elul dirige el corazón hacia el hogar.",
    storyOne: "Antes del Año Nuevo, nos presentamos ante Hashem llevando las plegarias, esperanzas y anhelos que el año ha guardado.",
    storyTwo: "Pidyon Kaparot une ese retorno interior con un acto exterior de compasión. A través de la tzedaká, una tradición sagrada se convierte en alimento, dignidad y cuidado para otro hogar judío.",
    storyThree: "Tu donativo ayuda a Hameir Laarets a brindar apoyo práctico a familias que se preparan para los días sagrados, mientras los nombres que nos confían son incluidos en una tefilá sincera.",
    closeCheckout: "Cerrar el proceso de donación",
    yourGift: "Tu donativo",
    lastStep: "Un último paso sencillo.",
    campaign: "Causa",
    gift: "Donativo",
    fundraiser: "Recaudador",
    fullName: "Nombre completo",
    email: "Correo electrónico",
    securePayment: "Continuar al pago seguro",
    paymentNote: "Los datos de pago se completarán de forma segura con el proveedor de pagos de la organización.",
    ready: "Listo para el pago seguro",
    takingShape: "Tu donativo está tomando forma.",
    handoff: "El sitio transferirá esta selección al proveedor de pagos seguro conservando la causa elegida y el crédito del recaudador.",
    returnPage: "Volver a la página",
  },
} as const;
const SOCIAL_LINKS = [
  {
    label: "Hameir Laarets website",
    href: "https://hameirlaarets.org/",
    icon: GlobeHemisphereWest,
  },
  {
    label: "Hameir Laarets on Instagram",
    href: "https://www.instagram.com/hameirlaarets/",
    icon: InstagramLogo,
  },
  {
    label: "Rabbi Yisrael Abergel on Facebook",
    href: "https://www.facebook.com/haravisraelabergel/",
    icon: FacebookLogo,
  },
  {
    label: "Hameir Laarets on YouTube",
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
  const [frequency, setFrequency] = useState<Frequency>("once");
  const [expanded, setExpanded] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(!HERO_MEDIA.videoReady);
  const [heroVideoUnavailable, setHeroVideoUnavailable] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
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
      if (video.currentTime < 0.25) showPosterFallback();
    }, 4500);

    return () => {
      cancelled = true;
      window.clearTimeout(playbackWatchdog);
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

      <section className={styles.globalHero} id="v4-main" aria-labelledby="global-hero-title">
        <div className={styles.heroMedia} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_MEDIA.poster} alt="" />
          {HERO_MEDIA.videoReady && (
            <video
              ref={heroVideoRef}
              className={heroVideoUnavailable ? styles.heroVideoUnavailable : undefined}
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              preload="auto"
              poster={HERO_MEDIA.poster}
              onTimeUpdate={(event) => {
                if (event.currentTarget.currentTime >= HERO_REVEAL_TIME_SECONDS) {
                  setHeroRevealed(true);
                }
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
        <div className={`${styles.heroContent} ${heroRevealed ? styles.heroContentVisible : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.heroLogo} src="/images/hameir-laarets-logo-new.png" alt="" />
          <span>{t.tagline}</span>
          <h1 id="global-hero-title">
            {t.identityTitle}
            <strong>{t.identityTitleAccent}</strong>
          </h1>
          <p>{t.identityBody}</p>
          <div className={styles.heroActions}>
            <a href="#v4-featured">{t.supportCurrent} <ArrowDown size={18} weight="bold" /></a>
            <a href="#v4-legacy">{t.discover}</a>
          </div>
        </div>
        <a className={`${styles.heroScrollCue} ${heroRevealed ? styles.heroScrollCueVisible : ""}`} href="#v4-featured" aria-label={t.supportCurrent}>
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
              alt="Rabbi Yoram Michael Abergel zt'l and Rabbi Yisrael Abergel together"
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
          <img src="/images/elul-volunteers-featured.jpg" alt="Volunteers preparing food packages for Jewish families before the New Year" />
          <div className={styles.photoScrim} />
          <div className={styles.photoCopy}>
            <span>{t.featured}</span>
            <h1>{t.elulTitle}<br />{t.elulTitleAccent}</h1>
            <p>{t.elulPhotoBody}</p>
            <a href={elulCampaignHref}>
              {t.fullElul} <ArrowRight size={20} weight="bold" />
            </a>
          </div>
        </div>

        <div className={styles.storyPanel}>
          <Sparkle size={25} weight="light" aria-hidden="true" />
          <span>{t.featured}</span>
          <h1>{t.elulTitle}<br />{t.elulTitleAccent}</h1>
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
                    onClick={() => setAmount(gift)}
                  >
                    ${gift}
                  </button>
                ))}
              </div>
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
          <nav aria-label="Hameir Laarets online">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>
                <Icon size={21} weight="regular" aria-hidden="true" />
              </a>
            ))}
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
