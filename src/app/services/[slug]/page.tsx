import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { business } from "@/data/business";
import { services } from "@/data/services";
import { principlesForService } from "@/lib/chat-knowledge";
import { PageHeader } from "@/components/sections/PageHeader";
import { ContactSection } from "@/components/sections/ContactSection";
import { Button } from "@/components/ui/Button";
import { pad2 } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) return {};

  return {
    title: service.name,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      url: `/services/${service.slug}`,
      title: `${service.name} — Rollings Automotive, Fullerton CA`,
      description: service.summary,
      images: [{ url: service.image }],
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const index = services.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();

  const service = services[index];
  const principles = principlesForService(service.slug);
  const related = [1, 2, 3].map((offset) => services[(index + offset) % services.length]);

  return (
    <>
      <PageHeader
        label={`Services · ${pad2(index + 1)} / ${pad2(services.length)}`}
        lines={[service.name]}
        intro={service.summary}
        image={service.image}
        imageAlt={service.alt}
      >
        <div className="flex flex-col gap-3">
          <Button href={business.phoneHref} icon="phone">{business.phoneDisplay}</Button>
          <Button href="/contact" variant="outline">Ask about {service.name.toLowerCase()}</Button>
        </div>
      </PageHeader>

      <nav aria-label="Breadcrumb" className="wrap flex flex-wrap items-center gap-3 py-7 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-mute">
        <Link href="/" className="u-link pb-0.5 hover:text-bone">Home</Link>
        <span aria-hidden>/</span>
        <Link href="/services" className="u-link pb-0.5 hover:text-bone">Services</Link>
        <span aria-hidden>/</span>
        <span className="text-bone">{service.name}</span>
      </nav>

      <section aria-labelledby="service-approach" className="border-y border-line bg-ink py-20 md:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="eyebrow" data-reveal="fade">Our approach</p>
            <h2 id="service-approach" className="display mt-5 text-[clamp(2rem,4vw,3.4rem)]" data-reveal="lines">
              <span className="line"><span>Why Rollings</span></span>
            </h2>
          </div>
          <div className="lg:col-span-8">
            <ul className="grid gap-8 sm:grid-cols-3">
              {principles.map((principle, i) => (
                <li key={principle.title} className="border-t border-line pt-5" data-reveal="fade">
                  <p className="eyebrow">{pad2(i + 1)}</p>
                  <h3 className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-bone">{principle.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mute">{principle.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-label={`${service.name} gallery`} className="bg-ink py-20 md:py-28">
        <div className="wrap">
          <div className="relative aspect-[16/10] overflow-hidden bg-ink-2 md:aspect-[16/8]" data-reveal="clip">
            <Image src={service.image} alt={service.alt} fill priority sizes="100vw" className="tone object-cover" />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {related.map((item) => (
              <Link key={item.slug} href={`/services/${item.slug}`} className="group relative block aspect-[4/3] overflow-hidden bg-ink-2" data-reveal="fade">
                <Image src={item.image} alt={item.alt} fill sizes="(min-width: 640px) 32vw, 100vw" className="tone object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.05]" />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
                <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-bone">{item.name}</span>
                  <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-4 shrink-0 text-bone transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-14 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between" data-reveal="fade">
            <p className="text-sm leading-relaxed text-mute">
              Don’t see what you need? Call us; we can probably still help.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/services" variant="outline">View all services</Button>
              <Button href="/contact">Request a consultation</Button>
            </div>
          </div>
        </div>
      </section>

      <ContactSection showChapter={false} />
    </>
  );
}
