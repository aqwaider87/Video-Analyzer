"use client";

import { motion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";

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
  const controls = useAnimation();
  const [crazy, setCrazy] = useState(false);

  const triggerCrazy = async () => {
    if (crazy) return;
    setCrazy(true);
    // scatter
    await controls.start(() => ({
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 150,
      rotate: (Math.random() - 0.5) * 180,
      opacity: 0.6,
      transition: { duration: 0.35 }
    }));
    // regroup
    await controls.start(() => ({
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }));
    setCrazy(false);
  };

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
    <div className={`flex flex-col items-center justify-center gap-6 ${className}`} dir={direction ? 'rtl' : 'ltr'}>
      {/* Brain Icon controller */}
      <motion.svg
        onClick={triggerCrazy}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
        className="w-12 h-12 cursor-pointer"
        fill="none"
        stroke="url(#brainStroke)"
        strokeWidth="2"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        style={{ filter: 'drop-shadow(0 0 6px rgba(100,180,255,0.9)) drop-shadow(0 0 10px rgba(180,120,255,0.7))' }}
        role="button"
        aria-label="Scatter title"
      >
        <defs>
          <linearGradient id="brainStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5ef9ff" />
              <stop offset="50%" stopColor="#7d5bff" />
              <stop offset="100%" stopColor="#ff63ff" />
          </linearGradient>
        </defs>
        <path d="M20 6c-4 0-7 3.4-7 7.6-.9.3-1.7.8-2.3 1.5-.9 1-1.4 2.2-1.4 3.5 0 2 1 3.8 2.7 4.9-.4 1.2-.6 2.4-.6 3.6 0 4.9 3.7 8.9 8.2 8.9 1 0 2-.2 3-.5 1 .3 2 .5 3 .5 4.5 0 8.2-4 8.2-8.9 0-1.2-.2-2.4-.6-3.6 1.7-1.1 2.7-2.9 2.7-4.9 0-2.6-1.8-4.9-4.3-5.7C33 9.4 29 6 25 6c-1.4 0-2.8.4-4 1.2C22 6.5 21 6 20 6Z" />
      </motion.svg>
      {/* Title */}
  <div className="inline-flex flex-wrap justify-center gap-x-1 sm:gap-x-2 gap-y-3 text-4xl md:text-5xl lg:text-6xl">
        {isArabic && arabicTokens.length > 0 && arabicTokens.map((token, i) => (
          token.trim() === '' ? (
            <span key={i} className="inline-block">&nbsp;</span>
          ) : (
            <motion.span
              key={i}
              custom={i}
              initial={{ opacity: 0, y: -14 }}
              animate={controls}
              className="relative inline-block font-extrabold text-neutral-200"
            >{token}</motion.span>
          )
        ))}
        {!isArabic && letters.map((char, i) => {
          if (i === 0 && char === 'A') {
            return (
              <motion.span
                key={i}
                custom={i}
                initial={{ opacity: 0, y: 14 }}
                animate={controls}
                className="relative inline-block font-extrabold text-neutral-200"
              >A</motion.span>
            );
          }
          if (i === 1 && char.toLowerCase() === 'i') {
            return (
              <span key={i} className="relative inline-flex items-center">
                <motion.span
                  custom={i}
                  initial={{ opacity: 0, y: 14, scale: 0.7 }}
                  animate={controls}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="font-extrabold text-neutral-200"
                >i</motion.span>
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 40 40"
                  className="absolute -right-5 -top-4 w-5 h-5"
                  fill="none"
                  stroke="url(#brainStroke)"
                  strokeWidth="2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                  style={{ filter: 'drop-shadow(0 0 3px rgba(100,180,255,0.8)) drop-shadow(0 0 5px rgba(180,120,255,0.6))' }}
                >
                  <path d="M20 6c-4 0-7 3.4-7 7.6-.9.3-1.7.8-2.3 1.5-.9 1-1.4 2.2-1.4 3.5 0 2 1 3.8 2.7 4.9-.4 1.2-.6 2.4-.6 3.6 0 4.9 3.7 8.9 8.2 8.9 1 0 2-.2 3-.5 1 .3 2 .5 3 .5 4.5 0 8.2-4 8.2-8.9 0-1.2-.2-2.4-.6-3.6 1.7-1.1 2.7-2.9 2.7-4.9 0-2.6-1.8-4.9-4.3-5.7C33 9.4 29 6 25 6c-1.4 0-2.8.4-4 1.2C22 6.5 21 6 20 6Z" />
                </motion.svg>
              </span>
            );
          }
          return (
            <motion.span
              key={i}
              custom={i}
              initial={{ opacity: 0, y: 14 }}
              animate={controls}
              className="relative inline-block font-extrabold text-neutral-200"
            >{char === ' ' ? '\u00A0' : char}</motion.span>
          );
        })}
      </div>
    </div>
  );
}
