"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CaretDown,
  CheckCircle,
  LinkSimpleHorizontal,
  LockKey,
  ShieldCheck,
} from "@phosphor-icons/react";
import styles from "./v2.module.css";

type Frequency = "once" | "monthly";

type Campaign = {
  id: string;
  title: string;
  donorTitle: string;
  description: string;
  category: string;
  image: string;
  tone: "ink" | "wine" | "warm";
};

const campaigns: Campaign[] = [
  {
    id: "general",
    title: "General Campaign",
    donorTitle: "Give Where It Is Needed Most",
    description: "Give Hameir Laarets the flexibility to respond wherever your help can make the greatest difference.",
    category: "General Support",
    image: "/images/v2-food-relief.png",
    tone: "ink",
  },
  {
    id: "emergency-lifeline",
    title: "Israel's Emergency Lifeline",
    donorTitle: "Stand with Families in Crisis",
    description: "Deliver urgent humanitarian assistance, practical care, and stability to vulnerable families in Israel.",
    category: "Humanitarian Aid",
    image: "/images/v2-family-crisis.png",
    tone: "wine",
  },
  {
    id: "next-step",
    title: "The Next Step Initiative",
    donorTitle: "Help a Child Take the Next Step",
    description: "Support therapeutic care and opportunities that help children move forward with confidence.",
    category: "Children & Family",
    image: "/images/v2-child-therapy.png",
    tone: "warm",
  },
  {
    id: "hafatzat-hamayanot",
    title: "Hafatzat HaMayanot",
    donorTitle: "Spread the Light of Torah",
    description: "Bring Torah learning, teachers, and sacred Jewish connection to more communities worldwide.",
    category: "Torah & Prayer",
    image: "/images/v2-torah-prayer.png",
    tone: "ink",
  },
  {
    id: "southern-israel",
    title: "Southern Israel Unity Center",
    donorTitle: "Strengthen Southern Israel",
    description: "Build resilience, security, and a thriving future for families throughout Israel's south.",
    category: "Jewish Community",
    image: "/images/v2-southern-community.png",
    tone: "warm",
  },
  {
    id: "tzedakah-box",
    title: "Tzedakah Box",
    donorTitle: "Make Everyday Giving Matter",
    description: "Turn the timeless mitzvah of tzedakah into consistent, practical support for people in need.",
    category: "General Support",
    image: "/images/v2-global-community.png",
    tone: "wine",
  },
  {
    id: "kaparot",
    title: "Kaparot 2026",
    donorTitle: "Turn Kaparot into Compassion",
    description: "Transform a sacred High Holiday tradition into food, dignity, and hope for families.",
    category: "Seasonal Giving",
    image: "/images/kaparot-family-hero.png",
    tone: "warm",
  },
  {
    id: "purim-pesach",
    title: "Purim Joy. Pesach Dignity.",
    donorTitle: "Bring Joy and Dignity Home",
    description: "Help families celebrate Purim and Pesach with the warmth every Jewish home deserves.",
    category: "Seasonal Giving",
    image: "/images/v2-food-relief.png",
    tone: "wine",
  },
  {
    id: "matanot-laevyonim",
    title: "Matanot La'evyonim",
    donorTitle: "Give the Gift of Purim",
    description: "Fulfill the mitzvah by helping families experience a joyful and dignified Purim.",
    category: "Seasonal Giving",
    image: "/images/v2-family-crisis.png",
    tone: "warm",
  },
  {
    id: "birkat-parnassah",
    title: "Birkat Parnassah — Parashat HaMan",
    donorTitle: "Share the Blessing of Parnassah",
    description: "Join a tradition of prayer, generosity, and support for families seeking stability.",
    category: "Torah & Prayer",
    image: "/images/v2-global-community.png",
    tone: "ink",
  },
  {
    id: "partners-prayer",
    title: "Partners in Prayer",
    donorTitle: "Carry a Prayer Forward",
    description: "Support prayer, spiritual connection, and sacred work that brings hope around the world.",
    category: "Torah & Prayer",
    image: "/images/v2-torah-prayer.png",
    tone: "wine",
  },
  {
    id: "birkat-habanim",
    title: "Birkat HaBanim",
    donorTitle: "A Blessing for Our Children",
    description: "Strengthen Jewish families through prayer, Torah, and programs for the next generation.",
    category: "Children & Family",
    image: "/images/v2-child-therapy.png",
    tone: "warm",
  },
  {
    id: "mexico",
    title: "Hameir Laarets — Mexico",
    donorTitle: "Strengthen Jewish Life in Mexico",
    description: "Expand Torah learning, Jewish identity, and connection for communities throughout Mexico.",
    category: "Global Jewish Life",
    image: "/images/v2-global-community.png",
    tone: "ink",
  },
];

const filterGroups: Record<string, string[]> = {
  "All Causes": [],
  "Relief & Care": ["Humanitarian Aid", "General Support"],
  "Torah & Prayer": ["Torah & Prayer"],
  "Seasonal Giving": ["Seasonal Giving"],
  "Community & Family": ["Children & Family", "Jewish Community", "Global Jewish Life"],
};

const giftAmounts = [36, 72, 180, 360];

const impactCopy: Record<number, string> = {
  36: "helps place essential groceries on a family's table",
  72: "helps provide care and practical support for a child",
  180: "helps a family regain stability during a difficult week",
  360: "helps fund urgent relief and long-term recovery",
};

export default function DonationCenterV2() {
  const [fundraiser, setFundraiser] = useState("");
  const [selectedCampaignId, setSelectedCampaignId] = useState("kaparot");
  const [frequency, setFrequency] = useState<Frequency>("once");
  const [amount, setAmount] = useState(180);
  const [filter, setFilter] = useState("All Causes");
  const [expanded, setExpanded] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const syncFromUrl = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      setFundraiser(params.get("fundraiser") || params.get("ref") || params.get("collector") || "");
      const requestedCampaign = params.get("campaign");
      if (requestedCampaign && campaigns.some((campaign) => campaign.id === requestedCampaign)) {
        setSelectedCampaignId(requestedCampaign);
      }
    }, 0);
    return () => window.clearTimeout(syncFromUrl);
  }, []);

  const selectedCampaign = campaigns.find((campaign) => campaign.id === selectedCampaignId) || campaigns[6];

  const filteredCampaigns = useMemo(
    () => filter === "All Causes"
      ? campaigns
      : campaigns.filter((campaign) => filterGroups[filter]?.includes(campaign.category)),
    [filter],
  );

  const visibleCampaigns = expanded || filter !== "All Causes" ? filteredCampaigns : filteredCampaigns.slice(0, 6);

  const scrollToDonate = () => {
    document.getElementById("v2-donate")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const chooseCampaign = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setReady(false);
    window.setTimeout(scrollToDonate, 40);
  };

  const submitDonation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReady(true);
  };

  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#v2-main">Skip to main content</a>

      {fundraiser && (
        <div className={styles.fundraiserStrip}>
          <LinkSimpleHorizontal size={16} weight="bold" aria-hidden="true" />
          Your gift will be credited to <strong>{fundraiser}</strong> automatically.
        </div>
      )}

      <header className={styles.header}>
        <a className={styles.brand} href="#v2-main" aria-label="Hameir Laarets donation center home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hameir-mark-transparent.png" alt="" />
          <span>HAMEIR LAARETS</span>
        </a>
        <nav className={styles.nav} aria-label="Main navigation">
          <a href="#v2-mission">Mission</a>
          <a href="#v2-causes">Causes</a>
          <a href="#v2-impact">Impact</a>
        </nav>
        <button className={styles.giveButton} onClick={scrollToDonate}>Give</button>
      </header>

      <section className={styles.hero} id="v2-main">
        <div className={styles.heroStory}>
          <p className={styles.date}>July 17, 2026</p>
          <h1>Care, with<br />absolute<br />clarity.</h1>
          <p className={styles.mantra}>Torah. Compassion. Community.</p>
          <div className={styles.heroImage}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/v2-community-hero.png" alt="Jewish community volunteers packing and delivering fresh food with dignity" />
          </div>
        </div>

        <div className={styles.donationColumn}>
          <div className={styles.donationShell}>
            <form className={styles.donationPanel} id="v2-donate" onSubmit={submitDonation}>
              <label className={styles.eyebrow} htmlFor="v2-campaign-select">You&apos;re supporting</label>
              <div className={styles.campaignSelect}>
                <select
                  id="v2-campaign-select"
                  value={selectedCampaignId}
                  onChange={(event) => { setSelectedCampaignId(event.target.value); setReady(false); }}
                >
                  {campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.title}</option>)}
                </select>
                <CaretDown size={18} weight="bold" aria-hidden="true" />
              </div>

              {fundraiser && (
                <p className={styles.attribution}><CheckCircle size={16} weight="fill" /> Credited to {fundraiser}</p>
              )}

              <span className={styles.eyebrow}>Frequency</span>
              <div className={styles.frequency} role="group" aria-label="Donation frequency">
                <button type="button" className={frequency === "once" ? styles.active : ""} aria-pressed={frequency === "once"} onClick={() => { setFrequency("once"); setReady(false); }}>One-time</button>
                <button type="button" className={frequency === "monthly" ? styles.active : ""} aria-pressed={frequency === "monthly"} onClick={() => { setFrequency("monthly"); setReady(false); }}>Monthly</button>
              </div>

              <fieldset className={styles.amountFieldset}>
                <legend className={styles.eyebrow}>Choose an amount</legend>
                <div className={styles.amountGrid}>
                  {giftAmounts.map((gift) => (
                    <button type="button" key={gift} className={amount === gift ? styles.active : ""} aria-pressed={amount === gift} onClick={() => { setAmount(gift); setReady(false); }}>${gift}</button>
                  ))}
                </div>
              </fieldset>

              <label className={styles.customAmount} htmlFor="v2-custom-amount">
                <span>Other amount</span>
                <b>$</b>
                <input id="v2-custom-amount" type="number" min="1" inputMode="decimal" value={giftAmounts.includes(amount) ? "" : amount} placeholder="—" onChange={(event) => { setAmount(Number(event.target.value)); setReady(false); }} />
              </label>

              <button className={styles.continueButton} type="submit">
                Continue <ArrowRight size={20} weight="bold" aria-hidden="true" />
              </button>

              <p className={styles.secure}><LockKey size={16} weight="bold" /> Secure donation · U.S. gifts are tax-deductible.</p>

              {ready && (
                <div className={styles.readyNotice} role="status">
                  <CheckCircle size={20} weight="fill" />
                  <span><strong>Your gift is ready.</strong> {frequency === "monthly" ? "Monthly" : "One-time"} gift of ${amount || 0} to {selectedCampaign.title}.</span>
                </div>
              )}
            </form>
          </div>
          <div className={styles.giftNote}>
            <strong>Your gift brings food, dignity, and hope</strong>
            <p>{impactCopy[amount] || "Your generosity helps advance this vital campaign"}.</p>
          </div>
          <div className={styles.trustProof}>
            <ShieldCheck size={28} weight="duotone" aria-hidden="true" />
            <div>
              <strong>Recognized in the United States</strong>
              <p>American Friends of Hameir Laarets Inc. is recognized by the IRS as a 501(c)(3) nonprofit organization.</p>
              <span>EIN 84-5083012 · Tax-deductible to the extent allowed by law</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.mission} id="v2-mission">
        <span>01</span>
        <p>We connect sacred Jewish purpose with practical care—responding to urgent needs while strengthening families and communities for the future.</p>
      </section>

      <section className={styles.causes} id="v2-causes">
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.goldEyebrow}>All campaigns</p>
            <h2>Choose the cause<br />closest to your heart.</h2>
          </div>
          <p>Every project is part of one shared mission: bringing clarity, dignity, and lasting Jewish strength where it matters most.</p>
        </div>

        <div className={styles.filters} role="group" aria-label="Filter campaigns">
          {Object.keys(filterGroups).map((category) => (
            <button
              key={category}
              className={filter === category ? styles.active : ""}
              aria-pressed={filter === category}
              onClick={() => { setFilter(category); setExpanded(category !== "All Causes"); }}
            >
              {category}
            </button>
          ))}
        </div>

        <div className={styles.campaignGrid}>
          {visibleCampaigns.map((campaign, index) => (
            <article className={`${styles.campaignCard} ${styles[campaign.tone]} ${index === 6 ? styles.wide : ""}`} key={campaign.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={campaign.image} alt="" />
              <div className={styles.cardTint} aria-hidden="true" />
              <div className={styles.cardContent}>
                <span>{campaign.category}</span>
                <h3>{campaign.donorTitle}</h3>
                <p>{campaign.description}</p>
                <button onClick={() => chooseCampaign(campaign.id)} aria-label={`Choose ${campaign.title}`}>
                  Choose this cause <ArrowRight size={18} weight="bold" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {filter === "All Causes" && !expanded && (
          <button className={styles.viewAll} onClick={() => setExpanded(true)}>View all 13 campaigns <ArrowRight size={18} weight="bold" /></button>
        )}
      </section>

      <section className={styles.impact} id="v2-impact">
        <div>
          <p className={styles.goldEyebrow}>A gift people can feel</p>
          <h2>Generosity becomes<br />something real.</h2>
        </div>
        <div className={styles.impactList}>
          {giftAmounts.map((gift) => (
            <button key={gift} onClick={() => { setAmount(gift); scrollToDonate(); }}>
              <strong>${gift}</strong>
              <span>{impactCopy[gift]}</span>
              <ArrowRight size={20} weight="bold" />
            </button>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hameir-mark-transparent.png" alt="" />
          <div><strong>HAMEIR LAARETS</strong><span>Torah · Compassion · Community</span></div>
        </div>
        <p>Bringing compassionate support and the teachings of Rabbi Yoram Michael Abargel zt”l to Jewish communities in Israel and around the world.</p>
        <div className={styles.footerLinks}>
          <a href="https://hameir-laarets.org.il/english/">Official website</a>
          <a href="https://hameir-laarets.org.il/contact/">Contact</a>
          <a href="#v2-causes">All campaigns</a>
        </div>
        <div className={styles.legal}><span>American Friends of Hameir Laarets Inc. · IRS-recognized 501(c)(3) · EIN 84-5083012</span><span>Israeli Nonprofit No. 580654762</span></div>
      </footer>

      <div className={styles.mobileBar}>
        <div><span>Selected cause</span><strong>{selectedCampaign.title}</strong></div>
        <button onClick={scrollToDonate}>Donate</button>
      </div>
    </main>
  );
}
