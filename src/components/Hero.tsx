'use client';

import { motion } from 'framer-motion';
import AnimatedHeading from './AnimatedHeading';
import { Translations, isRTL, Language } from '@/lib/i18n';

interface HeroProps { t: Translations; language: Language }

export default function Hero({ t, language }: HeroProps) {
  const rtl = isRTL(language);
  return (
    <div className={`relative ${rtl ? 'font-arabic' : 'font-english'} pt-24 md:pt-28 pb-6`}>      
      <div className="mx-auto max-w-[1080px] px-4">
        <AnimatedHeading className="bg-gradient-to-br from-white via-white to-slate-300 bg-clip-text text-transparent" phrase={t.title} />
      </div>

      <motion.p
        initial={{ opacity:0, y:24 }}
        animate={{ opacity:1, y:0 }}
        transition={{ delay:0.15, duration:0.75 }}
        className="mt-6 text-center text-base md:text-xl text-slate-300/90 leading-relaxed max-w-2xl mx-auto px-4"
      >
        {t.subtitle}
      </motion.p>

      {/* Accent underline glow */}
      <div className="relative flex justify-center mt-10 mb-4">
        <div className="h-px w-52 bg-gradient-to-r from-transparent via-fuchsia-400/50 to-transparent" />
      </div>
    </div>
  );
}

