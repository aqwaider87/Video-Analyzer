'use client';

import { useState, useEffect } from 'react';
import { Language, getTranslation, isRTL } from '@/lib/i18n';
import { AnalyzeResponse } from '@/api/types';
import BackgroundFX from '@/components/BackgroundFX';
import LanguageToggle from '@/components/LanguageToggle';
import Hero from '@/components/Hero';
import UrlCard from '@/components/UrlCard';
import ResultsView from '@/components/ResultsView';
import Version from '@/components/Version';

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [showResults, setShowResults] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalyzeResponse | null>(null);
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

  const handleAnalysisComplete = (data: AnalyzeResponse) => {
    setAnalysisData(data);
    setShowResults(true);
  };

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <main className={`
      h-screen relative overflow-x-hidden flex flex-col
      ${rtl ? 'font-arabic' : 'font-english'}
    `} style={{ contain: 'layout style paint' }}>
      {/* Background Effects */}
      <BackgroundFX language={language} />
      
      {/* Language Toggle */}
      <LanguageToggle language={language} onLanguageChange={handleLanguageChange} />
      
      {/* Version Display */}
      <Version />
      
      {/* Main Content - Takes available space */}
     <div className="relative z-10 flex-1 flex flex-col items-center px-4 py-4 overflow-y-auto scrollable">
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center min-h-0">
          {/* Hero Section - Always at top */}
          <div className="flex-shrink-0 w-full">
            <Hero t={t} language={language} />
          </div>
          
          {/* URL Input Card */}
          <div className="flex-shrink-0 w-full">
            <UrlCard 
              t={t} 
              language={language} 
              onAnalysisComplete={handleAnalysisComplete}
            />
          </div>
          
          {/* Results Section */}
          {showResults && analysisData && (
            <div className="flex-shrink-0 w-full">
              <ResultsView
                translations={t}
                language={language}
                data={analysisData}
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer - Always visible at bottom */}
      <footer
        className={`relative z-10 text-center py-4 px-4 flex-shrink-0 ${rtl ? 'font-arabic' : 'font-english'}`}
      >
        <p className={`text-white/50 text-sm leading-relaxed ${rtl ? 'font-arabic' : 'font-english'}`}>
          {language === 'ar' ? (
            <>
              <span className="mx-1 text-white">© {new Date().getFullYear()}</span>
              <a
                href="https://www.linkedin.com/in/ammar1987/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors text-white mx-1 underline decoration-dotted"
              >
                عمار قويدر
              </a>
            </>
          ) : (
            <>
              <span className="mx-1 text-white">© {new Date().getFullYear()}</span>
              <a
                href="https://www.linkedin.com/in/ammar1987/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors text-white mx-1 underline decoration-dotted"
              >
                Ammar Qwaider
              </a>       
            </>
          )}
        </p>
      </footer>
    </main>
  );
}
