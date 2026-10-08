export type ProjectMedia = {
  /** MP4 (H.264) in public/videos, e.g. '/videos/yeapp.mp4'. */
  src: string;
  /** First-frame still in public/videos, shown before play and under reduced motion. */
  poster: string;
  /** Phone frame for mobile apps, browser frame for web products. */
  frame: 'phone' | 'browser';
  /** What the clip shows, read by screen readers. */
  caption: string;
};

export type ProjectScreenshots = {
  /** Two phones for mobile apps, two overlapping browser windows for web products. */
  frame: 'phone' | 'browser';
  /** The product's own brand colours for the card behind the screens. */
  brand: { from: string; to: string };
  /** Two files in public/screens/<slug>/, back first. Sizes are the files' pixel sizes. */
  images: { src: string; alt: string; width: number; height: number }[];
};

export type Project = {
  slug: string;
  id: string;
  name: string;
  summary: string;
  category: string;
  company: string;
  period: string;
  platforms: string[];
  problem: string;
  contribution: string;
  outcome: string;
  metric: { value: string; label: string };
  overview: string;
  role: string;
  scope: string[];
  strategy: { label: string; value: string }[];
  tools: string[];
  results: string[];
  /** Optional walkthrough video. Add once a recording is available. */
  media?: ProjectMedia;
  /** Optional screenshots, shown when there is no video. */
  screenshots?: ProjectScreenshots;
};

export const projects: Project[] = [
  {
    slug: 'yeapp',
    id: 'TC-01',
    name: 'Yeapp by Krafton',
    summary: 'Voice-first social messaging app',
    category: 'Social messaging',
    company: 'The Product Highway',
    period: 'Jun 2026 to present',
    platforms: ['Android', 'iOS'],
    problem:
      'A voice-first social app had to go from early builds to a public launch on two app stores.',
    contribution:
      'Owned testing end to end, from the first builds through the Play Store and App Store launch.',
    outcome: 'Every post-launch release now ships against a full regression suite.',
    metric: { value: '400–500', label: 'case regression suite' },
    overview:
      'Yeapp is a voice-first social messaging app by Krafton. It combines chat, voice notes, Discord-style voice rooms and Ziggy AI, an in-app AI chat and voice companion.',
    role: 'QA owner from the early build phase through store launch and every release after it.',
    scope: [
      'Onboarding',
      '1:1 and group chat',
      'Voice notes',
      'Discord-style voice rooms',
      'Ziggy AI chat and voice companion',
      'Admin panel',
      'Backend APIs',
    ],
    strategy: [
      { label: 'Regression suite', value: '400–500 cases' },
      { label: 'Per release', value: 'Regression, smoke, sanity, end-to-end' },
      { label: 'API and admin', value: 'Validated in Postman' },
      { label: 'Defect flow', value: 'ClickUp, from logging to retest and closure' },
    ],
    tools: ['Postman', 'ClickUp', 'Android', 'iOS', 'Chrome DevTools'],
    results: [
      'Took the app from early builds to launch on the Play Store and App Store.',
      'Built and ran a 400–500 case regression suite on every post-launch release.',
      'Managed bugs in ClickUp from logging through retest and closure.',
    ],
  },
  {
    slug: 'scuderia-car-parts',
    screenshots: {
      frame: 'browser',
      brand: { from: '#b8141c', to: '#5e0a0e' }, // off-token: Scuderia brand red
      images: [
        { src: '/screens/scuderia-car-parts/home.jpg', alt: 'Scuderia Car Parts home page with the part search', width: 1600, height: 988 },
        { src: '/screens/scuderia-car-parts/tuning.jpg', alt: 'Tuning parts page, browsing parts by marque', width: 1600, height: 990 },
      ],
    },
    id: 'TC-02',
    name: 'Scuderia Car Parts',
    summary: 'Multi-region e-commerce for supercar parts',
    category: 'E-commerce',
    company: 'The Product Highway',
    period: 'Jun 2026 to present',
    platforms: ['Web'],
    problem:
      'A parts storefront sells across countries, languages and five currencies, and every module needed coverage.',
    contribution:
      'Wrote the full end-to-end suite from Figma, tested every localized storefront and automated the functional cases.',
    outcome: 'All functional test cases run automatically in FlowQA before each release.',
    metric: { value: '~2,000', label: 'case end-to-end suite' },
    overview:
      'Scuderia Car Parts is a multi-region e-commerce platform for supercar parts, with localized storefronts on separate country domains.',
    role: 'Test author and owner for the end-to-end suite, localization, SEO and automation.',
    scope: [
      'Pages and flows',
      'Part cards',
      'Quotes and enquiries',
      'Notifications',
      'Cart and checkout',
      'Localized storefronts',
      'SEO',
    ],
    strategy: [
      { label: 'End-to-end suite', value: '~2,000 cases from Figma' },
      { label: 'Currencies', value: 'GBP, EUR (DE, FR), AED, KRW, JPY' },
      { label: 'SEO', value: 'Meta tags, canonical, hreflang, redirects, sitemaps' },
      { label: 'Automation', value: 'All functional cases in FlowQA' },
    ],
    tools: ['FlowQA', 'Playwright', 'Figma', 'Chrome DevTools'],
    results: [
      'Authored a ~2,000 case suite covering every module.',
      'Validated language, pricing and currency switching across country domains.',
      'Verified developer fixes on development and staging before each release.',
    ],
  },
  {
    slug: 'flowqa',
    id: 'TC-03',
    name: 'FlowQA',
    summary: 'Record-and-replay test automation platform',
    category: 'Test automation',
    company: 'The Product Highway',
    period: 'Jun 2026 to present',
    platforms: ['Playwright', 'TypeScript'],
    problem:
      'The team needed a faster way to turn manual test flows into automated runs across environments.',
    contribution:
      'Developed the full application with AI-assisted development, on a base framework set up by a teammate.',
    outcome: 'Recorded tests export as standalone Playwright projects for CI pipelines.',
    metric: { value: '3', label: 'export languages: TS, JS, Python' },
    overview:
      'FlowQA is an internal record-and-replay end-to-end automation platform built on Playwright and TypeScript.',
    role: 'Developer of the full application, handed over for deployment.',
    scope: [
      'Recorder and replay',
      'Dev, staging and production runs',
      'Production safeguards',
      'Reusable steps and shared variables',
      'Test plan import',
      'Project health dashboard',
      'Code export',
    ],
    strategy: [
      { label: 'Built with', value: 'Claude Code, on a teammate’s base framework' },
      { label: 'Environments', value: 'Dev, staging, production with safeguards' },
      { label: 'Reporting', value: 'Health dashboard, run history, reports' },
      { label: 'Export', value: 'Playwright projects in TypeScript, JavaScript, Python' },
    ],
    tools: ['Playwright', 'TypeScript', 'Claude Code'],
    results: [
      'Built multi-environment runs with production safeguards.',
      'Added reusable steps, shared variables and test plan import.',
      'Enabled export of recorded tests as standalone Playwright projects.',
    ],
  },
  {
    slug: 'nhs',
    id: 'TC-04',
    name: 'NHS',
    summary: 'UK healthcare client transaction processing system',
    category: 'Healthcare',
    company: 'Sopra Steria',
    period: 'Feb 2024 to May 2026',
    platforms: ['Web'],
    problem:
      'A high-volume healthcare transaction system needed confident releases every sprint.',
    contribution:
      'Led functional, regression, integration, smoke and sanity testing across 10+ sprint releases.',
    outcome: 'Post-release defects fell by 40%, with full UAT sign-off before every release.',
    metric: { value: '−40%', label: 'post-release defects' },
    overview:
      'A client transaction processing system for the NHS, the UK’s public healthcare service, handling high-volume transaction records.',
    role: 'QA Engineer across functional, API, data and automation testing, and UAT with NHS stakeholders.',
    scope: [
      'All NHS modules',
      '40+ REST API endpoints',
      'Transaction data integrity',
      'Login, navigation and critical workflows',
      'Post-deployment smoke',
      'UAT',
    ],
    strategy: [
      { label: 'Test cases', value: '300+, 100% functional coverage' },
      { label: 'API', value: '40+ REST endpoints in Postman' },
      { label: 'Data', value: 'SQL reconciliation across transaction records' },
      { label: 'Automation', value: 'Selenium WebDriver (Java), XPath and CSS' },
      { label: 'Defects', value: '150+ managed in JIRA' },
    ],
    tools: ['Selenium', 'Java', 'Postman', 'SQL', 'JIRA'],
    results: [
      'Reduced post-release defects by 40% across 10+ sprint releases.',
      'Caught 20+ data discrepancies with SQL before go-live.',
      'Smoke suites enabled go/no-go decisions within 30 minutes of deployment.',
      'Achieved 100% UAT sign-off before every production release.',
    ],
  },
  {
    slug: 'luv-or-pop',
    screenshots: {
      frame: 'phone',
      brand: { from: '#e8384f', to: '#6d1028' }, // off-token: Luv or Pop balloon red
      images: [
        { src: '/screens/luv-or-pop/explore.jpg', alt: 'Luv or Pop Explore screen with a profile card', width: 430, height: 932 },
        { src: '/screens/luv-or-pop/hub.jpg', alt: 'Luv or Pop Show hub with the latest episode', width: 430, height: 932 },
      ],
    },
    id: 'TC-05',
    name: 'Luv or Pop',
    summary: 'Dating app from the “Pop the Balloon or Find Love” show',
    category: 'Dating',
    company: 'The Product Highway',
    period: 'Jun 2026 to present',
    platforms: ['Android', 'iOS'],
    problem:
      'A dating app built on a YouTube show needed every feature, from matching to live video, tested before launch.',
    contribution:
      'Designed the regression, smoke, sanity and end-to-end suites, with 60–80 cases per feature.',
    outcome: 'Builds were verified against Figma, supporting a smooth launch and stable releases.',
    metric: { value: '~300', label: 'case E2E regression suite' },
    overview:
      'Luv or Pop is the dating app from the “Pop the Balloon or Find Love” YouTube show, with in-app games and Prime Time, a time-boxed video-call dating feature.',
    role: 'Test designer and executor across mobile and web, including admin and API testing.',
    scope: [
      'Onboarding',
      'Matching',
      'Chat',
      'Subscriptions',
      'Vibe-matching games',
      'Prime Time video calls',
      'Admin panel and APIs',
    ],
    strategy: [
      { label: 'E2E regression', value: '~300 cases' },
      { label: 'Per feature', value: '60–80 cases' },
      { label: 'Design checks', value: 'Builds verified against Figma' },
      { label: 'API and admin', value: 'Validated in Postman' },
    ],
    tools: ['Postman', 'Figma', 'Android', 'iOS'],
    results: [
      'Built a ~300 case end-to-end regression suite.',
      'Tested Prime Time, where users decide to match when the call ends.',
      'Supported a smooth launch and stable releases.',
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
