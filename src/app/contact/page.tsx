import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/ContactSection";
import { business } from "@/data/business";

export const metadata: Metadata = {
  title: "Contact & Directions",
  description:
    "Contact Rollings Automotive at 242 W Commonwealth Ave, Fullerton, CA 92832. Call (714) 870-6900. Open Mon–Fri 7 AM–6 PM, Sat 7 AM–4 PM.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact", title: "Contact — Rollings Automotive, Fullerton CA" },
};

export default function ContactPage() {
  return (
    <>
      <div className="pt-16 lg:pt-20" />
      <ContactSection headingLevel="h1" showChapter={false} />
      <section aria-label="Map" className="border-t border-line bg-ink">
        <div className="relative h-[60svh] min-h-[360px] w-full">
          <iframe
            title="Map showing Rollings Automotive at 242 W Commonwealth Ave, Fullerton"
            src={business.mapsEmbedUrl}
            className="absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_invert(0.92)_contrast(0.9)]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
