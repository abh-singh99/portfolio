export const site = {
  name: 'Abhay Pratap Singh',
  role: 'QA Engineer',
  location: 'Bengaluru, India',
  email: 'singh.abhay99@outlook.com',
  phone: '+91 89328 70552',
  phoneHref: 'tel:+918932870552',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://abhay-qa.vercel.app',
  resume: {
    href: '/Abhay_Pratap_Singh_QA_Engineer_Resume.pdf',
    label: 'Download CV',
  },
  description:
    'QA Engineer in Bengaluru. Manual, API and automation testing with Playwright and Selenium across healthcare, e-commerce and consumer mobile apps.',
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/abhay-singh' },
    { label: 'GitHub', href: 'https://github.com/abh-singh99' },
  ],
  nav: [
    { label: 'Work', href: '/#work' },
    { label: 'About', href: '/#about' },
    { label: 'Experience', href: '/#experience' },
    { label: 'Contact', href: '/#contact' },
  ],
} as const;
