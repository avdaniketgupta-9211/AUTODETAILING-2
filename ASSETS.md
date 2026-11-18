# Rollings Automotive — Asset Manifest

All media is self-hosted under `public/` (required by the site's Content Security Policy).

## 1. Business photography (owned by Rollings Automotive)
Downloaded from the live site `rollingsautomotive.com/wp-content/uploads/2022/12/`.
Used in: Classic Cars section/page, Workshop collage.

| File | Subject |
| --- | --- |
| `images/business/silver-classic-car-1.png` | Silver classic Chevrolet, custom wheels, in shop |
| `images/business/green-car-engine.png` | Green pinstriped show engine bay |
| `images/business/Black-classic-car.png` | Navy/silver British saloon in workshop |
| `images/business/green-car-chevrolet.png` | Green custom Chevrolet on alignment rack |
| `images/business/Classic-car-restoration-6.png` | Chrome small-block engine, red car |
| `images/business/Classic-car-restoration-1.png` | Cream/black neo-classic roadster in showroom |
| `images/business/WS8-classic-car-e1671263286744-1.png` | White classic Corvette convertible |
| `images/business/classic-car-jurassic-side.png` | Jeep Wrangler in custom film livery |

Unused but available: `car-engine-front`, `car-parts`, `car-pipe`, `classic-car-seat`, `green-car-engine-2`, `Classic-car-restoration-2/5`.

## 2. Licensed stock (Pexels License — free commercial use, no attribution required)
| File | Pexels ID / creator |
| --- | --- |
| `videos/hero-1080.mp4`, `hero-720.mp4`, `hero-360.mp4`, `images/hero-poster.jpg`, `images/og.jpg` | Video 13574385 — 4art 44 |
| `videos/workshop-960.mp4`, `images/workshop-poster.jpg` | Video 4489931 — cottonbro studio |
| `images/stock/engine-repair.jpg` | 4116221 — Jose Ricardo Barraza Morachis |
| `images/stock/mechanic-tool.jpg` | 4116224 — Jose Ricardo Barraza Morachis |
| `images/stock/technician-engine.jpg`, `technician-portrait.jpg` | 8986037, 8986046 — Artem Podrez |
| `images/stock/engine-bench.jpg` | 6517339 — Omar Ramadan |
| `images/stock/mechanic-closeup.jpg`, `mechanic-hands.jpg`, `engine-bay.jpg` | 8478223, 8478259, 8478228 — Sergey Meshkov |
| `images/stock/truck-engine.jpg`, `camshaft.jpg`, `engine-part.jpg` | 7564861, 7565157, 7565167 — cottonbro studio |
| `images/stock/garage-car.jpg` | 4489765 — cottonbro studio |
| `images/stock/fleet-van.jpg` | 35831379 — DΛVΞ GΛRCIΛ |
| `images/stock/fleet-van-2.jpg` | 4391469 — Norma Mortenson |
| `images/stock/brake-caliper.jpg` | 14836042 — Amar Preciado |
| `images/stock/wheel-lowlight.jpg` | 19292949 — Luke Miller |
| `images/stock/bmw-wheel.jpg` | 9182360 — Shivam Maurya |
| `images/stock/diagnostics.jpg`, `diagnostics-vw.jpg` | 13065692, 13065689 — Daniel Andraski |
| `images/stock/battery.jpg` | 6473244 — Julia Avamotive |

## 3. Assets still required from Rollings Automotive
1. **Hero film**: a 10–20 s graded clip of the actual shop or a customer classic (16:9, ≥1920px, plus a 9:16 mobile cut). Replace the `hero-*.mp4` files and the poster. The current stock clip is a placeholder for the brand's own footage.
2. **Workshop photography**: technicians, diagnostic equipment and service bays at 242 W Commonwealth Ave. These would replace the stock images in the Philosophy, Workshop and Services sections.
3. **Fleet photography**: any vehicles from a fleet client (with permission).
4. **Higher-resolution originals** of the classic car photos (the website copies are 1440–1920px with heavy compression).
5. **Logo/wordmark** in vector form. The site currently uses a typographic "ROLLINGS" wordmark.
6. **Verified social profiles** (none are linked, because none could be verified).
7. **Current specials pricing.** The source site says specials may be out of date.

Optional transcoding (no ffmpeg in the build sandbox): produce WebM/AV1 renditions and add them as
extra sources in `HeroSection.tsx` (`HERO_SOURCES`).
