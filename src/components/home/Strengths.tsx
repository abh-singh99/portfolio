import { strengths } from '@/content/home';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from './SectionHeading';

export function Strengths() {
  return (
    <section id="strengths" aria-labelledby="strengths-heading" className="border-t border-line">
      <Container className="flex flex-col gap-16 py-24 sm:py-36">
        <SectionHeading id="strengths-heading" eyebrow={strengths.eyebrow} lines={strengths.heading} />
        <ol className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {strengths.items.map((item, i) => (
            <li key={item.title} className="flex flex-col gap-4 border-t border-line-hi pt-6" data-reveal>
              <span className="font-mono text-label text-flame">0{i + 1}</span>
              <h3 className="text-heading font-semibold text-fg-hi">{item.title}</h3>
              <p className="text-body text-fg-muted">{item.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
