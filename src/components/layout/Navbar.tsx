"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "@/lib/data";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      // Determine active section
      const sections = navLinks.map((l) => l.href.replace("#", ""));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] w-[92%] max-w-[1200px]">
      <motion.nav
        className={`w-full rounded-2xl transition-all duration-300 ${
          scrolled
            ? "bg-[rgba(5,11,23,0.95)] border-[rgba(255,43,77,0.15)]"
            : "bg-[rgba(5,11,23,0.7)] border-[rgba(255,255,255,0.06)]"
        } backdrop-blur-xl border`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 4.2 }}
      >
        <div className="flex items-center justify-between px-6 h-[70px]">
          {/* Logo */}
          <a
            href="#"
            className="interactive flex items-center gap-3"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
              <span
                className="text-accent font-bold text-lg"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                DD
              </span>
            </div>
            <div
              className="hidden sm:block text-[0.6rem] font-bold tracking-[2px] leading-tight uppercase"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              <div>DEVENDRA</div>
              <div className="text-white/50">DEVARAKONDA</div>
            </div>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className={`interactive relative px-4 py-2 text-[0.7rem] font-semibold tracking-[1.5px] uppercase rounded-full transition-all duration-300 ${
                    isActive
                      ? "text-accent bg-accent/10"
                      : "text-white/60 hover:text-accent"
                  }`}
                  style={{ fontFamily: "var(--font-family-heading)" }}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full border border-accent/30"
                      layoutId="activeNav"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile toggle */}
          <button
            className="interactive md:hidden text-white/80 hover:text-accent transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden md:hidden border-t border-white/10 bg-bg-primary/95 backdrop-blur-xl rounded-b-2xl"
            >
              <div className="px-4 py-4 flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleNavClick(link.href)}
                    className={`interactive text-left px-4 py-3 text-sm font-medium tracking-wider uppercase rounded-lg transition-all ${
                      activeSection === link.href.replace("#", "")
                        ? "text-accent bg-accent/15 border border-accent/20"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                    style={{ fontFamily: "var(--font-family-heading)" }}
                  >
                    {link.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
