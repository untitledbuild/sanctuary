# CLAUDE.md

Guidance for working in this repo. Keep changes consistent with the conventions below.

## What this is

The **untitled build** marketing site (home, /about, /careers) — a fully **static** site
(no runtime server) built from a Figma design and deployed to GitHub Pages /
any CDN at `untitledbuild.com`.

- **Astro** (static output) · **Tailwind CSS v4** (CSS-first tokens) · **GSAP + ScrollTrigger** (motion) · self-hosted Fontsource fonts.
- **Forms → Supabase** (contact, and careers applications), direct from the
  browser with the PUBLIC anon key, secured by INSERT-only RLS policies. No
  server; the site stays fully static.
  Setup + schema in [`infra/supabase/`](infra/supabase/).

## Commands

```bash
npm run dev       # dev server + HMR → http://localhost:4321
npm run build     # static build → ./dist
npm run preview   # serve ./dist locally
npm run check      # astro check (type-check .astro/.ts) — keep this clean (0 errors)
```

Always run `npm run check` and `npm run build` before considering a change done.

## Architecture & where things go

- **Content/copy** → [`src/data/site.ts`](src/data/site.ts) (typed). Sections are
  presentational and render from it. **Add/edit copy here, not in markup.**
- **Design tokens** → [`src/styles/global.css`](src/styles/global.css) `@theme` block:
  colors, fluid type scale (`--text-*` via `clamp()`), radii, shadows. Layout
  rhythm (`--container`, `--container-pad`, `--section-y`) is in `:root` below it.
- **Primitives** (`src/components/primitives/`) — reused atoms: `Container`
  (width variants: `spine`/`grid`/`container`/`wide`), `Button`, `Badge`,
  `Avatar`, `Tooltip`, `Wordmark`, `Icon` (UI line icons; names in
  `icon-names.ts`), `BrandIcon` (logos), `BlueprintGrid`, `StickyNote`,
  `CollabCursor`, `HatchBand` (diagonal section separator), `CapabilityMockup`
  (the four hand-built UI mockups in the "_what we build" cards).
  Scroll-reveal is a plain `data-reveal` attribute (no wrapper).
- **Dashed-line utilities** live in `global.css`: `.dashed-h` / `.dashed-v` for
  single rules, `.dashed-box` for all four sides of one element, `.hatch` for the
  45° ribbon. Use these rather than `border-dashed`, which renders browser dashes
  that don't match the Figma rhythm.
- **Sections** (`src/components/sections/`) — one component per page band.
  - **Home** ([`src/pages/index.astro`](src/pages/index.astro)): `Header`, `Hero`,
    `Testimonial`, `Showcase`, `Manifesto`, `WhatWeBuild`, `People`, `Story`, `Footer`.
  - **About** ([`src/pages/about.astro`](src/pages/about.astro)): `Header`, `Hero`
    (about copy), `Story`, `HowWeWork`, `People`, `FoundersNote`, `Footer`.
  - **Careers** ([`src/pages/careers.astro`](src/pages/careers.astro)): `Header`,
    `Hero` (careers copy), then the bands in
    `src/components/sections/careers/` — `CareersNav`, `CareersIntro`,
    `LookFor`, `Teams`, `WorkingModels`, `RemoteCulture`, `HowWeBuild`,
    `ExperienceLevels`, `CandidateSignals`, `CareersCta` — plus `Footer` and
    `ApplyDialog`. They live in their own folder because the page has ten of
    them and only this page uses them.
  - All three compose inside [`BaseLayout.astro`](src/layouts/BaseLayout.astro),
    with `HatchBand` between bands.
  - **Kept but no longer composed:** `AppDock`, `Whiteboard`, `TechLogos`, `Work`,
    `CallToAction`, `ContactForm`. They still type-check and still read their
    `site.ts` data — don't delete that data. The Supabase-wired `ContactForm` is
    the one to reinstate if the page needs a lead-gen path again.
- **`Hero` is shared** by all three pages. Pass `content` (a `HeroContent`) to override
  the default home copy. Its headline is an array of `HeadlineRun`s — each run
  optionally `box`ed (the dashed Figma-selection rectangle) with a `chip`, and
  optionally `break`ing the line above `sm`. `width` widens the column when a
  longer headline needs it (boxed runs can't break mid-phrase); `subtitle` and
  `secondaryCta` are both optional.
- **Motion** → [`src/scripts/motion.ts`](src/scripts/motion.ts):
  `data-reveal` reveals, `data-parallax` z-depth (front layers use a
  small/negative factor), the app-dock pop-in (`data-dock-dist`), sticky-note
  fly-in (`data-from`), collaborator-cursor `data-pendulum` sway, and
  `data-tilt` pointer-tracking card tilt (value = max degrees).
- **`data-tilt` is CSS-driven on purpose.** `motion.ts` only writes
  `--tilt-x/y/scale`; the easing is a CSS transition in `global.css`, so it runs
  on the compositor and its target values stay synchronously readable (which is
  what makes it testable — GSAP tweens can't be observed in a headless run).
  **Never put `data-tilt` and `data-reveal` on the same element** — the reveal
  tween writes an inline `transform` that silently overrides the tilt's. Put
  `data-reveal` on a wrapper instead (see `Story`/`FoundersNote`).
- **Forms** → [`src/scripts/form.ts`](src/scripts/form.ts) (contact) and
  [`src/scripts/apply.ts`](src/scripts/apply.ts) (careers) post to Supabase
  (config via `PUBLIC_SUPABASE_*` → `<meta>` in BaseLayout). Both no-op toward a
  mailto: fallback when unconfigured rather than faking success. `apply.ts`
  uploads the résumé to a **private** `resumes` Storage bucket first, then
  records the object key on the row — so a failed upload never files an
  application with no CV. Both scripts end in `export {}`: without a top-level
  import/export TS treats them as global scripts and their declarations collide.
- **Careers content is team-shaped.** `site.careers.openings.teams[]` holds the
  roles; tech badges sit on the *team*, not the role, because a team spans more
  technologies than any one role uses (the page says as much). `ApplyDialog`
  flattens every team's roles into its position select, behind an "introducing
  myself" option — a `[data-apply-open]` trigger with no `data-position` resets
  to that rather than inheriting the last role. Role detail is a native
  `<details>`, so it opens with JS off.
- **Keep the careers list honest to headcount.** The studio is ~30 people, so
  the page carries 5 teams and 8 roles, and says outright that anything not
  listed isn't open. If you add roles, add them because they're real — a list
  longer than the team is the fastest way to make the page read as fake. The
  sub-nav anchors point at `#team-NN`, so renumbering teams means updating
  `careers.nav` too.
- **The apply modal is a native `<dialog>`** — `showModal()` gives focus
  trapping, Esc-to-close, background inertness and `::backdrop` for free. It
  needs `m-auto`, because Tailwind's preflight zeroes the UA `margin: auto` a
  dialog relies on to centre itself.
- **The "What" whiteboard** is a proportional CSS **container** (`cqw` sizes + `%`
  positions, widened to ~1430px to mirror the Figma): the whole scene scales as
  one locked unit on desktop, and falls back to a plain note stack under `md`.

## Conventions (please follow)

- **Reuse tokens — don't introduce one-off colors/sizes.** Add a semantic token to
  `@theme` and use it everywhere. One-off arbitrary values (`text-[…]`) are only OK
  for a value used in a single component.
- **Responsive by construction:** fluid `clamp()` type + mobile-first breakpoints
  (`sm:`/`lg:`). Don't hard-code the 1440 canvas. Verify at ~390px and ~1440px.
- **Motion is progressive enhancement.** Elements marked `data-reveal` are hidden
  pre-paint only under `html.js-motion` (set in BaseLayout) and revealed by
  `motion.ts`; a failsafe + `prefers-reduced-motion` guard keep content visible
  without JS / with reduced motion. Don't hide content in a way that depends on JS.
- **Accessibility:** one `<h1>` (hero), section `<h2>`s, decorative SVGs/mockups
  `aria-hidden`, keep visible focus styles.
- Token naming: a `--text-*` size and a `--color-*` of the same name collide (both
  emit `text-<name>`). Keep size/color token names distinct (e.g. `--color-link`,
  not `--color-nav`, since `--text-nav` exists).

## Deployment & the base-path gotcha

`npm run build` → self-contained `dist/` (HTML, hashed assets, fonts, `sitemap.xml`,
`CNAME`). Pushed to `main`, [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
builds and publishes to GitHub Pages.

**Asset URLs are decided at build time by `astro.config.mjs` `base` and must match the
serve path:**

- Custom domain at root (`untitledbuild.com`) → **no `base`** (current config) + keep `public/CNAME`.
- Project subpath (`org.github.io/<repo>/`) → set `base: '/<repo>/'` **and** remove
  `public/CNAME`. Forgetting `base` is why a subpath deploy renders unstyled (assets
  404 at `/_astro/…`).

`site` in `astro.config.mjs` should point at the canonical origin (used for sitemap/canonical).

## Notes

- A small dark pill at bottom-center in dev is Astro's dev toolbar (dev-only, not in `dist/`).
- Known placeholders pending real assets, all swappable via `site.ts`:
  - **Showcase**: the three product frames render a "UI MOCKUP" panel until
    `image` is set on the `showcase.items[]` entry.
  - **Team portraits are inconsistent** and need a background pass: only
    `runanka.png` and `programmer.png` have alpha, so the `--color-portrait` pink
    disc shows through for those two. `adil.png` has pink baked in (matches by
    luck), `bipratip.png` is yellow, and `tyler.png` / `joud.JPG` carry full
    photographic backgrounds.
  - **`Collaborate` CTA** points at `#collaborate`, which nothing defines on
    either page yet.
  - **Supabase**: form no-ops gracefully until `PUBLIC_SUPABASE_*` are configured
    (only relevant if `ContactForm` is composed back in).
  - **Brand logos** (`BrandIcon.astro`) are hand-built; refine against Figma exports if needed.
- **Figma MCP access:** the connected Figma account can't open the v2 design file,
  so v2 work has been built from screenshots rather than pulled node-by-node.
