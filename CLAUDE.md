# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Keep changes consistent with the conventions below.

## What this is

The **untitled build** marketing landing page — a single-page, fully **static** site
(no runtime server) built from a Figma design and deployed to GitHub Pages /
any CDN at `untitledbuild.com`.

- **Astro** (static output) · **Tailwind CSS v4** (CSS-first tokens) · **GSAP + ScrollTrigger** + **Lenis** (motion) · self-hosted Fontsource fonts.

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
- **Primitives** (`src/components/primitives/`) — reused atoms: `Container`,
  `Section`, `SectionHeading`, `Eyebrow`, `Button`, `Wordmark`, `Icon`,
  `BlueprintGrid`, `Reveal`.
- **Mockups** (`src/components/mockups/`) — `PhoneMockup`, `BrowserMockup`. Pure
  CSS/SVG chrome; internals sized in `cqw` (container-query units) so they scale.
- **Sections** (`src/components/sections/`) — one component per page band; composed in
  [`src/pages/index.astro`](src/pages/index.astro) inside [`BaseLayout.astro`](src/layouts/BaseLayout.astro).
- **Motion** → [`src/scripts/motion.ts`](src/scripts/motion.ts) (loaded once in BaseLayout).

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
- Known placeholders pending real assets: Selected Builds cards, Why-Us illustration,
  Founders' note body, logo/favicon — all swappable via `site.ts` / asset slots.
