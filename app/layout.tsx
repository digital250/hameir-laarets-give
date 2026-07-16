import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "Hameir Laarets | Give Light. Strengthen Lives.";
const description = "Support Hameir Laarets humanitarian aid, Torah, prayer, seasonal campaigns, and Jewish communities in Israel and around the world.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og.png`;

  return {
    title,
    description,
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: { title, description, locale: "en_US", type: "website", images: [{ url: image, width: 1728, height: 905, alt: "Hameir Laarets — Torah, Compassion, Community" }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" dir="ltr"><body>{children}</body></html>;
}
