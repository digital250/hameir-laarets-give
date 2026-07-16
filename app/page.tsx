"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Campaign = {
  id: string;
  title: string;
  donorTitle: string;
  description: string;
  category: string;
  accent: string;
  featuredMonths?: number[];
};

const campaigns: Campaign[] = [
  {
    id: "general",
    title: "General Campaign",
    donorTitle: "Give Where It Is Needed Most",
    description: "Give Hameir Laarets the flexibility to respond wherever your help can make the greatest difference.",
    category: "General Support",
    accent: "navy",
  },
  {
    id: "emergency-lifeline",
    title: "Israel's Emergency Lifeline",
    donorTitle: "Stand with Families in Crisis",
    description: "Help deliver urgent humanitarian assistance, practical care, and stability to vulnerable families in Israel.",
    category: "Humanitarian Aid",
    accent: "ruby",
    featuredMonths: [5, 6],
  },
  {
    id: "next-step",
    title: "The Next Step Initiative",
    donorTitle: "Help a Child Take the Next Step",
    description: "Support therapeutic care and meaningful opportunities that help children move forward with confidence.",
    category: "Humanitarian Aid",
    accent: "teal",
  },
  {
    id: "tzedakah-box",
    title: "Tzedakah Box",
    donorTitle: "Make Everyday Giving Matter",
    description: "Turn the timeless mitzvah of tzedakah into consistent, practical support for people in need.",
    category: "General Support",
    accent: "gold",
  },
  {
    id: "southern-israel",
    title: "Southern Israel Unity Center",
    donorTitle: "Strengthen Southern Israel",
    description: "Build resilience, connection, and community for families living throughout Israel's south.",
    category: "Jewish Community",
    accent: "blue",
  },
  {
    id: "kaparot",
    title: "Kaparot",
    donorTitle: "Turn Kaparot into Compassion",
    description: "Transform a sacred High Holiday tradition into food, dignity, and hope for families preparing for the new year.",
    category: "Seasonal Giving",
    accent: "ruby",
    featuredMonths: [7, 8, 9, 10],
  },
  {
    id: "purim-pesach",
    title: "Purim Joy. Pesach Dignity.",
    donorTitle: "Bring Joy and Dignity Home",
    description: "Help families celebrate Purim and Pesach with the food, clothing, and dignity every Jewish home deserves.",
    category: "Seasonal Giving",
    accent: "plum",
    featuredMonths: [4],
  },
  {
    id: "matanot-laevyonim",
    title: "Matanot La'evyonim",
    donorTitle: "Give the Gift of Purim",
    description: "Fulfill the mitzvah of Matanot La'evyonim by helping families experience a joyful and dignified Purim.",
    category: "Seasonal Giving",
    accent: "gold",
    featuredMonths: [3],
  },
  {
    id: "birkat-parnassah",
    title: "Birkat Parnassah — Parashat HaMan",
    donorTitle: "Share the Blessing of Parnassah",
    description: "Join a meaningful tradition of prayer, generosity, and support for families seeking stability and livelihood.",
    category: "Seasonal Giving",
    accent: "teal",
    featuredMonths: [1, 2],
  },
  {
    id: "partners-prayer",
    title: "Partners in Prayer",
    donorTitle: "Carry a Prayer Forward",
    description: "Support prayer, spiritual connection, and the sacred work of bringing hope to Jews around the world.",
    category: "Torah & Prayer",
    accent: "blue",
    featuredMonths: [11, 12],
  },
  {
    id: "hafatzat-hamayanot",
    title: "Hafatzat HaMayanot",
    donorTitle: "Spread the Light of Torah",
    description: "Bring the teachings of Rabbi Yoram Michael Abargel zt”l to more homes, communities, and future generations.",
    category: "Torah & Prayer",
    accent: "navy",
  },
  {
    id: "birkat-habanim",
    title: "Birkat HaBanim",
    donorTitle: "A Blessing for Our Children",
    description: "Strengthen Jewish families through prayer, Torah, and programs created for the next generation.",
    category: "Torah & Prayer",
    accent: "plum",
  },
  {
    id: "mexico",
    title: "Hameir Laarets — Mexico",
    donorTitle: "Strengthen Jewish Life in Mexico",
    description: "Help expand Torah learning, Jewish identity, and community connection for Jews throughout Mexico.",
    category: "Global Jewish Life",
    accent: "teal",
  },
];

const categories = ["All Causes", "Humanitarian Aid", "Torah & Prayer", "Seasonal Giving", "Jewish Community", "Global Jewish Life", "General Support"];
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
    const params = new URLSearchParams(window.location.search);
    setFundraiser(params.get("fundraiser") || params.get("ref") || params.get("collector") || "");
    const requestedCampaign = params.get("campaign");
    if (requestedCampaign && campaigns.some((campaign) => campaign.id === requestedCampaign)) {
      setSelectedCampaignId(requestedCampaign);
    }
  }, []);

  const featured = useMemo(() => {
    const month = new Date().getMonth() + 1;
    return campaigns.find((campaign) => campaign.featuredMonths?.includes(month)) || campaigns[0];
  }, []);

  const selectedCampaign = campaigns.find((campaign) => campaign.id === selectedCampaignId) || featured;
  const visibleCampaigns = filter === "All Causes" ? campaigns : campaigns.filter((campaign) => campaign.category === filter);

  const chooseCampaign = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setNotice(false);
    window.setTimeout(() => document.getElementById("donate")?.scrollIntoView({ behavior: "smooth", block: "center" }), 30);
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
          <span className="status-check" aria-hidden="true">✓</span>
          <span>You are giving through <strong>{fundraiser}</strong>. Your gift will be credited automatically.</span>
        </div>
      )}

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Hameir Laarets donation center">
          <span className="brand-mark" aria-hidden="true"><i />HL</span>
          <span className="brand-copy"><strong>HAMEIR LAARETS</strong><small>Torah · Compassion · Community</small></span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#mission">Our Mission</a>
          <a href="#campaigns">Ways to Give</a>
          <a href="#trust">Why Give</a>
        </nav>
        <button className="button button-gold header-cta" onClick={() => document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" })}>
          Donate Now <span aria-hidden="true">→</span>
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-pattern" aria-hidden="true" />
        <div className="hero-inner" id="main-content">
          <div className="hero-story">
            <div className="campaign-kicker"><span>Featured Campaign</span><i />High Holidays 2026</div>
            <h1>Turn a sacred tradition into <em>compassion.</em></h1>
            <p className="hero-lead">Your Kaparot gift helps bring food, dignity, and hope to families across Israel as they prepare for the new year.</p>
            <div className="hero-actions">
              <button className="button button-gold" onClick={() => chooseCampaign("kaparot")}>Give for Kaparot <span aria-hidden="true">→</span></button>
              <a href="#campaigns" className="button button-ghost">Explore every cause</a>
            </div>
            <div className="hero-promise">
              <span className="promise-seal" aria-hidden="true">18</span>
              <p><strong>One gift. Two kinds of light.</strong><br />Practical help for today, spiritual strength for tomorrow.</p>
            </div>
          </div>

          <form className="donation-card" id="donate" onSubmit={submitDonation}>
            <div className="donation-card-head">
              <span className="donation-step">YOUR GIFT</span>
              <h2>Make a meaningful difference</h2>
              <p>Choose a cause and the amount that feels right to you.</p>
            </div>

            <label className="field-label" htmlFor="campaign-select">I want to support</label>
            <div className="select-wrap">
              <select id="campaign-select" value={selectedCampaignId} onChange={(event) => { setSelectedCampaignId(event.target.value); setNotice(false); }}>
                {campaigns.map((campaign) => <option value={campaign.id} key={campaign.id}>{campaign.title}</option>)}
              </select>
              <span aria-hidden="true">⌄</span>
            </div>

            {fundraiser && <div className="attribution-note"><span className="status-check">✓</span> Credited to {fundraiser}</div>}

            <div className="frequency-toggle" role="group" aria-label="Donation frequency">
              <button type="button" className={frequency === "once" ? "active" : ""} aria-pressed={frequency === "once"} onClick={() => setFrequency("once")}>One-time</button>
              <button type="button" className={frequency === "monthly" ? "active" : ""} aria-pressed={frequency === "monthly"} onClick={() => setFrequency("monthly")}>Monthly</button>
            </div>

            <fieldset className="amount-fieldset">
              <legend>Choose an amount</legend>
              <div className="amount-grid">
                {giftAmounts.map((value) => (
                  <button type="button" key={value} className={amount === value ? "active" : ""} aria-pressed={amount === value} onClick={() => { setAmount(value); setNotice(false); }}>${value}</button>
                ))}
              </div>
            </fieldset>

            <label className="custom-amount" htmlFor="custom-amount"><span>Other amount</span><b>$</b><input id="custom-amount" inputMode="decimal" type="number" min="1" value={amount} onChange={(event) => { setAmount(Number(event.target.value)); setNotice(false); }} /></label>

            <p className="impact-preview"><span aria-hidden="true">✓</span> ${amount || 0} {giftImpact[amount] || "helps advance this vital campaign"}.</p>
            <button className="button button-donate" type="submit">Continue to Secure Donation <span aria-hidden="true">→</span></button>

            {notice && <div className="integration-notice" role="status"><strong>Your gift selection is ready.</strong> Connect the GiveSuite or Double checkout to continue securely.</div>}

            <div className="card-trust">
              <span><i className="shield" aria-hidden="true">✓</i>Secure checkout</span>
              <span><i className="shield" aria-hidden="true">✓</i>Tax-deductible</span>
              <span><i className="shield" aria-hidden="true">✓</i>Receipt by email</span>
            </div>
          </form>
        </div>
      </section>

      <section className="trust-ribbon" aria-label="Donation trust information">
        <div><strong>501(c)(3)</strong><span>U.S. tax-deductible giving</span></div>
        <i />
        <div><strong>Israel & Worldwide</strong><span>Serving Jewish communities</span></div>
        <i />
        <div><strong>Personal Tracking</strong><span>Every fundraiser link is preserved</span></div>
      </section>

      <section className="mission-section" id="mission">
        <div className="section-intro">
          <span className="section-kicker">THE HAMEIR LAARETS MISSION</span>
          <h2>Where Torah, compassion, and community come together.</h2>
          <p>Hameir Laarets strengthens Jewish identity and resilience through inspiring Torah, humanitarian assistance, and programs that bring lasting hope to families and communities.</p>
        </div>
        <div className="mission-grid">
          <article className="mission-card dark-card"><span>01</span><h3>Relief with dignity</h3><p>Practical support for vulnerable families across Israel when they need it most.</p></article>
          <article className="mission-card gold-card"><span>02</span><h3>Torah that illuminates</h3><p>Sharing the teachings of Rabbi Yoram Michael Abargel zt”l across generations.</p></article>
          <article className="mission-card light-card"><span>03</span><h3>Community that endures</h3><p>Building resilient Jewish life in Israel and in communities around the world.</p></article>
        </div>
      </section>

      <section className="campaigns-section" id="campaigns">
        <div className="section-intro campaign-heading">
          <div><span className="section-kicker">ALL CAMPAIGNS</span><h2>Choose the cause closest to your heart.</h2></div>
          <p>Every path leads to meaningful impact. Select a campaign and your choice will appear instantly in the donation panel.</p>
        </div>

        <div className="filters" role="group" aria-label="Filter campaigns">
          {categories.map((category) => (
            <button key={category} className={filter === category ? "active" : ""} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}</button>
          ))}
        </div>

        <div className="campaign-grid">
          {visibleCampaigns.map((campaign, index) => (
            <article className="campaign-card" key={campaign.id}>
              <div className={`campaign-top ${campaign.accent}`}>
                <span className="campaign-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="campaign-category">{campaign.category}</span>
                <div className="campaign-arch" aria-hidden="true"><i /></div>
              </div>
              <div className="campaign-body">
                <small>{campaign.title}</small>
                <h3>{campaign.donorTitle}</h3>
                <p>{campaign.description}</p>
                <button onClick={() => chooseCampaign(campaign.id)}>Choose this cause <span aria-hidden="true">→</span></button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="impact-section" id="trust">
        <div className="impact-copy">
          <span className="section-kicker light-kicker">YOUR GIFT IN ACTION</span>
          <h2>Generosity becomes something people can feel.</h2>
          <p>Every donation helps Hameir Laarets respond with compassion, strengthen Jewish identity, and carry light into another home.</p>
          <button className="button button-gold" onClick={() => document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" })}>Make Your Gift <span aria-hidden="true">→</span></button>
        </div>
        <div className="impact-levels">
          {giftAmounts.map((value) => (
            <button key={value} onClick={() => { setAmount(value); document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" }); }}>
              <strong>${value}</strong><span>{giftImpact[value]}</span><i aria-hidden="true">→</i>
            </button>
          ))}
        </div>
      </section>

      <section className="closing-section">
        <div className="closing-seal" aria-hidden="true"><span>18</span></div>
        <div><span className="section-kicker">A LIGHT THAT TRAVELS</span><h2>Your gift reaches further than you can see.</h2><p>Choose a cause. Honor a tradition. Strengthen a family and the Jewish future.</p></div>
        <button className="button button-navy" onClick={() => document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" })}>Donate Now <span aria-hidden="true">→</span></button>
      </section>

      <footer>
        <div className="footer-main">
          <a className="brand footer-brand" href="#top"><span className="brand-mark" aria-hidden="true"><i />HL</span><span className="brand-copy"><strong>HAMEIR LAARETS</strong><small>Torah · Compassion · Community</small></span></a>
          <p>Bringing the teachings of Rabbi Yoram Michael Abargel zt”l and compassionate support to Jewish communities in Israel and around the world.</p>
          <div className="footer-links"><a href="https://hameir-laarets.org.il/english/">Official Website</a><a href="https://hameir-laarets.org.il/contact/">Contact</a><a href="#campaigns">All Campaigns</a></div>
        </div>
        <div className="footer-legal"><span>American Friends of Netivot Inc. · Recognized 501(c)(3)</span><span>Israeli Nonprofit No. 580654762</span></div>
      </footer>

      <div className="mobile-donate-bar">
        <div><span>Selected cause</span><strong>{selectedCampaign.title}</strong></div>
        <button className="button button-gold" onClick={() => document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" })}>Donate</button>
      </div>
    </main>
  );
}
