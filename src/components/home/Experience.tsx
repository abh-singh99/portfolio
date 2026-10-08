import { experience } from '@/content/experience';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from './SectionHeading';

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="scroll-mt-16 border-t border-line">
      <Container className="flex flex-col gap-16 py-24 sm:py-36">
        <SectionHeading id="experience-heading" eyebrow={experience.eyebrow} lines={experience.heading} />
        <ol className="mx-auto flex w-full max-w-3xl flex-col">
          {experience.roles.map((r) => (
            <li
              key={`${r.company}-${r.period}`}
              className="flex flex-col items-center gap-3 border-t border-line py-10 text-center last:border-b"
              data-reveal
            >
              <p className="font-mono text-label text-flame">{r.period}</p>
              <h3 className="font-display text-bento font-semibold text-fg-hi">{r.company}</h3>
              <p className="text-body text-fg-muted">
                {r.title} · {r.location}
              </p>
              <p className="max-w-xl text-body text-fg">{r.summary}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
