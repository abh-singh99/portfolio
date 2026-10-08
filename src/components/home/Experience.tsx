import { experience } from '@/content/experience';
import { Section } from './Section';

export function Experience() {
  return (
    <Section id="experience" heading={experience.heading}>
      <ol className="border-b border-line">
        {experience.roles.map((r) => (
          <li
            key={`${r.company}-${r.period}`}
            className="grid gap-2 border-t border-line py-6 sm:grid-cols-[11rem_1fr] sm:gap-6"
            data-reveal
          >
            <p className="font-mono text-label text-fg-muted">{r.period}</p>
            <div className="flex flex-col gap-1">
              <h3 className="text-subheading font-semibold text-fg-hi">
                {r.title}, {r.company}
              </h3>
              <p className="text-label text-fg-muted">{r.location}</p>
              <p className="mt-2 max-w-2xl text-body text-fg">{r.summary}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
