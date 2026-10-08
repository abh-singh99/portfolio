import { site } from '@/content/site';

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-6 text-micro text-fg-muted sm:px-8 sm:text-caption">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p className="font-mono">{site.builtWith}</p>
      </div>
    </footer>
  );
}
