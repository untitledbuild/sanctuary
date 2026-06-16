/**
 * Site content & configuration.
 *
 * All landing-page copy lives here so the section components stay purely
 * presentational. Editing wording, swapping a testimonial, or adding a
 * project never requires touching markup.
 */

export type IconName =
  | 'search'
  | 'share'
  | 'users'
  | 'dataflow'
  | 'user'
  | 'quote';

export interface NavLink {
  label: string;
  href: string;
}

export interface ProcessStep {
  /** Reserved for a future per-step icon/illustration in the white card. */
  illustration?: string;
  text: string;
}

export interface Feature {
  icon: IconName;
  label: string;
}

export interface Project {
  /** Optional — cards render as clean placeholders until real work is added. */
  title?: string;
  tag?: string;
  image?: string;
  href?: string;
}

const CTA_LABEL = 'Start a Project';
const CTA_HREF = '#start';

// Placeholder portfolio slots (typed so cards can later gain image/title/href).
// Kept as a typed const so `as const` on `site` below doesn't narrow it to `{}`.
const placeholderProjects: Project[] = [{}, {}, {}, {}];

export const site = {
  name: 'untitled build',
  domain: 'untitledbuild.com',
  url: 'https://untitledbuild.com',
  description:
    'We design, build, and ship software for companies that need things done. One team, one process.',

  /** Shared primary call-to-action, reused by header, hero, why-us and CTA. */
  cta: { label: CTA_LABEL, href: CTA_HREF },

  nav: {
    links: [{ label: 'PROJECTS', href: '#projects' }] satisfies NavLink[],
  },

  hero: {
    // \n marks the intended line break in the display heading.
    title: 'You need software.\nWe build it.',
    subtitle:
      'We design, build, and ship software for companies that need things done.',
  },

  process: {
    eyebrow: 'PROCESS',
    title: 'Keep it dead simple.',
    steps: [
      { text: "You tell us what you're trying to solve." },
      { text: 'We figure out the smartest way to build it.' },
      { text: 'We build it. You launch it.' },
      { text: 'Everyone acts like it was obvious.' },
    ] satisfies ProcessStep[],
  },

  whyUs: {
    eyebrow: 'WHY US?',
    title: 'Because software is already hard enough.',
    body: "You shouldn't need five vendors, three freelancers, and seventeen Slack channels to get something built.",
    features: [
      { icon: 'users', label: 'One team.' },
      { icon: 'dataflow', label: 'One process.' },
    ] satisfies Feature[],
    // The Figma card is an illustration placeholder (designer note:
    // "handling different comms channels is overwhelming"). Real artwork drops
    // into <WhyUs />'s media slot later.
    illustrationCaption: 'Illustration',
  },

  testimonial: {
    quote: "Probably the smoothest development project we've ever run.",
    name: 'Tyler Good',
    role: 'CEO & Founder, Ovvy AI Inc',
  },

  selectedBuilds: {
    eyebrow: 'SELECTED BUILDS',
    title: "A few products, platforms, and systems we've helped bring to life.",
    // Four placeholder slots matching the Figma grid; fill in as work ships.
    projects: placeholderProjects,
  },

  foundersNote: {
    heading: "Founders' note",
    // Placeholder body — swap for the real founders' message.
    body: [
      'We started untitled build for a simple reason: getting good software made should not feel like running a small war.',
      'No vendor merry-go-round. No telephone game across seventeen channels. One team that owns the problem with you, from the first conversation to the thing in production.',
    ],
    signature: 'The untitled build team',
  },

  callToAction: {
    title: 'Got an idea?',
    body: "Good. Most successful companies started with one. Let's build yours.",
  },

  footer: {
    // Rendered as the oversized wordmark; meta row underneath.
    copyright: `© ${'2026'} untitled build. All rights reserved.`,
  },
} as const;

export type Site = typeof site;
