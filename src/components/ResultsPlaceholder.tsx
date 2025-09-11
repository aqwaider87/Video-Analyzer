'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Heart, Eye, BarChart3 } from 'lucide-react';
import { Translations, isRTL, Language } from '@/lib/i18n';

interface ResultsPlaceholderProps {
  t: Translations;
  language: Language;
  isVisible: boolean;
}

export default function ResultsPlaceholder({ t, language, isVisible }: ResultsPlaceholderProps) {
  const rtl = isRTL(language);

  if (!isVisible) return null;

  const insights = [
    { icon: TrendingUp, label: t.sampleInsights.engagement, value: '8.7/10', color: 'from-green-400 to-emerald-600' },
    { icon: Heart, label: t.sampleInsights.sentiment, value: '92%', color: 'from-pink-400 to-rose-600' },
    { icon: Eye, label: t.sampleInsights.views, value: '2.5M', color: 'from-blue-400 to-cyan-600' },
    { icon: BarChart3, label: t.sampleInsights.likes, value: '125K', color: 'from-purple-400 to-violet-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className={`w-full max-w-4xl mx-auto mt-8 ${rtl ? 'font-arabic' : 'font-english'}`}
    >
      <motion.div
        className="glass rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-xl"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {t.resultsTitle}
          </h2>
          <p className="text-white/70 text-lg">
            {t.resultsSubtitle}
          </p>
        </motion.div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                className="relative group"
              >
                <motion.div
                  className="bg-white/10 rounded-2xl p-6 border border-white/20 backdrop-blur-sm
                           hover:bg-white/15 transition-all duration-300 h-full"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Icon with gradient background */}
                  <motion.div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${insight.color} mb-4`}
                    animate={{
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Icon className="text-white" size={24} />
                  </motion.div>

                  {/* Value */}
                  <motion.div
                    className="text-2xl md:text-3xl font-bold text-white mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.5, type: "spring" }}
                  >
                    {insight.value}
                  </motion.div>

                  {/* Label */}
                  <p className="text-white/70 text-sm font-medium">
                    {insight.label}
                  </p>

                  {/* Animated progress bar */}
                  <motion.div
                    className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                  >
                    <motion.div
                      className={`h-full bg-gradient-to-r ${insight.color} rounded-full`}
                      initial={{ width: '0%' }}
                      animate={{ width: '85%' }}
                      transition={{ 
                        delay: 1.4 + index * 0.1, 
                        duration: 1.5, 
                        ease: "easeOut" 
                      }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Analysis Section */}
        <motion.div
          className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <h3 className={`text-xl font-semibold text-white mb-4 flex items-center ${rtl ? 'font-arabic' : 'font-english'}`}>
            <motion.div
              className="w-2 h-2 bg-blue-400 rounded-full mr-3"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            {language === 'ar' ? 'اكتمل التحليل بالذكاء الاصطناعي' : 'AI Analysis Complete'}
          </h3>
          <p className={`text-white/70 leading-relaxed ${rtl ? 'font-arabic' : 'font-english'}`}>
            {language === 'ar' 
              ? 'تم تحليل الفيديو بنجاح باستخدام تقنيات الذكاء الاصطناعي المتقدمة. النتائج تظهر مؤشرات إيجابية للتفاعل والمشاعر.'
              : 'Video analysis completed using advanced AI techniques. The results show positive indicators for engagement and sentiment analysis.'
            }
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
