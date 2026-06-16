/**
 * Client-side motion: Lenis smooth scroll + GSAP/ScrollTrigger scroll reveals.
 *
 * Progressive enhancement — the page is fully readable without this script.
 * Elements marked `data-reveal` are hidden pre-paint by global.css (only when
 * `html.js-motion` is set, i.e. JS on + motion allowed) and revealed here.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const prefersReduced = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;

/** Lenis smooth scroll, driven by GSAP's ticker and synced to ScrollTrigger. */
function initSmoothScroll(): void {
  const lenis = new Lenis({ duration: 1.1, smoothWheel: true });

  // Expose for debugging / programmatic scrolling (harmless in production).
  (window as Window & { __lenis?: Lenis }).__lenis = lenis;

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Route in-page anchor links (nav, CTAs, logo) through Lenis.
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target);
      history.replaceState(null, '', hash);
    });
  });
}

/** Fade/slide elements in as they enter the viewport, gently staggered. */
function initReveals(): void {
  const els = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  els.forEach((el) => {
    gsap.set(el, { y: Number(el.dataset.revealY ?? 24), opacity: 0 });
  });

  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
        overwrite: true,
      }),
  });

  ScrollTrigger.refresh();
}

function main(): void {
  gsap.registerPlugin(ScrollTrigger);

  // Tell the pre-paint failsafe (see BaseLayout) that motion took over.
  (window as Window & { __motionReady?: boolean }).__motionReady = true;

  // Reduced motion: leave content as-is (already visible) — no animation.
  if (prefersReduced) return;

  initSmoothScroll();
  initReveals();
}

if (document.readyState !== 'loading') main();
else document.addEventListener('DOMContentLoaded', main);
