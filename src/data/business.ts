/**
 * Verified business facts sourced from https://rollingsautomotive.com/
 * (home, services, classic-cars, fleet-maintenance and specials pages).
 * Do not add claims here that cannot be traced to the source website.
 */
export const business = {
  name: "Rollings Automotive",
  shortName: "Rollings",
  founded: 1974,
  tagline: "Engineered with experience. Driven by integrity.",
  description:
    "Independent foreign and domestic auto repair and maintenance in Fullerton, California — focused on excellence and integrity since 1974.",
  phoneDisplay: "(714) 870-6900",
  phoneHref: "tel:+17148706900",
  phoneE164: "+1-714-870-6900",
  email: "info@rollingsautomotive.com",
  emailHref: "mailto:info@rollingsautomotive.com",
  address: {
    street: "242 W Commonwealth Ave",
    city: "Fullerton",
    region: "CA",
    postalCode: "92832",
    country: "US",
  },
  mapsDirectionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=242+W+Commonwealth+Ave%2C+Fullerton%2C+CA+92832",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=242%20W%20Commonwealth%20Ave%2C%20Fullerton%2C%20CA%2092832&z=16&output=embed",
  hours: [
    { label: "Monday – Friday", short: "Mon–Fri", value: "7 AM – 6 PM", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:00", closes: "18:00" },
    { label: "Saturday", short: "Sat", value: "7 AM – 4 PM", days: ["Saturday"], opens: "07:00", closes: "16:00" },
    { label: "Sunday", short: "Sun", value: "Closed", days: [] as string[], opens: null, closes: null },
  ],
} as const;

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://rollingsautomotive.com").replace(/\/$/, "");

/** Brands listed on the source site under "Independent Repair & Maintenance Shop". */
export const brands = [
  "BMW",
  "Volkswagen",
  "Audi",
  "Mercedes-Benz",
  "Nissan",
  "Toyota",
  "Honda",
  "Ford",
  "Mercury",
  "Lincoln",
  "Jeep",
  "GM",
  "Chrysler",
  "Plymouth",
  "Eagle",
] as const;

/** Principles, quoted / lightly edited from the source site. */
export const principles = [
  {
    title: "Honesty",
    body: "We only recommend the services we would do for our own cars — nothing more, nothing less.",
  },
  {
    title: "Integrity",
    body: "We stand by our work, and we always honor factory-recommended services and maintenance contracts.",
  },
  {
    title: "Quality materials",
    body: "We treat your car as if it were our own. That means we never cheap out on important parts or materials.",
  },
  {
    title: "Professional diagnostics",
    body: "Our shop is equipped with the latest diagnostic technology and tools — so we find the real problem, not a guess.",
  },
  {
    title: "Preventative maintenance",
    body: "We spot and advise on preventative measures that help avoid dangerous and costly breakdowns down the road.",
  },
  {
    title: "Customer-first advice",
    body: "Precise diagnostics also keep us from being “too careful” — we won’t do work that isn’t required.",
  },
] as const;
