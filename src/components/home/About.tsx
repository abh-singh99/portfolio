import { about } from '@/content/home';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from './SectionHeading';

// The story, then the four points that used to be Why work with me.
export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-8 border-t border-line">
      <Container className="flex flex-col gap-12 py-24 sm:py-36">
        <div className="flex flex-col gap-8">
          <SectionHeading id="about-heading" eyebrow={about.eyebrow} lines={about.heading} align="left" />
          <p className="max-w-4xl text-lead text-fg-muted">{about.body}</p>
        </div>
        <ol className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {about.strengths.map((item, i) => (
            <li key={item.title} className="flex flex-col gap-3 border-t border-line-hi pt-6">
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
