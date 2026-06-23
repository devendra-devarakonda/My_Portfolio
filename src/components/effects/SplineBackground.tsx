"use client";

import { useState, useEffect } from "react";
import Spline from "@splinetool/react-spline";

export default function SplineBackground() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Fade in the Spline scene when scrolling past 200px (leaving the Hero section)
      setShow(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[1] select-none pointer-events-none transition-opacity duration-[1200ms] ease-in-out"
      style={{
        opacity: show ? 0.8 : 0,
        visibility: show ? "visible" : "hidden",
      }}
    >
      <Spline scene="https://prod.spline.design/H0DnCjMK0r6uC-1E/scene.splinecode" />
    </div>
  );
}
