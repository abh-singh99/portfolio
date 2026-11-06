import { about } from '@/content/home';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from './SectionHeading';
import { CountUp } from './CountUp';

const statIcon: Record<string, React.ReactNode> = {
  cases: <path d="M9 11l2 2 4-4M5 4h14v16H5zM9 17h6" />,
  products: <path d="M4 7l8-4 8 4-8 4-8-4zM4 12l8 4 8-4M4 17l8 4 8-4" />,
  launch: <path d="M12 15l-3-3a15 15 0 0 1 8-8c1.5 0 3 1.5 3 3a15 15 0 0 1-8 8zM9 12H5l2-4h4M12 15v4l4-2v-4M6 17c-1 1-1 3-1 3s2 0 3-1" />,
};

// The story, three stat cards, then the four points from Why work with me.
export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-16 border-t border-line">
      <Container className="flex flex-col gap-14 py-24 sm:py-36">
        <div className="flex flex-col gap-8">
          <SectionHeading id="about-heading" eyebrow={about.eyebrow} lines={about.heading} align="left" />
          <div className="flex max-w-4xl flex-col gap-5">
            {about.body.map((p) => (
              <p key={p} className="text-lead text-fg-muted">
                {p}
              </p>
            ))}
          </div>
        </div>

        <ul className="grid gap-4 md:grid-cols-3">
          {about.stats.map((s) => (
            <li key={s.label} className="glass glass-hover flex flex-col gap-6 rounded-card p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-flame/15 text-flame">
                  <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {statIcon[s.icon]}
                  </svg>
                </span>
                <p className="font-display text-bento font-semibold text-fg-hi">
                  <CountUp value={s.value} suffix={s.suffix} />
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-label font-semibold tracking-wide text-fg-hi uppercase">{s.label}</h3>
                <p className="text-body-sm text-fg-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {about.strengths.map((item, i) => (
            <li key={item.title} className="glass glass-hover flex flex-col gap-3 rounded-card p-6">
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
