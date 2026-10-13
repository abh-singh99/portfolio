import { about } from '@/content/home';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from './SectionHeading';

// The story, then what sets the work apart. Ownership end to end is left to
// the project rows so it isn't said three times.
export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-8 border-t border-line">
      <Container className="flex flex-col gap-12 py-24 sm:py-36">
        <div className="flex flex-col gap-8">
          <SectionHeading id="about-heading" eyebrow={about.eyebrow} lines={about.heading} align="left" />
          <p className="max-w-4xl text-lead text-fg-muted">{about.body}</p>
        </div>
        <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-3">
          {about.strengths.map((item) => (
            <li key={item.title} className="flex flex-col gap-3 border-t border-line-hi pt-6">
              <h3 className="text-heading font-semibold text-fg-hi">{item.title}</h3>
              <p className="text-body text-fg-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
