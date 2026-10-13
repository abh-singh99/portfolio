import { parseAccents } from '@/lib/accents';

const CLASS = { serif: 'hd-serif', outline: 'hd-outline', strike: 'hd-strike', pill: 'hd-pill' } as const;

export function Accents({ text }: { text: string }) {
  return (
    <>
      {parseAccents(text).map((p, i) =>
        p.kind === 'strike' ? (
          <s key={i} className={CLASS.strike}>
            {p.text}
          </s>
        ) : p.kind ? (
          <span key={i} className={CLASS[p.kind]}>
            {p.text}
          </span>
        ) : (
          p.text
        ),
      )}
    </>
  );
}
