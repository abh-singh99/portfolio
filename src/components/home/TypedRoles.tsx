'use client';

import { useEffect, useState } from 'react';

// Types each role, holds it, deletes it, then moves to the next. Screen
// readers get one static sentence instead; under reduced motion the first
// role is shown and nothing animates.
export function TypedRoles({ roles, label }: { roles: readonly string[]; label: string }) {
  const [text, setText] = useState(roles[0]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let i = 0;
    let n = roles[0].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      if (deleting) {
        n -= 1;
        if (n === 0) {
          deleting = false;
          i = (i + 1) % roles.length;
        }
      } else {
        n += 1;
      }
      setText(roles[i].slice(0, n));
      const full = !deleting && n === roles[i].length;
      if (full) deleting = true;
      timer = setTimeout(step, full ? 1800 : deleting ? 40 : 75);
    };
    timer = setTimeout(step, 2200);
    return () => clearTimeout(timer);
  }, [roles]);

  return (
    <>
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="text-fg-hi">
        {text}
        <span className="type-caret" />
      </span>
    </>
  );
}
