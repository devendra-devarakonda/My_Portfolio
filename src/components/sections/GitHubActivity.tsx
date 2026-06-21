"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { GitBranch, GitCommit, Flame } from "lucide-react";
import { getGitHubContributions } from "@/lib/github";

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

const levelColors = [
  "bg-white/[0.04]",
  "bg-accent/20",
  "bg-accent/40",
  "bg-accent/60",
  "bg-accent/90",
];

export default function GitHubActivity() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  
  const [contributions, setContributions] = useState<{ date: string; count: number; level: number }[]>(() =>
    generateEmptyContributions()
  );
  const [repoCount, setRepoCount] = useState<number | string>("15+");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await getGitHubContributions();
      if (res && res.calendar) {
        const { calendar, repoCount: fetchedRepoCount } = res;
        const mappedData: { date: string; count: number; level: number }[] = [];
        calendar.weeks.forEach((week: any) => {
          // Pad the first week if it doesn't start on Sunday (0) to align columns correctly
          if (mappedData.length === 0 && week.contributionDays.length > 0) {
            const firstDate = new Date(week.contributionDays[0].date);
            const firstDayOfWeek = firstDate.getUTCDay(); // 0 is Sunday
            for (let i = 0; i < firstDayOfWeek; i++) {
              mappedData.push({ date: "", count: 0, level: 0 });
            }
          }
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
        setContributions(mappedData);
        setRepoCount(fetchedRepoCount);
      } else {
        setContributions(generateMockContributions());
        setRepoCount("15+");
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const totalContribs = useMemo(() => contributions.reduce((s, c) => s + c.count, 0), [contributions]);
  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = contributions.length - 1; i >= 0; i--) {
      // Ignore empty padding days
      if (contributions[i].date === "") continue;
      
      if (contributions[i].count > 0) {
        streak++;
      } else {
        // If today is 0, we shouldn't break the streak immediately if yesterday had contributions.
        // But for a simple calculation, breaking on the first 0 (except maybe today) is standard.
        // Let's just break on 0.
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

  return (
    <section className="relative py-16 md:py-24 bg-bg-secondary overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6" ref={ref}>
        <motion.h2
          className="text-2xl md:text-3xl font-black tracking-[3px] uppercase mb-10"
          style={{ fontFamily: "var(--font-family-heading)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          GitHub Activity
        </motion.h2>

        <motion.div
          className="rounded-xl glass border border-white/[0.06] p-6 md:p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
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

          {/* Heatmap */}
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-[3px] min-w-[700px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day, di) => (
                    <motion.div
                      key={`${wi}-${di}`}
                      className={`w-[11px] h-[11px] rounded-[2px] ${levelColors[day.level]} hover:ring-1 hover:ring-accent/50 transition-all duration-150`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.2, delay: wi * 0.005 + di * 0.01 }}
                      title={`${day.date}: ${day.count} contributions`}
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
        </motion.div>
      </div>
    </section>
  );
}
