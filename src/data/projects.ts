import type { Project } from '@/types/project';

// Case-study copy is written from each project's own README / about page.
// `gallery` is intentionally omitted for now, so every modal falls back to the
// single `image` thumbnail until real screenshots are added (drop a `gallery`
// array on a project and the carousel lights up automatically).
export const projects: Project[] = [
  {
    id: 1,
    title: 'TrapCheck',
    description:
      'An AI-powered tourist trap detector that evaluates venues by combining live web searches and Google Maps reviews through a hybrid three-stage pipeline: deterministic metrics, RAG-based calibration, and LLM interpretation.',
    gallery: [
      {
        src: 'TrapCheck-1.webp',
        alt: 'TrapCheck verdict for Olive Garden Times Square: a "75 — Definite Trap" score with signals and evidence',
        caption: 'Verdict with a transparent trap score',
      },
      {
        src: 'TrapCheck-2.webp',
        alt: 'TrapCheck input screen for entering a venue name and city before analysis',
        caption: 'Enter a venue to analyze',
      },
      {
        src: 'TrapCheck-3.webp',
        alt: 'Pipeline diagram: web search and reviews, deterministic metrics, keyword RAG retriever, prompt assembly, Gemini interpretation, structured JSON output',
        caption: 'The hybrid metrics-then-LLM pipeline',
      },
      {
        src: 'TrapCheck-4.webp',
        alt: 'Bar chart showing RAG calibration cutting error from 13.6 to 9.3 MAE, a 32% reduction',
        caption: 'RAG calibration: -32% error, 95.6% accuracy',
      },
    ],
    tags: ['Python', 'LangChain', 'RAG', 'Gemini AI', 'AI Agents', 'NLP'],
    github: 'https://github.com/ashkenazzio/trap-check',
    live: null,
    caseStudy: {
      problem:
        'Ask an LLM "is this place a tourist trap?" and you get a different vibe every time: confident, fluent, and not especially reproducible. I wanted a verdict you could actually trust and explain, not a coin flip dressed up in nice prose.',
      approach:
        'So I refused to let the model see raw reviews first. A deterministic metrics layer computes the hard signals up front (reviewer credibility, trap/manipulation keywords, suspicious same-day review clusters), then a lightweight RAG step calibrates the score against a hand-curated set of 149 global venues, and only then does Gemini step in, constrained to a JSON schema, to interpret rather than invent. Metrics before the model: the boring part is what makes it stable.',
      outcome:
        'The RAG calibration cut scoring error (MAE) by 32% and landed around 95.6% accuracy on the eval set, with the deterministic signals staying 100% stable across runs. Built for an Applied Language Models course, it became my favourite kind of project: the one that taught me LLMs are at their best when you give them less to freestyle and more to reason about.',
    },
    metrics: [
      { value: '95.6%', label: 'scoring accuracy (with RAG)' },
      { value: '-32%', label: 'error (MAE) vs. no RAG' },
      { value: '149', label: 'curated venues in the RAG set' },
    ],
    techStack: [
      { category: 'Language', items: ['Python'] },
      { category: 'AI / NLP', items: ['LangChain', 'Gemini', 'RAG', 'Structured output'] },
      { category: 'Signals', items: ['Credibility scoring', 'Keyword detection', 'Date clustering'] },
    ],
  },
  {
    id: 2,
    title: 'Ticketz',
    description:
      'A high-scale event management platform built to demonstrate senior-level engineering: advanced RBAC, an event-driven, contract-first GraphQL API, and production-ready DevOps, every line human-written.',
    gallery: [
      {
        src: 'Ticketz-1.webp',
        alt: 'Ticketz landing page hero reading "Find your scene. Or build it." with an event card and member-growth widget',
        caption: 'Landing — a dual-sided event platform',
      },
      {
        src: 'Ticketz-4.webp',
        alt: 'Organizer dashboard showing revenue, active members, tickets sold, and a sales-velocity chart',
        caption: 'Organizer dashboard',
      },
      {
        src: 'Ticketz-noai.webp',
        alt: 'A bordered "Human Written Code" badge stating every line of logic in Ticketz was architected, written, and debugged by a human',
        caption: 'No generated boilerplate — human-written',
      },
      {
        src: 'Ticketz-uml-users.webp',
        alt: 'UML class diagram of the Users & Access Control domain: roles, permissions, sessions, and connections',
        caption: 'Domain model — Users & Access Control',
      },
      {
        src: 'Ticketz-uml-tickets.webp',
        alt: 'UML class diagram of the Tickets & Orders domain: orders, tickets, payments, and discount codes',
        caption: 'Domain model — Tickets & Orders',
      },
      {
        src: 'Ticketz-uml-communities.webp',
        alt: 'UML class diagram of the Communities & Events domain: communities, events, venues, and memberships',
        caption: 'Domain model — Communities & Events',
      },
    ],
    tags: [
      'Next.js',
      'NestJS',
      'GraphQL',
      'Prisma',
      'TypeScript',
      'Full-Stack',
    ],
    github: 'https://github.com/ashkenazzio/ticketz',
    live: null,
    wip: true,
    caseStudy: {
      problem:
        'My earlier full-stack projects worked, but they leaned on conventions and a bit of luck at the seams. Ticketz is the deliberate opposite: a stress-test of the patterns real teams use at scale, with proper role-based access, a typed contract across the network boundary, and infra that someone other than me could actually run.',
      approach:
        'A contract-first GraphQL setup where the schema (SDL) is written before the code, and the frontend generates its TypeScript types from it via graphql-codegen, so a backend field rename becomes a frontend compile error rather than a 2am bug. A NestJS 11 API with modular dependency injection and JWT-based RBAC across Attendee / Organizer / Admin roles, Prisma 6 over PostgreSQL, and the whole thing (API, frontend, database) orchestrated with Docker Compose behind GitHub Actions CI/CD.',
      outcome:
        'Work in progress, and honestly that’s the point. It’s the project where I stopped reaching for the quick win and started caring about architecture for its own sake. It now lives as a single monorepo (consolidated from the original two-repo split). One stubborn principle throughout: every line of logic was architected, written, and debugged by a human, with no generated boilerplate.',
    },
    techStack: [
      { category: 'Frontend', items: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind'] },
      { category: 'API', items: ['NestJS 11', 'GraphQL', 'Apollo', 'JWT + RBAC'] },
      { category: 'Data', items: ['Prisma 6', 'PostgreSQL'] },
      { category: 'DevOps', items: ['Docker Compose', 'GitHub Actions'] },
    ],
  },
  {
    id: 3,
    title: 'Weather2Music',
    description:
      'A single-page React app that reads the live weather for any city, classifies it into a "mood," and responds by repainting the interface and serving a matching YouTube playlist, with stackable ambient sound layers on top.',
    // Cover with the snowy mood (slide 2) — more striking than the sunny one.
    coverIndex: 1,
    gallery: [
      {
        src: 'weather2music-1.webp',
        alt: 'Weather2Music in a hot, sunny mood for Dubai: palm-tree background, 33°C clear, with a matching playlist',
        caption: 'A hot, clear day in Dubai',
      },
      {
        src: 'weather2music-2.webp',
        alt: 'Weather2Music in a cold, snowy mood for Ushuaia: snow scene, 3°C, with a calmer playlist and palette',
        caption: 'The same app, snowy in Ushuaia',
      },
      {
        src: 'weather2music-4.webp',
        alt: 'Weather2Music with the ambient sound toggles (rain, beach, birdsong, café) layered over the music',
        caption: 'Stackable ambient sound layers',
      },
    ],
    tags: ['React', 'REST APIs', 'API Integration', 'UI/UX'],
    github: 'https://github.com/ashkenazzio/weather2music',
    live: 'https://ashkenazzio.github.io/weather2music',
    caseStudy: {
      problem:
        'An early project with a simple, slightly silly goal: teach myself to wrangle external APIs, and make something playful while I was at it. Snowy and freezing should feel like a calm, cold playlist over a snow scene; bright and hot should sound like it.',
      approach:
        'The heart of it is a little classification scheme I designed from scratch, the "mood code." It squashes a weather reading into a three-character key (sky + day/night + temperature band, so a hot clear afternoon is "BdH", a snowy night "SnF"), and that single key drives the background, the colour scheme, and the playlist. Around it, four APIs cooperate in one flow (OpenWeather, Google Places autocomplete, Google reverse-geocoding, and the YouTube Data API), wrapped in proper React composition with Context and a couple of custom hooks.',
      outcome:
        'It started as a vanilla-JS prototype and I rebuilt it in React to learn component architecture and hooks properly. The mood code was the first real algorithm I designed myself rather than just wiring up handlers. Modest, sure, but it’s the moment the whole "designing an abstraction" thing finally clicked for me.',
    },
    techStack: [
      { category: 'Frontend', items: ['React 18', 'Hooks + Context', 'CSS Modules', 'GSAP'] },
      { category: 'APIs', items: ['OpenWeather', 'Google Places', 'Geocoding', 'YouTube Data API'] },
      { category: 'Idea', items: ['Hand-designed "mood code" classifier'] },
    ],
  },
  {
    id: 4,
    title: 'Brain Tumor Classification',
    description:
      'A computer-vision deep-learning model that classifies brain MRI scans into four categories (glioma, meningioma, pituitary, no tumor) using EfficientNet-B0 transfer learning in PyTorch.',
    gallery: [
      {
        src: 'BrainTumorClassification-1.webp',
        alt: 'Grid of correctly classified brain MRI scans, each labelled with its true and predicted class',
        caption: 'Sample predictions on the test set',
      },
      {
        src: 'BrainTumorClassification-2.webp',
        alt: 'Confusion matrix for the four tumor classes, showing a near-perfect diagonal',
        caption: 'Confusion matrix — 7 misses out of 1,311',
      },
      {
        src: 'BrainTumorClassification-3.webp',
        alt: 'Training and validation loss and accuracy curves across the four experiments',
        caption: 'Loss & accuracy across four experiments',
      },
      {
        src: 'BrainTumorClassification-4.webp',
        alt: 'One-vs-rest ROC curves for each class, all with AUC near 1.0',
        caption: 'ROC curves (one-vs-rest), AUC ≈ 1.0',
      },
    ],
    tags: [
      'Python',
      'PyTorch',
      'Computer Vision',
      'Deep Learning',
      'Transfer Learning',
    ],
    github: 'https://github.com/ashkenazzio/brain-tumor-classification',
    live: null,
    caseStudy: {
      problem:
        'Classify brain MRI scans into four categories accurately enough to be interesting and, just as importantly, prove the accuracy was genuinely learned rather than something the pretrained network already happened to know.',
      approach:
        'Transfer learning on EfficientNet-B0 (ImageNet weights, ~4M params), fine-tuned over 7,023 scans with data augmentation and mixed-precision training. I started by measuring a zero-shot baseline to establish the floor, then ran four controlled experiments varying dropout and training length to see what actually moved the needle, backed up with confusion matrices, ROC and precision-recall curves.',
      outcome:
        'The model went from ~42% zero-shot to 99.47% test accuracy at ~1.1 ms per image, and the honest finding was that aggressive dropout tuning barely mattered: the defaults were already well-tuned, and 20 epochs was plenty. A good lesson in letting the experiments tell you the boring truth instead of chasing knobs.',
    },
    metrics: [
      { value: '99.47%', label: 'test accuracy (best model)' },
      { value: '42% → 99%', label: 'zero-shot vs. fine-tuned' },
      { value: '~1.1 ms', label: 'inference per image' },
    ],
    techStack: [
      { category: 'Language', items: ['Python'] },
      { category: 'ML', items: ['PyTorch', 'EfficientNet-B0', 'timm', 'torchvision'] },
      { category: 'Method', items: ['Transfer learning', 'Augmentation', 'Mixed precision'] },
    ],
  },
  {
    id: 5,
    title: 'Arise',
    description:
      'A full-stack personal-finance app built with Next.js, NextAuth, and MySQL. Log expenses and incomes, organize them into custom categories, and read your spending relatively: "up 14% on food" rather than just a number.',
    // Cover with the dark-mode summary (slide 5) instead of the first slide.
    coverIndex: 4,
    gallery: [
      {
        src: 'Arise-1.webp',
        alt: 'Arise summary: per-category sum cards with percentage change, a spending pie chart, and a trend-insight note',
        caption: 'Summary — spending read relatively',
      },
      {
        src: 'Arise-2.webp',
        alt: 'Arise flow view: expenses and incomes side by side with a running balance',
        caption: 'Flow — expenses, incomes, running balance',
      },
      {
        src: 'Arise-3.webp',
        alt: 'Arise add-entry form with title, amount, date, category, and an expense/income toggle',
        caption: 'Adding an entry',
      },
      {
        src: 'Arise-4.webp',
        alt: 'Arise summary in bar-chart mode, breaking spending down by category',
        caption: 'Same data, as a bar chart',
      },
      {
        src: 'Arise-5.webp',
        alt: 'Arise summary in dark mode, showing the themeable UI',
        caption: 'Dark mode',
      },
    ],
    tags: ['Next.js', 'React', 'Node.js', 'REST APIs', 'Full-Stack'],
    github: 'https://github.com/ashkenazzio/arise',
    live: 'https://arise-mocha.vercel.app',
    caseStudy: {
      problem:
        'I wanted a real reason to learn modern full-stack React end to end, not a tutorial to-do list. A budgeting app gave it purpose, with one opinionated twist: nudge people to read spending against their own recent flow instead of fixating on absolute amounts.',
      approach:
        'Next.js doing double duty as both the rendered app and the JSON API behind it: SSR pages, REST-style API routes, credential auth via NextAuth with bcrypt-hashed passwords and JWT sessions, and a hand-written schema queried through the raw mysql2 pool (no ORM, on purpose). The piece I’m quietly proud of is a dual-mode data layer. Every create/update/delete is implemented twice behind one handler, once against the API for signed-in users and once against localStorage for the anonymous "try it first" mode, so the UI never knows which it’s talking to.',
      outcome:
        'It’s deployed and functional, and I’ve deliberately left a few rough edges visible because they map directly to what the build taught me. This was my proper way into Next.js, auth, and relational modelling. The budgeting concept gave it a reason to exist, but the wiring is where the learning actually happened.',
    },
    techStack: [
      { category: 'Framework', items: ['Next.js 12', 'React 18', 'SSR + API routes'] },
      { category: 'Auth', items: ['NextAuth', 'JWT sessions', 'bcryptjs'] },
      { category: 'Data', items: ['MySQL', 'mysql2 (no ORM)'] },
      { category: 'UI', items: ['Framer Motion', 'Chart.js', 'CSS Modules'] },
    ],
  },
  {
    id: 6,
    title: 'City Bicycle & Stuff',
    description:
      'A complete MVC e-commerce store for an urban bike shop, built from scratch with Node.js, Express, and MongoDB: storefront, live cart, auth, orders, and an admin dashboard, all hand-rolled.',
    gallery: [
      {
        src: 'Bicycle-1.webp',
        alt: 'Storefront product grid showing a bike helmet, a city bike, and a U-lock',
        caption: 'Storefront',
      },
      {
        src: 'Bicycle-2.webp',
        alt: 'Product detail page for "The Guvnor" city bike with price, description, and add-to-cart',
        caption: 'Product detail',
      },
      {
        src: 'Bicycle-3.webp',
        alt: 'Shopping cart with three items, editable quantities, and a recalculated total',
        caption: 'Live cart with recalculated totals',
      },
      {
        src: 'Bicycle-4.webp',
        alt: 'Role-protected admin dashboard for creating, editing, and deleting products',
        caption: 'Admin — product management',
      },
    ],
    tags: ['Node.js', 'Express', 'MongoDB', 'MVC', 'E-Commerce', 'Full-Stack'],
    github: 'https://github.com/ashkenazzio/Online-Shop',
    live: null,
    caseStudy: {
      problem:
        'This was my very first real project: the capstone of a full-stack bootcamp, and the one that genuinely taught me to code. The goal was less "ship a store" and more "understand, from the ground up, how a web app actually fits together."',
      approach:
        'So it’s deliberately framework-light: no ORM, no scaffolding, no front-end framework. Routing, the data layer, auth, sessions, the cart, and the views are all hand-written. A clean MVC split with model classes over the native MongoDB driver, session-based auth with isAuth / isAdmin middleware, bcrypt hashing, CSRF protection, and a deliberate middleware pipeline. A nice touch I still like: the cart re-validates against the database on every request, so prices stay current and deleted products quietly fall out instead of breaking checkout.',
      outcome:
        'I keep it in my portfolio precisely because it’s where everything started: the project that turned "I think I want to build software" into actually being able to. Rough in places, sure, but every abstraction I’ve leaned on since makes more sense because I once built the thing underneath it by hand.',
    },
    techStack: [
      { category: 'Runtime', items: ['Node.js', 'Express'] },
      { category: 'Data', items: ['MongoDB (native driver)'] },
      { category: 'Auth', items: ['express-session', 'bcryptjs', 'csurf'] },
      { category: 'Views', items: ['EJS (server-rendered)', 'Multer uploads'] },
    ],
  },
];
