import { about } from '@/content/home';
import { Section } from './Section';

export function About() {
  return (
    <Section id="about" heading={about.heading}>
      <div className="flex flex-col gap-12">
        <div className="flex max-w-2xl flex-col gap-4" data-reveal>
          {about.body.map((p) => (
            <p key={p} className="text-subheading text-fg">
              {p}
            </p>
          ))}
        </div>
        <dl className="grid gap-8 sm:grid-cols-2">
          {about.stack.map((group) => (
            <div key={group.label} className="flex flex-col gap-3 border-t border-line pt-4" data-reveal>
              <dt className="text-label font-medium text-fg-hi">{group.label}</dt>
              <dd className="text-body-sm text-fg-muted">{group.items.join(' · ')}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
