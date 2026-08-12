"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { personalInfo } from "@/lib/data";
import { Download } from "lucide-react";
import SectionHeading from "@/components/section-headings/SectionHeading";
import ScrollHighlight from "@/components/ui/ScrollHighlight";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const aboutText = `I am a visionary developer who combines technology and form into compelling and professional solutions. With expertise in full-stack development and AI engineering, I create products that make a real impact. With a passion for building scalable applications and AI-powered products, I bring ideas to life through elegant code, innovative architecture, and immersive digital experiences that push boundaries.`;

  return (
    <section 
      id="about" 
      className="relative py-24 lg:py-32 lg:min-h-[150vh] bg-[#050B17]/90 overflow-hidden flex flex-col justify-center items-center"
    >
      {/* Decorative lines */}
      <div className="absolute top-12 right-0 w-24 h-[1px] bg-gradient-to-l from-accent/30 to-transparent" />
      <div className="absolute bottom-12 left-0 w-24 h-[1px] bg-gradient-to-r from-accent/30 to-transparent" />

      <div className="max-w-[1000px] w-full mx-auto px-6 text-center" ref={ref}>
        <SectionHeading
          className="text-3xl md:text-4xl font-black tracking-[3px] uppercase mb-12 lg:mb-16 text-center mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          ABOUT
        </SectionHeading>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 lg:mb-16 flex justify-center w-full"
        >
          <ScrollHighlight
            text={aboutText}
            splitBy="words"
            dimColor="rgba(255, 255, 255, 0)"
            highlightColor="#FFA8B6"
            scrollStart="top 75%"
            scrollEnd="bottom 30%"
            scrub={true}
            font={{
              fontFamily: "var(--font-family-body), 'Inter', sans-serif",
              fontSize: "clamp(1.5rem, 2.5vw, 2.4rem)",
              fontWeight: 600,
              lineHeight: "1.75em",
              letterSpacing: "-0.01em",
              textAlign: "center",
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center"
        >
          <a
            href={personalInfo.resumeUrl}
            className="interactive inline-flex items-center gap-3 px-8 py-3.5 border border-white/10 text-white text-[0.8rem] font-semibold tracking-[1px] uppercase rounded-lg hover:border-accent/50 hover:shadow-[0_0_25px_rgba(255,43,77,0.15)] transition-all duration-300 bg-white/[0.02]"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            <Download className="w-4 h-4" />
            Download CV
          </a>
        </motion.div>
      </div>
    </section>
  );
}
