// Headline accents, marked inline in content strings:
//   *word*  serif italic in flame   _word_  outlined
//   ~word~  serif, struck through   `word`  mono pill
export type AccentKind = 'serif' | 'outline' | 'strike' | 'pill';
export type AccentPart = { text: string; kind?: AccentKind };

const MARKS: Record<string, AccentKind> = { '*': 'serif', _: 'outline', '~': 'strike', '`': 'pill' };
const PATTERN = /([*_~`])(.+?)\1/g;

export function parseAccents(text: string): AccentPart[] {
  const parts: AccentPart[] = [];
  let last = 0;
  for (const m of text.matchAll(PATTERN)) {
    if (m.index > last) parts.push({ text: text.slice(last, m.index) });
    parts.push({ text: m[2], kind: MARKS[m[1]] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}

/** The heading without its accent marks, for metadata, images and keys. */
export const plainText = (text: string) => text.replace(PATTERN, '$2');
