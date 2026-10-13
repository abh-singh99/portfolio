import { Eyebrow } from '@/components/ui';
import { Accents } from '@/components/Accents';

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
    <div className={`flex flex-col gap-4 ${align === 'center' ? 'items-center text-center' : ''}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className={`hd-mix text-fg-hi ${size === 'statement' ? 'text-statement' : 'text-section'}`}>
        {list.map((l) => (
          <span key={l} className="block">
            <Accents text={l} />
          </span>
        ))}
      </h2>
    </div>
  );
}
