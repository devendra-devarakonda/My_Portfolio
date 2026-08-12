// Scroll Text Highlight — Originkit
// Originkit — exact GSAP stagger animation restored.
"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type FontStyle = React.CSSProperties;

type SplitBy = "characters" | "words";

type ScrollPosition =
    | "top top"
    | "top center"
    | "top bottom"
    | "center top"
    | "center center"
    | "center bottom"
    | "bottom top"
    | "bottom center"
    | "bottom bottom"
    | string;

export type ScrollHighlightProps = {
    text?: string;
    font?: FontStyle;

    dimColor?: string;
    highlightColor?: string;

    splitBy?: SplitBy;
    scrollStart?: ScrollPosition;
    scrollEnd?: ScrollPosition;
    scrub?: boolean | number;
    containerStyle?: React.CSSProperties;
};

const CHAR_STAGGER = 0.03;
const WORD_STAGGER = 0.1;

export default function ScrollHighlight({
    text = "Every detail matters. Small interactions shape perception, build trust, and transform ordinary experiences into memorable ones.",

    font = {
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: "24px",
        fontWeight: 600,
        letterSpacing: "-0.025em",
        lineHeight: "1.5em",
        textAlign: "center",
    },

    dimColor = "rgba(255, 255, 255, 0.15)",
    highlightColor = "#FFFFFF",

    splitBy = "words",
    scrollStart = "top center",
    scrollEnd = "bottom center",
    scrub = true,
    containerStyle,
}: ScrollHighlightProps) {
    const containerRef = useRef<HTMLParagraphElement>(null);
    const words = text.trim().split(/\s+/).filter(Boolean);
    const chars = Array.from(text);
    const stagger = splitBy === "characters" ? CHAR_STAGGER : WORD_STAGGER;
    const isZero = dimColor === "rgba(255, 255, 255, 0)" || dimColor === "transparent";

    useEffect(() => {
        const paragraph = containerRef.current;
        if (!paragraph) return;

        const targets = paragraph.querySelectorAll(
            splitBy === "characters" ? ".char" : ".word"
        );

        const ctx = gsap.context(() => {
            gsap.set(targets, {
                color: dimColor,
                opacity: isZero ? 0 : 1,
            });

            gsap.to(targets, {
                color: highlightColor,
                opacity: 1,
                stagger,
                scrollTrigger: {
                    trigger: paragraph,
                    start: scrollStart,
                    end: scrollEnd,
                    scrub,
                },
            });
        }, paragraph);

        return () => ctx.revert();
    }, [
        text,
        dimColor,
        highlightColor,
        splitBy,
        stagger,
        scrollStart,
        scrollEnd,
        scrub,
        isZero,
    ]);

    return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center", paddingTop: "10px", paddingBottom: "10px", ...containerStyle }}>
            <p
                ref={containerRef}
                style={{
                    margin: "0 auto",
                    display: "block",
                    width: "100%",
                    whiteSpace: "pre-wrap",
                    color: dimColor,
                    textAlign: "center",
                    ...font,
                }}
            >
                {splitBy === "characters"
                    ? chars.map((char, index) => (
                          <span
                              key={`${char}-${index}`}
                              className="char"
                              style={{
                                  display: "inline-block",
                                  color: dimColor,
                                  opacity: isZero ? 0 : 1,
                              }}
                          >
                              {char === " " ? "\u00A0" : char}
                          </span>
                      ))
                    : words.map((word, index) => (
                          <React.Fragment key={`${word}-${index}`}>
                              <span
                                  className="word"
                                  style={{
                                      display: "inline-block",
                                      color: dimColor,
                                      opacity: isZero ? 0 : 1,
                                  }}
                              >
                                  {word}
                              </span>
                              {index < words.length - 1 ? " " : null}
                          </React.Fragment>
                      ))}
            </p>
        </div>
    );
}
