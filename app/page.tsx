"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CaretDown,
  CheckCircle,
  Leaf,
  LinkSimpleHorizontal,
  LockKey,
  Receipt,
  ShieldCheck,
} from "@phosphor-icons/react";

type Campaign = {
  id: string;
  title: string;
  donorTitle: string;
  description: string;
  category: string;
  featuredMonths?: number[];
};

const campaigns: Campaign[] = [
  {
    id: "general",
    title: "General Campaign",
    donorTitle: "Give Where It Is Needed Most",
    description: "Give Hameir Laarets the flexibility to respond wherever your help can make the greatest difference.",
    category: "General Support",
  },
  {
    id: "emergency-lifeline",
    title: "Israel's Emergency Lifeline",
    donorTitle: "Stand with Families in Crisis",
    description: "Help deliver urgent humanitarian assistance, practical care, and stability to vulnerable families in Israel.",
    category: "Humanitarian Aid",
    featuredMonths: [5, 6],
  },
  {
    id: "next-step",
    title: "The Next Step Initiative",
    donorTitle: "Help a Child Take the Next Step",
    description: "Support therapeutic care and meaningful opportunities that help children move forward with confidence.",
    category: "Humanitarian Aid",
  },
  {
    id: "tzedakah-box",
    title: "Tzedakah Box",
    donorTitle: "Make Everyday Giving Matter",
    description: "Turn the timeless mitzvah of tzedakah into consistent, practical support for people in need.",
    category: "General Support",
  },
  {
    id: "southern-israel",
    title: "Southern Israel Unity Center",
    donorTitle: "Strengthen Southern Israel",
    description: "Build resilience, connection, and community for families living throughout Israel's south.",
    category: "Jewish Community",
  },
  {
    id: "kaparot",
    title: "Kaparot",
    donorTitle: "Turn Kaparot into Compassion",
    description: "Transform a sacred High Holiday tradition into food, dignity, and hope for families preparing for the new year.",
    category: "Seasonal Giving",
    featuredMonths: [7, 8, 9, 10],
  },
  {
    id: "purim-pesach",
    title: "Purim Joy. Pesach Dignity.",
    donorTitle: "Bring Joy and Dignity Home",
    description: "Help families celebrate Purim and Pesach with the food, clothing, and dignity every Jewish home deserves.",
    category: "Seasonal Giving",
    featuredMonths: [4],
  },
  {
    id: "matanot-laevyonim",
    title: "Matanot La'evyonim",
    donorTitle: "Give the Gift of Purim",
    description: "Fulfill the mitzvah of Matanot La'evyonim by helping families experience a joyful and dignified Purim.",
    category: "Seasonal Giving",
    featuredMonths: [3],
  },
  {
    id: "birkat-parnassah",
    title: "Birkat Parnassah — Parashat HaMan",
    donorTitle: "Share the Blessing of Parnassah",
    description: "Join a meaningful tradition of prayer, generosity, and support for families seeking stability and livelihood.",
    category: "Seasonal Giving",
    featuredMonths: [1, 2],
  },
  {
    id: "partners-prayer",
    title: "Partners in Prayer",
    donorTitle: "Carry a Prayer Forward",
    description: "Support prayer, spiritual connection, and the sacred work of bringing hope to Jews around the world.",
    category: "Torah & Prayer",
    featuredMonths: [11, 12],
  },
  {
    id: "hafatzat-hamayanot",
    title: "Hafatzat HaMayanot",
    donorTitle: "Spread the Light of Torah",
    description: "Bring the teachings of Rabbi Yoram Michael Abargel zt”l to more homes, communities, and future generations.",
    category: "Torah & Prayer",
  },
  {
    id: "birkat-habanim",
    title: "Birkat HaBanim",
    donorTitle: "A Blessing for Our Children",
    description: "Strengthen Jewish families through prayer, Torah, and programs created for the next generation.",
    category: "Torah & Prayer",
  },
  {
    id: "mexico",
    title: "Hameir Laarets — Mexico",
    donorTitle: "Strengthen Jewish Life in Mexico",
    description: "Help expand Torah learning, Jewish identity, and community connection for Jews throughout Mexico.",
    category: "Global Jewish Life",
  },
];

const categories = [
  "All Causes",
  "Humanitarian Aid",
  "Torah & Prayer",
  "Seasonal Giving",
  "Jewish Community",
  "Global Jewish Life",
  "General Support",
];

const giftAmounts = [36, 72, 180, 360];

const giftImpact: Record<number, string> = {
  36: "helps provide essential groceries",
  72: "helps support therapeutic care",
  180: "helps strengthen a family in crisis",
  360: "helps fund urgent relief and recovery",
};

export default function Home() {
  const [fundraiser, setFundraiser] = useState("");
  const [filter, setFilter] = useState("All Causes");
  const [selectedCampaignId, setSelectedCampaignId] = useState("kaparot");
  const [amount, setAmount] = useState(180);
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [notice, setNotice] = useState(false);

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

  const featured = useMemo(() => {
    const month = new Date().getMonth() + 1;
    return campaigns.find((campaign) => campaign.featuredMonths?.includes(month)) || campaigns[0];
  }, []);

  const selectedCampaign = campaigns.find((campaign) => campaign.id === selectedCampaignId) || featured;
  const visibleCampaigns = filter === "All Causes" ? campaigns : campaigns.filter((campaign) => campaign.category === filter);

  const scrollToDonation = () => {
    document.getElementById("donate")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const chooseCampaign = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setNotice(false);
    window.setTimeout(scrollToDonation, 40);
  };

  const submitDonation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(true);
  };

  return (
    <main>
      <a className="skip-link" href="#main-content">Skip to main content</a>

      {fundraiser && (
        <div className="fundraiser-strip">
          <CheckCircle size={17} weight="fill" aria-hidden="true" />
          <span>You are giving through <strong>{fundraiser}</strong>. Your gift will be credited automatically.</span>
        </div>
      )}

      <header className="site-header" id="top">
        <a className="brand" href="#top" aria-label="Hameir Laarets donation center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hameir-mark-transparent.png" alt="" />
          <span className="brand-type">
            <strong>HAMEIR LAARETS</strong>
            <small>Torah · Compassion · Community</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#mission">Our Mission</a>
          <a href="#campaigns">Ways to Give</a>
          <a href="#trust">Why Give</a>
          <a href="#stories">Stories</a>
        </nav>
        <button className="button header-cta" onClick={scrollToDonation}>
          Donate Now <ArrowRight size={17} weight="bold" aria-hidden="true" />
        </button>
      </header>

      <section className="hero" id="main-content">
        <div className="hero-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/kaparot-family-hero.png" alt="A family preparing a holiday meal together" />
          <div className="hero-copy">
            <span className="campaign-tag">Kaparot 2026</span>
            <h1>Turn a sacred<br />tradition into<br /><em>dignity for a family.</em></h1>
            <p>Your Kaparot gift becomes food, relief, and hope for a family in Israel.</p>
          </div>
        </div>

        <form className="donation-panel" id="donate" onSubmit={submitDonation}>
          <div className="panel-ornament" aria-hidden="true"><span>YOUR GIFT</span><Leaf size={29} weight="thin" /></div>
          <h2>Choose an amount that brings food, dignity, and hope.</h2>

          <label className="field-label" htmlFor="campaign-select">I want to support</label>
          <div className="campaign-select">
            <select
              id="campaign-select"
              value={selectedCampaignId}
              onChange={(event) => { setSelectedCampaignId(event.target.value); setNotice(false); }}
            >
              {campaigns.map((campaign) => (
                <option value={campaign.id} key={campaign.id}>{campaign.title}</option>
              ))}
            </select>
            <CaretDown size={16} weight="bold" aria-hidden="true" />
          </div>

          {fundraiser && (
            <div className="attribution-note">
              <LinkSimpleHorizontal size={17} weight="bold" aria-hidden="true" />
              Credited to {fundraiser}
            </div>
          )}

          <div className="frequency-toggle" role="group" aria-label="Donation frequency">
            <button type="button" className={frequency === "once" ? "active" : ""} aria-pressed={frequency === "once"} onClick={() => setFrequency("once")}>One-time</button>
            <button type="button" className={frequency === "monthly" ? "active" : ""} aria-pressed={frequency === "monthly"} onClick={() => setFrequency("monthly")}>Monthly</button>
          </div>

          <fieldset className="amount-fieldset">
            <legend>Choose an amount</legend>
            <div className="amount-grid">
              {giftAmounts.map((value) => (
                <button
                  type="button"
                  key={value}
                  className={amount === value ? "active" : ""}
                  aria-pressed={amount === value}
                  onClick={() => { setAmount(value); setNotice(false); }}
                >
                  ${value}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="custom-amount" htmlFor="custom-amount">
            <span>Other amount</span>
            <b>$</b>
            <input
              id="custom-amount"
              inputMode="decimal"
              type="number"
              min="1"
              value={amount}
              onChange={(event) => { setAmount(Number(event.target.value)); setNotice(false); }}
            />
          </label>

          <p className="impact-preview">
            <CheckCircle size={16} weight="fill" aria-hidden="true" />
            ${amount || 0} {giftImpact[amount] || "helps advance this vital campaign"}.
          </p>

          <button className="button donation-cta" type="submit">
            Donate Securely <LockKey size={17} weight="bold" aria-hidden="true" />
          </button>

          {notice && (
            <div className="integration-notice" role="status">
              <strong>Your gift selection is ready.</strong>
              The GiveSuite or Double checkout can continue securely from here.
            </div>
          )}

          <div className="panel-trust">
            <ShieldCheck size={20} weight="duotone" aria-hidden="true" />
            <span>Your gift is secure and tax-deductible.</span>
          </div>

          <div className="transparency-note">
            <strong>Transparent giving</strong>
            <p>Your cause, amount, and fundraiser attribution stay connected throughout the donation journey.</p>
          </div>
        </form>
      </section>

      <section className="trust-ledger" id="trust" aria-label="Donation trust information">
        <div><ShieldCheck size={24} weight="duotone" aria-hidden="true" /><span><strong>Secure giving</strong>Protected donation flow</span></div>
        <div><Receipt size={24} weight="duotone" aria-hidden="true" /><span><strong>Tax-deductible</strong>Receipt sent by email</span></div>
        <div><LinkSimpleHorizontal size={24} weight="duotone" aria-hidden="true" /><span><strong>Personal tracking</strong>Fundraiser attribution preserved</span></div>
      </section>

      <section className="mission-section" id="mission">
        <div className="mission-index"><span>01</span><small>Our mission</small></div>
        <div className="mission-copy">
          <p className="eyebrow">WHERE TORAH, COMPASSION, AND COMMUNITY COME TOGETHER</p>
          <h2>We strengthen Jewish life in the places it is felt most: <em>at home, in community, and in the heart.</em></h2>
        </div>
        <div className="mission-detail">
          <p>Hameir Laarets brings together inspiring Torah, humanitarian assistance, and resilient community programs—responding to immediate need while building strength for generations.</p>
          <a href="#campaigns">Explore every way to give <ArrowRight size={18} weight="bold" aria-hidden="true" /></a>
        </div>
      </section>

      <section className="campaigns-section" id="campaigns">
        <div className="campaigns-heading">
          <div className="section-index"><span>02</span><small>Ways to give</small></div>
          <div>
            <p className="eyebrow">ALL CAMPAIGNS</p>
            <h2>Choose the cause<br /><em>closest to your heart.</em></h2>
          </div>
          <p>Every path leads to meaningful impact. Choose a campaign below and it will appear instantly in your donation panel.</p>
        </div>

        <div className="filters" role="group" aria-label="Filter campaigns">
          {categories.map((category) => (
            <button
              key={category}
              className={filter === category ? "active" : ""}
              aria-pressed={filter === category}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="campaign-list">
          {visibleCampaigns.map((campaign, index) => (
            <article className="campaign-row" key={campaign.id}>
              <span className="campaign-number">{String(index + 1).padStart(2, "0")}</span>
              <div className="campaign-title">
                <small>{campaign.category}</small>
                <h3>{campaign.donorTitle}</h3>
              </div>
              <p>{campaign.description}</p>
              <button onClick={() => chooseCampaign(campaign.id)} aria-label={`Choose ${campaign.title}`}>
                Choose this cause <ArrowRight size={18} weight="bold" aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="impact-section" id="stories">
        <div className="impact-intro">
          <div className="section-index light"><span>03</span><small>Your gift in action</small></div>
          <p className="eyebrow light">A GIFT PEOPLE CAN FEEL</p>
          <h2>Generosity becomes something real.</h2>
          <p>Food on a table. Care for a child. Torah reaching another home. A community finding its footing again.</p>
        </div>
        <div className="impact-amounts">
          {giftAmounts.map((value) => (
            <button
              key={value}
              onClick={() => { setAmount(value); scrollToDonation(); }}
            >
              <strong>${value}</strong>
              <span>{giftImpact[value]}</span>
              <ArrowRight size={19} weight="bold" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      <section className="closing-section">
        <p className="eyebrow">A LIGHT THAT TRAVELS</p>
        <h2>Your gift reaches<br /><em>further than you can see.</em></h2>
        <p>Choose a cause. Honor a tradition. Strengthen a family and the Jewish future.</p>
        <button className="button closing-cta" onClick={scrollToDonation}>
          Make your gift <ArrowRight size={18} weight="bold" aria-hidden="true" />
        </button>
      </section>

      <footer>
        <div className="footer-brand"><strong>HAMEIR LAARETS</strong><span>Torah · Compassion · Community</span></div>
        <p>Bringing the teachings of Rabbi Yoram Michael Abargel zt”l and compassionate support to Jewish communities in Israel and around the world.</p>
        <div className="footer-links">
          <a href="https://hameir-laarets.org.il/english/">Official Website</a>
          <a href="https://hameir-laarets.org.il/contact/">Contact</a>
          <a href="#campaigns">All Campaigns</a>
        </div>
        <div className="footer-legal">
          <span>American Friends of Netivot Inc. · Recognized 501(c)(3)</span>
          <span>Israeli Nonprofit No. 580654762</span>
        </div>
      </footer>

      <div className="mobile-donate-bar">
        <div><span>Selected cause</span><strong>{selectedCampaign.title}</strong></div>
        <button className="button" onClick={scrollToDonation}>Donate</button>
      </div>
    </main>
  );
}
