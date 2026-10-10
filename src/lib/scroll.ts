import type Lenis from 'lenis';

// The page's Lenis instance, so overlays can pause smooth scroll while open.
// Null under reduced motion, where Lenis is never constructed.
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const pauseScroll = () => instance?.stop();
export const resumeScroll = () => instance?.start();
