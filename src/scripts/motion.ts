/**
 * Client-side motion — the choreography that makes the page feel built, not
 * placed. Everything here is progressive enhancement: the page is fully
 * readable without JS, and reduced-motion users get a static, fully-visible
 * page (the early return below skips all animation).
 *
 * Layers:
 *   • Lenis smooth scroll, driven by GSAP's ticker + synced to ScrollTrigger
 *   • scroll reveals          [data-reveal] (+ -delay / -y)
 *   • z-depth parallax        [data-parallax]   (front = small/negative factor)
 *   • app-dock pop-in         [data-dock] / [data-dock-tile][data-dock-dist]
 *   • sticky-note fly-in      [data-note][data-from][data-rotate]
 *   • cursor Y-pendulum       [data-pendulum]
 *   • custom cursor (cursor-02) following the pointer, growing over links
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const prefersReduced = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;

/* -------------------------------------------------------------- scroll ---- */
function initSmoothScroll(): void {
  const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  (window as Window & { __lenis?: Lenis }).__lenis = lenis;

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Route in-page anchor links (nav, CTAs, logo, tooltip) through Lenis.
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -24 });
      history.replaceState(null, '', hash);
    });
  });
}

/* ------------------------------------------------------------- reveals ---- */
function initReveals(): void {
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    const y = Number(el.dataset.revealY ?? 24);
    const delay = Number(el.dataset.revealDelay ?? 0);
    gsap.set(el, { y, opacity: 0 });
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      delay,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

/* ------------------------------------------------------------ parallax ---- */
/** Each element drifts ±(factor·range) across its own scroll span. A small or
 *  negative factor reads as "closer" (front of the z-axis), a larger positive
 *  factor as "further back" — that's how the bars sit in front of the notes. */
function initParallax(): void {
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const factor = Number(el.dataset.parallax);
    if (!factor) return;
    const range = 320;
    ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        gsap.set(el, { y: (self.progress - 0.5) * factor * range });
      },
    });
  });
}

/* ------------------------------------------------------------ app dock ---- */
/** Tiles pop in from the edges inward; the centre `ub` tile lands last. */
function initDock(): void {
  const dock = document.querySelector<HTMLElement>('[data-dock]');
  if (!dock) return;
  const tiles = gsap.utils.toArray<HTMLElement>('[data-dock-tile]');
  const maxDist = Math.max(...tiles.map((t) => Number(t.dataset.dockDist ?? 0)));

  gsap.set(tiles, { opacity: 0, scale: 0.4, y: 26 });
  ScrollTrigger.create({
    trigger: dock,
    start: 'top 78%',
    once: true,
    onEnter: () => {
      tiles.forEach((t) => {
        const dist = Number(t.dataset.dockDist ?? 0);
        const order = maxDist - dist; // outermost first, centre (dist 0) last
        gsap.to(t, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.55,
          ease: 'back.out(1.7)',
          delay: order * 0.13,
        });
      });
    },
  });
}

/* --------------------------------------------------------- sticky notes --- */
/** Notes fly in from four offset directions to their resting spot. */
function initNotes(): void {
  const offsets: Record<string, { x: number; y: number }> = {
    'bottom-left': { x: -200, y: 240 },
    bottom: { x: -40, y: 280 },
    'bottom-right': { x: 220, y: 250 },
    right: { x: 280, y: 70 },
  };
  gsap.utils.toArray<HTMLElement>('[data-note]').forEach((note) => {
    const from = note.dataset.from ?? 'bottom';
    const o = offsets[from] ?? { x: 0, y: 220 };
    const section = note.closest('section');
    gsap.fromTo(
      note,
      { x: o.x, y: o.y, rotate: -10, opacity: 0 },
      {
        x: 0,
        y: 0,
        rotate: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 55%', once: true },
      },
    );
  });
}

/* ------------------------------------------------------------ pendulum ---- */
/** Collaborator cursors sway on Y (~30px), each slightly out of phase. */
function initPendulum(): void {
  gsap.utils.toArray<HTMLElement>('[data-pendulum]').forEach((el, i) => {
    gsap.to(el, {
      y: 30,
      duration: 1.6 + i * 0.25,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: i * 0.2,
    });
  });
}

/* ------------------------------------------------------- custom cursor ---- */
function initCursor(): void {
  const cursor = document.getElementById('cursor');
  if (!cursor || !window.matchMedia('(pointer: fine)').matches) return;

  document.documentElement.classList.add('has-custom-cursor');
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.16, ease: 'power3' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.16, ease: 'power3' });

  let shown = false;
  window.addEventListener(
    'pointermove',
    (e) => {
      xTo(e.clientX - 5);
      yTo(e.clientY - 4);
      if (!shown) {
        shown = true;
        gsap.to(cursor, { opacity: 1, duration: 0.2 });
      }
    },
    { passive: true },
  );

  // Grow + soften over interactive targets.
  const grow = (on: boolean) =>
    gsap.to(cursor, { scale: on ? 1.8 : 1, duration: 0.2, ease: 'power2.out' });
  document.querySelectorAll('[data-cursor="link"], a, button').forEach((el) => {
    el.addEventListener('pointerenter', () => grow(true));
    el.addEventListener('pointerleave', () => grow(false));
  });

  document.addEventListener('mouseleave', () =>
    gsap.to(cursor, { opacity: 0, duration: 0.2 }),
  );
  window.addEventListener('blur', () =>
    gsap.to(cursor, { opacity: 0, duration: 0.2 }),
  );
}

/* ---------------------------------------------------------------- main ---- */
function main(): void {
  gsap.registerPlugin(ScrollTrigger);
  (window as Window & { __motionReady?: boolean }).__motionReady = true;

  // Reduced motion: leave everything visible & static.
  if (prefersReduced) return;

  initSmoothScroll();
  initReveals();
  initParallax();
  initDock();
  initNotes();
  initPendulum();
  initCursor();

  ScrollTrigger.refresh();
}

if (document.readyState !== 'loading') main();
else document.addEventListener('DOMContentLoaded', main);
