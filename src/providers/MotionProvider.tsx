'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// One scroll clock: Lenis is driven by the GSAP ticker so ScrollTrigger and
// smooth scroll never drift apart. Under reduced motion neither is constructed.
function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ anchors: { offset: -72 }, lerp: 0.12 });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
}

// One motion context per route: reveals are built after each navigation and
// reverted on the next, so no tween outlives the page that owns it.
function useReveals(pathname: string) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const duration =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--duration-reveal'),
      ) / 1000 || 0.7;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 24,
          opacity: 0,
          duration,
          // GSAP's expo.out is the same curve as TPH --ease-expo.
          ease: 'expo.out',
          delay: Number(el.dataset.revealDelay ?? 0),
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      });

      // Paint text: words brighten in reading order as the block scrolls through.
      gsap.utils.toArray<HTMLElement>('[data-paint]').forEach((el) => {
        gsap.fromTo(
          el.querySelectorAll('.paint-word'),
          { opacity: 0.18 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: true },
          },
        );
      });
    });

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [pathname]);
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useSmoothScroll();
  useReveals(pathname);
  return <>{children}</>;
}
