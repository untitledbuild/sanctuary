// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// The site is fully static (Astro's default output). `astro build` emits a
// self-contained `dist/` of HTML/CSS/JS that can be uploaded to any CDN or
// static host. `site` is used for canonical URLs and the generated sitemap.
export default defineConfig({
  site: 'https://untitledbuild.com',
  integrations: [sitemap()],
  vite: {
    // Cast works around a Vite type-version skew between @tailwindcss/vite and
    // the Vite bundled with Astro; the plugin itself is correct at runtime.
    plugins: [/** @type {any} */ (tailwindcss())],
  },
  build: {
    // Inline tiny stylesheets to cut requests; larger assets stay hashed files.
    inlineStylesheets: 'auto',
  },
});
