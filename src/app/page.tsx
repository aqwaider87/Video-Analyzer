'use client';

import { useState, useEffect } from 'react';
import { Language, getTranslation, isRTL } from '@/lib/i18n';
import { AnalyzeResponse } from '@/api/types';
import BackgroundFX from '@/components/BackgroundFX';
import LanguageToggle from '@/components/LanguageToggle';
import Hero from '@/components/Hero';
import InteractiveBrain from '@/components/InteractiveBrain';
import UrlCard from '@/components/UrlCard';
import ResultsView from '@/components/ResultsView';
import Version from '@/components/Version';

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [showResults, setShowResults] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalyzeResponse | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showVersion, setShowVersion] = useState(false);

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
    <main className={`min-h-screen relative ${rtl ? 'font-arabic' : 'font-english'}`}>
      {/* Keep animated brain background but make it subtle by layering shell above */}
      <div className="absolute inset-0 pointer-events-none">
        <BackgroundFX language={language} />
      </div>

      {/* Floating controls */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-4">
        <LanguageToggle language={language} onLanguageChange={handleLanguageChange} />
      </div>

      {/* Centered shell container */}
      <div className="relative z-20 max-w-[1680px] mx-auto px-4 py-12 md:py-16">
        <div className="surface-shell rounded-[var(--radius-xl)] overflow-hidden flex flex-col md:flex-row min-h-[640px]">
          {/* Left panel */}
          <section className="w-full md:w-[48%] xl:w-[46%] p-8 md:p-14 flex flex-col gap-10 bg-[var(--bg-shell)] relative">
            {/* Logo / Brain at top-left */}
            <div className="flex items-start">
              <InteractiveBrain />
            </div>
            <div className="space-y-10">
              <Hero t={t} language={language} />
              <UrlCard t={t} language={language} onAnalysisComplete={handleAnalysisComplete} />
            </div>
            <div className="hidden md:block absolute top-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-[var(--border-soft)] to-transparent" />
          </section>
          {/* Right panel (results) */}
          <section className="flex-1 bg-[var(--bg-shell)] p-6 md:p-10 flex flex-col">
            {showResults && analysisData ? (
              <div className="grid gap-6 auto-rows-min">
                <ResultsView translations={t} language={language} data={analysisData} />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted text-sm md:text-base max-w-sm text-center leading-relaxed">
                  {language === 'ar' ? 'أدخل رابط فيديو تيك توك لعرض التحليلات المتقدمة هنا.' : 'Enter a TikTok video URL to see sentiment, engagement and content insights here.'}
                </p>
              </div>
            )}
          </section>
        </div>
        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-muted tracking-wide">
          {language === 'ar' ? (
            <>
              <button
                type="button"
                onClick={() => setShowVersion(v => !v)}
                className="inline-flex items-center gap-1 hover:text-foreground/80 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 rounded-sm"
                aria-expanded={showVersion}
                aria-controls="app-version-panel"
              >
                <span>© {new Date().getFullYear()}</span>
                <span className="underline decoration-dotted">عمار قويدر</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowVersion(v => !v)}
                className="inline-flex items-center gap-1 hover:text-foreground/80 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 rounded-sm"
                aria-expanded={showVersion}
                aria-controls="app-version-panel"
              >
                <span>© {new Date().getFullYear()}</span>
                <span className="underline decoration-dotted">Ammar Qwaider</span>
              </button>
            </>
          )}
        </footer>
        {showVersion && <Version className="" />}
      </div>
    </main>
  );
}
