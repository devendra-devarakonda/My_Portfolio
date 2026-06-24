"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { projects } from "@/lib/data";
import { ExternalLink, Code2, Search } from "lucide-react";

const filters = [
  { id: "all", label: "Featured" },
  { id: "fullstack", label: "Full Stack" },
  { id: "ai", label: "AI" },
  { id: "backend", label: "Backend" },
];

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = projects.filter((p) => {
    const matchesFilter = activeFilter === "all" || p.category === activeFilter;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section id="projects" className="relative py-24 md:py-32 bg-[#050B17]/90 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6" ref={ref}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-black tracking-[3px] uppercase"
            style={{ fontFamily: "var(--font-family-heading)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            PROJECTS
          </motion.h2>

          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Search */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass">
              <Search className="w-3.5 h-3.5 text-white/30" />
              <input
                type="text"
                placeholder="Filter by skill types"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-xs text-white/70 placeholder:text-white/30 w-[130px]"
              />
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`interactive px-5 py-2 text-[0.7rem] font-semibold tracking-wider rounded-full border transition-all duration-300 ${
                    activeFilter === f.id
                      ? "bg-accent border-accent text-white"
                      : "border-white/[0.08] text-white/50 hover:border-accent/50 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              className="group relative rounded-xl glass border border-white/[0.06] hover:border-accent/30 overflow-hidden transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 * i }}
              whileHover={{ y: -8, boxShadow: "0 0 40px rgba(255,43,77,0.12)" }}
            >
              {/* Image */}
              <div className="relative h-[200px] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-base font-bold mb-2">{project.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-[0.6rem] font-medium tracking-wider bg-white/5 border border-white/[0.06] rounded-full text-white/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3">
                  <a
                    href={project.liveUrl}
                    className="interactive flex items-center gap-2 px-4 py-2 text-[0.65rem] font-bold tracking-wider uppercase bg-accent text-white rounded hover:bg-accent-dark transition-colors duration-200"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Live Demo
                  </a>
                  <a
                    href={project.codeUrl}
                    className="interactive flex items-center gap-2 px-4 py-2 text-[0.65rem] font-bold tracking-wider uppercase border border-white/10 text-white/60 rounded hover:border-accent/50 hover:text-white transition-all duration-200"
                  >
                    <Code2 className="w-3 h-3" />
                    View Code
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
