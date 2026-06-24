"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Instantiate Lenis with configuration settings optimized for Framer Motion + WebGL combinations
    const lenis = new Lenis({
      duration: 0.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.2,
      touchMultiplier: 1.3,
    });

    lenisRef.current = lenis;
    if (typeof window !== "undefined") {
      (window as any).lenis = lenis;
    }

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Sync window scroll with internal hash links (like your #projects navbar buttons)
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const target = document.querySelector(hash) as HTMLElement;
        if (target) {
          lenis.scrollTo(target);
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      if (typeof window !== "undefined") {
        delete (window as any).lenis;
      }
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return <>{children}</>;
}
