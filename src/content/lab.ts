// Test Lab: hands-on demos of how Abhay tests, plus a sample bug report.
// Every demo is a simulation that runs in the visitor's browser. The shop
// (Apex Parts), its API and the sign-up form are fictional.

export type LabId = 'api' | 'functional' | 'boundary' | 'automation' | 'a11y';

export const testLab = {
  eyebrow: 'Test Lab',
  heading: ['Don’t take my *word* for it.', 'Test it _yourself._'],
  lead: 'Five working demos of how I test, on a fictional parts shop with real defects planted in it. Explore it by hand, design the test cases, then run the automated suite.',
  simulated: 'Simulated · runs in your browser',
  close: 'Close demo',
  done: 'Done',
  tabsLabel: 'Demos',
  cards: [
    { id: 'api', kind: 'Backend · Postman', title: 'API contract testing', body: 'Send requests to the shop’s orders API, set your own assertions and run the 9-request collection.', meta: '9 requests · 2 defects', cta: 'Open API client', tab: 'Backend', modalTitle: 'API testing' },
    { id: 'functional', kind: 'Functional · Exploratory', title: 'Break the checkout', body: 'An exploratory session on build 1.0. Test it against the requirements and expose six planted defects.', meta: '6 defects · bug board', cta: 'Start the session', tab: 'Functional', modalTitle: 'Functional testing' },
    { id: 'boundary', kind: 'Test design · BVA', title: 'Boundary values', body: 'Choose the values worth testing. An off-by-one defect hides at one edge, and only the right set exposes it.', meta: 'Coverage · partitions', cta: 'Design the tests', tab: 'Boundary values', modalTitle: 'Boundary value analysis' },
    { id: 'automation', kind: 'Automation · Playwright', title: 'Regression suite', body: 'Run 11 Playwright checks against the same checkout. Watch them fail on build 1.0 and pass on the fix.', meta: '11 tests · 2 builds', cta: 'Run the suite', tab: 'Automation', modalTitle: 'Test automation' },
    { id: 'a11y', kind: 'Accessibility · axe-core', title: 'Accessibility audit', body: 'Run a real axe-core scan on a sign-up form, inspect each WCAG violation, then verify the fixed build.', meta: 'WCAG 2.2 · live scan', cta: 'Run the audit', tab: 'Accessibility', modalTitle: 'Accessibility testing' },
  ] as const satisfies readonly { id: LabId; [k: string]: string }[],
};

/* ---------------------------------------------------------------- API */
export const apiLab = {
  steps: [
    'Send <b>Create order</b>. Status, timing and the Test Results tab are all live.',
    'Open <b>Unknown product</b> in the collection and send it. Read the test results against the contract.',
    'Edit the assertions in the <b>Tests</b> tab if you like, then press <b>Run collection</b> to run all 9 requests.',
  ],
  finish: 'Collection run complete: <b>7 passed, 2 failed</b>. A contract defect and a performance defect, each found by an assertion, not by looking at a screen.',
  explain: {
    intro: '<b>Context:</b> every screen in an app is backed by API calls. I test the contract directly: status codes, response shape, auth, bad input, limits and response time.',
    create: '<b>201 Created</b> with the new order in the body and a <span class="font-mono">location</span> header. All assertions pass.',
    unknown: '<b>Defect: contract violation.</b> An unknown product returns <span class="font-mono">200</span> with a <span class="font-mono">null</span> body instead of <span class="font-mono">404</span>. The app would render an empty product page and no error. Nothing on screen looks broken, so only an API test catches it.',
    slow: '<b>Defect: performance.</b> The sales summary takes over 400 ms against a 300 ms budget.',
  },
  real: 'On real projects: Postman collections with test scripts, run in CI, plus SQL checks on the data behind them. On NHS that covered 40+ APIs.',
};

/* ---------------------------------------------------------- Functional */
export const functionalLab = {
  requirements: [
    'Full name is required. It is shown on the confirmation as plain text.',
    'Email needs a name, an @ and a domain with an extension.',
    'Password has at least 8 characters.',
    'Quantity is a whole number from 1 to 10.',
    'Coupon SAVE10 gives 10% off, in any letter case. Other codes are rejected.',
    'VAT is 20% of the discounted amount.',
  ],
  defects: [
    { id: 'BUG-01', area: 'Email', severity: 'Major', technique: 'Equivalence partitioning', title: 'Email without an extension is accepted', expected: 'priya@example is rejected', actual: 'Accepted as valid', hint: 'Try an email address that is missing something after the domain.' },
    { id: 'BUG-02', area: 'Password', severity: 'Major', technique: 'Boundary value analysis', title: 'Password of exactly 8 characters is rejected', expected: '8 characters accepted', actual: 'Needs 9 or more', hint: 'The rule says “at least 8”. Test exactly on that edge.' },
    { id: 'BUG-03', area: 'Quantity', severity: 'Critical', technique: 'Boundary value analysis', title: 'Quantity 0 creates an order', expected: '0 is rejected', actual: 'Order accepted for £0.00', hint: 'What is just below the smallest allowed quantity?' },
    { id: 'BUG-04', area: 'Coupon', severity: 'Minor', technique: 'Equivalence partitioning', title: 'Coupon code is case-sensitive', expected: 'save10 and SAVE10 both work', actual: 'save10 is rejected', hint: 'The requirement says “in any letter case”.' },
    { id: 'BUG-05', area: 'Pricing', severity: 'Critical', technique: 'Calculation oracle', title: 'VAT is charged before the discount', expected: 'VAT on the discounted amount', actual: 'VAT on the full subtotal', hint: 'Place a valid order with SAVE10 and check the VAT line by hand.' },
    { id: 'BUG-06', area: 'Confirmation', severity: 'Critical', technique: 'Security · injection probe', title: 'Name is rendered without output encoding', expected: 'Markup shown as plain text', actual: 'Markup reaches the page as live HTML (simulated)', hint: 'Put some HTML in the name field, like &lt;b&gt;hi&lt;/b&gt;.' },
  ],
  steps: [
    'Exploratory session on <b>build 1.0</b>. Press <b>Fill valid example</b>, place an order, then change one field at a time against the requirements.',
  ],
  progress: (n: number, total: number) => `<b>${n} of ${total}</b> defects exposed. Keep going, or use a hint on the bug board.`,
  finish: 'All 6 defects exposed with <b>equivalence partitioning, boundary values, a calculation oracle and an injection probe</b>. Next, the Automation tab turns these into a regression suite.',
  noDefect: 'For this input, build 1.0 matches the requirements. Try another.',
  real: 'On real projects: requirement-based test cases plus exploratory sessions before every release. 300+ cases on NHS, 150+ defects logged in JIRA.',
};

/* ------------------------------------------------------------ Boundary */
export const boundaryLab = {
  field: 'Driver age for track days',
  steps: [
    'Track days are open to drivers aged <b>18 to 70</b>. Test a value, or add a standard set. The build under test has an off-by-one defect at one edge.',
  ],
  exposed: (vals: string) => `<b>Defect exposed by ${vals}.</b> The build disagrees with the specification at that edge.`,
  hidden: 'The build has a defect and your values haven’t exposed it yet. Test on and next to each edge.',
  none: 'This build has no defect. Every value should match the specification.',
  finish: 'That’s <b>boundary value analysis</b>: off-by-one defects live at the edges, so a handful of well-chosen values beats dozens of random ones.',
  partitions: 'Partitions: below the minimum is invalid, minimum to maximum is valid, above the maximum is invalid. The edges between them are where off-by-one defects live.',
  real: 'On real projects: every input rule gets boundary and equivalence cases before anything is automated.',
};

/* ---------------------------------------------------------- Automation */
export const automationLab = {
  start: 'Press <b>Run suite</b> to run the checkout regression suite against <b>build 1.0</b>, the build from the Functional tab.',
  failed: (n: number) => `<b>${n} tests failed</b>, one for each defect from the exploratory session. The developer ships <b>build 1.1</b>. Switch the build in the editor toolbar and run again.`,
  finish: 'All 11 pass on build 1.1. The suite now runs on every release, so none of these defects can quietly come back. That’s <b>regression automation</b>.',
  intro: '<b>Context:</b> each defect found by hand becomes an automated check. The browser on the right is driven by the test, not by you.',
  real: 'On real projects: Playwright (TypeScript), Selenium (Java) and FlowQA, the record-and-replay tool I built. Yeapp’s regression suite has 400–500 cases.',
};

/* ------------------------------------------------------- Accessibility */
export const a11yLab = {
  steps: [
    'Press <b>Run scan</b>. This runs axe-core, the engine behind most accessibility tools, on the sign-up form.',
    'Select a violation to highlight the element it’s about. Each one names the WCAG rule it breaks.',
    'Build 1.1 has the fixes. Switch to it in the panel and scan again.',
  ],
  finish: 'Zero violations on build 1.1. That’s <b>accessibility testing</b>: making sure people using screen readers, keyboards or zoom can complete the form.',
  intro: '<b>Context:</b> the form looks fine, but a screen reader can’t tell what the email field is for, and the button has no name.',
  caveat: 'Automated scans catch roughly a third of accessibility problems. I also test with the keyboard alone and with a screen reader.',
  real: 'On real projects: axe-core runs in this site’s own test suite on every release, in both light and dark themes.',
};

/* ---------------------------------------------------------- Bug report */
export const bugReport = {
  eyebrow: 'Bug report',
  heading: ['A `bug report` I would *send.*'],
  lead: 'Clear reports get bugs fixed the first time. This one is BUG-05 from the Test Lab checkout, so you can reproduce it yourself.',
  id: 'BUG-05',
  title: 'VAT is charged on the full subtotal instead of the discounted amount',
  fields: [
    { label: 'Severity', value: 'Critical · P1. Every discounted order is overcharged.' },
    { label: 'Environment', value: 'Apex Parts checkout, build 1.0 · Chrome 129 · macOS 15' },
    { label: 'Requirement', value: 'VAT is 20% of the discounted amount.' },
  ],
  steps: ['Open the checkout and press Fill valid example (2 × £120.00).', 'Enter the coupon SAVE10.', 'Press Place order and read the summary.'],
  expected: 'Subtotal £240.00, discount −£24.00, VAT £43.20, total £259.20.',
  actual: 'VAT £48.00, total £264.00. The customer pays £4.80 too much.',
  cause: 'VAT is calculated from the subtotal before the discount is applied.',
  regression: 'TC-09 in the checkout suite. Fails on build 1.0, passes on build 1.1.',
  reproduce: 'Reproduce it in the Test Lab',
  labels: { steps: 'Steps to reproduce', expected: 'Expected', actual: 'Actual', cause: 'Likely cause', regression: 'Regression test' },
};
