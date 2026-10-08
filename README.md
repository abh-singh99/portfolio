# Abhay Pratap Singh, QA Engineer

Personal portfolio. Next.js 15 (App Router), Tailwind v4 on the TPH design foundation, GSAP and Lenis for scroll motion.

## Develop

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

## Edit content

All copy lives in `src/content/`. Components hold no strings.

| File | What it holds |
| --- | --- |
| `site.ts` | Name, contact details, socials, nav, CV path |
| `home.ts` | Hero, about, strengths, FlowQA, credentials, contact copy |
| `projects.ts` | The five projects and their case studies |
| `experience.ts` | Career timeline |

Replace `public/Abhay_Pratap_Singh_QA_Engineer_Resume.pdf` to update the CV.

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_FORMSPREE_ID` | Formspree form ID. Without it, the contact form opens the visitor's mail app. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata and the sitemap. |

## Quality

```bash
pnpm check          # type-check, lint, build, Playwright
```

The Playwright suite covers navigation, all case-study routes, the CV download, contact form validation, the theme toggle, reduced motion, SEO files and axe WCAG 2.2 AA scans in both themes, on desktop and mobile. It runs in GitHub Actions on every push.

Design tokens come from `src/styles/foundation.css` (TPH foundation, kept unedited). App overrides are in `src/app/globals.css`.

Layout inspired by [manshaqarib.vercel.app](https://manshaqarib.vercel.app). All code and content here are original.
