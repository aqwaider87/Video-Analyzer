'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Languages } from 'lucide-react';
import { Language } from '@/lib/i18n';
import { useEffect, useRef, useState } from 'react';

interface LanguageToggleProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export default function LanguageToggle({ language, onLanguageChange }: LanguageToggleProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!open) return;
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const toggle = () => setOpen(o => !o);
  const selectLang = (lng: Language) => {
    onLanguageChange(lng);
    setOpen(false);
    // return focus to button for accessibility
    requestAnimationFrame(() => btnRef.current?.focus());
  };

  return (
    <motion.div
      ref={containerRef}
      className="fixed top-6 right-6 z-50"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
    >
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="lang-menu"
        className="group inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--surface-card)] border border-[var(--border-soft)] hover:border-[var(--border-strong)] text-[var(--text-soft)] hover:text-[var(--text)] shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      >
        <Languages size={18} className="transition-transform group-hover:rotate-6" />
        <span className="sr-only">Select language</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id="lang-menu"
            role="menu"
            aria-label="Language selector"
            initial={{ opacity: 0, scale: 0.9, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 4 }}
            exit={{ opacity: 0, scale: 0.94, y: -2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="mt-2 origin-top-right min-w-[160px] rounded-xl border border-[var(--border-soft)] bg-[var(--surface-card)] shadow-xl backdrop-blur-sm p-1 flex flex-col gap-1"
          >
            <button
              role="menuitemradio"
              aria-checked={language === 'en'}
              onClick={() => selectLang('en')}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 text-left transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/50 ${language === 'en' ? 'bg-[var(--accent-subtle)] text-[var(--text)]' : 'text-[var(--text-soft)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]'}`}
            >
              <span className="font-semibold tracking-wide">English</span>
              {language === 'en' && <span className="ml-auto text-[10px] uppercase text-[var(--accent)]">Active</span>}
            </button>
            <button
              role="menuitemradio"
              aria-checked={language === 'ar'}
              onClick={() => selectLang('ar')}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 text-left transition-colors font-arabic focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/50 ${language === 'ar' ? 'bg-[var(--accent-subtle)] text-[var(--text)]' : 'text-[var(--text-soft)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]'}`}
            >
              <span className="font-arabic">العربية</span>
              {language === 'ar' && <span className="ml-auto text-[10px] uppercase text-[var(--accent)]">مفعل</span>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
