# Rollings Automotive — Website

Cinematic, editorial website for Rollings Automotive (Fullerton, CA — est. 1974).
Built with Next.js App Router, TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger, Lenis, Drizzle ORM/PostgreSQL.

## Routes
`/` (11-chapter homepage) · `/services` · `/classic-cars` · `/fleet-maintenance` · `/specials` · `/contact` · `/api/contact` · `/api/health` · `/sitemap.xml` · `/robots.txt`

## Structure
```
src/app/            routes, metadata, sitemap, robots, API
src/components/
  layout/           Navbar, MobileMenu, Footer, BackToTop, MotionProvider (Lenis + reveals)
  sections/         Hero, BrandIntroduction, Philosophy, Services, ClassicCars, Fleet, Brands, Workshop, Testimonials, Contact, PageHeader
  ui/               Button, SectionHeading/Lines, ServiceItem, ImageReveal, VideoBackground, ContactForm
src/animations/     gsap.ts, heroAnimations.ts, scrollAnimations.ts (data-attribute motion language)
src/data/           business.ts, services.ts, testimonials.ts, navigation.ts (verified content)
src/lib/            validation.ts (shared client/server), utils.ts
src/db/             Drizzle schema (inquiries table)
tests/unit          Vitest (validation, spam heuristics, content integrity)
tests/e2e           Playwright (routes, nav, form, overflow at 7 widths, reduced motion, a11y basics)
```

## Environment
| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | PostgreSQL connection (contact inquiries) |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical URLs/sitemap (default `https://rollingsautomotive.com`) |
| `INQUIRY_SALT` | recommended | Salt for hashed IPs used in rate-limiting |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | optional | Email notification for each inquiry via Resend |

Without the Resend variables, inquiries are still saved to the `inquiries` table. Staff can read them with:
`psql $DATABASE_URL -c "select created_at,name,email,phone,service,message from inquiries order by created_at desc"`

## Commands
```bash
npm install
npx drizzle-kit push        # create/update tables
npm run build && npm run start
npx vitest run              # unit tests
npx playwright install chromium && E2E_BASE_URL=http://localhost:3000 npx playwright test
```

## Deployment
1. Provision PostgreSQL (Neon, Supabase, RDS…) and set `DATABASE_URL`.
2. Set `NEXT_PUBLIC_SITE_URL` to the production origin, plus `INQUIRY_SALT` (and Resend vars if you want email).
3. Deploy to Vercel or any Node 20+ host (`npm run build` → `npm run start`). Run `npx drizzle-kit push` once against production.
4. Behind a proxy, make sure `x-forwarded-for` is forwarded so rate limiting works per client.
5. Confirm `/api/health` returns `{ ok: true }`.

## Content policy
All business facts, services, brands, testimonials and specials come from rollingsautomotive.com. Do not add awards, ratings, certifications or statistics unless they are verified. See `ASSETS.md` for media licensing and the assets still needed.
