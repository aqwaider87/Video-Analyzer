'use client';

import { motion } from 'framer-motion';
import AnimatedHeading from './AnimatedHeading';
import { Translations, isRTL, Language } from '@/lib/i18n';

interface HeroProps { t: Translations; language: Language }

export default function Hero({ t, language }: HeroProps) {
  const rtl = isRTL(language);
  return (
    <div className={`relative ${rtl ? 'font-arabic' : 'font-english'} select-none`}> 
  <div className="space-y-6 flex flex-col  items-center text-center">
    <div className="space-y-3 w-full flex flex-col items-center text-center">
          <AnimatedHeading
            className="font-semibold tracking-tight text-[clamp(2.5rem,4vw,3.25rem)] leading-[1.06] text-[var(--text-strong)] relative"
            phrase={t.title}
          />
        </div>
        <motion.p
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.55, ease:'easeOut' }}
          className="relative pl-5 md:pl-6 text-[15px] md:text-[16.5px] leading-relaxed max-w-md font-normal tracking-[0.005em] text-[var(--text-muted)]/95 [text-wrap:balance]  items-center text-center"
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

