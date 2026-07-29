"use client";

import { useEffect } from "react";
import styles from "./double-elul.module.css";

const DOUBLE_EMBED_URL = "https://embed.double.giving/652a15b0-2417-11f0-80b5-ed6216307745";

export default function DoubleElulPage() {
  useEffect(() => {
    if (document.querySelector(`script[src="${DOUBLE_EMBED_URL}"]`)) return;

    let cleanupTimer = 0;
    const closeStaleCheckout = () => {
      cleanupTimer = window.setTimeout(() => {
        window.Double?.closeCheckout?.();
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete("campaign");
        window.history.replaceState({}, "", currentUrl);
      }, 1200);
    };
    const script = document.createElement("script");
    script.src = DOUBLE_EMBED_URL;
    script.async = true;
    script.referrerPolicy = "strict-origin-when-cross-origin";
    document.addEventListener("Double.ready", closeStaleCheckout, { once: true });
    document.head.appendChild(script);

    return () => {
      window.clearTimeout(cleanupTimer);
      document.removeEventListener("Double.ready", closeStaleCheckout);
    };
  }, []);

  return (
    <main className={styles.page}>
      <div
        className="double--donation-form-widget"
        {...({ campaign: "kaparotelul-2026" } as Record<string, string>)}
      />
    </main>
  );
}
