import type Lenis from 'lenis';

// The page's Lenis instance, so overlays can pause smooth scroll while open.
// Null under reduced motion, where Lenis is never constructed.
let instance: Lenis | null = null;
let lockedAt: number | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

// Freezes the page behind an overlay. Pinning the body in place (rather than
// only overflow: hidden) also stops touch swipes outside the panel from
// scrolling the page on iOS. Unlock puts the reader back where they were.
export function lockScroll() {
  if (lockedAt !== null) return;
  lockedAt = window.scrollY;
  instance?.stop();
  const b = document.body.style;
  b.position = 'fixed';
  b.top = `-${lockedAt}px`;
  b.left = '0';
  b.right = '0';
  b.overflow = 'hidden';
}

export function unlockScroll() {
  if (lockedAt === null) return;
  const y = lockedAt;
  lockedAt = null;
  const b = document.body.style;
  b.position = b.top = b.left = b.right = b.overflow = '';
  window.scrollTo({ top: y, behavior: 'instant' });
  instance?.scrollTo(y, { immediate: true, force: true });
  instance?.start();
}
