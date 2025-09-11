'use client';

import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { Language, isRTL } from '@/lib/i18n';

interface LanguageToggleProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export default function LanguageToggle({ language, onLanguageChange }: LanguageToggleProps) {
  const isArabic = language === 'ar';

  return (
    <motion.div
      className="fixed top-6 right-6 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="glass rounded-2xl p-1 flex items-center space-x-1">
        <button
          onClick={() => onLanguageChange('en')}
          className={`
            px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2
            ${!isArabic 
              ? 'bg-white/20 text-white shadow-lg' 
              : 'text-white/70 hover:text-white hover:bg-white/10'
            }
          `}
          aria-label="Switch to English"
        >
          <Globe size={16} />
          <span>EN</span>
        </button>
        
        <button
          onClick={() => onLanguageChange('ar')}
          className={`
            px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2
            font-arabic
            ${isArabic 
              ? 'bg-white/20 text-white shadow-lg' 
              : 'text-white/70 hover:text-white hover:bg-white/10'
            }
          `}
          aria-label="التبديل إلى العربية"
        >
          <span className="font-arabic">العربية</span>
        </button>
      </div>
    </motion.div>
  );
}
