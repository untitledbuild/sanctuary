# untitled build — landing page

Marketing landing page for **untitled build**, built as a fully static site so the
output can be dropped onto any CDN (or static host) and served from
`untitledbuild.com`.

- **Framework:** [Astro](https://astro.build) (static output — ships zero JS by default)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) (CSS-first design tokens via `@theme`)
- **Motion:** [GSAP](https://gsap.com) + ScrollTrigger for scroll reveals; CSS transitions for hover/tilt
- **Fonts:** self-hosted via Fontsource (Roboto Flex, Roboto Mono, Instrument Serif)

---

## Why this stack

- **Astro** — outputs pure static HTML/CSS/JS (zero JS by default), ideal for a
  CDN-served marketing site; mainstream and actively maintained.
- **Animations.** Astro emits standard HTML/CSS/JS, so *any* client library
  works. We use GSAP + ScrollTrigger (the industry standard, now fully free) for
  scroll-driven motion. Hover-driven motion (the card tilt, the People flip) is
  plain CSS so it runs on the compositor and survives a JS failure.

Tailwind v4 was chosen because its `@theme` block lets us declare the design
tokens **once** (colours, fluid type scale, radii, shadows) and reuse them
everywhere — no per-element colour/class naming — while giving best-in-class
responsive ergonomics.

---

## Getting started

**Prerequisites:** Node `>=20.3` (see `.nvmrc`).

```bash
npm install        # install dependencies
npm run dev        # dev server with HMR  → http://localhost:4321
npm run build      # static production build → ./dist
npm run preview    # serve the built ./dist locally to sanity-check
npm run check      # type-check .astro/.ts (astro check)
```

The build output in `dist/` is **fully static** — `index.html`, hashed
CSS/JS, self-hosted font files, `sitemap.xml`, and `favicon.svg`. Nothing
needs a server at runtime.

---

## Project structure

```
src/
├── data/
│   └── site.ts              # ALL copy/content (typed). Sections render from here.
├── styles/
│   └── global.css           # Design tokens (@theme) + base layer. Single source of truth.
├── layouts/
│   └── BaseLayout.astro      # <html>/<head>, SEO/OG meta, fonts, motion bootstrap, slot
├── components/
│   ├── primitives/           # Reusable atoms — reused by every section
│   │   ├── Container.astro       # centred max-width column (--container)
│   │   ├── Button.astro  Badge.astro  Avatar.astro  Tooltip.astro
│   │   ├── Wordmark.astro        # "untitled build" lockup (sans + serif italic)
│   │   ├── Icon.astro            # inline SVG icon set (names in icon-names.ts)
│   │   ├── BrandIcon.astro       # brand/product logos
│   │   ├── BlueprintGrid.astro   # dashed "construction grid" background
│   │   ├── HatchBand.astro       # 45° hatch ribbon between bands
│   │   ├── CapabilityMockup.astro# the 4 hand-built "what we build" UI mockups
│   │   └── StickyNote.astro  CollabCursor.astro  GridField.astro
│   └── sections/             # One component per page band
│       ├── Header.astro  Hero.astro  Testimonial.astro  Footer.astro
│       ├── Showcase.astro  Manifesto.astro  WhatWeBuild.astro   # home
│       ├── People.astro  Story.astro
│       ├── HowWeWork.astro  FoundersNote.astro                  # about
│       ├── Openings.astro  ApplyDialog.astro                    # careers
│       └── AppDock.astro  Whiteboard.astro  TechLogos.astro     # kept, not composed
│           Work.astro  CallToAction.astro  ContactForm.astro
├── scripts/
│   ├── motion.ts            # GSAP/ScrollTrigger init (progressive enhancement)
│   ├── form.ts              # Supabase contact-form POST
│   └── apply.ts             # careers apply dialog + résumé upload
└── pages/
    ├── index.astro          # home
    ├── about.astro          # /about
    └── careers.astro        # /careers

public/
├── CNAME                    # custom domain (untitledbuild.com) — copied verbatim into dist/
└── favicon.svg
```

### Design tokens (`src/styles/global.css`)

The Figma export named hundreds of one-off colours/sizes. These are consolidated
into a small **semantic** token set inside Tailwind's `@theme`, which generates
the utilities used throughout:

| Group     | Examples                                                                  |
| --------- | ------------------------------------------------------------------------- |
| Colour    | `bg`, `ink`, `heading`, `body`, `navy`, `card`, `surface`, `plate`, `portrait`, `line`… |
| Type      | `text-hero`, `text-h2`, `text-quote`, `text-project`, `text-lead`, `text-nav` |
| Radii     | `rounded-tile`, `rounded-card`, `rounded-field`, `rounded-control`, `rounded-badge` |
| Elevation | `shadow-tile`, `shadow-tile-hero`, `shadow-tooltip`, `shadow-control`     |

Change a brand colour or the type scale **once** here and it propagates
everywhere. Layout rhythm (`--container`, `--container-pad`, `--section-y`) lives
just below in `:root`.

---

## Editing content

All text lives in [`src/data/site.ts`](src/data/site.ts) — hero copy for both
pages, the testimonial, showcase, capabilities, team, Our Story, the founder's
note, footer. Sections are presentational and read from this object, so wording
changes never touch markup.

**Placeholders awaiting real assets** (clearly marked in the data/components):

- **Showcase** — the three product frames render a "UI MOCKUP" panel until
  `image` is set on a `showcase.items[]` entry in `site.ts`.
- **Team portraits** — inconsistent backgrounds. Only `runanka.png` and
  `programmer.png` have alpha, so the pink `--color-portrait` disc shows through
  for those two; `bipratip.png` is yellow and `tyler.png` / `joud.JPG` carry
  photographic backgrounds. Needs a background-removal pass.
- **`Collaborate` CTA** — points at `#collaborate`, which nothing defines yet.
- **Careers applications** — the apply dialog needs the `job_applications` table
  and the private `resumes` bucket from `infra/supabase/schema.sql`, plus
  `PUBLIC_SUPABASE_*`. Until then it fails gracefully toward the mailto: link.
  The submit path is written against the documented REST/Storage endpoints but
  has not been run against a live project.
- **Logo / favicon** — `Wordmark.astro` renders the wordmark in type; swap
  `public/favicon.svg` for the final mark when available.

---

## Responsive design

The site is **not** pinned to the 1440 Figma canvas. Two mechanisms keep it fluid:

1. **Fluid type** — every heading/label uses `clamp()` (see the `--text-*` tokens)
   so sizes scale smoothly from mobile to desktop.
2. **Mobile-first breakpoints** — grids collapse (`sm:`/`lg:`): the People and
   capability grids drop to one column, the showcase strip stacks, the blueprint
   frames hide, and the hero's desktop-only line break is released.

Verified with zero horizontal overflow at 500px, 768px, 1024px and 1440px.

---

## Motion & accessibility

- Reveals are **progressive enhancement**. A pre-paint inline script adds
  `html.js-motion` only when JS is on *and* motion is allowed; `global.css` hides
  `[data-reveal]` only under that class, and a failsafe un-hides everything if the
  motion bundle never runs — content can't get stuck.
- `prefers-reduced-motion: reduce` disables all reveal animation and the card
  tilt; the page renders fully static.
- Hover-driven motion is gated on `(hover: hover) and (pointer: fine)`. On touch
  the People cards stack both faces instead of flipping, so nothing is
  hover-only content.
- Semantic landmarks (`header`/`main`/`footer`/`nav`), a single `h1`, labelled
  nav, decorative SVGs/mockups marked `aria-hidden`, visible focus rings.

---

## Deployment (static → GitHub Pages / CDN)

`npm run build` produces a self-contained `dist/`. It can go on any static host;
this repo ships with automated GitHub Pages deployment.

- **GitHub Pages (automated).** [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
  runs on every push to `main`: it builds with Astro and publishes `dist/`. Enable
  it once under **Settings → Pages → Source: GitHub Actions**.
- **Custom domain.** `public/CNAME` carries `untitledbuild.com` into every build.
  Set the same domain in **Settings → Pages** and point DNS at GitHub Pages
  (apex `A`/`AAAA` records, `www` `CNAME`), then enable *Enforce HTTPS*.
- **Base path.** Asset URLs are decided at build time by `base` in `astro.config.mjs`,
  which must match the serve path: **none** for a root custom domain (current
  config), or `base: '/<repo>/'` (and remove `CNAME`) when serving from
  `<org>.github.io/<repo>/`.
- `site` in `astro.config.mjs` (`https://untitledbuild.com`) drives canonical URLs
  and the generated sitemap — update it if the origin changes.
- **Other hosts** (Cloudflare Pages, Netlify, S3+CloudFront…): point them at the repo
  with build command `npm run build` and output dir `dist/`, or upload `dist/`
  directly; configure the domain in that provider.

### Performance notes

- Zero render-blocking app JS; the only client bundle is the motion layer
  (~50 KB gzipped, deferred).
- Fonts are self-hosted with `unicode-range` subsets, so a latin visitor only
  downloads latin woff2 files. The non-latin subsets in `dist/` are never
  fetched by them; trim the Fontsource imports in `global.css` if you want them
  gone from the bundle entirely.
