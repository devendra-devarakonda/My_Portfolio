"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import dynamic from "next/dynamic";
import { personalInfo } from "@/lib/data";
import { ChevronDown } from "lucide-react";
import { useBackground } from "@/components/backgrounds/BackgroundProvider";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const isHeroInView = useInView(ref, { margin: "200px 0px 200px 0px" });
  const { setIsLiquidEtherEnabled } = useBackground();

  useEffect(() => {
    setIsLiquidEtherEnabled(!isHeroInView);
    return () => setIsLiquidEtherEnabled(true);
  }, [isHeroInView, setIsLiquidEtherEnabled]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} id="hero" className="relative min-h-screen w-full flex items-center overflow-hidden">
      {/* Background Image completely filling the section */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/images/hero.jpg"
          alt="Background Image"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Subtle overlay to ensure text readability without obscuring the background */}
        <div className="absolute inset-0 bg-bg-primary/40" />
        {/* Smooth fade to bg-primary at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/20 to-transparent" />
      </div>

      {/* Three.js background */}
      {isHeroInView && <HeroScene />}

      {/* Decorative arcs (white circles like reference) */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {/* Large outer arc */}
        <div
          className="absolute top-1/2 right-[15%] transform -translate-y-1/2 w-[500px] h-[500px] rounded-full border-[3px] border-white/[0.12]"
        />
        {/* Top-right arc fragment */}
        <div
          className="absolute -top-[80px] right-[5%] w-[350px] h-[350px] rounded-full border-[3px] border-white/[0.08]"
          style={{ clipPath: "polygon(0 40%, 100% 0, 100% 100%, 0 100%)" }}
        />
        {/* Small bottom-left arc */}
        <motion.div
          className="absolute bottom-[20%] left-[8%] w-[150px] h-[150px] rounded-full border-[2px] border-accent/20"
          animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        {/* Red glow orb */}
        <motion.div
          className="absolute bottom-[15%] left-[5%] w-[250px] h-[250px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,43,77,0.08) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-[3] w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between gap-12 pt-20"
        style={{ opacity }}
      >
        {/* Left: Text content */}
        <motion.div className="flex-1 max-w-[550px]">
          <motion.h1
            className="text-[2.2rem] sm:text-[3rem] md:text-[4rem] lg:text-[4.5rem] font-black leading-[0.95] tracking-[2px] uppercase mb-4"
            style={{ fontFamily: "var(--font-family-heading)" }}
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 4.3 }}
          >
            <span className="block">{personalInfo.name}</span>
            <span className="block">{personalInfo.lastName}</span>
          </motion.h1>

          <motion.p
            className="text-[0.75rem] md:text-[0.85rem] font-normal tracking-[5px] uppercase text-white/50 mb-3"
            style={{ fontFamily: "var(--font-family-heading)" }}
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 4.5 }}
          >
            {personalInfo.title}
          </motion.p>

          <motion.p
            className="text-[0.65rem] md:text-[0.75rem] font-normal tracking-[5px] uppercase text-accent/70 mb-8"
            style={{ fontFamily: "var(--font-family-heading)" }}
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 4.6 }}
          >
            {personalInfo.subtitle}
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-white/50 leading-relaxed mb-10 max-w-[420px]"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 4.7 }}
          >
            {personalInfo.description}
          </motion.p>

          <motion.a
            href="#projects"
            className="interactive group relative inline-flex items-center gap-3 px-8 py-4 bg-accent text-white text-[0.75rem] font-bold tracking-[2px] uppercase rounded-md overflow-hidden transition-all duration-300 hover:bg-accent-dark shimmer"
            style={{
              fontFamily: "var(--font-family-heading)",
              boxShadow: "0 0 30px rgba(255,43,77,0.3)",
            }}
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 4.9 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.preventDefault();
              const target = document.getElementById("projects");
              if (target) {
                if ((window as any).lenis) {
                  (window as any).lenis.scrollTo(target);
                } else {
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }
            }}
          >
            Explore Portfolio
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5.5 }}
      >
        <span className="text-[0.6rem] tracking-[3px] uppercase text-white/30" style={{ fontFamily: "var(--font-family-heading)" }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-4 h-4 text-accent/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
