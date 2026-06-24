"use client";

import React, { useRef } from "react";
import { useInView, motion } from "framer-motion";
import ShinyText from "../ui/ShinyText";

interface SectionHeadingProps {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  initial?: any;
  animate?: any;
  transition?: any;
}

export default function SectionHeading({
  children,
  className = "",
  style = {},
  initial,
  animate,
  transition
}: SectionHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  
  // Trigger exactly once per page session when entering viewport for the first time
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px 0px"
  });

  return (
    <motion.h2
      ref={ref}
      className={className}
      style={{
        fontFamily: "var(--font-family-heading)",
        textShadow: "0 0 10px rgba(255, 43, 77, 0.15), 0 0 20px rgba(255, 43, 77, 0.08)",
        ...style
      }}
      initial={initial}
      animate={animate}
      transition={transition}
    >
      <ShinyText
        text={children}
        animate={isInView}
        color="#A5A5A5"
        shineColor="#FFFFFF"
        spread={140}
        direction="left"
      />
    </motion.h2>
  );
}
