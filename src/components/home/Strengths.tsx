import { strengths } from '@/content/home';
import { Section } from './Section';

export function Strengths() {
  return (
    <Section id="strengths" heading={strengths.heading}>
      <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
        {strengths.items.map((item) => (
          <li key={item.title} className="flex flex-col gap-2 border-t border-line pt-4" data-reveal>
            <h3 className="text-subheading font-semibold text-fg-hi">{item.title}</h3>
            <p className="text-body text-fg-muted">{item.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
