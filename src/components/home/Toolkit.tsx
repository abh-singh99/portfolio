import { toolkit } from '@/content/home';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from './SectionHeading';

// Bento cells: wide cells get the larger heading, so the grid has rhythm
// instead of four equal boxes.
const layout = [
  { span: 'md:col-span-4', size: 'text-bento' },
  { span: 'md:col-span-2', size: 'text-title' },
  { span: 'md:col-span-3', size: 'text-title' },
  { span: 'md:col-span-3', size: 'text-bento' },
];

export function Toolkit() {
  return (
    <section id="toolkit" aria-labelledby="toolkit-heading" className="scroll-mt-16">
      <Container className="flex flex-col gap-12 pt-12 pb-24 sm:pt-16 sm:pb-36">
        <SectionHeading id="toolkit-heading" eyebrow={toolkit.eyebrow} lines={toolkit.heading} size="section" />
        <ul className="grid border-t border-l border-line md:grid-cols-6">
          {toolkit.groups.map((group, i) => (
            <li
              key={group.label}
              className={`flex min-h-56 flex-col justify-between gap-10 border-r border-b border-line p-6 transition-colors hover:bg-surface-1 sm:p-9 ${layout[i % layout.length].span}`}
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
