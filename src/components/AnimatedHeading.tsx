"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

interface AnimatedHeadingProps { className?: string; phrase?: string; rtl?: boolean; }

export default function AnimatedHeading({ className = '', phrase, rtl }: AnimatedHeadingProps) {
  // detect RTL automatically if not provided (Arabic unicode range)
  const text = phrase || "AI TikTok Video Analyzer";
  const autoRtl = /[\u0600-\u06FF]/.test(text);
  const direction = rtl ?? autoRtl;
  const isArabic = /[\u0600-\u06FF]/.test(text);
  // For Arabic keep word integrity (avoid per-letter splitting which breaks shaping)
  const arabicTokens = isArabic ? text.split(/(\s+)/) : [];
  const letters = isArabic ? [] : Array.from(text);
  // Split into words (keep spaces) for grouping to prevent mid-word wrapping
  const wordSegments = isArabic ? [] : text.split(/(\s+)/).filter(seg => seg.length > 0);
  const controls = useAnimation();
  // Scatter animation removed (design simplification). Icon retained purely decorative.

  // Initial reveal on mount
  useEffect(() => {
    if (isArabic) {
      controls.start((i: number) => ({
        opacity: 1,
        y: 0,
        x: 0,
        rotate: 0,
        transition: { delay: i * 0.05, duration: 0.45, ease: 'easeOut' }
      }));
    } else {
      controls.start((i: number) => ({
        opacity: 1,
        y: 0,
        x: 0,
        rotate: 0,
        transition: { delay: i * 0.04, duration: 0.45, ease: 'easeOut' }
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, isArabic]);

  return (
  <div className={`flex flex-col ${direction ? 'items-end' : 'items-start'} justify-center gap-4 ${className}`} dir={direction ? 'rtl' : 'ltr'}>
      {/* Brain Icon controller removed; brain now only decorates the 'i' */}
      {/* Title */}
  <div className="inline-flex flex-wrap gap-x-1 sm:gap-x-2 gap-y-2 text-4xl md:text-5xl lg:text-6xl">
        {isArabic && arabicTokens.length > 0 && arabicTokens.map((token, i) => (
          token.trim() === '' ? (
            <span key={i} className="inline-block">&nbsp;</span>
          ) : (
            <motion.span
              key={i}
              custom={i}
              initial={{ opacity: 0, y: -14 }}
              animate={controls}
              className="relative inline-block font-extrabold text-current"
            >{token}</motion.span>
          )
        ))}
        {!isArabic && wordSegments.map((segment, wi) => {
          if (/^\s+$/.test(segment)) {
            return <span key={`space-${wi}`} className="inline-block w-2" />;
          }
          // segment is a word
          const chars = Array.from(segment);
          return (
            <span key={`word-${wi}`} className="inline-flex flex-nowrap whitespace-nowrap">
              {chars.map((char, ci) => {
                const globalIndex = chars.slice(0, ci).length + wordSegments.slice(0, wi).join('').length; // approximate ordering index
                if (globalIndex === 0 && char === 'A') {
                  return (
                    <motion.span
                      key={`char-${wi}-${ci}`}
                      custom={globalIndex}
                      initial={{ opacity: 0, y: 14 }}
                      animate={controls}
                      className="relative inline-block font-extrabold text-current"
                    >A</motion.span>
                  );
                }
                if (globalIndex === 1 && char.toLowerCase() === 'i') {
                  return (
                    <span key={`char-${wi}-${ci}`} className="relative inline-flex items-center">
                      <motion.span
                        custom={globalIndex}
                        initial={{ opacity: 0, y: 14, scale: 0.7 }}
                        animate={controls}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="font-extrabold text-current"
                      >i</motion.span>
                      <motion.svg
                        aria-hidden="true"
                        focusable="false"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 40 40"
                        className="absolute -right-1 -top-4 w-5 h-5 text-[var(--text-muted)] focus:outline-none"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        animate={{ opacity:[0,1], scale:[0.85,1] }}
                        transition={{ duration:0.8, ease:'easeOut' }}
                        style={{ filter: 'none' }}
                      >
                        <path d="M20 6c-4 0-7 3.4-7 7.6-.9.3-1.7.8-2.3 1.5-.9 1-1.4 2.2-1.4 3.5 0 2 1 3.8 2.7 4.9-.4 1.2-.6 2.4-.6 3.6 0 4.9 3.7 8.9 8.2 8.9 1 0 2-.2 3-.5 1 .3 2 .5 3 .5 4.5 0 8.2-4 8.2-8.9 0-1.2-.2-2.4-.6-3.6 1.7-1.1 2.7-2.9 2.7-4.9 0-2.6-1.8-4.9-4.3-5.7C33 9.4 29 6 25 6c-1.4 0-2.8.4-4 1.2C22 6.5 21 6 20 6Z" />
                      </motion.svg>
                    </span>
                  );
                }
                return (
                  <motion.span
                    key={`char-${wi}-${ci}`}
                    custom={globalIndex}
                    initial={{ opacity: 0, y: 14 }}
                    animate={controls}
                    className="relative inline-block font-extrabold text-current"
                  >{char}</motion.span>
                );
              })}
            </span>
          );
        })}
      </div>
    </div>
  );
}
