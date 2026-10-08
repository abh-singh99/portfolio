import { experience } from '@/content/experience';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from './SectionHeading';

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="scroll-mt-8 border-t border-line">
      <Container className="flex flex-col gap-16 py-24 sm:py-36">
        <SectionHeading id="experience-heading" eyebrow={experience.eyebrow} lines={experience.heading} size="section" />
        <ol className="border-b border-line">
          {experience.roles.map((r) => (
            <li
              key={`${r.company}-${r.period}`}
              className="grid gap-3 border-t border-line py-8 transition-colors hover:bg-surface-1 sm:px-4 lg:grid-cols-12 lg:gap-8"
              data-reveal
            >
              <p className="font-mono text-label text-fg-muted lg:col-span-3">{r.period}</p>
              <div className="flex flex-col gap-1 lg:col-span-4">
                <h3 className="text-heading font-semibold text-fg-hi">{r.company}</h3>
                <p className="text-body text-fg-muted">
                  {r.title} · {r.location}
                </p>
              </div>
              <p className="text-body text-fg lg:col-span-5">{r.summary}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
