/**
 * Verified knowledge base for the site assistant.
 *
 * Every fact below is sourced from the existing website data modules
 * (`src/data/business.ts`, `src/data/services.ts`). Nothing here introduces a
 * new service, price, testimonial, certification or business claim. The same
 * strings are used to build the server-side AI system prompt and the
 * deterministic fallback responder, so both modes stay within verified data.
 */
import { brands, business, principles } from "@/data/business";
import { additionalServices, services } from "@/data/services";

export type ChatLink = { label: string; href: string };
export type ChatAnswer = { text: string; links?: ChatLink[] };

/** Which already-published principles are shown on each service page / answer. */
export const SERVICE_PRINCIPLES: Record<string, readonly number[]> = {
  "engine-repair": [3, 2, 0],
  brakes: [2, 0, 4],
  "oil-change": [4, 2, 5],
  "tire-rotation": [4, 1, 5],
  "wheel-alignment": [4, 5, 3],
  suspension: [3, 5, 4],
  battery: [4, 3, 0],
  transmission: [3, 2, 5],
  "vehicle-electronics": [3, 5, 0],
  "air-conditioning": [4, 3, 5],
  hybrid: [3, 4, 1],
  "smog-check": [4, 5, 1],
  towing: [0, 5, 1],
};

const DEFAULT_PRINCIPLES = [0, 1, 4] as const;

export function principlesForService(slug: string) {
  const indexes = SERVICE_PRINCIPLES[slug] ?? DEFAULT_PRINCIPLES;
  return indexes.map((i) => principles[i]).filter(Boolean);
}

const serviceKeywords: Record<string, readonly string[]> = {
  "engine-repair": ["engine", "warning light", "check engine", "rough running", "motor"],
  brakes: ["brake", "brakes", "rotor", "pads"],
  "oil-change": ["oil", "lube", "oil change"],
  "tire-rotation": ["tire", "tyre", "rotation"],
  "wheel-alignment": ["alignment", "tracking", "geometry"],
  suspension: ["suspension", "shock", "strut", "steering"],
  battery: ["battery", "battery replacement", "jump start"],
  transmission: ["transmission", "gearbox"],
  "vehicle-electronics": ["electronic", "electrical", "wiring", "diagnostic"],
  "air-conditioning": ["a/c", "ac", "air conditioning", "aircon", "conditioning"],
  hybrid: ["hybrid", "electric car", "ev service"],
  "smog-check": ["smog", "emissions", "inspection"],
  towing: ["tow", "towing", "can't drive", "stranded"],
};

export function findService(question: string) {
  const q = question.toLowerCase();
  const byName = services.find((s) => q.includes(s.name.toLowerCase()));
  if (byName) return byName;
  for (const service of services) {
    if (serviceKeywords[service.slug]?.some((keyword) => q.includes(keyword))) return service;
  }
  return undefined;
}

const allServiceNames = services.map((s) => s.name).join(", ");
const hoursText = business.hours.map((h) => `${h.short}: ${h.value}`).join(" · ");

/** Facts given to the server-side model. Deliberately narrow and source-bound. */
export const chatSystemPrompt = [
  "You are the website assistant for Rollings Automotive, an independent auto repair shop in Fullerton, California.",
  "Answer using ONLY the verified facts below. Never invent prices, services, testimonials, ratings, certifications, warranties, parts inventory or business claims.",
  "If a question is not covered by these facts, say you do not have verified information about it and offer to connect the visitor with the team.",
  "Keep replies to 1-3 short sentences. Be friendly and direct. When useful, mention the exact page path from the list.",
  "",
  `Business: ${business.name}, ${business.description}`,
  `Founded: ${business.founded}. Phone: ${business.phoneDisplay}. Email: ${business.email}.`,
  `Address: ${business.address.street}, ${business.address.city}, ${business.address.region} ${business.address.postalCode}.`,
  `Hours: ${hoursText}.`,
  `Services: ${allServiceNames}. Also listed: ${additionalServices.join(", ")}.`,
  ...services.map((s) => `- /services/${s.slug} (${s.name}): ${s.summary}`),
  `Principles: ${principles.map((p) => `${p.title} — ${p.body}`).join(" | ")}`,
  `Makes worked on: ${brands.join(", ")}. ${business.name} is an independent repair shop and is not affiliated with, authorized by or endorsed by any vehicle manufacturer.`,
  "Pages: / (home), /services (all services), /classic-cars, /fleet-maintenance, /specials, /contact.",
  "Estimates: consultations are free. When in doubt, bring your car in for a free consultation; if we can't fix it, we'll refer the visitor to a shop that can. No prices are published on the website.",
].join("\n");

/** Deterministic, verified responder used when no AI provider is configured or it fails. */
export function answerFromKnowledge(rawQuestion: string): ChatAnswer {
  const q = rawQuestion.toLowerCase().trim();

  if (/^(hi|hello|hey|good (morning|afternoon|evening)|yo)\b/.test(q)) {
    return { text: "Hi! 👋 Welcome! How can we help you today?" };
  }

  // Retail / discount questions are not covered by the published services list.
  if (/(sell|selling|discount|cheap|coupon|in stock|inventory)/.test(q)) {
    return {
      text: "I don't have verified information about that. I can help with our services, estimates, hours, or contacting the team.",
      links: [
        { label: "View all services", href: "/services" },
        { label: "Contact our team", href: "/contact" },
      ],
    };
  }

  const service = findService(q);
  if (service) {
    const relevant = principlesForService(service.slug)[0];
    return {
      text: `${service.summary}${relevant ? ` ${relevant.body}` : ""}`,
      links: [
        { label: `Explore ${service.name}`, href: `/services/${service.slug}` },
        { label: "Ask our team", href: "/contact" },
      ],
    };
  }

  if (/(classic|restoration|vintage|muscle car)/.test(q)) {
    return {
      text: `Rollings Automotive is known in Fullerton for classic car restoration — and for treating every one of these cars like the rolling history it is.`,
      links: [
        { label: "Classic cars", href: "/classic-cars" },
        { label: "Request a consultation", href: "/contact" },
      ],
    };
  }

  if (/(fleet|business vehicles|company vehicles)/.test(q)) {
    return {
      text: "We work with fleets of all sizes and offer custom pricing and service plans — high-quality maintenance with speedy turnaround times.",
      links: [
        { label: "Fleet maintenance", href: "/fleet-maintenance" },
        { label: "Discuss fleet maintenance", href: "/contact" },
      ],
    };
  }

  if (/(bmw|honda|toyota|volkswagen|audi|mercedes|nissan|ford|jeep|make|makes|brands|foreign|domestic)/.test(q)) {
    return {
      text: `We work on all makes, foreign and domestic — including ${brands.slice(0, 8).join(", ")} and more. We are an independent repair shop and are not affiliated with any vehicle manufacturer.`,
      links: [{ label: "Vehicles we service", href: "/fleet-maintenance" }],
    };
  }

  if (/(hour|open|closed|close|time|when are you|saturday|sunday)/.test(q)) {
    return {
      text: `Our hours are ${hoursText}.`,
      links: [{ label: "Contact & consultation", href: "/contact" }],
    };
  }

  if (/(address|where|location|directions|map|visit)/.test(q)) {
    return {
      text: `You can find us at ${business.address.street}, ${business.address.city}, ${business.address.region} ${business.address.postalCode}.`,
      links: [{ label: "Get directions", href: business.mapsDirectionsUrl }],
    };
  }

  if (/(email|phone|number|call|contact|reach|talk to|speak to)/.test(q)) {
    return {
      text: `Call ${business.phoneDisplay} or email ${business.email}. Our consultations are free — when in doubt, just bring your car in.`,
      links: [{ label: "Contact our team", href: "/contact" }],
    };
  }

  if (/(estimate|quote|price|prices|cost|how much|charge|consultation|appointment|book|schedule)/.test(q)) {
    return {
      text: "We don't publish prices on the website. Consultations are free — when in doubt, bring your car in. Prefer to talk first? Give us a call.",
      links: [
        { label: "Get a free estimate", href: "/contact" },
        { label: business.phoneDisplay, href: business.phoneHref },
      ],
    };
  }

  if (/(service|repair|maintenance|offer|do you do|what can you|all makes)/.test(q)) {
    return {
      text: `All types of maintenance and repair — all makes, domestic and foreign. Our services include ${allServiceNames}.`,
      links: [{ label: "View all services", href: "/services" }],
    };
  }

  return {
    text: "I don't have verified information about that. I can help with our services, estimates, hours, or contacting the team.",
    links: [
      { label: "View all services", href: "/services" },
      { label: "Contact our team", href: "/contact" },
    ],
  };
}
