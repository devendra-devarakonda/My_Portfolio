"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { personalInfo } from "@/lib/data";
import { Download } from "lucide-react";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-24 md:py-32 bg-[#050B17]/90 overflow-hidden">
      {/* Decorative line */}
      <div className="absolute top-12 right-0 w-24 h-[1px] bg-gradient-to-l from-accent/30 to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6">
        <div ref={ref} className="grid md:grid-cols-[auto_1fr] gap-12 md:gap-16 items-center">
          {/* Left: Portrait */}
          <motion.div
            className="relative flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="relative">
              {/* Orbiting ring */}
              <motion.div
                className="absolute inset-[-18px] rounded-full border border-accent/15"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-accent rounded-full shadow-[0_0_10px_rgba(255,43,77,0.6)]" />
              </motion.div>

              {/* Glow behind */}
              <div
                className="absolute inset-[-20px] rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(255,43,77,0.1) 0%, transparent 60%)",
                  filter: "blur(15px)",
                }}
              />

              <div className="relative w-[200px] h-[200px] rounded-full overflow-hidden border-[3px] border-accent/30 shadow-[0_0_40px_rgba(255,43,77,0.15)] hover:shadow-[0_0_60px_rgba(255,43,77,0.25)] transition-shadow duration-300">
                <Image
                  src="/images/hero.jpg"
                  alt={personalInfo.fullName}
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <div>
            <motion.h2
              className="text-3xl md:text-4xl font-black tracking-[3px] uppercase mb-6"
              style={{ fontFamily: "var(--font-family-heading)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              ABOUT
            </motion.h2>

            <motion.p
              className="text-white/60 text-sm md:text-[0.95rem] leading-[1.9] mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {personalInfo.fullName} is a visionary developer who combines technology
              and form into compelling and professional solutions. With expertise in
              full-stack development and AI engineering, he creates products that make
              a real impact.
            </motion.p>

            <motion.p
              className="text-white/60 text-sm md:text-[0.95rem] leading-[1.9] mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              With a passion for building scalable applications and AI-powered products,
              he brings ideas to life through elegant code, innovative architecture,
              and immersive digital experiences that push boundaries.
            </motion.p>

            <motion.a
              href={personalInfo.resumeUrl}
              className="interactive inline-flex items-center gap-3 px-7 py-3 border border-white/10 text-white text-[0.8rem] font-semibold tracking-[1px] uppercase rounded-lg hover:border-accent/50 hover:shadow-[0_0_25px_rgba(255,43,77,0.15)] transition-all duration-300"
              style={{ fontFamily: "var(--font-family-heading)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ y: -2 }}
            >
              <Download className="w-4 h-4" />
              Download CV
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}
