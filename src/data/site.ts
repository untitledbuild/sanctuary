/**
 * Site content & configuration.
 *
 * All landing-page copy lives here so section components stay purely
 * presentational. Editing wording, swapping a testimonial, adding a project, or
 * dropping in real team photos/links never requires touching markup.
 */

/* ---------------------------------------------------------------- types ---- */

export interface NavLink {
  label: string;
  href: string;
}

/** A tile in the "Us" app-dock. `brand` selects an inline SVG in BrandIcon. */
export interface AppTile {
  brand: BrandName;
  label: string;
  /** Relative tile size — the middle (ub) tile is the largest, edges smallest. */
  size: 'sm' | 'md' | 'lg' | 'xl';
}

export type BrandName =
  | 'spotify' | 'chrome' | 'gitlab' | 'notion' | 'ub'
  | 'figma' | 'vscode' | 'datagrip' | 'confluence' | 'github';

/** A FigJam sticky note in the "What" whiteboard. */
export interface StickyNote {
  color: 'blue' | 'green' | 'yellow' | 'gray';
  badge?: string;        /* small label above the body (e.g. "Discovery")     */
  title?: string;        /* handwritten heading                               */
  /** For the gray "Project kickoff" checklist note. */
  checklist?: string[];
  /** Resting position as % of the board (so it scales). */
  x: number;
  y: number;
  rotate: number;
  /** Direction the note flies in from on scroll. */
  from: 'bottom-left' | 'bottom' | 'bottom-right' | 'right';
}

/** A collaborator cursor floating over the whiteboard. */
export interface Collaborator {
  name: string;
  color: 'pink' | 'cyan' | 'lime' | 'orange';
  x: number;
  y: number;
}

export interface TeamMember {
  name: string;          /* "FULL NAME" placeholder until real names land     */
  title: string;
  /** Avatar image URL (random placeholder for now) or undefined → grey block. */
  image?: string;
  linkedin?: string;
}

export interface Tech {
  brand: TechName;
  label: string;
}

export type TechName =
  | 'react' | 'nextjs' | 'typescript' | 'node'
  | 'tailwind' | 'postgresql' | 'aws' | 'stripe';

export interface Project {
  title: string;
  description: string;
  /** Tag pills, each coloured from the badge palette. */
  tags: { label: string; tone: BadgeTone }[];
  image?: string;        /* UI mockup screenshot; undefined → "UI MOCKUP"     */
  href?: string;
}

export type BadgeTone = 'brand' | 'orange' | 'pink' | 'green' | 'gray';

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  rating: number;
  avatar?: string;
}

/* ---------------------------------------------------------------- copy ----- */

const CTA = { label: 'SEND MESSAGE', href: '#start' };

export const site = {
  name: 'untitled build',
  domain: 'untitledbuild.com',
  url: 'https://untitledbuild.com',
  description:
    'Fast, scalable software built by senior designers and developers. ' +
    'One team, one process — from whiteboard to production.',

  /** Shared primary call-to-action (header, hero, app-dock, CTA band). */
  cta: CTA,

  nav: {
    links: [
      { label: 'Us', href: '#us' },
      { label: 'What', href: '#what' },
      { label: 'People', href: '#people' },
      { label: 'Work', href: '#work' },
    ] satisfies NavLink[],
  },

  /* 1 — Hero ------------------------------------------------------------- */
  hero: {
    title: 'You need software.\nWe build it.',
    subtitle:
      'Fast, scalable software built by senior designers and developers.',
    form: {
      fields: {
        name: 'FULL NAME',
        email: 'EMAIL',
        projectType: 'PROJECT TYPE',
        message: 'MESSAGE',
      },
      projectTypes: [
        'Web app',
        'Mobile app',
        'AI / ML product',
        'Internal tool',
        'Design only',
        'Not sure yet',
      ],
      submit: 'SEND MESSAGE',
      success: "Got it — we'll be in touch within one business day.",
      error: 'Something went wrong. Please email us at hello@untitledbuild.com.',
    },
  },

  /* Testimonial (sits under the hero) ----------------------------------- */
  testimonial: {
    quote: "Probably the smoothest development project we've ever run.",
    author: 'Tyler Good',
    role: 'CEO & Founder, Ovvy AI Inc',
    rating: 5,
    avatar: '/testimonials/tyler-good.png',
  } satisfies Testimonial,

  /* 2 — Us (app-icon dock) ---------------------------------------------- */
  us: {
    tooltip: 'Send Message',
    /* Order matches the Figma dock, smallest at the edges growing to the
       centre `ub` tile. The scroll choreography (edges → in → centre) is keyed
       off DOM order in motion.ts. */
    tiles: [
      { brand: 'spotify', label: 'Spotify', size: 'sm' },
      { brand: 'chrome', label: 'Chrome', size: 'sm' },
      { brand: 'gitlab', label: 'GitLab', size: 'md' },
      { brand: 'notion', label: 'Notion', size: 'lg' },
      { brand: 'ub', label: 'untitled build', size: 'xl' },
      { brand: 'figma', label: 'Figma', size: 'lg' },
      { brand: 'vscode', label: 'VS Code', size: 'md' },
      { brand: 'datagrip', label: 'DataGrip', size: 'sm' },
      { brand: 'confluence', label: 'Confluence', size: 'sm' },
    ] satisfies AppTile[],
  },

  /* 3 — What (whiteboard) ----------------------------------------------- */
  what: {
    title: 'Because software is already hard enough.',
    subtitle:
      "You shouldn't need five vendors, three freelancers, and seventeen " +
      'Slack channels to get something built.',
    features: [
      { icon: 'users', label: 'One team.' },
      { icon: 'dataflow', label: 'One process.' },
    ],
    boardName: 'Project planning board',
    /* Positions are % of the board canvas; notes deliberately overlap for
       depth (yellow behind gray, gray over green) and fly in on scroll. */
    notes: [
      {
        color: 'blue', badge: 'Discovery', title: 'Market & competitor research',
        x: 16, y: 50, rotate: -3, from: 'bottom-left',
      },
      {
        color: 'yellow', badge: 'Build', title: 'CMS Integration',
        x: 39, y: 64, rotate: 2, from: 'bottom',
      },
      {
        color: 'green', badge: 'Launch', title: 'Deploy to production',
        x: 66, y: 62, rotate: -2, from: 'bottom-right',
      },
      {
        color: 'gray', title: 'Project kickoff',
        checklist: ['Align on goals', 'Define success metrics', 'Finalize scope'],
        x: 54, y: 40, rotate: 1, from: 'right',
      },
    ] satisfies StickyNote[],
    collaborators: [
      { name: 'Furkan', color: 'pink', x: 10, y: 49 },
      { name: 'Runanka', color: 'cyan', x: 37, y: 60 },
      { name: 'Adil', color: 'orange', x: 84, y: 40 },
      { name: 'Bipratip', color: 'lime', x: 60, y: 84 },
    ] satisfies Collaborator[],
  },

  /* 4 — People ----------------------------------------------------------- */
  people: {
    title: 'The People Behind The Builds',
    subtitle:
      'We think like product owners, design like users, and build like engineers.',
    /* 5 placeholder cards — swap name/title/image/linkedin when real data
       lands. Random avatars keep the layout honest meanwhile. */
    members: [
      { name: 'Adil Bin Bhutto', title: 'Cloud & Security', image: '/team/adil.png', linkedin: '#' },
      { name: 'Furkan Vijapura', title: 'Mobile Lead', image: '/team/furkan.png', linkedin: '#' },
      { name: 'Runanka Roy', title: 'Full Stack Developer', image: '/team/runanka.png', linkedin: '#' },
      //{ name: 'FULL NAME', title: 'TITLE', image: 'https://i.pravatar.cc/300?img=47', linkedin: '#' },
      { name: 'Bipratip Biswas', title: 'Product Design', image: '/team/bipratip.png', linkedin: '#' },
    ] satisfies TeamMember[],
  },

  /* 5 — Tech logos ------------------------------------------------------- */
  tech: {
    title: "Engineering with today's most trusted technologies.",
    stack: [
      { brand: 'react', label: 'React' },
      { brand: 'nextjs', label: 'Next.js' },
      { brand: 'typescript', label: 'TypeScript' },
      { brand: 'node', label: 'Node.js' },
      { brand: 'tailwind', label: 'Tailwind' },
      { brand: 'postgresql', label: 'PostgreSQL' },
      { brand: 'aws', label: 'AWS' },
      { brand: 'stripe', label: 'Stripe' },
    ] satisfies Tech[],
  },

  /* 6 — Work (from whiteboard to production) ----------------------------- */
  work: {
    title: 'From whiteboard to production.',
    subtitle: 'Turning ideas into products people use.',
    projects: [
      {
        title: 'Ovvy',
        description: 'AI-powered real estate photo editing platform.',
        tags: [
          { label: 'React', tone: 'brand' },
          { label: 'PostgreSQL', tone: 'orange' },
          { label: 'AWS', tone: 'pink' },
          { label: 'Stripe', tone: 'green' },
        ],
      },
      {
        title: 'AI Sales Platform',
        description: 'Helping B2B teams automate lead qualification with AI.',
        tags: [
          { label: 'Next.js', tone: 'brand' },
          { label: 'TypeScript', tone: 'pink' },
          { label: 'OpenAI', tone: 'green' },
          { label: 'Supabase', tone: 'orange' },
        ],
      },
    ] satisfies Project[],
    /* The GitHub "push successful" activity card. */
    commit: {
      repo: 'untitled-build/website',
      author: 'runanka',
      branch: 'main',
      status: 'Push successful',
      time: '1m ago',
      commits: 26,
      files: 14,
      additions: 321,
      deletions: 45,
    },
  },

  /* 7 — Call to action --------------------------------------------------- */
  closing: {
    title: 'Got an idea?',
    subtitle: "Good. Most successful companies started with one. Let's build yours.",
  },

  /* ---- Integrations ---------------------------------------------------- */
  /** Contact email used as a graceful fallback if the form endpoint is down. */
  contactEmail: 'hello@untitledbuild.com',
} as const;

export type Site = typeof site;
