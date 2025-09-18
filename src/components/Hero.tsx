'use client';

import { motion } from 'framer-motion';
import AnimatedHeading from './AnimatedHeading';
import { Translations, isRTL, Language } from '@/lib/i18n';

interface HeroProps { t: Translations; language: Language }

export default function Hero({ t, language }: HeroProps) {
  const rtl = isRTL(language);
  return (
    <div className={`relative ${rtl ? 'font-arabic' : 'font-english'} select-none`}>
      <div className="space-y-6">
        <div className="space-y-3">
          <AnimatedHeading className="text-[clamp(2.4rem,4vw,3.2rem)] font-semibold leading-[1.08] text-[var(--text-strong)]" phrase={t.title} />
        </div>
        <motion.p
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.6 }}
          className="text-base md:text-lg text-muted max-w-md leading-relaxed"
        >
          {t.subtitle}
        </motion.p>
        {/* <div className="flex gap-3 pt-2">
          <button className="btn-primary-minimal rounded-full px-7 h-12 text-sm font-medium focus-ring-minimal transition-colors">{language==='ar' ? 'ابدأ التحليل' : 'Analyze Now'}</button>
          <button className="btn-outline-minimal rounded-full px-7 h-12 text-sm font-medium focus-ring-minimal transition-colors">{language==='ar' ? 'تعرف أكثر' : 'Learn More'}</button>
        </div> */}
      </div>
    </div>
  );
}

