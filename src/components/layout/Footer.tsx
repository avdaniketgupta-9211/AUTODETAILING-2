import Link from "next/link";
import { business } from "@/data/business";
import { footerNav } from "@/data/navigation";
import { services } from "@/data/services";
import { BackToTop } from "./BackToTop";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink pt-20 lg:pt-28">
      <div className="wrap">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4" data-reveal="fade">
            <p className="font-serif text-[clamp(1.8rem,3vw,2.6rem)] italic leading-[1.1] text-bone">
              Engineered with experience.
              <br />
              Driven by integrity.
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-mute">
              Independent foreign and domestic repair, classic car care and fleet maintenance in Fullerton, California — since 1974.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8" data-stagger>
            <div data-stagger-item>
              <h2 className="eyebrow mb-5">Explore</h2>
              <ul className="space-y-3 text-sm">
                {footerNav.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="u-link pb-0.5 text-bone/85 hover:text-bone">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div data-stagger-item>
              <h2 className="eyebrow mb-5">Services</h2>
              <ul className="space-y-3 text-sm">
                {services.slice(0, 7).map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="u-link pb-0.5 text-bone/85 hover:text-bone">
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div data-stagger-item>
              <h2 className="eyebrow mb-5">Visit</h2>
              <address className="space-y-3 text-sm not-italic text-bone/85">
                <a href={business.mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="u-link block w-fit pb-0.5">
                  {business.address.street}
                  <br />
                  {business.address.city}, {business.address.region} {business.address.postalCode}
                </a>
                <a href={business.phoneHref} className="u-link block w-fit pb-0.5">{business.phoneDisplay}</a>
                <a href={business.emailHref} className="u-link block w-fit break-all pb-0.5">{business.email}</a>
              </address>
            </div>
            <div data-stagger-item>
              <h2 className="eyebrow mb-5">Hours</h2>
              <dl className="space-y-3 text-sm">
                {business.hours.map((h) => (
                  <div key={h.label}>
                    <dt className="text-mute">{h.short}</dt>
                    <dd className="text-bone/85">{h.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </nav>
        </div>
      </div>

      <div className="wrap mt-20 lg:mt-28" aria-hidden>
        <p
          data-footer-mark
          className="select-none text-center text-[clamp(4rem,19.5vw,21rem)] font-light uppercase leading-[0.78] tracking-[-0.06em] text-bone/[0.92]"
        >
          Rollings
        </p>
      </div>

      <div className="wrap mt-10 flex flex-col-reverse items-start justify-between gap-6 border-t border-line py-8 text-xs text-mute sm:flex-row sm:items-center">
        <p>
          © {year} Rollings Automotive · Fullerton, CA · Est. 1974
        </p>
        <BackToTop />
      </div>
    </footer>
  );
}
