'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Language, getTranslation, isRTL } from '@/lib/i18n';
import BackgroundFX from '@/components/BackgroundFX';
import LanguageToggle from '@/components/LanguageToggle';
import Hero from '@/components/Hero';
import UrlCard from '@/components/UrlCard';
import ResultsPlaceholder from '@/components/ResultsPlaceholder';
import Version from '@/components/Version';

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [showResults, setShowResults] = useState(false);
  const [mounted, setMounted] = useState(false);

  const t = getTranslation(language);
  const rtl = isRTL(language);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update document direction and language
  useEffect(() => {
    if (mounted) {
      document.documentElement.dir = rtl ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
      
      // Update page title
      document.title = language === 'ar' 
        ? 'محلل فيديوهات الذكي | AI Video Analyzer'
        : 'AI Video Analyzer | محلل فيديوهات الذكي';
    }
  }, [language, rtl, mounted]);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  const handleAnalysisComplete = () => {
    setShowResults(true);
  };

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <main className={`
      min-h-screen relative overflow-x-hidden
      ${rtl ? 'font-arabic' : 'font-english'}
    `} style={{ contain: 'layout style paint' }}>
      {/* Background Effects */}
      <BackgroundFX language={language} />
      
      {/* Language Toggle */}
      <LanguageToggle language={language} onLanguageChange={handleLanguageChange} />
      
      {/* Version Display */}
      <Version />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-7xl mx-auto">
          {/* Hero Section */}
          <Hero t={t} language={language} />
          
          {/* URL Input Card */}
          <UrlCard 
            t={t} 
            language={language} 
            onAnalysisComplete={handleAnalysisComplete}
          />
          
          {/* Results Section */}
          <ResultsPlaceholder
            t={t}
            language={language}
            isVisible={showResults}
          />
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        className={`relative z-10 text-center py-8 px-4 ${rtl ? 'font-arabic' : 'font-english'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <p className={`text-white/50 text-sm leading-relaxed ${rtl ? 'font-arabic' : 'font-english'}`}>
          {language === 'ar' ? (
            <>
              <span className="mx-1">© {new Date().getFullYear()}</span>
              <a
                href="https://www.linkedin.com/in/ammar1987/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:text-amber-200 transition-colors mx-1 underline decoration-dotted"
              >
                عمار قويدر
              </a>
            </>
          ) : (
            <>
              <span className="mx-1">© {new Date().getFullYear()}</span>
              <a
                href="https://www.linkedin.com/in/ammar1987/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:text-amber-200 transition-colors mx-1 underline decoration-dotted"
              >
                Ammar Qwaider
              </a>       
            </>
          )}
        </p>
      </motion.footer>
    </main>
  );
}
