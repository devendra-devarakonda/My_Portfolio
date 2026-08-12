// Hover Image Reveal — Originkit
// Using component defaults with Side Reveal mode support.

"use client";

import { useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  type Transition as MotionTransition,
} from "framer-motion";
import { ExternalLink, Code2 } from "lucide-react";

export interface Item {
  text?: string;
  image?: { src?: string; srcSet?: string; alt?: string };
  link?: string;
  description?: string;
  tags?: string[];
  liveUrl?: string;
  codeUrl?: string;
}

interface ItemsValue {
  itemCount?: number;
  [key: string]: unknown;
}

const MAX_ITEMS = 6;

interface FontValue {
  fontSize?: number | string;
  letterSpacing?: number | string;
  lineHeight?: number | string;
  [key: string]: unknown;
}

export interface HoverImageRevealProps {
  items?: ItemsValue;
  font?: FontValue;
  textColor?: string;
  dimColor?: string;
  align?: "left" | "center" | "right";
  rowGap?: number;
  imageWidth?: number | string;
  imageHeight?: number | string;
  rounded?: number;
  offsetX?: number;
  offsetY?: number;
  followStrength?: number;
  transition?: MotionTransition;
  backgroundColor?: string;
  mode?: "follow" | "side";
  style?: CSSProperties;
}

const DEFAULT_ITEMS_DATA: { text: string; src: string }[] = [
  {
    text: "NEW SEASON DROP",
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/8e0d22a8-ac82-4893-90d8-3403f80ec600/w=800",
  },
  {
    text: "ESSENTIAL COLLECTION",
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/d6af07a0-4dc5-4de4-07b1-9d2ad6100000/w=800",
  },
  {
    text: "SUMMER EDITION",
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/c083d83a-f5a4-4434-989f-4eaa9bbe7500/w=800",
  },
  {
    text: "STREET ICONS",
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/93bad0e0-e2ab-4e21-de9c-4cb54b028f00/w=800",
  },
  {
    text: "PREMIUM DENIM",
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/09a59a65-3c07-4500-f72c-68c824168c00/w=800",
  },
  {
    text: "ARCHIVE PIECES",
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/8e0d22a8-ac82-4893-90d8-3403f80ec600/w=800",
  },
];

const DEFAULT_ITEMS: ItemsValue = {
  itemCount: 5,
  item1: {
    text: DEFAULT_ITEMS_DATA[0].text,
    image: { src: DEFAULT_ITEMS_DATA[0].src },
  },
  item2: {
    text: DEFAULT_ITEMS_DATA[1].text,
    image: { src: DEFAULT_ITEMS_DATA[1].src },
  },
  item3: {
    text: DEFAULT_ITEMS_DATA[2].text,
    image: { src: DEFAULT_ITEMS_DATA[2].src },
  },
  item4: {
    text: DEFAULT_ITEMS_DATA[3].text,
    image: { src: DEFAULT_ITEMS_DATA[3].src },
  },
  item5: {
    text: DEFAULT_ITEMS_DATA[4].text,
    image: { src: DEFAULT_ITEMS_DATA[4].src },
  },
  item6: {
    text: DEFAULT_ITEMS_DATA[5].text,
    image: { src: DEFAULT_ITEMS_DATA[5].src },
  },
};

const DEFAULT_FONT: FontValue = {
  fontFamily: "Inter",
  fontWeight: 400,
  fontSize: 61,
  lineHeight: "0.9em",
  letterSpacing: "-0.05em",
  textAlign: "left",
};

const DEFAULT_TRANSITION: MotionTransition = {
  type: "spring",
  stiffness: 400,
  damping: 40,
  mass: 1,
};

const alignToFlex: Record<string, CSSProperties["alignItems"]> = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
};
const alignToText: Record<string, CSSProperties["textAlign"]> = {
  left: "left",
  center: "center",
  right: "right",
};

export default function HoverImageReveal({
  items = DEFAULT_ITEMS,
  font = DEFAULT_FONT,
  textColor = "#FFFFFF",
  dimColor = "#51565A",
  align = "left",
  rowGap = 30,
  imageWidth = "55%",
  imageHeight = "440px",
  rounded = 16,
  offsetX = 200,
  offsetY = 0,
  followStrength = 0,
  transition = DEFAULT_TRANSITION,
  backgroundColor = "#000000",
  mode = "side",
  style,
}: HoverImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Initially null so no image or details are preloaded/visible until a heading is hovered
  const [hovered, setHovered] = useState<number | null>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const stiffness = 60 + followStrength * 5;
  const springCfg = { stiffness, damping: 28, mass: 0.5 };
  const x = useSpring(rawX, springCfg);
  const y = useSpring(rawY, springCfg);

  const data = items || DEFAULT_ITEMS;
  const count = Math.max(
    1,
    Math.min(MAX_ITEMS, (data.itemCount as number) || 5)
  );
  const list: Item[] = [];
  for (let i = 1; i <= count; i++) {
    const it = data[`item${i}`] as Item | undefined;
    const fallback = DEFAULT_ITEMS_DATA[i - 1];
    list.push({
      text: it?.text ?? fallback?.text ?? `Item ${i}`,
      image: it?.image ?? (fallback ? { src: fallback.src } : undefined),
      link: it?.link,
      description: it?.description,
      tags: it?.tags,
      liveUrl: it?.liveUrl,
      codeUrl: it?.codeUrl,
    });
  }

  const isSideMode = mode === "side";
  const activeIndex = hovered !== null ? Math.min(hovered, list.length - 1) : 0;
  const activeItem = list[activeIndex];

  const onMove = (e: React.MouseEvent) => {
    if (isSideMode) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set(e.clientX - rect.left + offsetX);
    rawY.set(e.clientY - rect.top + offsetY);
  };

  const imageContainerStyle: any = isSideMode
    ? {
        position: "absolute",
        top: "50%",
        right: 0,
        transform: "translateY(-50%)",
        width: typeof imageWidth === "number" ? `${imageWidth}px` : imageWidth,
        height: typeof imageHeight === "number" ? `${imageHeight}px` : imageHeight,
        borderRadius: rounded,
        overflow: "hidden",
        pointerEvents: hovered !== null ? "auto" : "none",
        zIndex: 2,
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        background: "rgba(5, 11, 23, 0.6)",
      }
    : {
        position: "absolute",
        top: 0,
        left: 0,
        x,
        y,
        transform: "translate(-50%, -50%)",
        width: typeof imageWidth === "number" ? `${imageWidth}px` : imageWidth,
        height: typeof imageHeight === "number" ? `${imageHeight}px` : imageHeight,
        borderRadius: rounded,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 2,
      };

  return (
    <div
      ref={containerRef}
      onMouseMove={onMove}
      onMouseLeave={() => setHovered(null)}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "440px",
        overflow: "visible",
        backgroundColor,
        display: "flex",
        flexDirection: isSideMode ? "row" : "column",
        justifyContent: isSideMode ? "space-between" : "center",
        alignItems: isSideMode ? "center" : alignToFlex[align],
        gap: `${rowGap}px`,
        padding: "16px 0",
        boxSizing: "border-box",
        cursor: "default",
        ...(font as CSSProperties),
        ...style,
      }}
    >
      {/* Revealed Image Container - Only visible when hovered is NOT null */}
      <motion.div
        style={imageContainerStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered !== null ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      >
        {list.map((item, i) => {
          const src = item.image?.src;
          const isCurrent = hovered === i;

          return (
            <motion.div
              key={i}
              initial={false}
              animate={{
                opacity: isCurrent ? 1 : 0,
                scale: isCurrent ? 1 : 1.05,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                overflow: "hidden",
                pointerEvents: isCurrent ? "auto" : "none",
              }}
            >
              {src ? (
                <img
                  src={src}
                  alt={item.image?.alt || item.text || ""}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg,#333,#111)",
                  }}
                />
              )}
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B17] via-[#050B17]/40 to-transparent" />
            </motion.div>
          );
        })}

        {/* Project Details Overlay in Side Mode */}
        {isSideMode && activeItem && hovered !== null && (
          <div className="absolute bottom-0 inset-x-0 p-6 z-10 flex flex-col gap-3 bg-gradient-to-t from-[#050B17] via-[#050B17]/90 to-transparent">
            {activeItem.description && (
              <p className="text-xs text-white/70 line-clamp-2 leading-relaxed font-sans">
                {activeItem.description}
              </p>
            )}

            {activeItem.tags && activeItem.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 font-sans">
                {activeItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 text-[0.65rem] font-medium tracking-wider bg-white/10 border border-white/10 rounded-full text-white/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {(activeItem.liveUrl || activeItem.codeUrl || activeItem.link) && (
              <div className="flex gap-3 pt-1 font-sans">
                {(activeItem.liveUrl || activeItem.link) && (
                  <a
                    href={activeItem.liveUrl || activeItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interactive flex items-center gap-2 px-4 py-2 text-[0.65rem] font-bold tracking-wider uppercase bg-accent text-white rounded hover:bg-accent-dark transition-colors duration-200"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Live Demo
                  </a>
                )}
                {activeItem.codeUrl && (
                  <a
                    href={activeItem.codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interactive flex items-center gap-2 px-4 py-2 text-[0.65rem] font-bold tracking-wider uppercase border border-white/20 text-white/80 rounded hover:border-accent/50 hover:text-white transition-all duration-200 bg-white/5 backdrop-blur-sm"
                  >
                    <Code2 className="w-3 h-3" />
                    View Code
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Titles List */}
      <div
        onMouseLeave={() => setHovered(null)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: alignToFlex[align],
          gap: `${rowGap}px`,
          width: isSideMode ? "40%" : "100%",
          zIndex: 3,
        }}
      >
        {list.map((item, i) => {
          const isItemHovered = hovered === i;
          const color = hovered === null
            ? textColor
            : isItemHovered
              ? textColor
              : dimColor;

          const copyStyle: CSSProperties = {
            display: "block",
            color,
            transition: "color 0.3s ease, opacity 0.3s ease",
            whiteSpace: "pre",
            textAlign: alignToText[align],
          };

          const inner = (
            <motion.div
              style={{ position: "relative" }}
              animate={{ y: isItemHovered && !isSideMode ? "-100%" : "0%" }}
              transition={transition}
            >
              <div className="flex items-center gap-3">
                {isSideMode && (
                  <span
                    className={`text-xs font-mono transition-all duration-300 ${
                      isItemHovered ? "text-accent font-bold" : "text-white/20"
                    }`}
                  >
                    0{i + 1}
                  </span>
                )}
                <span style={copyStyle}>{item.text}</span>
              </div>
            </motion.div>
          );

          return (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              style={{
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              {item.link && !isSideMode ? (
                <a
                  href={item.link}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  {inner}
                </a>
              ) : (
                inner
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
