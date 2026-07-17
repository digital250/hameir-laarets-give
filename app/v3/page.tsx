"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle,
  LinkSimpleHorizontal,
  LockKey,
  ShieldCheck,
  X,
} from "@phosphor-icons/react";
import styles from "./v3.module.css";

type Frequency = "once" | "monthly";
type CauseId = "families" | "children" | "food" | "community" | "torah";

type Cause = {
  id: CauseId;
  label: string;
  image: string;
  impact: string;
  monthlyImpact: string;
  description: string;
};

type Campaign = {
  id: string;
  cause: CauseId;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
};

const causes: Cause[] = [
  {
    id: "families",
    label: "Families",
    image: "/images/v3-community-table.png",
    impact: "helps a family feel steady again.",
    monthlyImpact: "brings steady support to a family.",
    description: "Food, practical care, and breathing room when a household needs it most.",
  },
  {
    id: "children",
    label: "Children",
    image: "/images/v2-child-therapy.png",
    impact: "helps a child take the next step.",
    monthlyImpact: "keeps a child moving forward.",
    description: "Therapy, guidance, and opportunities that help children grow with confidence.",
  },
  {
    id: "food",
    label: "Food",
    image: "/images/v2-food-relief.png",
    impact: "puts dignity back on the table.",
    monthlyImpact: "keeps a family’s table full.",
    description: "Fresh groceries and essential food support, delivered with care and dignity.",
  },
  {
    id: "community",
    label: "Community",
    image: "/images/v2-southern-community.png",
    impact: "strengthens a community from within.",
    monthlyImpact: "helps a community keep thriving.",
    description: "Resilience, connection, and lasting support for Jewish communities near and far.",
  },
  {
    id: "torah",
    label: "Torah",
    image: "/images/v2-torah-prayer.png",
    impact: "keeps the light of Torah moving.",
    monthlyImpact: "keeps Torah learning within reach.",
    description: "Learning, prayer, teachers, and sacred connection for the next generation.",
  },
];

const campaigns: Campaign[] = [
  { id: "general", cause: "families", eyebrow: "Where needed most", title: "Give Where It Is Needed Most", description: "Let your gift meet the most urgent need with speed and flexibility.", image: "/images/v2-food-relief.png" },
  { id: "emergency-lifeline", cause: "families", eyebrow: "Humanitarian aid", title: "Israel’s Emergency Lifeline", description: "Practical relief and stability for families facing a crisis.", image: "/images/v2-family-crisis.png" },
  { id: "next-step", cause: "children", eyebrow: "Children & family", title: "The Next Step Initiative", description: "Therapeutic care and opportunity for children with special needs.", image: "/images/v2-child-therapy.png" },
  { id: "hafatzat-hamayanot", cause: "torah", eyebrow: "Torah & prayer", title: "Hafatzat HaMayanot", description: "Bring Torah learning and Jewish connection to more communities.", image: "/images/v2-torah-prayer.png" },
  { id: "southern-israel", cause: "community", eyebrow: "Jewish community", title: "Southern Israel Unity Center", description: "Build resilience and a thriving future throughout Israel’s south.", image: "/images/v2-southern-community.png" },
  { id: "tzedakah-box", cause: "families", eyebrow: "Everyday giving", title: "Tzedakah Box", description: "Turn a timeless mitzvah into consistent, practical support.", image: "/images/v2-global-community.png" },
  { id: "kaparot", cause: "food", eyebrow: "Seasonal giving", title: "Kaparot 2026", description: "Transform a sacred tradition into food, dignity, and hope.", image: "/images/kaparot-family-hero.png" },
  { id: "purim-pesach", cause: "food", eyebrow: "Seasonal giving", title: "Purim Joy. Pesach Dignity.", description: "Help families celebrate with the warmth every Jewish home deserves.", image: "/images/v2-food-relief.png" },
  { id: "matanot-laevyonim", cause: "food", eyebrow: "Seasonal giving", title: "Matanot La’evyonim", description: "Help families experience a joyful and dignified Purim.", image: "/images/v2-family-crisis.png" },
  { id: "birkat-parnassah", cause: "torah", eyebrow: "Torah & prayer", title: "Birkat Parnassah", description: "Join a tradition of prayer, generosity, and support for stability.", image: "/images/v2-global-community.png" },
  { id: "partners-prayer", cause: "torah", eyebrow: "Torah & prayer", title: "Partners in Prayer", description: "Carry prayer, spiritual connection, and hope around the world.", image: "/images/v2-torah-prayer.png" },
  { id: "birkat-habanim", cause: "children", eyebrow: "Children & family", title: "Birkat HaBanim", description: "Strengthen Jewish families and the next generation through prayer.", image: "/images/v2-child-therapy.png" },
  { id: "mexico", cause: "community", eyebrow: "Global Jewish life", title: "Hameir Laarets — Mexico", description: "Expand Jewish identity and connection throughout Mexico.", image: "/images/v2-global-community.png" },
];

const amounts = [36, 72, 180, 360];

export default function DonationExperienceV3() {
  const [fundraiser, setFundraiser] = useState("");
  const [causeId, setCauseId] = useState<CauseId>("families");
  const [campaignId, setCampaignId] = useState("general");
  const [amount, setAmount] = useState(180);
  const [customAmount, setCustomAmount] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [frequency, setFrequency] = useState<Frequency>("once");
  const [expanded, setExpanded] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const syncFromUrl = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      setFundraiser(params.get("fundraiser") || params.get("ref") || params.get("collector") || "");
      const requested = params.get("campaign");
      const match = campaigns.find((campaign) => campaign.id === requested);
      if (match) {
        setCampaignId(match.id);
        setCauseId(match.cause);
      }
    }, 0);
    return () => window.clearTimeout(syncFromUrl);
  }, []);

  useEffect(() => {
    if (!checkoutOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCheckoutOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [checkoutOpen]);

  const activeCause = useMemo(() => causes.find((cause) => cause.id === causeId) || causes[0], [causeId]);
  const activeCampaign = useMemo(() => campaigns.find((campaign) => campaign.id === campaignId) || campaigns[0], [campaignId]);
  const displayedCampaigns = expanded ? campaigns : campaigns.slice(0, 6);

  const selectCause = (nextCause: CauseId) => {
    setCauseId(nextCause);
    const firstCampaign = campaigns.find((campaign) => campaign.cause === nextCause);
    if (firstCampaign) setCampaignId(firstCampaign.id);
  };

  const selectAmount = (gift: number) => {
    setAmount(gift);
    setShowCustom(false);
    setCustomAmount("");
  };

  const chooseCampaign = (campaign: Campaign) => {
    setCampaignId(campaign.id);
    setCauseId(campaign.cause);
    document.getElementById("v3-give")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const submitGift = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCompleted(true);
  };

  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#v3-main">Skip to main content</a>

      {fundraiser && (
        <div className={styles.fundraiserStrip}>
          <LinkSimpleHorizontal size={16} weight="bold" aria-hidden="true" />
          You’re giving through <strong>{fundraiser}</strong>. Your gift will be credited automatically.
        </div>
      )}

      <header className={styles.header}>
        <a href="#v3-main" className={styles.brand} aria-label="Hameir Laarets donation center home">HAMEIR LAARETS</a>
        <span className={styles.headerStatement}>Serving Jewish communities across the U.S. and Israel</span>
        <nav className={styles.nav} aria-label="Main navigation">
          <a href="#v3-causes">Our work</a>
          <a href="#v3-trust">Why trust us</a>
        </nav>
        <button className={styles.headerGive} onClick={() => document.getElementById("v3-give")?.scrollIntoView({ behavior: "smooth" })}>Give</button>
      </header>

      <section className={styles.hero} id="v3-main">
        <div className={styles.heroCopy}>
          <h1>Give where<br />it becomes real.</h1>
          <p>Your gift strengthens families, nourishes hope, and keeps Jewish life thriving—here and in Israel.</p>
        </div>
        <div className={styles.heroImage} aria-live="polite">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={activeCause.image} src={activeCause.image} alt={`Hameir Laarets ${activeCause.label.toLowerCase()} support in action`} />
        </div>

        <div className={styles.composerFrame} id="v3-give">
          <section className={styles.composer} aria-label="Build your donation">
            <div className={styles.causeTabs} role="group" aria-label="Choose the kind of impact">
              {causes.map((cause) => (
                <button
                  key={cause.id}
                  type="button"
                  className={causeId === cause.id ? styles.activeCause : ""}
                  aria-pressed={causeId === cause.id}
                  onClick={() => selectCause(cause.id)}
                >
                  {cause.label}
                </button>
              ))}
            </div>

            <div className={styles.impactCopy}>
              <span><i /> Live impact</span>
              <h2><strong>${amount || 0}</strong> {frequency === "monthly" ? activeCause.monthlyImpact : activeCause.impact}</h2>
              <p>{activeCause.description}</p>
            </div>

            <div className={styles.giftControls}>
              <div className={styles.frequency} role="group" aria-label="Donation frequency">
                <button type="button" className={frequency === "once" ? styles.selected : ""} aria-pressed={frequency === "once"} onClick={() => setFrequency("once")}>One-time</button>
                <button type="button" className={frequency === "monthly" ? styles.selected : ""} aria-pressed={frequency === "monthly"} onClick={() => setFrequency("monthly")}>Monthly</button>
              </div>

              <span className={styles.giftLabel}>Choose your gift</span>
              <div className={styles.amounts} role="group" aria-label="Choose donation amount">
                {amounts.map((gift) => (
                  <button type="button" key={gift} className={!showCustom && amount === gift ? styles.selectedAmount : ""} aria-pressed={!showCustom && amount === gift} onClick={() => selectAmount(gift)}>${gift}</button>
                ))}
                <button type="button" className={showCustom ? styles.selectedAmount : ""} aria-pressed={showCustom} onClick={() => setShowCustom(true)}>Other</button>
              </div>

              {showCustom && (
                <label className={styles.customAmount}>
                  <span>$</span>
                  <input
                    autoFocus
                    type="number"
                    inputMode="decimal"
                    min="1"
                    value={customAmount}
                    aria-label="Custom donation amount"
                    placeholder="Enter your amount"
                    onChange={(event) => {
                      setCustomAmount(event.target.value);
                      setAmount(Number(event.target.value) || 0);
                    }}
                  />
                </label>
              )}

              <button className={styles.continueButton} disabled={amount < 1} onClick={() => { setCompleted(false); setCheckoutOpen(true); }}>
                Continue with ${amount || 0}<ArrowRight size={22} weight="bold" aria-hidden="true" />
              </button>
              <div className={styles.trustLine}>
                <span><LockKey size={16} /> Secure checkout</span><i />
                <span><CheckCircle size={16} /> Tax-deductible</span><i />
                <span><ShieldCheck size={17} /> 501(c)(3)</span>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className={styles.campaignSection} id="v3-causes">
        <div className={styles.sectionLead}>
          <span>Explore all campaigns</span>
          <h2>Real needs. Real people.<br />Real impact.</h2>
          <p>Choose one of our 13 active campaigns. Your fundraiser attribution stays with you, whichever campaign you select.</p>
        </div>

        <div className={styles.campaignGrid}>
          {displayedCampaigns.map((campaign, index) => (
            <article key={campaign.id} className={`${styles.campaignCard} ${index === 0 ? styles.featuredCard : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={campaign.image} alt="" />
              <div className={styles.cardScrim} />
              <div className={styles.cardCopy}>
                <span>{campaign.eyebrow}</span>
                <h3>{campaign.title}</h3>
                <p>{campaign.description}</p>
                <button onClick={() => chooseCampaign(campaign)}>Donate to this campaign <ArrowRight size={18} weight="bold" /></button>
              </div>
            </article>
          ))}
        </div>

        <button className={styles.allCampaigns} onClick={() => setExpanded((current) => !current)}>
          {expanded ? "Show fewer campaigns" : "Explore all 13 campaigns"}<ArrowRight size={18} weight="bold" />
        </button>
      </section>

      <section className={styles.trustSection} id="v3-trust">
        <div>
          <span>Give with confidence</span>
          <h2>Care should feel clear<br />from beginning to end.</h2>
        </div>
        <div className={styles.trustGrid}>
          <article><ShieldCheck size={30} weight="light" /><h3>Established & trusted</h3><p>Hameir Laarets is a recognized 501(c)(3) nonprofit serving Jewish communities in the U.S., Israel, and beyond.</p></article>
          <article><LockKey size={30} weight="light" /><h3>Secure by design</h3><p>Your information is protected through a secure payment experience, with a receipt sent automatically.</p></article>
          <article><Check size={30} weight="light" /><h3>Your choice stays clear</h3><p>Your selected campaign, gift frequency, and fundraiser attribution remain visible throughout the donation process.</p></article>
        </div>
      </section>

      <footer className={styles.footer}>
        <strong>HAMEIR LAARETS</strong>
        <span>Torah · Compassion · Community</span>
        <small>© 2026 Hameir Laarets. All rights reserved.</small>
      </footer>

      {checkoutOpen && (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCheckoutOpen(false); }}>
          <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="checkout-title">
            <button className={styles.closeModal} onClick={() => setCheckoutOpen(false)} aria-label="Close checkout"><X size={22} /></button>
            {!completed ? (
              <>
                <span className={styles.modalEyebrow}>Your gift</span>
                <h2 id="checkout-title">One last, simple step.</h2>
                <div className={styles.giftSummary}>
                  <div><span>Cause</span><strong>{activeCampaign.title}</strong></div>
                  <div><span>Gift</span><strong>${amount} · {frequency === "monthly" ? "Monthly" : "One-time"}</strong></div>
                  {fundraiser && <div><span>Fundraiser</span><strong>{fundraiser}</strong></div>}
                </div>
                <form className={styles.checkoutForm} onSubmit={submitGift}>
                  <label>Full name<input required autoComplete="name" name="name" /></label>
                  <label>Email address<input required type="email" autoComplete="email" name="email" /></label>
                  <button type="submit">Continue to secure payment <ArrowRight size={19} weight="bold" /></button>
                </form>
                <p className={styles.modalNote}><LockKey size={15} /> Payment details will be completed securely with the organization’s payment provider.</p>
              </>
            ) : (
              <div className={styles.successState}>
                <CheckCircle size={50} weight="fill" />
                <span>Ready for secure payment</span>
                <h2 id="checkout-title">Your gift is taking shape.</h2>
                <p>The live site will now hand this selection to the organization’s secure payment provider, while preserving the campaign and fundraiser attribution.</p>
                <button onClick={() => setCheckoutOpen(false)}>Return to the page</button>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
