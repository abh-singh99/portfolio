import { about } from '@/content/home';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from './SectionHeading';

// Bento cells: wide cells get the larger heading, so the grid has rhythm
// instead of five equal boxes.
const layout = [
  { span: 'md:col-span-4', size: 'text-bento' },
  { span: 'md:col-span-2', size: 'text-title' },
  { span: 'md:col-span-3', size: 'text-title' },
  { span: 'md:col-span-3', size: 'text-bento' },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-8">
      {/* Wide measure on purpose: the story reads as two short blocks under the statement. */}
      <Container className="flex flex-col gap-10 py-24 sm:py-36">
        <SectionHeading id="about-heading" eyebrow={about.eyebrow} lines={about.heading} align="left" />
        <div className="flex flex-col gap-5" data-reveal>
          {about.body.map((p) => (
            <p key={p} className="text-lead text-fg-muted">
              {p}
            </p>
          ))}
        </div>
      </Container>

      <Container className="flex flex-col gap-12 pb-24 sm:pb-36">
        <SectionHeading id="stack-heading" eyebrow={about.stackEyebrow} lines={about.stackHeading} size="section" />
        <ul className="grid border-t border-l border-line md:grid-cols-6">
          {about.stack.map((group, i) => (
            <li
              key={group.label}
              className={`flex min-h-56 flex-col justify-between gap-10 border-r border-b border-line p-6 transition-colors hover:bg-surface-1 sm:p-9 ${layout[i % layout.length].span}`}
              data-reveal
            >
              <h3 className={`font-display font-semibold text-fg-hi ${layout[i % layout.length].size}`}>{group.label}</h3>
              <p className="max-w-sm text-body text-fg-muted">{group.items.join(', ')}.</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
