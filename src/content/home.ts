export const hero = {
  eyebrow: 'Abhay Pratap Singh · QA Engineer',
  // Accent marks: see src/lib/accents.ts.
  title: ['I _break_ *software*', 'before users do.'],
  location: 'Bengaluru, India · Open to QA roles',
  cta: { work: 'View projects', contact: 'Contact me' },
  intro:
    'QA Engineer in Bengaluru. I test mobile and web products end to end, from first build to store launch, with manual, API and automation testing.',
  proof: ['3,000+ test cases written', '5 products', '2 store launches'],
  availability: 'Open to QA roles',
};

export const marquee = [
  'Playwright',
  'Selenium',
  'Postman',
  'TypeScript',
  'Java',
  'SQL',
  'JIRA',
  'TestRail',
  'Figma',
  'ClickUp',
  'Chrome DevTools',
];

export const about = {
  eyebrow: 'About me',
  heading: ['Quality is a *process,*', 'not a ~phase.~'],
  body: 'My path into QA started in operations and data validation at Amazon, where root-cause work on high-volume discrepancies taught me to find exactly where things break. Since 2024 I have tested healthcare, e-commerce and consumer mobile products, and I am ISTQB certified.',
  // What sets the work apart; ownership end to end is told by the projects.
  strengths: [
    {
      title: 'Suites that scale',
      body: 'From 60–80 cases per feature up to a ~2,000 case end-to-end suite written from Figma.',
    },
    {
      title: 'I test below the UI',
      body: 'REST APIs in Postman and SQL reconciliation that caught 20+ discrepancies before go-live.',
    },
    {
      title: 'I automate what repeats',
      body: 'Playwright and Selenium suites, plus FlowQA, the automation platform I built.',
    },
  ],
};

export const toolkit = {
  eyebrow: 'Toolkit',
  heading: ['The *tools* behind', 'my testing.'],
  groups: [
    {
      label: 'Testing',
      items: ['Functional', 'Regression', 'Smoke and sanity', 'End-to-end', 'Integration', 'UAT', 'API', 'Mobile', 'Localization', 'SEO', 'Data validation'],
    },
    {
      label: 'Automation',
      items: ['Playwright (TypeScript)', 'Selenium WebDriver (Java)', 'XPath and CSS locators'],
    },
    {
      label: 'Tools',
      items: ['Postman', 'SQL', 'JIRA', 'ClickUp', 'TestRail', 'Figma', 'Confluence', 'Chrome DevTools', 'Git', 'Claude Code'],
    },
    {
      label: 'Practice',
      items: ['Agile and Scrum', 'SDLC and STLC', 'Defect lifecycle', 'Test design and planning'],
    },
  ],
};

export const statement =
  'From the first build to the store launch, I find what breaks, prove it with a test, and make sure it never ships again.';

export const work = {
  eyebrow: 'Selected projects',
  heading: ['Products I’ve helped *ship.*'],
  summaryLabel: 'Test summary',
  visitLabel: 'Visit site',
  appLabel: 'Get the app',
  soonLabel: 'Coming soon',
  newTab: 'opens in a new tab',
};

// The /get/<slug> page behind each app's screens.
export const getApp = {
  heading: (name: string) => `Get ${name}`,
  body: 'Opening the store for your phone. If nothing happens, pick a store below.',
  desktop: 'Pick your store to download the app.',
  play: 'Get it on Google Play',
  appStore: 'Download on the App Store',
  only: (name: string, platform: string) => `${name} is on ${platform} only for now.`,
  back: '← Back to projects',
};

export const credentials = {
  eyebrow: 'Credentials',
  heading: 'Certified and still *learning.*',
  items: [
    { name: 'ISTQB Certified Tester, Foundation Level', issuer: 'ISTQB' },
    { name: 'Databricks and AI for All', issuer: 'Databricks' },
    { name: 'Microsoft Excel', issuer: 'Certificate' },
    { name: 'Power BI', issuer: 'Certificate' },
  ],
  education: {
    name: 'Bachelor of Business Administration, Marketing and Operations',
    issuer: 'Galgotias University, 2018 to 2021',
  },
};

export const contact = {
  eyebrow: 'Contact',
  heading: ['Let’s talk about your `QA` *needs.*'],
  body: 'Hiring a QA engineer or need someone to own testing on your product? Send me the role details and tell me about your team.',
  copyLabel: 'Copy',
  copiedLabel: 'Copied',
  emailCta: 'Email me',
};
