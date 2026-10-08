import { site } from '@/content/site';

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="flex flex-col gap-2 px-4 py-6 text-caption text-fg-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p className="font-mono">{site.builtWith}</p>
      </div>
    </footer>
  );
}
