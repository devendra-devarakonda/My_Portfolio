"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const loadingSteps = [
  "Initializing Devendra OS...",
  "Loading Projects...",
  "Loading Experience...",
  "Access Granted.",
];

export default function CinematicLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("loaderShown")) {
      setIsLoading(false);
      return;
    }

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < loadingSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 60);

    const timeout = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem("loaderShown", "true");
    }, 4000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "#020408" }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Scanlines overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-5"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
            }}
          />

          {/* Glowing orb */}
          <motion.div
            className="absolute w-[300px] h-[300px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,43,77,0.15) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Terminal window */}
          <div className="relative w-[460px] max-w-[90vw]">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-t-xl border border-b-0 border-white/10 bg-white/5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              <span className="ml-3 text-xs text-white/30 font-mono">devendra-os — terminal</span>
            </div>

            {/* Terminal body */}
            <div className="px-5 py-5 rounded-b-xl border border-white/10 bg-[#0a0e1a]/90 backdrop-blur-xl font-mono text-sm">
              {loadingSteps.slice(0, currentStep + 1).map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-2 flex items-center gap-2"
                >
                  <span className="text-[#FF2B4D]">❯</span>
                  <span
                    className={
                      i === loadingSteps.length - 1
                        ? "text-[#28C840] font-bold"
                        : "text-white/70"
                    }
                  >
                    {step}
                  </span>
                  {i < currentStep && (
                    <span className="text-[#28C840] ml-auto">✓</span>
                  )}
                </motion.div>
              ))}

              {/* Blinking cursor */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[#FF2B4D]">❯</span>
                <motion.span
                  className="w-2 h-4 bg-[#FF2B4D]"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.75, repeat: Infinity }}
                />
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6 h-1 w-full rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #FF2B4D, #FF4D6D)",
                  boxShadow: "0 0 20px rgba(255,43,77,0.5)",
                }}
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-white/30 font-mono">
              <span>Loading system...</span>
              <span>{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
