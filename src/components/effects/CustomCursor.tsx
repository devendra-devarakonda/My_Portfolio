"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (!cursor || !dot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    const onMouseEnterInteractive = () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1.8)";
      cursor.style.borderColor = "rgba(255, 43, 77, 0.8)";
      cursor.style.background = "rgba(255, 43, 77, 0.05)";
    };

    const onMouseLeaveInteractive = () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
      cursor.style.borderColor = "rgba(255, 43, 77, 0.5)";
      cursor.style.background = "transparent";
    };

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.12;
      cursorY += (mouseY - cursorY) * 0.12;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMouseMove);
    animate();

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
        className="fixed pointer-events-none z-[10000] w-10 h-10 rounded-full border border-[rgba(255,43,77,0.5)] mix-blend-difference transition-[transform,border-color,background] duration-200"
        style={{ transform: "translate(-50%, -50%)" }}
      />
      {/* Inner dot */}
      <div
        ref={cursorDotRef}
        className="fixed pointer-events-none z-[10001] w-1.5 h-1.5 rounded-full bg-accent"
        style={{ transform: "translate(-50%, -50%)" }}
      />
    </>
  );
}
