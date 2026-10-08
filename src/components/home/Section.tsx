import { Container } from '@/components/layout/Container';

// Editorial section: the statement heading owns the left column on wide
// screens, content takes the rest. Stacks below lg.
export function Section({
  id,
  heading,
  intro,
  children,
}: {
  id: string;
  heading: string;
  intro?: string;
  children: React.ReactNode;
}) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-16 py-20 sm:py-28">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="flex min-w-0 flex-col gap-3 lg:col-span-4" data-reveal>
          <h2 id={headingId} className="font-display text-statement font-semibold text-fg-hi text-balance">
            {heading}
          </h2>
          {intro && <p className="max-w-sm text-body text-fg-muted">{intro}</p>}
        </div>
        <div className="min-w-0 lg:col-span-8">{children}</div>
      </Container>
    </section>
  );
}
