"use client";

import { personalInfo } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="relative py-6 bg-bg-secondary border-t border-white/[0.05]">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <p className="text-[0.7rem] tracking-[1px] text-white/30">
          Powered by{" "}
          <span className="text-accent font-semibold">{personalInfo.fullName}</span>{" "}
          &copy; {new Date().getFullYear()}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
