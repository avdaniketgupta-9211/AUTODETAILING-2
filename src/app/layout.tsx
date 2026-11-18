import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Manrope, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { business, siteUrl } from "@/data/business";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rollings Automotive — Auto Repair in Fullerton, CA since 1974",
    template: "%s · Rollings Automotive, Fullerton CA",
  },
  description:
    "Independent foreign and domestic auto repair, classic car restoration and fleet maintenance in Fullerton, California. Focused on excellence and integrity since 1974.",
  applicationName: "Rollings Automotive",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Rollings Automotive",
    locale: "en_US",
    url: "/",
    images: [{ url: "/images/og.jpg", width: 1920, height: 1080, alt: "Rollings Automotive — Fullerton, CA" }],
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#101112",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  "@id": `${siteUrl}/#business`,
  name: business.name,
  description: business.description,
  url: siteUrl,
  image: `${siteUrl}/images/og.jpg`,
  telephone: business.phoneE164,
  email: business.email,
  foundingDate: String(business.founded),
  address: {
    "@type": "PostalAddress",
    streetAddress: business.address.street,
    addressLocality: business.address.city,
    addressRegion: business.address.region,
    postalCode: business.address.postalCode,
    addressCountry: business.address.country,
  },
  areaServed: { "@type": "City", name: "Fullerton, California" },
  openingHoursSpecification: business.hours
    .filter((h) => h.opens)
    .map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.days, opens: h.opens, closes: h.closes })),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${instrument.variable}`}>
      <body className="antialiased">
        <a
          href="#main"
          className="fixed left-4 top-4 z-[100] -translate-y-24 bg-bone px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <MotionProvider>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
