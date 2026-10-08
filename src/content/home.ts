export const hero = {
  title: ['I break things', 'before your', 'users do.'],
  // Index into title of the word set in the flame accent.
  accentLine: 2,
  intro:
    'QA Engineer in Bengaluru. I test mobile and web products end to end, from first build to store launch, with manual, API and automation testing.',
  proof: ['3,000+ test cases written', '5 products', '2 store launches'],
  availability: 'Open to QA roles',
};

export const about = {
  heading: 'Quality is a process, not a phase.',
  body: [
    'I own testing from the first build through release. That means writing the suites, running every regression and smoke pass, checking the APIs and data underneath, and automating what repeats.',
    'My path into QA started in operations and data validation at Amazon, where root-cause work on high-volume discrepancies taught me to find exactly where things break. Since 2024 I have tested healthcare, e-commerce and consumer mobile products, and I am ISTQB certified.',
  ],
  stack: [
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

export const work = {
  heading: 'Selected work',
  intro: 'Five products, each with the suite I built and what it changed.',
  caseStudyLabel: 'Read case study',
};

export const strengths = {
  heading: 'Why work with me',
  items: [
    {
      title: 'I own the whole path',
      body: 'From early builds to the Play Store and App Store, and every release after launch.',
    },
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

export const flowqa = {
  heading: 'FlowQA',
  lead: 'A record-and-replay automation platform I developed. Record a flow once, run it on any environment, and export it as real Playwright code.',
  features: [
    { title: 'Record and replay', body: 'Capture end-to-end flows in the browser and replay them as tests.' },
    { title: 'Multi-environment runs', body: 'Dev, staging and production, with safeguards on production.' },
    { title: 'Reusable building blocks', body: 'Shared steps, shared variables and test plan import.' },
    { title: 'Project health', body: 'A dashboard with run history and reports.' },
  ],
  codeCaption: 'Example: a recorded flow exported as a standalone Playwright test',
  code: `import { test, expect } from '@playwright/test';

test('checkout with a saved part', async ({ page }) => {
  await page.goto(process.env.BASE_URL!);
  await page.getByRole('link', { name: 'Parts' }).click();
  await page.getByRole('button', { name: 'Add to cart' }).first().click();
  await page.getByRole('link', { name: 'Cart' }).click();
  await expect(page.getByRole('heading', { name: 'Your cart' })).toBeVisible();
});`,
  exportsLabel: 'Exports to',
  exports: ['TypeScript', 'JavaScript', 'Python'],
  cta: 'Read the FlowQA case study',
};

export const credentials = {
  heading: 'Credentials',
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
  heading: 'Let’s talk about your QA needs.',
  body: 'Hiring for a QA role or need someone to own testing on your product? Send a note with the details.',
  availability: 'Based in Bengaluru. Open to on-site, hybrid and remote roles.',
  copyLabel: 'Copy email',
  copiedLabel: 'Email copied',
  form: {
    name: 'Name',
    email: 'Email',
    message: 'Message',
    submit: 'Send message',
    sending: 'Sending',
    success: 'Message sent. Thanks, I will get back to you soon.',
    error: 'Could not send. Please email me directly instead.',
    required: 'Required',
    invalidEmail: 'Enter a valid email address',
  },
};
