"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { socialLinks } from "@/lib/data";
import { Send } from "lucide-react";
import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
});

// Suppress internal Spline runtime timeline error in Next.js DevTools overlay
if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (
      args[0] &&
      typeof args[0] === "string" &&
      args[0].includes("Missing property")
    ) {
      return;
    }
    originalError(...args);
  };
}

// Custom SVG icons since lucide-react removed brand icons
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const MediumIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42s-3.38-2.88-3.38-6.42 1.51-6.42 3.38-6.42 3.38 2.88 3.38 6.42zm3.04 0c0 3.24-.31 5.86-.7 5.86s-.7-2.62-.7-5.86.31-5.86.7-5.86.7 2.62.7 5.86z"/>
  </svg>
);

const socialIcons: Record<string, React.ReactNode> = {
  linkedin: <LinkedInIcon />,
  github: <GitHubIcon />,
  twitter: <XIcon />,
  instagram: <InstagramIcon />,
  medium: <MediumIcon />,
};

export default function Contact() {
  const ref = useRef(null);
  const splineContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isSplineLoading, setIsSplineLoading] = useState(true);

  useEffect(() => {
    const container = splineContainerRef.current;
    if (!container) return;

    const cleanup = () => {
      // 1. Light DOM links
      container.querySelectorAll('a[href*="spline.design"]').forEach((el) => el.remove());
      container.querySelectorAll('a[href*="spline"]').forEach((el) => el.remove());

      // 2. Shadow DOM links/elements (like #logo in spline-viewer)
      container.querySelectorAll('*').forEach((el) => {
        if (el.shadowRoot) {
          el.shadowRoot.querySelectorAll('#logo, a[href*="spline"], a[href*="spline.design"]').forEach((logo) => {
            logo.remove();
          });
        }
      });
    };

    cleanup();

    const observer = new MutationObserver(() => {
      cleanup();
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
    });

    const interval = setInterval(cleanup, 500);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-black/30 backdrop-blur-sm overflow-hidden min-h-[650px] flex items-center">
      {/* Red decorative lines */}
      <div className="absolute top-20 right-0 w-20 h-[1px] bg-gradient-to-l from-accent/30 to-transparent" />
      <div className="absolute bottom-20 left-0 w-20 h-[1px] bg-gradient-to-r from-accent/30 to-transparent" />

      {/* Spline Canvas wrapper
          Mobile: absolute background, low opacity, clicks pass-through
          Laptop/Desktop: positioned on the left half, full opacity, interactive
      */}
      <div 
        ref={splineContainerRef}
        className="absolute inset-0 lg:left-0 lg:right-auto lg:w-1/2 lg:h-[600px] lg:top-1/2 lg:-translate-y-1/2 z-0 lg:z-10 opacity-30 lg:opacity-100 pointer-events-none lg:pointer-events-auto transition-opacity duration-700"
      >
        {isSplineLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-primary/50 backdrop-blur-sm z-20">
            <div className="relative w-14 h-14 mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-2 border-t-accent animate-spin" />
            </div>
            <span 
              className="text-[10px] uppercase tracking-[3px] text-accent font-bold animate-pulse"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              Loading 3D Core...
            </span>
          </div>
        )}
        <Spline
          scene="https://prod.spline.design/ugsf8Y3oatPuKhvV/scene.splinecode"
          onLoad={() => setIsSplineLoading(false)}
        />
      </div>

      <div className="relative z-10 max-w-[600px] lg:max-w-[1200px] w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" ref={ref}>
        {/* Left spacer column for laptop/desktop (so Spline has its visual area) */}
        <div className="hidden lg:block h-[560px] relative pointer-events-none">
          {/* Cover panel containing social links to mask the Spline watermark on laptop */}
          <div className="absolute bottom-0 left-32 bg-bg-primary pl-4 pt-4 pb-2 pr-2 z-20 pointer-events-auto flex items-center gap-40 rounded-tl-xl border-t border-l border-white/[0.05]">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="interactive w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-accent hover:border-accent/50 hover:shadow-[0_0_20px_rgba(255,43,77,0.2)] transition-all duration-300 bg-white/[0.02]"
                aria-label={link.name}
              >
                {socialIcons[link.icon]}
              </a>
            ))}
          </div>
        </div>

        {/* Right column containing the Contact Heading, Form, and Social Links */}
        <div className="w-full flex flex-col">
          <motion.h2
            className="text-3xl md:text-4xl font-black tracking-[3px] uppercase text-center lg:text-left mb-12"
            style={{ fontFamily: "var(--font-family-heading)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            MY CONTACT
          </motion.h2>

          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Name + Email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="interactive w-full px-5 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-white/30 focus:border-accent/50 focus:shadow-[0_0_15px_rgba(255,43,77,0.1)] transition-all duration-300"
                />
              </div>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="interactive w-full px-5 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-white/30 focus:border-accent/50 focus:shadow-[0_0_15px_rgba(255,43,77,0.1)] transition-all duration-300"
                />
              </div>
            </div>

            {/* Message */}
            <div className="relative group">
              <textarea
                placeholder="Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
                className="interactive w-full px-5 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-white/30 focus:border-accent/50 focus:shadow-[0_0_15px_rgba(255,43,77,0.1)] transition-all duration-300 resize-none"
              />
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              className="interactive relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent text-white text-[0.75rem] font-bold tracking-[2px] uppercase rounded-md overflow-hidden transition-all duration-300 hover:bg-accent-dark shimmer self-start lg:self-start mx-auto lg:mx-0"
              style={{
                fontFamily: "var(--font-family-heading)",
                boxShadow: "0 0 30px rgba(255,43,77,0.3)",
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send className="w-4 h-4" />
              {submitted ? "Message Sent!" : "Send Message"}
            </motion.button>
          </motion.form>
        </div>
      </div>

      {/* Mobile-only social links positioned at the bottom right to mask the Spline watermark */}
      <div className="lg:hidden absolute bottom-3 right-3 bg-bg-primary pl-4 pt-4 pb-2 pr-2 z-20 pointer-events-auto flex items-center gap-4 rounded-tl-xl border-t border-l border-white/[0.05]">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="interactive w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-accent hover:border-accent/50 hover:shadow-[0_0_20px_rgba(255,43,77,0.2)] transition-all duration-300 bg-white/[0.02]"
            aria-label={link.name}
          >
            {socialIcons[link.icon]}
          </a>
        ))}
      </div>
    </section>
  );
}
