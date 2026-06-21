import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { educationData } from '../../lib/education';
import '../../app/education.css';

export default function EducationTimeline() {
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      if (width >= 768 && width < 1024) {
        // Scale down desktop layout proportionally for tablet
        setScale((width - 40) / 800);
      } else {
        setScale(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pathFilter = "drop-shadow(0 0 8px rgba(255,138,138,0.8)) drop-shadow(0 0 20px rgba(255,138,138,0.6)) drop-shadow(0 0 40px rgba(255,138,138,0.4))";
  const nodeFilter = "drop-shadow(0 0 10px rgba(255,217,138,0.8))";

  // Desktop paths and coordinates
  const desktopPath = "M 50 280 L 530 280 A 160 160 0 0 1 530 600 L 150 600 A 125 125 0 0 0 150 850 L 750 850";

  const mobileLineLength = educationData.length > 0 ? 40 + (educationData.length - 1) * 170 + 140 : 200;
  const mobileSvgHeight = mobileLineLength + 20;
  const mobileContainerHeight = mobileSvgHeight + 100;

  return (
    <section className="timeline-container py-24 md:py-32 flex flex-col items-center justify-center">
      {/* Desktop / Tablet View */}
      {!isMobile ? (
        <div
          className="relative w-full max-w-[800px] h-[1150px] mx-auto transition-all duration-300"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            height: `${1150 * scale}px`
          }}
        >
          <h2 className="absolute top-6 left-10 text-9xl font-[family-name:var(--font-family-heading)] font-bold text-white tracking-tight z-20">
            Education
          </h2>

          {/* SVG Timeline Path */}
          <svg
            className="timeline-svg"
            viewBox="0 0 800 1150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Base Neon Glow Path */}
            <path
              d={desktopPath}
              stroke="#ff8a8a"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: pathFilter }}
            />

            {/* Traveling Light Pulse Path */}
            <path
              d={desktopPath}
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pulse-path"
              style={{ filter: pathFilter }}
            />

            {/* Yellow Connecting Lines & Nodes */}
            {educationData.map((item) => (
              <g key={`connect-${item.id}`}>
                {/* Connecting Line */}
                <polyline
                  points={`${item.connectLine.x1},${item.connectLine.y1} ${item.connectLine.x2},${item.connectLine.y2} ${item.connectLine.x3},${item.connectLine.y3}`}
                  fill="none"
                  stroke="#ffd98a"
                  strokeWidth="2"
                  opacity="0.8"
                />

                {/* Outer pulsing halo ring */}
                <motion.circle
                  cx={item.nodePos.x}
                  cy={item.nodePos.y}
                  r="13"
                  fill="none"
                  stroke="#ffd98a"
                  strokeWidth="1.5"
                  style={{ filter: "drop-shadow(0 0 6px rgba(255,217,138,0.5))" }}
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Glowing Node Core */}
                <motion.circle
                  cx={item.nodePos.x}
                  cy={item.nodePos.y}
                  r="7"
                  fill="#ffd98a"
                  style={{ filter: nodeFilter }}
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.9, 1, 0.9],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </g>
            ))}
          </svg>

          {/* Floating Glass Cards */}
          {educationData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="glass-card absolute"
              style={{
                width: "190px",
                height: "150px",
                left: `${item.position.x}px`,
                top: `${item.position.y}px`,
              }}
            >
              {/* Golden Header with Year inside */}
              <div className="card-header-bg h-[24px] w-full flex items-center px-3">
                <span className="text-[10px] font-bold text-[#5c4d37] tracking-wider uppercase">
                  {item.year}
                </span>
              </div>

              <div className="p-4 flex flex-col h-[126px] justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[11px] font-medium text-gray-400 mt-1 line-clamp-2">
                    {item.institution}
                  </p>
                </div>
                <button className="glass-btn text-[10px] font-semibold text-gray-800 py-1.5 px-3 w-fit tracking-wide cursor-pointer">
                  view more
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Mobile Layout: Alternating Vertical Center Timeline */
        <div className="relative w-full max-w-[400px] mx-auto px-4" style={{ height: `${mobileContainerHeight}px` }}>
          <h2 className="text-4xl font-bold text-gray-800 mb-12 pl-4 z-20">
            Education
          </h2>

          {/* Center Timeline SVG */}
          <svg
            className="absolute top-[80px] left-0 w-full pointer-events-none z-10"
            style={{ height: `${mobileSvgHeight}px` }}
            viewBox={`0 0 400 ${mobileSvgHeight}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Base Vertical Neon Path */}
            <line
              x1="200"
              y1="20"
              x2="200"
              y2={mobileLineLength}
              stroke="#ff8a8a"
              strokeWidth="6"
              strokeLinecap="round"
              style={{ filter: pathFilter }}
            />

            {/* Traveling Light Pulse Path */}
            <line
              x1="200"
              y1="20"
              x2="200"
              y2={mobileLineLength}
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              className="pulse-path"
              style={{ filter: pathFilter }}
            />

            {/* Connecting Lines and Nodes for Mobile */}
            {educationData.map((item, index) => {
              const topY = 40 + index * 170;
              const nodeY = topY + 25; // Connects to the card header height level
              const isEven = index % 2 === 0;
              const xStart = 200;
              const xEnd = isEven ? 215 : 185;

              return (
                <g key={`mobile-connect-${item.id}`}>
                  {/* Connecting Line */}
                  <line
                    x1={xStart}
                    y1={nodeY}
                    x2={xEnd}
                    y2={nodeY}
                    stroke="#ffd98a"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                  {/* Outer halo */}
                  <motion.circle
                    cx={xStart}
                    cy={nodeY}
                    r="11"
                    fill="none"
                    stroke="#ffd98a"
                    strokeWidth="1.5"
                    style={{ filter: "drop-shadow(0 0 6px rgba(255,217,138,0.5))" }}
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                    }}
                  />
                  {/* Glowing Node Core */}
                  <motion.circle
                    cx={xStart}
                    cy={nodeY}
                    r="6"
                    fill="#ffd98a"
                    style={{ filter: nodeFilter }}
                    animate={{
                      scale: [1, 1.15, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Mobile Alternating Cards */}
          {educationData.map((item, index) => {
            const isEven = index % 2 === 0;
            const cardWidth = 170;
            const topY = 40 + index * 170;

            return (
              <motion.div
                key={`mobile-card-${item.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className="glass-card absolute"
                style={{
                  width: `${cardWidth}px`,
                  height: "140px",
                  top: `${topY}px`,
                  left: isEven ? 'calc(50% + 15px)' : `calc(50% - ${cardWidth}px - 15px)`
                }}
              >
                {/* Golden Header with Year */}
                <div className="card-header-bg h-[20px] w-full flex items-center px-3">
                  <span className="text-[9px] font-bold text-[#5c4d37] tracking-wider uppercase">
                    {item.year}
                  </span>
                </div>

                <div className="p-3 flex flex-col h-[120px] justify-between">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[10px] font-medium text-gray-600 mt-0.5 line-clamp-2">
                      {item.institution}
                    </p>
                  </div>
                  <button className="glass-btn text-[9px] font-semibold text-gray-800 py-1 px-2.5 w-fit tracking-wide cursor-pointer">
                    view more
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
