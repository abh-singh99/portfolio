import { statement } from '@/content/home';
import { Container } from '@/components/layout/Container';

export function PaintStatement() {
  return (
    <section aria-label="Approach" className="bg-surface-1">
      <Container className="py-28 sm:py-40">
        <p data-paint className="max-w-5xl font-display text-statement font-bold text-fg-hi">
          {statement.split(' ').map((w, i) => (
            <span key={i}>
              <span className="paint-word">{w}</span>{' '}
            </span>
          ))}
        </p>
      </Container>
    </section>
  );
}
