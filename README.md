# untitled build — landing page

Marketing landing page for **untitled build**, built as a fully static site so the
output can be dropped onto any CDN (or static host) and served from
`untitledbuild.com`.

- **Framework:** [Astro](https://astro.build) (static output — ships zero JS by default)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) (CSS-first design tokens via `@theme`)
- **Motion:** [GSAP](https://gsap.com) + ScrollTrigger for scroll reveals, [Lenis](https://lenis.darkroom.engineering/) for smooth scroll
- **Fonts:** self-hosted via Fontsource (Roboto Flex, Roboto Mono, Instrument Serif)

---

## Why this stack

- **Astro** — outputs pure static HTML/CSS/JS (zero JS by default), ideal for a
  CDN-served marketing site; mainstream and actively maintained.
- **Animations.** Astro emits standard HTML/CSS/JS, so *any* client library
  works. We use GSAP + ScrollTrigger (the industry standard, now fully free)
  driven by Lenis for smooth scroll. Swapping in Motion, Lottie, etc. later is
  trivial.

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
│   │   ├── Section.astro         # semantic <section> + vertical rhythm (--section-y)
│   │   ├── SectionHeading.astro  # eyebrow + display heading (+ optional lead)
│   │   ├── Eyebrow.astro         # monospace label ("PROCESS", "WHY US?"…)
│   │   ├── Button.astro          # the black "Start a Project" CTA
│   │   ├── Wordmark.astro        # "untitled build" lockup (sans + serif italic)
│   │   ├── Icon.astro            # inline SVG icon set (currentColor-driven)
│   │   ├── BlueprintGrid.astro   # dashed "construction grid" background (SVG pattern)
│   │   └── Reveal.astro          # marks an element for scroll-reveal
│   ├── mockups/              # Faithfully-recreated UI chrome (CSS/SVG, no images)
│   │   ├── PhoneMockup.astro      # mobile-app frame (notch + swipe bar)
│   │   └── BrowserMockup.astro    # web-app frame (dots, address pill, tabs, blocks)
│   └── sections/             # One component per page section
│       ├── Header.astro  Hero.astro  Process.astro  WhyUs.astro
│       ├── Testimonial.astro  SelectedBuilds.astro  FoundersNote.astro
│       └── CallToAction.astro  Footer.astro
├── scripts/
│   └── motion.ts            # Lenis + GSAP/ScrollTrigger init (progressive enhancement)
└── pages/
    └── index.astro          # composes the sections into the page

public/
├── CNAME                    # custom domain (untitledbuild.com) — copied verbatim into dist/
└── favicon.svg
```

### Design tokens (`src/styles/global.css`)

The Figma export named hundreds of one-off colours/sizes. These are consolidated
into a small **semantic** token set inside Tailwind's `@theme`, which generates
the utilities used throughout:

| Group     | Examples                                                            |
| --------- | ------------------------------------------------------------------- |
| Colour    | `bg`, `ink`, `heading`, `body`, `navy`, `surface`, `paper`, `line`… |
| Type      | `text-display`, `text-quote`, `text-eyebrow`, `text-lead`…          |
| Radii     | `rounded-card`, `rounded-browser`, `rounded-block`, `rounded-cta`   |
| Elevation | `shadow-float`                                                      |

Change a brand colour or the type scale **once** here and it propagates
everywhere. Layout rhythm (`--container`, `--container-pad`, `--section-y`) lives
just below in `:root`.

---

## Editing content

All text lives in [`src/data/site.ts`](src/data/site.ts) — hero copy, process
steps, the testimonial, projects, founders' note, CTA, footer. Sections are
presentational and read from this object, so wording changes never touch markup.

**Placeholders awaiting real assets** (clearly marked in the data/components):

- **Selected Builds** — four empty card slots. Add `image`/`title`/`href` to a
  `projects[]` entry in `site.ts` and the card fills in (wrap in `<a>` when a
  `href` exists).
- **Why-Us illustration** — a captioned placeholder; drop artwork into the media
  slot in `WhyUs.astro`.
- **Founders' note body** — placeholder prose; replace with the real message.
- **Logo / favicon** — `Wordmark.astro` renders the wordmark in type; swap
  `public/favicon.svg` for the final mark when available.

---

## Responsive design

The site is **not** pinned to the 1440 Figma canvas. Two mechanisms keep it fluid:

1. **Fluid type** — every heading/label uses `clamp()` (see the `--text-*` tokens)
   so sizes scale smoothly from mobile to desktop.
2. **Mobile-first breakpoints** — grids collapse (`sm:`/`lg:`), the hero's dual
   mockup row stacks, the Why-Us card switches from a right-edge bleed to a
   contained block, and the founders' note eases its rotation on small screens.

Verified at 390px (mobile) and 1440px (desktop).

---

## Motion & accessibility

- Reveals are **progressive enhancement**. A pre-paint inline script adds
  `html.js-motion` only when JS is on *and* motion is allowed; `global.css` hides
  `[data-reveal]` only under that class, and a failsafe un-hides everything if the
  motion bundle never runs — content can't get stuck.
- `prefers-reduced-motion: reduce` disables Lenis and all reveal animation; the
  page renders fully static.
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
