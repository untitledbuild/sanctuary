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
  | 'figma' | 'vscode' | 'datagrip' | 'confluence' | 'github'
  | 'apple' | 'jira' | 'adobe' | 'openai';

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
  bio: string;
  /** Avatar image URL, or undefined → generic programmer illustration. */
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
  /** Line under the author name (e.g. "CEO & Founder, Ovvy AI Inc"). */
  role?: string;
  authorHref?: string;
  rating: number;
  avatar?: string;
}

/** A product shot in the showcase band under the testimonial. */
export interface ShowcaseItem {
  label: string;
  /** Screenshot path; undefined → styled placeholder frame. */
  image?: string;
  /** Frame proportion — the centre tile is the wide one. */
  shape: 'phone' | 'wide';
  /** Optional tint behind the mockup (Figma uses a yellow centre tile). */
  tint?: 'plain' | 'yellow' | 'pink';
}

/**
 * One run of a hero headline. `box` draws the dashed Figma "selection"
 * rectangle; `chip` hangs the layer-name / tag label off that box.
 */
export interface HeadlineRun {
  text: string;
  box?: boolean;
  chip?: 'label' | 'tag';
  /** Start a new line before this run — only above `sm`, so narrow screens
   *  still wrap naturally instead of inheriting the desktop break. */
  break?: boolean;
}

/** Everything a hero band needs — shared by the home and about pages. */
export interface HeroContent {
  headline: HeadlineRun[];
  /** Optional — the careers hero goes straight from headline to CTA. */
  subtitle?: string;
  layerLabel: string;
  techTag: string;
  cta: NavLink & { label: string };
  /** Optional second, quieter action beside the primary one. */
  secondaryCta?: NavLink & { label: string };
  /** Headline column width. Boxed runs can't break mid-phrase, so a longer
   *  headline needs a wider column to land on the intended lines. */
  width?: string;
}

/** One role inside a division. */
export interface Role {
  title: string;
  level: string;
  focus: string;
  /** Bullet list rendered under "You will" in the role detail. */
  responsibilities: string[];
}

/**
 * A technology division in the careers list. Divisions group roles; the tech
 * badges belong to the division, since a division spans more technologies than
 * any single role uses.
 */
export interface Division {
  index: string;
  title: string;
  summary: string;
  tech: string[];
  roles: Role[];
}

/** A labelled item used by the "look for" / models / culture card rows. */
export interface Trait {
  title: string;
  body: string;
}

/** A numbered step in the "How We Build" band. */
export interface BuildStep {
  index: string;
  title: string;
  body: string;
}

/** A card in the about page's "_how we work" row. */
export interface Principle {
  title: string;
  icon: 'scale' | 'droplet' | 'browser';
}

/** A capability card in the "_what we build" grid. */
export interface Capability {
  title: string;
  description: string;
  /** Selects the hand-built mockup drawn in CapabilityMockup.astro. */
  mockup: 'design' | 'engineering' | 'ai' | 'platform';
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
      { label: '_works', href: '/#works' },
      { label: '_careers', href: '/careers' },
      { label: '_about', href: '/about' },
    ] satisfies NavLink[],
  },

  /* 1 — Hero ------------------------------------------------------------- */
  hero: {
    /* Drawn as runs so the dashed "selection" boxes (a Figma-canvas motif) can
       bracket individual phrases. */
    headline: [
      { text: 'We build', box: true, chip: 'label' },
      { text: 'products that move' },
      { text: 'businesses forward.', box: true, chip: 'tag' },
    ] satisfies HeadlineRun[],
    /** Layer-name chip above the first selection box. */
    layerLabel: 'Header_h1',
    /** Chip hanging off the second selection box. */
    techTag: 'Something techy',
    cta: { label: 'Collaborate', href: '#collaborate' },
    title: 'You need software.\nWe build it.',
    subtitle:
      'Software, AI systems, and digital experiences designed for ' +
      'companies that refuse to stand still.',
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
    authorHref: 'https://ovvy.ai',
    rating: 5,
    avatar: '/testimonials/ovvy.png',
  } satisfies Testimonial,

  /* 1b — Product showcase (three mockups under the testimonial) ---------- */
  showcase: {
    label: 'Recent work',
    items: [
      { label: 'Delivery routing app', shape: 'phone', tint: 'plain' },
      { label: 'Peregrin — revenue intelligence', shape: 'wide', tint: 'yellow' },
      { label: 'Kaizen Store analytics', shape: 'phone', tint: 'pink' },
    ] satisfies ShowcaseItem[],
  },

  /* 1c — Manifesto line -------------------------------------------------- */
  manifesto: {
    title: 'we ship things\nthat work',
    /* The little floating selection toolbar under the line. */
    actions: ['Copy', 'Find Selection'],
  },

  /* 3b — What we build --------------------------------------------------- */
  build: {
    label: '_what we build',
    title:
      'We think like product owners, design like users, and build like engineers.',
    items: [
      {
        title: 'Product design',
        description:
          'Interfaces people actually enjoy using, from first sketch to shipped screen.',
        mockup: 'design',
      },
      {
        title: 'Software engineering',
        description:
          'Full-stack builds on infrastructure that holds up under real traffic.',
        mockup: 'engineering',
      },
      {
        title: 'AI systems',
        description:
          'Applied AI features that solve a real problem, not just add a chatbot.',
        mockup: 'ai',
      },
      {
        title: 'Platform & infrastructure',
        description:
          'Cloud architecture and security that keeps everything running.',
        mockup: 'platform',
      },
    ] satisfies Capability[],
  },

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
      { name: 'Abir', color: 'pink', x: 10, y: 49 },
      { name: 'Runanka', color: 'cyan', x: 37, y: 60 },
      { name: 'Adil', color: 'orange', x: 84, y: 40 },
      { name: 'Bipratip', color: 'lime', x: 60, y: 84 },
    ] satisfies Collaborator[],
  },

  /* 4 — People ----------------------------------------------------------- */
  people: {
    title: 'Our Leadership Team',
    subtitle:
      'We think like product owners, design like users, and build like engineers.',
    members: [
      {
        name: 'Runanka Roy',
        title: 'Full-Stack Engineer',
        bio: 'Architects and ships scalable systems end-to-end, turning ambitious ideas into dependable, production-ready products.',
        image: '/team/runanka.png',
        linkedin: 'https://www.linkedin.com/in/runanka/',
      },
      {
        name: 'Abir Armany',
        title: 'Mobile Engineer',
        bio: 'Crafts polished, high-performance mobile experiences built to last, with an obsessive eye for detail.',
        linkedin: 'https://www.linkedin.com/in/abir-armany-25ba80316',
      },
      {
        name: 'Adil Bin Bhutto',
        title: 'Operations & Infrastructure',
        bio: 'Keeps every engagement running smoothly, owning cloud infrastructure, security, and engineering operations end-to-end.',
        image: '/team/adil.png',
        linkedin: 'https://www.linkedin.com/in/adil/',
      },
      {
        name: 'Bipratip Biswas',
        title: 'Product Designer',
        bio: 'Shapes product direction through sharp design instincts, strategic thinking, and genuinely user-centered craft.',
        image: '/team/bipratip.png',
        linkedin: 'https://www.linkedin.com/in/bipratip-biswas-3bb51b250/',
      },
      {
        name: 'Joud Almualem',
        title: 'Client Success',
        bio: "The client's go-to throughout every engagement, turning clear communication into consistently great outcomes.",
        image: '/team/joud.JPG',
      },
      {
        name: 'Tyler Good',
        title: 'Growth & Partnerships',
        bio: 'Builds relationships with companies across the US, uncovering challenges and bringing new opportunities to the team.',
        image: '/team/tyler.png',
      },
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
        image: '/portfolio/ovvy.webp',
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

  /* 8 — Our Story (Notion-style document card) --------------------------- */
  story: {
    docTitle: 'Our Story',
    date: '8 August 2026 at 3:37 PM',
    title: 'Our Story',
    paragraphs: [
      'untitledbuild started the way most studios do — a handful of people ' +
        'who kept getting hired to fix things other teams had already tried ' +
        'and abandoned. Somewhere along the way we realized we liked building ' +
        'more than fixing, and started taking on our own projects instead.',
      "We're still small on purpose. Every person here works directly with " +
        'clients, writes real code, and has opinions about the product — not ' +
        'just the pixels.',
    ],
  },

  /* ---- About page ------------------------------------------------------ */
  about: {
    hero: {
      headline: [
        { text: 'We started' },
        { text: 'untitledbuild', box: true, chip: 'label' },
        { text: 'because', break: true },
        { text: 'good software is still rare.', box: true, chip: 'tag' },
      ] satisfies HeadlineRun[],
      subtitle:
        "We're a small studio that builds products, AI systems, and the " +
        "occasional weird side project. Here's the short version of how we " +
        'got here.',
      layerLabel: 'Header_h1',
      techTag: 'Something techy',
      cta: { label: 'Collaborate', href: '#collaborate' },
      /* Wider than the home hero so "because good software is still rare."
         stays on one line, as in the design. */
      width: '52rem',
    },
    howWeWork: {
      label: '_how we work',
      title:
        'We think like product owners, design like users, and build like engineers.',
      principles: [
        { title: 'Think like owners', icon: 'scale' },
        { title: 'Design like users', icon: 'droplet' },
        { title: 'Build like engineers', icon: 'browser' },
      ] satisfies Principle[],
    },
    foundersNote: {
      docTitle: "Founder's note",
      body:
        'Thanks for reading this far. We built untitledbuild because we like ' +
        "making things that work properly — and we're pickier than most about " +
        'who we build them with. If any of this sounds like your kind of team, ' +
        "we'd love to hear from you.",
      signature: '— The untitledbuild team',
      zoom: '100%',
    },
  },

  /* ---- Careers page ---------------------------------------------------- */
  careers: {
    tagline: "Think deeply. Build boldly. Engineer what's next.",

    hero: {
      headline: [
        { text: 'Great technology', box: true, chip: 'label' },
        { text: 'starts with' },
        { text: 'great people.', box: true, chip: 'tag', break: true },
      ] satisfies HeadlineRun[],
      subtitle:
        'We bring together exceptional engineers and builders to create ' +
        'intelligent products, scalable platforms and technology that moves ' +
        'businesses forward.',
      layerLabel: 'Header_h1',
      techTag: 'Something techy',
      cta: { label: 'Explore Opportunities', href: '#openings' },
      secondaryCta: { label: 'Introduce Yourself', href: '#introduce' },
      width: '44rem',
    },

    /* In-page sub-nav. Anchors only — every target is a band on this page. */
    nav: [
      { label: 'Open Positions', href: '#openings' },
      { label: 'Engineering', href: '#division-02' },
      { label: 'Design', href: '#division-07' },
      { label: 'AI & Data', href: '#division-01' },
      { label: 'Cloud & Security', href: '#division-04' },
      { label: 'Working Here', href: '#working' },
      { label: 'Remote Culture', href: '#remote' },
    ] satisfies NavLink[],

    intro: {
      title: 'Build What Comes Next.',
      body:
        'We are looking for brilliant engineers, designers, AI builders and ' +
        'technology thinkers who want to solve ambitious problems and build ' +
        'products that matter.',
      lead: 'Join a remote-first engineering organization working across:',
      disciplines: [
        'AI', 'Product Engineering', 'Software', 'Mobile', 'Web',
        'Cloud', 'Data', 'Security', 'UX', 'Advanced Computing',
      ],
    },

    lookFor: {
      label: '_what we look for',
      title: 'We Look for Builders.',
      body:
        'We care more about how you think, learn and build than the number of ' +
        'keywords on your résumé.',
      traits: [
        {
          title: 'Deep Technical Thinking',
          body: 'People who understand fundamentals and can solve difficult engineering problems.',
        },
        {
          title: 'Product Mindset',
          body: 'Engineers who understand that great software solves real customer problems.',
        },
        {
          title: 'AI-Native Thinking',
          body: 'People who actively explore AI, automation, agents and emerging technologies.',
        },
        {
          title: 'Curiosity',
          body: 'People who continuously learn and experiment with new technologies.',
        },
        {
          title: 'Ownership',
          body: 'People who take a problem from idea to architecture to implementation to production.',
        },
        {
          title: 'Craft',
          body: 'People who care about performance, security, usability, reliability and quality.',
        },
        {
          title: 'Collaboration',
          body: 'People who communicate clearly and work well across disciplines and time zones.',
        },
      ] satisfies Trait[],
    },

    openings: {
      label: '_open positions',
      title: 'Seven divisions. One engineering culture.',
      body:
        'Pick the division closest to your work — each lists the roles open ' +
        'inside it. Not every role needs every technology listed.',
      divisions: [
        {
          index: '01',
          title: 'AI & Agentic Engineering',
          summary: 'Production AI: agents, retrieval, and LLM systems that hold up under real use.',
          tech: ['Python', 'FastAPI', 'OpenAI', 'Claude', 'Gemini', 'LangGraph', 'MCP', 'RAG', 'PyTorch', 'Hugging Face'],
          roles: [
            {
              title: 'AI Engineer',
              level: 'Mid – Senior',
              focus: 'AI Agents · LLMs · RAG · Python · Production AI',
              responsibilities: [
                'Build production AI applications',
                'Design agentic workflows',
                'Integrate LLMs with enterprise systems',
                'Build reliable RAG pipelines',
                'Work with product and engineering teams',
              ],
            },
            {
              title: 'Machine Learning Engineer',
              level: 'Mid – Senior',
              focus: 'Training · Evaluation · Inference · MLOps',
              responsibilities: [
                'Train and fine-tune models against real data',
                'Build evaluation harnesses that catch regressions',
                'Take models from notebook to served endpoint',
                'Monitor drift and model quality in production',
              ],
            },
            {
              title: 'Generative AI Engineer',
              level: 'Mid – Senior',
              focus: 'Multimodal · Prompt systems · Guardrails',
              responsibilities: [
                'Build multimodal generation features',
                'Design prompt and context systems that scale',
                'Add guardrails and quality checks around model output',
              ],
            },
            {
              title: 'AI Agent Engineer',
              level: 'Mid – Senior',
              focus: 'Tool use · Planning · Long-running workflows',
              responsibilities: [
                'Design agents that use tools reliably',
                'Build durable, resumable workflows',
                'Instrument agent runs so failures are debuggable',
              ],
            },
            {
              title: 'LLM Engineer',
              level: 'Senior',
              focus: 'Serving · Fine-tuning · Cost and latency',
              responsibilities: [
                'Serve models at production latency and cost',
                'Fine-tune and distil for specific tasks',
                'Own the evaluation story end to end',
              ],
            },
            {
              title: 'AI Solutions Architect',
              level: 'Senior – Principal',
              focus: 'Architecture · Integration · Enterprise AI',
              responsibilities: [
                'Shape AI architecture across client systems',
                'Make build-vs-buy and model selection calls',
                'Lead technical conversations with client teams',
              ],
            },
          ],
        },
        {
          index: '02',
          title: 'Product & Software Engineering',
          summary: 'The products themselves — web, SaaS and enterprise systems, built to last.',
          tech: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Go', 'Java', '.NET', 'PostgreSQL'],
          roles: [
            {
              title: 'Senior Software Engineer',
              level: 'Senior',
              focus: 'Full-stack · Architecture · Delivery',
              responsibilities: [
                'Own features from design through production',
                'Make architectural decisions and document them',
                'Raise the engineering bar through review and mentorship',
              ],
            },
            {
              title: 'Full-Stack Engineer',
              level: 'Mid – Senior',
              focus: 'TypeScript · React · Node.js · PostgreSQL',
              responsibilities: [
                'Build across the stack, from schema to interface',
                'Ship iteratively with product and design',
                'Keep the codebase understandable as it grows',
              ],
            },
            {
              title: 'Backend Engineer',
              level: 'Mid – Senior',
              focus: 'APIs · Data modelling · Performance',
              responsibilities: [
                'Design APIs other teams enjoy consuming',
                'Model data for correctness and speed',
                'Diagnose and fix production performance problems',
              ],
            },
            {
              title: 'Frontend Engineer',
              level: 'Mid – Senior',
              focus: 'React · Next.js · Accessibility · Performance',
              responsibilities: [
                'Build interfaces that stay fast on real devices',
                'Work from design systems and contribute back to them',
                'Own accessibility as a requirement, not a pass at the end',
              ],
            },
            {
              title: 'Software Architect',
              level: 'Senior – Principal',
              focus: 'System design · Trade-offs · Technical direction',
              responsibilities: [
                'Set architecture across services and teams',
                'Make and defend trade-offs in writing',
                'Keep systems simple as requirements multiply',
              ],
            },
            {
              title: 'Product Engineer',
              level: 'Mid – Senior',
              focus: 'Product thinking · Rapid iteration',
              responsibilities: [
                'Turn ambiguous problems into shipped features',
                'Talk to users and act on what you hear',
                'Prototype quickly, then harden what works',
              ],
            },
          ],
        },
        {
          index: '03',
          title: 'Mobile Engineering',
          summary: 'Native and cross-platform apps, from first build through store release.',
          tech: ['React Native', 'Flutter', 'Swift', 'SwiftUI', 'Kotlin', 'Jetpack Compose', 'TypeScript'],
          roles: [
            {
              title: 'React Native Engineer',
              level: 'Mid – Senior',
              focus: 'React Native · TypeScript · Native modules',
              responsibilities: [
                'Ship cross-platform apps that feel native',
                'Bridge to native modules where it matters',
                'Own release pipelines to both stores',
              ],
            },
            {
              title: 'Flutter Engineer',
              level: 'Mid – Senior',
              focus: 'Flutter · Dart · Cross-platform UI',
              responsibilities: [
                'Build Flutter apps with a consistent design language',
                'Tune rendering and startup performance',
                'Integrate platform channels and native SDKs',
              ],
            },
            {
              title: 'iOS Engineer',
              level: 'Mid – Senior',
              focus: 'Swift · SwiftUI · Swift Concurrency',
              responsibilities: [
                'Build iOS apps in modern Swift and SwiftUI',
                'Use structured concurrency correctly',
                'Own App Store submission and release health',
              ],
            },
            {
              title: 'Android Engineer',
              level: 'Mid – Senior',
              focus: 'Kotlin · Jetpack Compose · Coroutines',
              responsibilities: [
                'Build Android apps in Kotlin and Compose',
                'Handle the real fragmentation of the device landscape',
                'Own Play Store release and crash-free rates',
              ],
            },
            {
              title: 'Mobile Architect',
              level: 'Senior – Principal',
              focus: 'Cross-platform strategy · Offline · Release',
              responsibilities: [
                'Set mobile architecture across platforms',
                'Design offline-first and sync behaviour',
                'Own the release and observability strategy',
              ],
            },
          ],
        },
        {
          index: '04',
          title: 'Cloud, Platform & Computing',
          summary: 'The infrastructure everything else runs on, including AI and GPU workloads.',
          tech: ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Docker', 'Terraform', 'Linux', 'CI/CD', 'GPU/CUDA'],
          roles: [
            {
              title: 'Cloud Engineer',
              level: 'Mid – Senior',
              focus: 'AWS · Azure · GCP · Terraform',
              responsibilities: [
                'Build and maintain cloud infrastructure as code',
                'Design for cost as well as capability',
                'Automate the things people currently do by hand',
              ],
            },
            {
              title: 'DevOps Engineer',
              level: 'Mid – Senior',
              focus: 'CI/CD · Automation · Developer experience',
              responsibilities: [
                'Build pipelines engineers trust',
                'Shorten the path from commit to production',
                'Make the safe thing the easy thing',
              ],
            },
            {
              title: 'Platform Engineer',
              level: 'Mid – Senior',
              focus: 'Kubernetes · Internal platforms · Tooling',
              responsibilities: [
                'Build the platform other engineers build on',
                'Run Kubernetes without it running you',
                'Treat internal tooling as a product',
              ],
            },
            {
              title: 'Site Reliability Engineer',
              level: 'Mid – Senior',
              focus: 'Observability · Incidents · SLOs',
              responsibilities: [
                'Define and defend service level objectives',
                'Lead incident response and write honest postmortems',
                'Instrument systems so problems surface early',
              ],
            },
            {
              title: 'Cloud Architect',
              level: 'Senior – Principal',
              focus: 'Multi-cloud · Security · Cost architecture',
              responsibilities: [
                'Design cloud architecture across environments',
                'Balance security, resilience and cost deliberately',
                'Guide migrations without stopping delivery',
              ],
            },
            {
              title: 'AI/GPU Infrastructure Engineer',
              level: 'Senior',
              focus: 'CUDA · GPU scheduling · Inference infrastructure',
              responsibilities: [
                'Run GPU fleets efficiently',
                'Optimise inference throughput and cost',
                'Build the substrate model workloads depend on',
              ],
            },
          ],
        },
        {
          index: '05',
          title: 'Data & Intelligent Systems',
          summary: 'Pipelines, warehouses and the analytics that turn data into decisions.',
          tech: ['Python', 'SQL', 'Kafka', 'Spark', 'Snowflake', 'Databricks', 'BigQuery', 'PostgreSQL'],
          roles: [
            {
              title: 'Data Engineer',
              level: 'Mid – Senior',
              focus: 'Pipelines · Streaming · Warehousing',
              responsibilities: [
                'Build pipelines that survive bad input',
                'Model warehouses analysts can actually use',
                'Own data quality and freshness',
              ],
            },
            {
              title: 'Analytics Engineer',
              level: 'Mid – Senior',
              focus: 'SQL · Modelling · BI',
              responsibilities: [
                'Turn raw tables into trustworthy models',
                'Build metrics definitions the business agrees on',
                'Make analysis reproducible',
              ],
            },
            {
              title: 'Data Scientist',
              level: 'Mid – Senior',
              focus: 'Statistics · Experimentation · Prediction',
              responsibilities: [
                'Frame business questions as answerable ones',
                'Design experiments and read them honestly',
                'Build predictive models that ship',
              ],
            },
            {
              title: 'ML Engineer',
              level: 'Mid – Senior',
              focus: 'Feature pipelines · Serving · Monitoring',
              responsibilities: [
                'Productionise models and the data feeding them',
                'Build feature pipelines that match training and serving',
                'Monitor model behaviour after launch',
              ],
            },
            {
              title: 'Data Architect',
              level: 'Senior – Principal',
              focus: 'Platform design · Governance · Scale',
              responsibilities: [
                'Design the data platform end to end',
                'Set governance that helps rather than blocks',
                'Plan for scale before it arrives',
              ],
            },
          ],
        },
        {
          index: '06',
          title: 'Cybersecurity, Quality & Reliability',
          summary: 'Security, testing and reliability treated as engineering, not paperwork.',
          tech: ['IAM', 'Zero Trust', 'OAuth/OIDC', 'SIEM', 'DevSecOps', 'Kubernetes Security', 'OpenTelemetry'],
          roles: [
            {
              title: 'Security Engineer',
              level: 'Mid – Senior',
              focus: 'Threat modelling · Hardening · Response',
              responsibilities: [
                'Threat-model systems before they ship',
                'Harden infrastructure and applications',
                'Lead response when something goes wrong',
              ],
            },
            {
              title: 'Application Security Engineer',
              level: 'Mid – Senior',
              focus: 'AppSec · Code review · SDLC',
              responsibilities: [
                'Review code and designs for security flaws',
                'Build security into the development lifecycle',
                'Teach engineers to find their own bugs',
              ],
            },
            {
              title: 'Cloud Security Engineer',
              level: 'Mid – Senior',
              focus: 'IAM · Zero Trust · Cloud posture',
              responsibilities: [
                'Design least-privilege access across cloud accounts',
                'Monitor and remediate cloud posture',
                'Secure Kubernetes and CI/CD supply chains',
              ],
            },
            {
              title: 'DevSecOps Engineer',
              level: 'Mid – Senior',
              focus: 'Pipeline security · Scanning · Supply chain',
              responsibilities: [
                'Put security checks in the pipeline, not after it',
                'Own dependency and supply-chain risk',
                'Keep signal high and false positives low',
              ],
            },
            {
              title: 'QA Automation Engineer',
              level: 'Mid – Senior',
              focus: 'Test automation · CI · Coverage that matters',
              responsibilities: [
                'Build test suites engineers trust and keep green',
                'Automate the checks that actually catch regressions',
                'Make failures easy to diagnose',
              ],
            },
            {
              title: 'Performance Engineer',
              level: 'Mid – Senior',
              focus: 'Profiling · Load testing · Optimisation',
              responsibilities: [
                'Profile systems and find the real bottleneck',
                'Design load tests that reflect reality',
                'Turn measurements into shipped improvements',
              ],
            },
            {
              title: 'Site Reliability Engineer',
              level: 'Mid – Senior',
              focus: 'SLOs · Observability · Resilience',
              responsibilities: [
                'Make reliability measurable',
                'Build observability into systems from the start',
                'Reduce toil through automation',
              ],
            },
          ],
        },
        {
          index: '07',
          title: 'UI/UX & Product Design',
          summary: 'Design that ships — systems, prototypes and interfaces built with engineering.',
          tech: ['Figma', 'Design Systems', 'Prototyping', 'React', 'Next.js', 'Accessibility', 'Motion'],
          roles: [
            {
              title: 'Product Designer',
              level: 'Mid – Senior',
              focus: 'Product thinking · Interaction · Craft',
              responsibilities: [
                'Own product design from problem to shipped screen',
                'Work directly with engineers, not over a wall',
                'Defend decisions with reasoning and evidence',
              ],
            },
            {
              title: 'UI/UX Designer',
              level: 'Mid – Senior',
              focus: 'Interface design · Systems · Prototyping',
              responsibilities: [
                'Design interfaces people can use without a manual',
                'Build and maintain design systems',
                'Prototype interactions before they are built',
              ],
            },
            {
              title: 'UX Researcher',
              level: 'Mid – Senior',
              focus: 'Research · Usability · Synthesis',
              responsibilities: [
                'Plan and run research that changes decisions',
                'Synthesise findings into something actionable',
                'Bring real user evidence into the room',
              ],
            },
            {
              title: 'Design Systems Designer',
              level: 'Mid – Senior',
              focus: 'Tokens · Components · Documentation',
              responsibilities: [
                'Own the token and component layer',
                'Document intent, not just appearance',
                'Keep design and code in sync',
              ],
            },
            {
              title: 'Design Engineer',
              level: 'Mid – Senior',
              focus: 'React · Motion · Design implementation',
              responsibilities: [
                'Build the interfaces you design',
                'Own motion and interaction detail in code',
                'Close the gap between Figma and production',
              ],
            },
            {
              title: 'Creative Technologist',
              level: 'Mid – Senior',
              focus: 'Prototyping · Emerging tech · Experimentation',
              responsibilities: [
                'Prototype ideas nobody has built yet',
                'Explore new technology and report back honestly',
                'Make abstract concepts tangible',
              ],
            },
          ],
        },
      ] satisfies Division[],
    },

    working: {
      label: '_working models',
      title: 'Work Your Way.',
      models: [
        { title: 'Full-Time', body: 'Join the core team and work on long-term products and technology.' },
        { title: 'Part-Time', body: 'Contribute specialized expertise with flexible commitments.' },
        { title: 'Remote', body: 'Work from wherever you do your best work, with a distributed engineering culture.' },
        { title: 'Contract / Project', body: 'Join specific high-impact projects where your expertise is needed.' },
        { title: 'Fractional / Advisory', body: 'Experienced architects and technology leaders can contribute at a strategic level.' },
      ] satisfies Trait[],
    },

    remote: {
      label: '_remote culture',
      title: 'Remote by Design.',
      body: "Great engineers don't need to sit in the same building to build great things together.",
      points: [
        'Remote-first collaboration',
        'Async communication',
        'Flexible working hours',
        'Global engineering teams',
        'Modern collaboration tools',
        'Documentation-first culture',
        'Results over hours online',
        'Trust and ownership',
      ],
    },

    howWeBuild: {
      label: '_how we build',
      title: 'Think deeply. Build simply. Ship continuously.',
      steps: [
        { index: '01', title: 'Understand', body: 'Start with the problem, not the technology.' },
        { index: '02', title: 'Explore', body: 'Research, prototype and challenge assumptions.' },
        { index: '03', title: 'Engineer', body: 'Build secure, maintainable and scalable systems.' },
        { index: '04', title: 'Ship', body: 'Move from prototype to production quickly.' },
        { index: '05', title: 'Measure', body: 'Learn from real users and real-world performance.' },
        { index: '06', title: 'Improve', body: 'Continuously refine the product and the technology.' },
      ] satisfies BuildStep[],
    },

    levels: {
      label: '_experience levels',
      title: 'We hire at every level.',
      body:
        'Strong fundamentals matter more than years served. These are the levels ' +
        'we hire into across every division.',
      items: [
        'Intern / Apprentice',
        'Junior Engineer',
        'Mid-Level Engineer',
        'Senior Engineer',
        'Staff Engineer',
        'Principal Engineer',
        'Architect',
        'Technology Lead',
      ],
      exceptional: {
        title: 'Exceptional Talent',
        body:
          "Don't see your role? If you're exceptionally good at what you do, " +
          'introduce yourself.',
        cta: 'Introduce Yourself',
      },
    },

    signals: {
      label: '_what makes a great candidate',
      title: "You Don't Need Every Skill.",
      body:
        'Technology changes quickly. We value strong fundamentals, curiosity and ' +
        'the ability to learn. You may be a great candidate if you show:',
      items: [
        'Strong computer science fundamentals',
        'Excellent problem solving',
        'Ability to learn quickly',
        'Strong engineering judgment',
        'Open-source contributions',
        'Interesting personal projects',
        'Technical writing',
        'Research or experimentation',
        'Product thinking',
        'Strong communication',
      ],
    },

    closing: {
      title: 'Build the Future With Us.',
      body:
        "If you're the kind of person who looks at a difficult problem and wants " +
        "to understand how to solve it, we'd like to meet you.",
      cta: { label: 'Explore Open Roles', href: '#openings' },
      secondaryCta: { label: 'Introduce Yourself', href: '#introduce' },
    },

    apply: {
      title: 'Apply',
      fields: {
        name: { label: 'Name', placeholder: 'John Doe' },
        email: { label: 'Email', placeholder: 'johndoe@mail.com' },
        position: { label: 'Position' },
        resume: { label: 'Resume' },
      },
      /** Shown first in the position list for speculative applications. */
      openOption: 'Introducing myself — no specific role',
      upload: {
        action: 'Click to upload',
        rest: 'or drag and drop',
        hint: 'PDF, DOCX (max. 10 mb)',
      },
      submit: 'Submit',
      success: "Application received — we'll be in touch.",
      error: 'Something went wrong. Please email hello@untitledbuild.com.',
    },
  },

  /* 9 — Footer ----------------------------------------------------------- */
  languages: [
    { code: 'ENG', active: true },
    { code: 'FRN', active: false },
    { code: 'ESP', active: false },
    { code: 'DEU', active: false },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ] satisfies NavLink[],

  /* ---- Integrations ---------------------------------------------------- */
  /** Contact email used as a graceful fallback if the form endpoint is down. */
  contactEmail: 'hello@untitledbuild.com',
} as const;

export type Site = typeof site;
