import { Eyebrow } from '@/components/ui';

// Eyebrow plus a large statement heading. Lines render as blocks so each
// phrase breaks where the copy says, not where the measure falls.
export function SectionHeading({
  id,
  eyebrow,
  lines,
  size = 'statement',
  align = 'center',
}: {
  id: string;
  eyebrow: string;
  lines: string | readonly string[];
  size?: 'statement' | 'section';
  align?: 'left' | 'center';
}) {
  const list = typeof lines === 'string' ? [lines] : lines;
  return (
    <div className={`flex flex-col gap-4 ${align === 'center' ? 'items-center text-center' : ''}`} data-reveal>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className={`font-display font-semibold text-fg-hi ${size === 'statement' ? 'text-statement' : 'text-section'}`}>
        {list.map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
      </h2>
    </div>
  );
}
