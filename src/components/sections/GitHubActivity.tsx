"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { GitBranch, GitCommit, Flame } from "lucide-react";
import { getGitHubContributions } from "@/lib/github";
import LaserFlow from "../ui/LaserFlow";

// Generate empty, stable contributions for initial render
function generateEmptyContributions() {
  const data: { date: string; count: number; level: number }[] = [];
  for (let i = 0; i < 365; i++) {
    data.push({
      date: "",
      count: 0,
      level: 0,
    });
  }
  return data;
}

// Generate mock GitHub contribution data
function generateMockContributions() {
  const data: { date: string; count: number; level: number }[] = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const count = Math.random() > 0.3 ? Math.floor(Math.random() * 10) : 0;
    const level = count === 0 ? 0 : count < 3 ? 1 : count < 5 ? 2 : count < 8 ? 3 : 4;
    data.push({
      date: date.toISOString().split("T")[0],
      count,
      level,
    });
  }
  return data;
}

// Padding helper to align first day to Sunday and pad the end of calendar to complete weeks
function fillAndPadContributions(rawData: { date: string; count: number; level: number }[]) {
  if (rawData.length === 0) return rawData;

  const padded: typeof rawData = [];

  // 1. Pad the beginning of the calendar so the first day aligns with Sunday
  const firstDateStr = rawData[0].date;
  if (firstDateStr) {
    const firstDate = new Date(firstDateStr);
    const firstDayOfWeek = firstDate.getUTCDay(); // 0 is Sunday
    for (let i = 0; i < firstDayOfWeek; i++) {
      padded.push({ date: "", count: 0, level: 0 });
    }
  }

  // 2. Add raw data
  padded.push(...rawData);

  // 3. Pad the end of the calendar so it completes the last week (multiple of 7)
  while (padded.length % 7 !== 0) {
    padded.push({ date: "", count: 0, level: 0 });
  }

  return padded;
}

const levelColors = [
  "bg-white/[0.04]",
  "bg-accent/20",
  "bg-accent/40",
  "bg-accent/60",
  "bg-accent/90",
];

export default function GitHubActivity() {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const revealImgRef = useRef<HTMLImageElement>(null);

  const isInView = useInView(ref, { once: true, margin: "-80px" });
  
  // Gating threshold for WebGL lifecycle
  const isNearView = useInView(ref, {
    margin: "300px 0px 300px 0px",
    once: false
  });

  const [contributions, setContributions] = useState<{ date: string; count: number; level: number }[]>(() =>
    generateEmptyContributions()
  );
  const [repoCount, setRepoCount] = useState<number | string>("15+");
  const [loading, setLoading] = useState(true);

  // Progressive enhancement states
  const [isLaserDegraded, setIsLaserDegraded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await getGitHubContributions();
      if (res && res.calendar) {
        const { calendar, repoCount: fetchedRepoCount } = res;
        const mappedData: { date: string; count: number; level: number }[] = [];
        calendar.weeks.forEach((week: any) => {
          week.contributionDays.forEach((day: any) => {
            const count = day.contributionCount;
            const level = count === 0 ? 0 : count < 3 ? 1 : count < 5 ? 2 : count < 8 ? 3 : 4;
            mappedData.push({
              date: day.date,
              count,
              level,
            });
          });
        });
        setContributions(fillAndPadContributions(mappedData));
        setRepoCount(fetchedRepoCount);
      } else {
        setContributions(fillAndPadContributions(generateMockContributions()));
        setRepoCount("15+");
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Monitor screen width to apply mobile optimization parameters
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 5-second dynamic recovery gating check for degradation
  useEffect(() => {
    if (!isNearView || !isLaserDegraded) return;

    const timer = setTimeout(() => {
      setIsLaserDegraded(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isNearView, isLaserDegraded]);

  const totalContribs = useMemo(() => contributions.reduce((s, c) => s + c.count, 0), [contributions]);
  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = contributions.length - 1; i >= 0; i--) {
      // Ignore empty padding days
      if (contributions[i].date === "") continue;
      
      if (contributions[i].count > 0) {
        streak++;
      } else {
        if (i !== contributions.length - 1) break;
      }
    }
    return streak;
  }, [contributions]);

  // Organize into weeks (columns)
  const weeks = useMemo(() => {
    const w: typeof contributions[] = [];
    for (let i = 0; i < contributions.length; i += 7) {
      w.push(contributions.slice(i, i + 7));
    }
    return w;
  }, [contributions]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const el = revealImgRef.current;
    if (el) {
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    }
  };

  const handleMouseLeave = () => {
    const el = revealImgRef.current;
    if (el) {
      el.style.setProperty("--mx", "-9999px");
      el.style.setProperty("--my", "-9999px");
    }
  };

  return (
    <section ref={ref} id="github" className="relative w-full overflow-hidden bg-[#050B17] py-16 md:py-24 z-0">
      {/* 1. Header Anchor (Aligned to max-w-7xl, clean base background with no visual noise) */}
      <div className="max-w-7xl mx-auto px-6 mb-10 relative z-20">
        <motion.h2
          className="text-2xl md:text-3xl font-black tracking-[3px] uppercase"
          style={{ fontFamily: "var(--font-family-heading)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          GitHub Activity
        </motion.h2>
      </div>

      {/* 2. Interactive Showcase Wrapper (Backgrounds span absolute across Laser Area and Stats Panel) */}
      <div
        ref={containerRef}
        className="relative w-full flex flex-col items-center z-0"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* LaserFlow visual background (Layer: z-[1]) */}
        <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
          <div className="w-full max-w-6xl h-full relative">
            <LaserFlow
              className="w-full h-full"
              visible={isNearView}
              degraded={isLaserDegraded}
              onDegrade={() => setIsLaserDegraded(true)}
              wispDensity={isMobile ? 0.35 : 1.0}
              wispIntensity={isMobile ? 1.2 : 5.0}
              wispSpeed={10}
              flowSpeed={0.3}
              flowStrength={0.2}
              fogIntensity={isMobile ? 0.12 : 0.5}
              fogScale={0.3}
              horizontalSizing={0.4}
              verticalSizing={1.8}
              verticalBeamOffset={0.05} 
              decay={1.0}
              dpr={isMobile ? 0.75 : 1.0}
              color="#FF2B4D"
            />
          </div>
        </div>

        {/* github.png Background Reveal Layer (Layer: z-[5]) */}
        <img
          ref={revealImgRef}
          src="/github.png"
          alt="GitHub Activity Background Reveal"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 5,
            mixBlendMode: "screen",
            opacity: 0.25,
            pointerEvents: "none",
            "--mx": "-9999px",
            "--my": "-9999px",
            WebkitMaskImage: "radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)",
            maskImage: "radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat"
          } as React.CSSProperties}
        />

        {/* Solid Glass Overlay (Layer: z-[10]) */}
        <div 
          className="absolute inset-0 z-[10] pointer-events-none"
          style={{ background: "rgba(5, 11, 23, 0.45)" }}
        />

        {/* Dynamic empty laser spacer to show the visual hero background (Layer: z-20) */}
        <div className="relative w-full h-[35vh] md:h-[45vh] lg:h-[55vh] pointer-events-none z-20" />

        {/* 3. GitHub Content Panel Container (Layer: z-20) */}
        <div className="w-full max-w-7xl px-6 pb-24 relative z-20">
          
          {/* Single Premium Stats Glass Panel (Layer: z-20) */}
          <div
            className="rounded-xl border p-6 md:p-8 relative overflow-hidden"
            style={{
              background: "rgba(5, 11, 23, 0.45)",
              borderColor: "rgba(255, 255, 255, 0.05)"
            }}
          >
            {/* Stats Cards Row inside the panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <GitCommit className="w-5 h-5 text-accent mx-auto mb-2" />
                <div className="h-8 flex items-center justify-center">
                  {loading ? (
                    <div className="h-5 w-16 bg-accent/20 animate-pulse rounded" />
                  ) : (
                    <div className="text-2xl font-bold text-accent" style={{ fontFamily: "var(--font-family-heading)" }}>
                      {totalContribs}
                    </div>
                  )}
                </div>
                <div className="text-[0.65rem] text-white/40 tracking-wider uppercase mt-1">Contributions</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <Flame className="w-5 h-5 text-orange-400 mx-auto mb-2" />
                <div className="h-8 flex items-center justify-center">
                  {loading ? (
                    <div className="h-5 w-16 bg-orange-400/20 animate-pulse rounded" />
                  ) : (
                    <div className="text-2xl font-bold text-orange-400" style={{ fontFamily: "var(--font-family-heading)" }}>
                      {currentStreak}
                    </div>
                  )}
                </div>
                <div className="text-[0.65rem] text-white/40 tracking-wider uppercase mt-1">Current Streak</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <GitBranch className="w-5 h-5 text-green-400 mx-auto mb-2" />
                <div className="h-8 flex items-center justify-center">
                  {loading ? (
                    <div className="h-5 w-16 bg-green-400/20 animate-pulse rounded" />
                  ) : (
                    <div className="text-2xl font-bold text-green-400" style={{ fontFamily: "var(--font-family-heading)" }}>
                      {repoCount}
                    </div>
                  )}
                </div>
                <div className="text-[0.65rem] text-white/40 tracking-wider uppercase mt-1">Repositories</div>
              </div>
            </div>

            {/* Full Contribution Heatmap grid (Tailwind auto columns layout) */}
            <div className="overflow-x-auto pb-2 w-full">
              <div className="grid grid-flow-col auto-cols-fr w-full min-w-[800px] gap-[3px]">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {week.map((day, di) => (
                      <motion.div
                        key={`${wi}-${di}`}
                        className={`w-full aspect-square rounded-[2px] ${levelColors[day.level]} hover:ring-1 hover:ring-accent/50 transition-all duration-150`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.2, delay: wi * 0.005 + di * 0.01 }}
                        title={day.date ? `${day.date}: ${day.count} contributions` : "No contributions"}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2 mt-4 justify-end">
              <span className="text-[0.6rem] text-white/30">Less</span>
              {levelColors.map((c, i) => (
                <div key={i} className={`w-[11px] h-[11px] rounded-[2px] ${c}`} />
              ))}
              <span className="text-[0.6rem] text-white/30">More</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
