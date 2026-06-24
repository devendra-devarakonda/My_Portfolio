"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (!cursor || !dot) return;

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let targetScale = 1;
    let currentScale = 1;
    let isRafActive = true;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
    };

    const onMouseEnterInteractive = () => {
      targetScale = 1.8;
      cursor.style.borderColor = "rgba(255, 43, 77, 0.8)";
      cursor.style.background = "rgba(255, 43, 77, 0.05)";
    };

    const onMouseLeaveInteractive = () => {
      targetScale = 1;
      cursor.style.borderColor = "rgba(255, 43, 77, 0.5)";
      cursor.style.background = "transparent";
    };

    const animate = () => {
      if (!isRafActive) return;
      
      // Initialize starting coordinates instantly to avoid jump from -100 to initial mouse coords
      if (cursorX === -100 && mouseX !== -100) {
        cursorX = mouseX;
        cursorY = mouseY;
      } else {
        cursorX += (mouseX - cursorX) * 0.12;
        cursorY += (mouseY - cursorY) * 0.12;
      }
      
      currentScale += (targetScale - currentScale) * 0.15;
      cursor.style.transform = `translate3d(${cursorX - 20}px, ${cursorY - 20}px, 0) scale(${currentScale})`;
      requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMouseMove);
    requestAnimationFrame(animate);

    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, [role="button"], .interactive'
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnterInteractive);
      el.addEventListener("mouseleave", onMouseLeaveInteractive);
    });

    // Hide on mobile
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const display = e.matches ? "none" : "block";
      cursor.style.display = display;
      dot.style.display = display;
    };
    handleMediaChange(mediaQuery);
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      isRafActive = false;
      document.removeEventListener("mousemove", onMouseMove);
      mediaQuery.removeEventListener("change", handleMediaChange);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterInteractive);
        el.removeEventListener("mouseleave", onMouseLeaveInteractive);
      });
    };
  }, []);

  return (
    <>
      {/* Outer ring cursor */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[10000] w-10 h-10 rounded-full border border-[rgba(255,43,77,0.5)] mix-blend-difference transition-[border-color,background] duration-200"
        style={{ left: 0, top: 0, transform: "translate3d(-100px, -100px, 0)" }}
      />
      {/* Inner dot */}
      <div
        ref={cursorDotRef}
        className="fixed pointer-events-none z-[10001] w-1.5 h-1.5 rounded-full bg-accent"
        style={{ left: 0, top: 0, transform: "translate3d(-100px, -100px, 0)" }}
      />
    </>
  );
}
