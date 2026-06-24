"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket } from "lucide-react";

export default function FloatingHireCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToContact = () => {
    const target = document.getElementById("contact");
    if (target) {
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(target);
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          onClick={scrollToContact}
          className="interactive fixed bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-3 rounded-full font-heading text-xs font-bold tracking-widest uppercase text-white bg-accent hover:bg-accent-dark transition-all duration-300"
          style={{
            fontFamily: "var(--font-family-heading)",
            boxShadow: "0 0 30px rgba(255,43,77,0.4), 0 0 60px rgba(255,43,77,0.2)",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Rocket className="w-4 h-4" />
          Hire Me
        </motion.button>
      )}
    </AnimatePresence>
  );
}
