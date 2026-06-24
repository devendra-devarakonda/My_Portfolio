"use client";

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, useInView } from 'framer-motion';
import { techStackData } from '@/lib/techStack';
import TechCube from './TechCube';
import TechNode from './TechNode';
import TechConnections from './TechConnections';
import NavigationControls from './NavigationControls';
import './tech-stack.css';

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const isCurrentlyInView = useInView(containerRef, { margin: "200px 0px 200px 0px" });

  // Initial entry state
  const [hasEntered, setHasEntered] = useState(false);

  // Main interactive states
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredNodeIdx, setHoveredNodeIdx] = useState<number | null>(null);
  const [transitionState, setTransitionState] = useState<'entering' | 'exiting' | 'stable'>('stable');
  const [pulseTrigger, setPulseTrigger] = useState(false);
  const [isSectionHovered, setIsSectionHovered] = useState(false);

  // Resize / Responsive tracking
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Math simulation loop for floating drift
  const [time, setTime] = useState(0);

  // Trigger initial entry sequence once visible
  useEffect(() => {
    if (isInView && !hasEntered) {
      setHasEntered(true);
      setTransitionState('entering');
      setTimeout(() => setTransitionState('stable'), 850);
    }
  }, [isInView, hasEntered]);

  // Resize observer
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Float animation timer
  useEffect(() => {
    if (!hasEntered || !isCurrentlyInView) return;
    let animId: number;
    const tick = () => {
      setTime((t) => t + 0.015);
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [hasEntered, isCurrentlyInView]);

  // Determine limits based on screen size
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const maxVisible = isMobile ? 4 : isTablet ? 6 : 8;

  // Active category calculations
  const activeCategory = techStackData[activeCategoryIdx];
  const categoryColor = (activeCategory as any).color || '#ff4d6d'; // TS fallback
  const technologies = activeCategory.technologies;
  const totalPages = Math.ceil(technologies.length / maxVisible);

  // Paginated nodes
  const startIndex = currentPage * maxVisible;
  const visibleNodes = technologies.slice(startIndex, startIndex + maxVisible);

  // Calculate coordinates (viewBox is 800x550)
  const cx = 400;
  const cy = 275;
  const baseRadius = isMobile ? 210 : isTablet ? 220 : 255;
  const angleStep = (2 * Math.PI) / visibleNodes.length;

  const positions = visibleNodes.map((_, index) => {
    // Alternate radius a bit to create depth
    const radius = baseRadius + (index % 2 === 0 ? 18 : -18);
    // Angular layout centered around -Math.PI / 2 (top)
    const angle = index * angleStep - Math.PI / 2 + (index % 2 === 0 ? 0.03 : -0.03);
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle)
    };
  });

  // Apply floating drift
  const driftingPositions = positions.map((pos, index) => {
    const speedX = 1.0 + (index % 3) * 0.15;
    const speedY = 0.8 + (index % 2) * 0.25;
    const amplitude = isMobile ? 3 : 7;

    const dx = Math.sin(time * speedX + index) * amplitude;
    const dy = Math.cos(time * speedY + index * 1.5) * amplitude;

    return {
      x: pos.x + dx,
      y: pos.y + dy
    };
  });

  // Handoff slide navigation
  const handleTransition = (nextCategoryIdx: number, nextPage: number) => {
    if (transitionState !== 'stable') return;

    setTransitionState('exiting');
    setHoveredNodeIdx(null);

    // Timing sequence (1 second total):
    // 1. Current nodes collapse into core, core starts charging (500ms)
    setTimeout(() => {
      // 2. Change category, trigger entering (burst wave, nodes emerge)
      setActiveCategoryIdx(nextCategoryIdx);
      setCurrentPage(nextPage);
      setPulseTrigger(true);
      setTransitionState('entering');

      setTimeout(() => setPulseTrigger(false), 100);

      // 3. System stabilizes after nodes are fully deployed (500ms later)
      setTimeout(() => {
        setTransitionState('stable');
      }, 500);

    }, 500);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      handleTransition(activeCategoryIdx, currentPage + 1);
    } else {
      const nextCat = (activeCategoryIdx + 1) % techStackData.length;
      handleTransition(nextCat, 0);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      handleTransition(activeCategoryIdx, currentPage - 1);
    } else {
      const prevCat = (activeCategoryIdx - 1 + techStackData.length) % techStackData.length;
      const prevCatTotalPages = Math.ceil(techStackData[prevCat].technologies.length / maxVisible);
      handleTransition(prevCat, prevCatTotalPages - 1);
    }
  };

  const handlePageSelect = (pageIdx: number) => {
    handleTransition(activeCategoryIdx, pageIdx);
  };

  // Auto-rotation scheduling (8 seconds)
  useEffect(() => {
    if (!hasEntered || isSectionHovered || transitionState !== 'stable') return;

    const interval = setInterval(() => {
      handleNext();
    }, 8000);

    return () => clearInterval(interval);
  }, [hasEntered, isSectionHovered, transitionState, activeCategoryIdx, currentPage, totalPages]);

  return (
    <section 
      id="skills"
      ref={containerRef}
      className="tech-container py-12 md:py-16 flex flex-col items-center justify-between min-h-[125vh] bg-[#050B17]/90"
      onMouseEnter={() => setIsSectionHovered(true)}
      onMouseLeave={() => setIsSectionHovered(false)}
    >
      <div className="particle-grid" />

      {/* Title Header */}
      <div className="text-center z-30 shrink-0 mb-6">
        <h2 className="tech-heading text-3xl md:text-5xl font-black tracking-[4px] uppercase text-white">
          TECH STACK
        </h2>
        <div 
          className="w-16 h-[2px] mx-auto mt-3 transition-colors duration-500" 
          style={{ backgroundColor: categoryColor, boxShadow: `0 0 8px ${categoryColor}` }}
        />
      </div>

      {/* Interactive Skill Constellation View */}
      {hasEntered && (
        <div className="flex-1 min-h-[500px] w-full flex items-center justify-center my-2">
          <div 
            className="relative w-full max-w-[850px] mx-auto z-20"
            style={{ aspectRatio: '800/550', maxHeight: '100%' }}
          >
          
          {/* Central CSS energy glow behind/around the 3D core */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-700 animate-pulse"
            style={{
              width: isMobile ? '75px' : isTablet ? '120px' : '180px',
              height: isMobile ? '75px' : isTablet ? '120px' : '180px',
              background: `radial-gradient(circle, ${categoryColor}70 0%, ${categoryColor}15 55%, transparent 100%)`,
              filter: isMobile ? 'blur(16px)' : 'blur(28px)',
              boxShadow: `0 0 35px ${categoryColor}30, 0 0 70px ${categoryColor}15`,
              zIndex: 12,
            }}
          />

          {/* R3F Crystal Core */}
          {isCurrentlyInView && (
            <TechCube 
              isHovered={isSectionHovered} 
              pulseTrigger={pulseTrigger} 
              transitionState={transitionState}
              categoryColor={categoryColor}
            />
          )}

          {/* SVG Connection Lines */}
          <TechConnections
            nodes={driftingPositions}
            cx={cx}
            cy={cy}
            hoveredIndex={hoveredNodeIdx}
            transitionState={transitionState}
            categoryColor={categoryColor}
          />

          {/* Technology Node Overlay */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <AnimatePresence>
              {transitionState !== 'exiting' && visibleNodes.map((tech, idx) => {
                const pos = driftingPositions[idx] || positions[idx];
                return (
                  <div key={`${activeCategoryIdx}-${currentPage}-${tech.name}`} className="pointer-events-auto">
                    <TechNode
                      tech={tech}
                      x={pos.x}
                      y={pos.y}
                      index={idx}
                      isHovered={hoveredNodeIdx === idx}
                      onHoverStart={() => setHoveredNodeIdx(idx)}
                      onHoverEnd={() => setHoveredNodeIdx(null)}
                      categoryColor={categoryColor}
                    />
                  </div>
                );
              })}
            </AnimatePresence>
          </div>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      {hasEntered && (
        <div className="shrink-0 w-full">
          <NavigationControls
          categoryName={activeCategory.name}
          categoryIndex={activeCategoryIdx}
          totalCategories={techStackData.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={handleNext}
          onPrev={handlePrev}
          onPageSelect={handlePageSelect}
        />
        </div>
      )}
    </section>
  );
}
