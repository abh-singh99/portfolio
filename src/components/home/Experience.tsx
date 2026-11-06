import { experience } from '@/content/experience';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from './SectionHeading';

// A vertical timeline: a flame rail with a node per role, each role a glass card.
export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="scroll-mt-16 border-t border-line">
      <Container className="flex flex-col gap-16 py-24 sm:py-36">
        <SectionHeading id="experience-heading" eyebrow={experience.eyebrow} lines={experience.heading} align="left" />
        <ol className="relative flex flex-col gap-6 pl-8 sm:pl-12">
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[5px] w-px bg-gradient-to-b from-flame via-line-hi/50 to-transparent sm:left-[7px]"
          />
          {experience.roles.map((r, i) => (
            <li key={`${r.company}-${r.period}`} className="relative">
              <span
                aria-hidden="true"
                className={`absolute top-8 -left-8 size-3 rounded-full border-2 border-flame sm:-left-12 sm:size-4 ${i === 0 ? 'status-dot bg-flame' : 'bg-surface-0'}`}
              />
              <article className="glass glass-hover grid gap-3 rounded-card p-6 sm:grid-cols-[1fr_auto] sm:gap-x-8 sm:p-8">
                <div className="flex flex-col gap-1">
                  <h3 className="font-display text-title font-semibold text-fg-hi">{r.company}</h3>
                  <p className="text-body text-fg-muted">
                    {r.title} · {r.location}
                  </p>
                </div>
                <p className="font-mono text-label text-flame sm:text-right">{r.period}</p>
                <p className="max-w-2xl text-body text-fg sm:col-span-2">{r.summary}</p>
              </article>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
