"use client";

import dynamic from "next/dynamic";
import CinematicLoader from "@/components/effects/CinematicLoader";
import ParticleBackground from "@/components/effects/ParticleBackground";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero"; // Keep Hero static so it draws fast above the fold

// Dynamically split off sections below the fold
const About = dynamic(() => import("@/components/sections/About"), { ssr: false });
const Skills = dynamic(() => import("@/components/sections/Skills"), { ssr: false });
const Projects = dynamic(() => import("@/components/sections/Projects"), { ssr: false });
const GitHubActivity = dynamic(() => import("@/components/sections/GitHubActivity"), { ssr: false });
const Education = dynamic(() => import("@/components/sections/Education"), { ssr: false });
const Blogs = dynamic(() => import("@/components/sections/Blogs"), { ssr: false });
const Contact = dynamic(() => import("@/components/sections/Contact"), { ssr: false });
const Footer = dynamic(() => import("@/components/layout/Footer"), { ssr: false });

const FloatingHireCTA = dynamic(() => import("@/components/effects/FloatingHireCTA"), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/effects/CustomCursor"), { ssr: false });

export default function Home() {
  return (
    <>
      {/* Cinematic Loader */}
      <CinematicLoader />

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Background particles */}
      <ParticleBackground />

      {/* Floating Hire Me CTA */}
      <FloatingHireCTA />

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main className="relative z-[1]">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <GitHubActivity />
        <Education />
        <Blogs />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
