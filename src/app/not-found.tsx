import Link from 'next/link';
import { Container } from '@/components/layout/Container';

export default function NotFound() {
  return (
    <Container className="flex flex-col gap-6 pt-40 pb-32">
      <p className="font-mono text-label text-fg-muted">404</p>
      <h1 className="font-display text-statement font-semibold text-fg-hi">This page failed its test.</h1>
      <p className="text-body text-fg-muted">The page you were looking for does not exist.</p>
      <Link href="/" className="w-fit text-label font-medium text-link hover:text-link-hi">
        Back to home
      </Link>
    </Container>
  );
}
