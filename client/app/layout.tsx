import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SITE } from "@/lib/constants";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import "./globals.css";

/**
 * The brand type ships with the app.
 *
 * Fraunces and Inter are variable fonts kept in `app/fonts`, so the page never
 * depends on a font CDN, the build never needs the network, and the fallback
 * is metric-matched (`adjustFontFallback`) so swapping to the fallback does
 * not shift the layout.
 */
const inter = localFont({
  src: [
    {
      path: "./fonts/Inter-Variable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

const fraunces = localFont({
  src: [
    {
      path: "./fonts/Fraunces-Variable.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "./fonts/Fraunces-Italic-Variable.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-fraunces",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "Jos hotels",
    "hotel booking Jos",
    "Plateau State hotels",
    "JosStay",
    "book a hotel in Jos",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#173B4D",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const organization = organizationJsonLd();
  const website = websiteJsonLd();

  return (
    <html lang="en-NG" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ocean focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ivory"
        >
          Skip to content
        </a>

        <Header />

        <main id="main-content">{children}</main>

        <Footer />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
        />
      </body>
    </html>
  );
}
