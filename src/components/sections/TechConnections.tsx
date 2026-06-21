import { motion } from 'framer-motion';

interface NodePosition {
  x: number;
  y: number;
}

interface TechConnectionsProps {
  nodes: NodePosition[];
  cx: number;
  cy: number;
  hoveredIndex: number | null;
  transitionState: 'entering' | 'exiting' | 'stable';
  categoryColor: string;
}

export default function TechConnections({
  nodes,
  cx,
  cy,
  hoveredIndex,
  transitionState,
  categoryColor
}: TechConnectionsProps) {
  return (
    <svg className="svg-overlay" viewBox="0 0 800 550" preserveAspectRatio="xMidYMid meet">
      <defs>
        {/* Glow Filters */}
        <filter id="glow-base" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-bright" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {nodes.map((node, index) => {
        // Draw custom Bezier curve: S-curve style
        // Starts at (cx, cy) and control points push horizontally
        
        // Pull back the endpoint so the line stops at the edge of the card
        const dx = node.x - cx;
        const dy = node.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Reduce the distance so it stops before the node center
        const pullBack = 70; // approx distance from center to edge of the node card
        const targetX = dist > pullBack ? node.x - (dx / dist) * pullBack : node.x;
        const targetY = dist > pullBack ? node.y - (dy / dist) * pullBack : node.y;

        const midX = cx + (targetX - cx) * 0.45;
        const d = `M ${cx} ${cy} C ${midX} ${cy}, ${midX} ${targetY}, ${targetX} ${targetY}`;

        // Determine highlights
        const isSelfHovered = hoveredIndex === index;
        const isAnyHovered = hoveredIndex !== null;

        let strokeColor = categoryColor;
        let opacity = 0.4;
        let strokeWidth = 1.5;
        let filterId = "glow-base";

        if (isSelfHovered) {
          strokeColor = "#ffffff"; // bright core
          opacity = 1.0;
          strokeWidth = 2.5;
          filterId = "glow-bright";
        } else if (isAnyHovered) {
          opacity = 0.08; // heavily dimmed when other node is hovered
          strokeWidth = 1.0;
        }

        // Animate path drawing based on transition state
        const pathVariants = {
          hidden: { pathLength: 0, opacity: 0 },
          visible: { 
            pathLength: 1, 
            opacity, 
            transition: { 
              duration: 0.8, 
              ease: "easeOut" as const,
              delay: index * 0.04 
            } 
          },
          exit: { 
            pathLength: 0, 
            opacity: 0, 
            transition: { 
              duration: 0.5, 
              ease: "easeIn" as const
            } 
          }
        };

        return (
          <g key={`connection-${index}`}>
            {/* Background Glow Path */}
            <motion.path
              d={d}
              stroke={categoryColor}
              strokeWidth={strokeWidth * 2.5}
              fill="none"
              opacity={isSelfHovered ? 0.8 : opacity * 0.5}
              filter="url(#glow-base)"
              variants={pathVariants}
              initial="hidden"
              animate={transitionState === 'exiting' ? 'exit' : 'visible'}
            />

            {/* Main Interactive Path */}
            <motion.path
              d={d}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="none"
              opacity={opacity}
              filter={`url(#${filterId})`}
              variants={pathVariants}
              initial="hidden"
              animate={transitionState === 'exiting' ? 'exit' : 'visible'}
            />

            {/* Traveling Light Pulse Dot (only visible when not dimmed) */}
            {(!isAnyHovered || isSelfHovered) && transitionState === 'stable' && (
              <motion.path
                d={d}
                stroke={isSelfHovered ? "var(--neon-yellow)" : categoryColor}
                strokeWidth={strokeWidth + 0.5}
                fill="none"
                strokeDasharray="15 150"
                opacity={isSelfHovered ? 1.0 : 0.65}
                filter="url(#glow-base)"
                animate={{
                  strokeDashoffset: [300, 0]
                }}
                transition={{
                  duration: isSelfHovered ? 2.5 : 4,
                  repeat: Infinity,
                  ease: "linear",
                  delay: index * 0.2
                }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
