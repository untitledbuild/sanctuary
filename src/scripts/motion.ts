/**
 * Client-side motion — the choreography that makes the page feel built, not
 * placed. Everything here is progressive enhancement: the page is fully
 * readable without JS, and reduced-motion users get a static, fully-visible
 * page (the early return below skips all animation).
 *
 * Layers:
 *   • scroll reveals          [data-reveal] (+ -delay / -y)
 *   • z-depth parallax        [data-parallax]   (front = small/negative factor)
 *   • app-dock pop-in         [data-dock] / [data-dock-tile][data-dock-dist]
 *   • sticky-note fly-in      [data-note][data-from][data-rotate]
 *   • cursor Y-pendulum       [data-pendulum]
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const prefersReduced = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;

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

/* ---------------------------------------------------------------- main ---- */
function main(): void {
  gsap.registerPlugin(ScrollTrigger);
  (window as Window & { __motionReady?: boolean }).__motionReady = true;

  // Reduced motion: leave everything visible & static.
  if (prefersReduced) return;

  initReveals();
  initParallax();
  initDock();
  initNotes();
  initPendulum();

  ScrollTrigger.refresh();
}

if (document.readyState !== 'loading') main();
else document.addEventListener('DOMContentLoaded', main);
