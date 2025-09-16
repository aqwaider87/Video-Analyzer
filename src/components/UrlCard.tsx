'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clipboard, AlertCircle, Loader2 } from 'lucide-react';
import { Translations, isRTL, Language } from '@/lib/i18n';
import { validateTikTokUrl, analyzeVideo } from '@/lib/utils';
import { AnalyzeResponse } from '@/api/types';

interface UrlCardProps {
  t: Translations;
  language: Language;
  onAnalysisComplete: (data: AnalyzeResponse) => void;
}

export default function UrlCard({ t, language, onAnalysisComplete }: UrlCardProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [highlightInput, setHighlightInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pasteResetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pasteActive, setPasteActive] = useState(false);
  const [pasteClicked, setPasteClicked] = useState(false);
  // Removed inputFocused state to keep input color constant on focus
  const [showPasteTooltip, setShowPasteTooltip] = useState(false);
  const rtl = isRTL(language);

  useEffect(() => {
    return () => {
      if (pasteResetTimeout.current) clearTimeout(pasteResetTimeout.current);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if input is empty
    if (!url.trim()) {
      setHighlightInput(true);
      inputRef.current?.focus();
      setTimeout(() => setHighlightInput(false), 2000);
      return;
    }
    
    if (!validateTikTokUrl(url)) {
      setError(t.errorInvalidUrl);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const response = await analyzeVideo(url);
      console.log('Analysis completed successfully:', response);
      onAnalysisComplete(response);
    } catch (err) {
      console.error('Analysis failed:', err);
      if (err instanceof Error) {
        setError(`Analysis failed: ${err.message}`);
      } else {
        setError('Analysis failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setError('');
      setPasteClicked(true);
      setTimeout(() => setPasteClicked(false), 700);
    } catch (err) {
      console.error('Failed to paste from clipboard');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) setError('');
    if (highlightInput) setHighlightInput(false);
  };

  return (
    <motion.div className={`w-full max-w-4xl mx-auto ${rtl ? 'font-arabic' : 'font-english'}`}>
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        animate={shake ? { x: [-6, 6, -4, 4, -2, 2, 0] } : { x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex-1">
              <motion.div 
                className="relative group rounded-2xl p-[2px] transition-all duration-500 bg-white/10"
                animate={highlightInput ? {
                  boxShadow: [
                    '0 0 0 0 rgba(94, 249, 255, 0)',
                    '0 0 0 4px rgba(94, 191, 255, 0.4)',
                    '0 0 0 0 rgba(255, 99, 255, 0)',
                    '0 0 0 4px rgba(125, 91, 255, 0.5)',
                    '0 0 0 0 rgba(94, 249, 255, 0)'
                  ],
                  scale: [1, 1.02, 1, 1.02, 1]
                } : {}}
                transition={highlightInput ? { 
                  duration: 2, 
                  times: [0, 0.2, 0.4, 0.6, 1],
                  ease: 'easeInOut' 
                } : {}}
              >
                <motion.input
                  ref={inputRef}
                  // Use text instead of url to avoid native browser validation; rely on custom validateTikTokUrl
                  type="text"
                  inputMode="url"
                  autoComplete="off"
                  spellCheck={false}
                  value={url}
                  onChange={handleInputChange}
                  placeholder={t.inputPlaceholder}
                  className={`
                    w-full px-6 py-4 rounded-[1rem] bg-white/10 border border-white/20 
                    text-white placeholder-white/50 backdrop-blur-sm
                    focus:outline-none focus:ring-0 focus:border-white/20
                    transition-all duration-300 text-lg
                    ${rtl ? 'text-left pl-6 pr-14' : 'text-left pl-6 pr-14'}
                    ${error ? 'border-red-400/50 focus:ring-red-400/50' : ''}
                    ${highlightInput ? 'border-blue-400/60' : ''}
                  `}
                  disabled={isLoading}
                  dir="ltr"
                  animate={highlightInput ? {
                    borderColor: [
                      'rgba(255, 255, 255, 0.2)',
                      'rgba(94, 249, 255, 0.6)',
                      'rgba(255, 99, 255, 0.6)',
                      'rgba(125, 91, 255, 0.7)',
                      'rgba(255, 255, 255, 0.2)'
                    ]
                  } : {}}
                  transition={highlightInput ? { 
                    duration: 2, 
                    times: [0, 0.2, 0.4, 0.6, 1],
                    ease: 'easeInOut' 
                  } : {}}
                  aria-invalid={!!error}
                  aria-describedby={error ? 'url-error' : undefined}
                />
                <motion.button
                  type="button"
                  onClick={handlePaste}
                  className={`
                    absolute inset-y-0 right-2
                    my-auto h-11 w-11 text-white/60 hover:text-white hover:bg-white/10 rounded-xl
                    transition-all duration-200 z-30 flex items-center justify-center
                    overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60
                  `}
                  disabled={isLoading}
                  onHoverStart={() => {
                    if (pasteResetTimeout.current) {
                      clearTimeout(pasteResetTimeout.current);
                      pasteResetTimeout.current = null;
                    }
                    setPasteActive(true);
                    setShowPasteTooltip(true);
                  }}
                  onHoverEnd={() => {
                    if (pasteResetTimeout.current) clearTimeout(pasteResetTimeout.current);
                    pasteResetTimeout.current = setTimeout(() => {
                      setPasteActive(false);
                      pasteResetTimeout.current = null;
                    }, 1000);
                    setTimeout(() => setShowPasteTooltip(false), 120);
                  }}
                  animate={
                    pasteClicked
                      ? {
                          scale: [1, 1.22, 0.92, 1.08, 1],
                          boxShadow: [
                            '0 0 0 0 rgba(59,130,246,0)',
                            '0 0 0 6px rgba(59,130,246,0.35)',
                            '0 0 0 0 rgba(59,130,246,0)'
                          ]
                        }
                      : pasteActive
                        ? { scale: 1.08 }
                        : { scale: 1 }
                  }
                  whileTap={{ scale: 0.94 }}
                  transition={
                    pasteClicked
                      ? { duration: 0.7, times: [0, 0.25, 0.55, 0.8, 1], ease: 'easeInOut' }
                      : { type: 'spring', stiffness: 420, damping: 24 }
                  }
                  title={t.pasteButton}
                  aria-label={t.pasteButton}
                >
                  <Clipboard size={20} />
                  <AnimatePresence>
                    {pasteClicked && (
                      <motion.span
                        key="ripple"
                        initial={{ opacity: 0.5, scale: 0 }}
                        animate={{ opacity: 0, scale: 2.4 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-lg bg-blue-500/40 blur-sm pointer-events-none"
                      />
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {showPasteTooltip && !pasteClicked && (
                      <motion.div
                        key="tooltip"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 2 }}
                        transition={{ duration: 0.18 }}
                        role="tooltip"
                        className={`absolute ${rtl ? 'right-full mr-2' : 'left-full ml-2'} top-1/2 -translate-y-1/2 px-2 py-1 rounded-md bg-black/70 text-xs text-white whitespace-nowrap backdrop-blur-sm`}
                      >
                        {rtl ? 'لصق الرابط' : 'Paste URL'}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            </div>
              <motion.button
                type="submit"
                disabled={isLoading}
                className="px-7 py-4 rounded-2xl font-semibold text-lg bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 text-white hover:from-gray-500 hover:via-gray-600 hover:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl h-14 whitespace-nowrap"
                whileHover={{ scale: isLoading ? 1 : 1.06 }}
                whileTap={{ scale: 0.94 }}
                animate={isLoading ? {} : {
                  boxShadow: [
                    '0 10px 25px rgba(0,0,0,0.18)',
                    '0 15px 38px rgba(30,30,30,0.55)',
                    '0 10px 25px rgba(0,0,0,0.18)'
                  ],
                  scale: url.trim() ? [1, 1.015, 1] : 1
                }}
                transition={{
                  boxShadow: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                  scale: url.trim() ? { duration: 2.8, repeat: Infinity, ease: 'easeInOut' } : undefined
                }}
                aria-disabled={isLoading}
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`flex items-center ${rtl ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
                    >
                      <Loader2 className="animate-spin" size={20} />
                      <span className="text-white drop-shadow-sm">{t.loadingText}</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="start"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3"
                    >
                      <motion.svg
                        key="brainBtn"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 64 64"
                        className="w-7 h-7 shrink-0"
                        fill="none"
                        initial={{ rotate: -4 }}
                        animate={{ rotate: [-4, 4, -4] }}
                        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <defs>
                          <linearGradient id="btnGradStroke" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#5ef9ff" />
                            <stop offset="50%" stopColor="#7d5bff" />
                            <stop offset="100%" stopColor="#ff63ff" />
                          </linearGradient>
                          <radialGradient id="btnGradFill" cx="50%" cy="45%" r="60%">
                            <stop offset="0%" stopColor="#65f6ff" stopOpacity="0.65" />
                            <stop offset="45%" stopColor="#2563eb" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#001c40" stopOpacity="0" />
                          </radialGradient>
                          <filter id="btnGlow" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur" />
                            <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.1  0 0 0 0 0.6  0 0 0 0.45 0" result="glow" />
                            <feMerge>
                              <feMergeNode in="glow" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>
                        <g filter="url(#btnGlow)">
                          <path
                            d="M32 4c-8 0-14 6-14 14v2h-2c-4 0-8 4-8 8v8c0 4 4 8 8 8h2v2c0 8 6 14 14 14h4c8 0 14-6 14-14v-2h2c4 0 8-4 8-8v-8c0-4-4-8-8-8h-2v-2c0-8-6-14-14-14h-4z"
                            stroke="url(#btnGradStroke)"
                            strokeWidth={1.8}
                            fill="url(#btnGradFill)"
                          />
                          <g stroke="url(#btnGradStroke)" strokeLinecap="round" strokeWidth={1.4}>
                            <path d="M20 22c6 2 8 6 12 10s8 8 12 10" strokeDasharray="3 8" />
                            <path d="M20 34c4 2 6 4 10 8s6 4 10 6" strokeDasharray="3 8" />
                          </g>
                          <line x1="33" y1="10" x2="33" y2="54" stroke="#ffffff" strokeWidth={1.1} strokeOpacity={0.5} />
                        </g>
                      </motion.svg>
                      <span className="leading-none tracking-wide text-white drop-shadow-sm">{t.buttonText}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                id="url-error"
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className={`flex items-center ${rtl ? 'space-x-reverse space-x-2' : 'space-x-2'} text-red-300 text-sm`}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              className="relative overflow-hidden rounded-full h-2 bg-white/10"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          )}
        </div>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              className="inline-flex items-center space-x-2 text-white/80"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-blue-400 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
              <span className="text-sm">{t.loadingDivText}</span>
            </motion.div>
          </motion.div>
        )}
      </motion.form>
    </motion.div>
  );
}
