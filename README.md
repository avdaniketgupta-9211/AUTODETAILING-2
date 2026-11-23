# Rollings Automotive — Website

Cinematic, editorial website for Rollings Automotive (Fullerton, CA — est. 1974).
Built with Next.js App Router, TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger, Lenis, Drizzle ORM/PostgreSQL.

## Routes
`/` (11-chapter homepage) · `/services` · `/services/[slug]` (13 dedicated service pages) · `/classic-cars` · `/fleet-maintenance` · `/specials` · `/contact` · `/api/contact` · `/api/chat` · `/api/chat/lead` · `/api/health` · `/sitemap.xml` · `/robots.txt`

## Structure
```
src/app/            routes, metadata, sitemap, robots, API
src/components/
  layout/           Navbar, MobileMenu, Footer, BackToTop, MotionProvider (Lenis + reveals)
  sections/         Hero, BrandIntroduction, Philosophy, Services, ClassicCars, Fleet, Brands, Workshop, Testimonials, Contact, PageHeader
  ui/               Button, SectionHeading/Lines, ServiceItem, ImageReveal, VideoBackground, ContactForm, Chatbot
src/animations/     gsap.ts, heroAnimations.ts, scrollAnimations.ts (data-attribute motion language)
src/data/           business.ts, services.ts, testimonials.ts, navigation.ts (verified content)
src/lib/            validation.ts (shared client/server), chat-knowledge.ts (verified AI context + fallback), request-guard.ts, utils.ts
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
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | optional | Email notification for each inquiry or chat lead via Resend |
| `OPENAI_API_KEY`, `OPENAI_MODEL` | optional | Server-side AI chat. Without a key, `/api/chat` uses the verified built-in knowledge-base responder (no external calls, no key in the browser). |
| `LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_TOKEN` | optional | GoHighLevel/CRM webhook for chat estimate requests. When set, a rejected webhook is **not** reported as success. |

Chat leads are stored in the `inquiries` table as `service = "Chat estimate request"`. In local development only (no `DATABASE_URL` / webhook), they are appended to the gitignored `.data/chat-leads.jsonl` so the flow can be tested. Without Resend, inquiries are still saved to the `inquiries` table. Staff can read them with:
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
