'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Bookmark, TrendingUp, User, Hash, AlertCircle, Smile, Frown, Meh, BarChart3 } from 'lucide-react';
import { Translations, isRTL, Language } from '@/lib/i18n';
import { AnalyzeResponse, CommentSentiment } from '@/api/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ResultsViewProps {
  t: Translations;
  language: Language;
  data: AnalyzeResponse | null;
  isVisible: boolean;
}

interface SentimentCounts {
  positive: number;
  negative: number;
  neutral: number;
  total: number;
}

export default function ResultsView({ t, language, data, isVisible }: ResultsViewProps) {
  const rtl = isRTL(language);

  // Sentiment lookup function to map API values to translated strings
  const getSentimentLabel = (sentimentValue: string): string => {
    // Handle null or undefined values
    if (!sentimentValue) {
      return t.results.neutral; // Fallback to neutral
    }
    
    // Handle both Arabic and English API responses
    const normalizedSentiment = sentimentValue.toLowerCase().trim();
    
    if (normalizedSentiment === 'ايجابي' || normalizedSentiment === 'positive') {
      return t.results.positive;
    } else if (normalizedSentiment === 'سلبي' || normalizedSentiment === 'negative') {
      return t.results.negative;
    } else if (normalizedSentiment === 'محايد' || normalizedSentiment === 'neutral') {
      return t.results.neutral;
    }
    
    // Fallback to original value if no match found
    return sentimentValue;
  };

  if (!isVisible || !data) return null;

  // More robust error handling - check for various error conditions
  // Only show error if explicitly failed OR no metadata with comments
  const hasValidData = data.metadata && (
    (data.metadata.comments && data.metadata.comments.length > 0) ||
    data.metadata.likes ||
    data.metadata.comment_count
  );
  
  if (data.success === false || !hasValidData) {
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-4xl mx-auto mt-8 ${rtl ? 'font-arabic' : 'font-english'}`}
      >
        <motion.div
          className="glass rounded-2xl p-8 border border-red-400/20 text-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <AlertCircle className="mx-auto text-red-400 mb-4" size={48} />
          <h2 className="text-xl font-bold text-red-400 mb-2">
            {t.results.operationFailed}
          </h2>
        </motion.div>
      </motion.div>
    );
  }

  // Safe data extraction with error handling
  try {
    const metadata = data.metadata;
    if (!metadata) throw new Error('No metadata');

    const comments = metadata.comments || [];
    const likes = metadata.likes || '0';
    const commentCount = metadata.comment_count || 0;
    const saveCount = metadata.save_count || '0';
    const influencerName = metadata.influencer_name || 'Unknown';
    const description = metadata.description || '';
    const hashtags = metadata.hashtags || [];

    // Calculate sentiment counts
    const sentimentCounts: SentimentCounts = comments.reduce(
      (acc, comment) => {
        if (comment.sentiment === 'ايجابي') acc.positive++;
        else if (comment.sentiment === 'سلبي') acc.negative++;
        else if (comment.sentiment === 'محايد') acc.neutral++;
        acc.total++;
        return acc;
      },
      { positive: 0, negative: 0, neutral: 0, total: 0 }
    );

    // Memoize chart data to prevent re-renders and hanging
    const chartData = useMemo(() => {
      return [
        { time: '1 h', positive: Math.floor(sentimentCounts.positive * 0.1), negative: Math.floor(sentimentCounts.negative * 0.1), neutral: Math.floor(sentimentCounts.neutral * 0.1) },
        { time: '45 m', positive: Math.floor(sentimentCounts.positive * 0.3), negative: Math.floor(sentimentCounts.negative * 0.2), neutral: Math.floor(sentimentCounts.neutral * 0.2) },
        { time: '30 m', positive: Math.floor(sentimentCounts.positive * 0.5), negative: Math.floor(sentimentCounts.negative * 0.4), neutral: Math.floor(sentimentCounts.neutral * 0.4) },
        { time: '15 m', positive: Math.floor(sentimentCounts.positive * 0.7), negative: Math.floor(sentimentCounts.negative * 0.6), neutral: Math.floor(sentimentCounts.neutral * 0.6) },
        { time: '10 m', positive: Math.floor(sentimentCounts.positive * 0.9), negative: Math.floor(sentimentCounts.negative * 0.8), neutral: Math.floor(sentimentCounts.neutral * 0.8) },
        { time: 'Now', positive: sentimentCounts.positive, negative: sentimentCounts.negative, neutral: sentimentCounts.neutral },
      ];
    }, [sentimentCounts.positive, sentimentCounts.negative, sentimentCounts.neutral]);

    // Find most liked comment
    const mostLikedComment = comments
      .filter(c => c.likes && !isNaN(Number(c.likes)))
      .sort((a, b) => Number(b.likes) - Number(a.likes))[0];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className={`w-full max-w-6xl mx-auto mt-8 space-y-6 ${rtl ? 'font-arabic' : 'font-english'}`}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {t.results.analysisResults}
          </h2>
          <p className="text-white/70 text-lg">
            {t.results.detailedAnalysis}
          </p>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-8"
        >
          <motion.div
            className="glass rounded-2xl p-6 border border-white/10"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h4 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <BarChart3 className="text-blue-400" size={28} />
              {t.results.sentimentAnalysis}
            </h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enhanced Sentiment Analysis */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-xl"
              >
                
                {/* Sentiment Overview Cards */}
                <div className="space-y-3">
                  {[
                    { 
                      sentiment: 'positive', 
                      count: sentimentCounts.positive, 
                      percentage: sentimentCounts.total > 0 ? Math.round((sentimentCounts.positive / sentimentCounts.total) * 100) : 0,
                      label: t.results.positive,
                      gradient: 'from-emerald-400 via-green-400 to-teal-500',
                      bgGradient: 'from-emerald-500/20 to-green-600/10',
                      icon: Smile,
                      iconBg: 'from-emerald-500 to-green-600'
                    },
                    { 
                      sentiment: 'negative', 
                      count: sentimentCounts.negative, 
                      percentage: sentimentCounts.total > 0 ? Math.round((sentimentCounts.negative / sentimentCounts.total) * 100) : 0,
                      label: t.results.negative,
                      gradient: 'from-red-400 via-rose-400 to-pink-500',
                      bgGradient: 'from-red-500/20 to-rose-600/10',
                      icon: Frown,
                      iconBg: 'from-red-500 to-rose-600'
                    },
                    { 
                      sentiment: 'neutral', 
                      count: sentimentCounts.neutral, 
                      percentage: sentimentCounts.total > 0 ? Math.round((sentimentCounts.neutral / sentimentCounts.total) * 100) : 0,
                      label: t.results.neutral,
                      gradient: 'from-slate-400 via-gray-400 to-zinc-500',
                      bgGradient: 'from-slate-500/20 to-gray-600/10',
                      icon: Meh,
                      iconBg: 'from-slate-500 to-gray-600'
                    },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    const progressWidth = sentimentCounts.total > 0 ? (item.count / sentimentCounts.total) * 100 : 0;
                    
                    return (
                      <motion.div
                        key={item.sentiment}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                        className={`relative overflow-hidden rounded-lg bg-gradient-to-r ${item.bgGradient} border border-white/10 p-3 hover:border-white/30 transition-all duration-300`}
                        whileHover={{ scale: 1.02, y: -2 }}
                      >
                        {/* Background Progress Bar */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-10`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progressWidth}%` }}
                          transition={{ delay: 1.2 + index * 0.1, duration: 1, ease: "easeOut" }}
                        />
                        
                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon 
                              className={`${
                                item.sentiment === 'positive' ? 'text-green-400' : 
                                item.sentiment === 'negative' ? 'text-red-400' : 
                                'text-gray-400'
                              }`} 
                              size={24} 
                            />
                            <div>
                              <h5 className="text-white font-semibold text-base">{item.label}</h5>
                              <p className="text-white/60 text-xs">{item.count} {t.results.comment}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <motion.div
                              className={`text-2xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 1.0 + index * 0.1, type: "spring", stiffness: 200 }}
                            >
                              {item.percentage}%
                            </motion.div>
                          </div>
                        </div>
                        
                        {/* Animated Progress Line */}
                        <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${item.gradient} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progressWidth}%` }}
                            transition={{ delay: 1.4 + index * 0.1, duration: 1.2, ease: "easeOut" }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Overall Sentiment Indicator */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                  className="mt-4 p-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 font-medium text-sm">Overall Sentiment</span>
                    <div className="flex items-center gap-2">
                      {sentimentCounts.positive > sentimentCounts.negative ? (
                        <>
                          <Smile className="text-green-400" size={16} />
                          <span className="text-green-400 font-semibold text-sm">Positive</span>
                        </>
                      ) : sentimentCounts.negative > sentimentCounts.positive ? (
                        <>
                          <Frown className="text-red-400" size={16} />
                          <span className="text-red-400 font-semibold text-sm">Negative</span>
                        </>
                      ) : (
                        <>
                          <Meh className="text-gray-400" size={16} />
                          <span className="text-gray-400 font-semibold text-sm">Neutral</span>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Comment Volume Trends by Sentiment */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="bg-white/5 rounded-xl p-6"
              >
                <div className="h-72 sm:h-80 md:h-96 [&_.recharts-legend-wrapper]:text-xs [&_.recharts-legend-wrapper]:sm:text-sm [&_.recharts-legend-wrapper]:overflow-hidden [&_.recharts-legend-item-text]:truncate [&_.recharts-legend-item-text]:max-w-[80px] [&_.recharts-legend-item-text]:sm:max-w-none">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="time" 
                        stroke="rgba(255,255,255,0.7)"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="rgba(255,255,255,0.7)"
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                      <Legend 
                        wrapperStyle={{
                          fontSize: '11px',
                          color: 'rgba(255,255,255,0.8)',
                          paddingTop: '8px'
                        }}
                        iconType="line"
                        layout="horizontal"
                        align="center"
                        verticalAlign="bottom"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="positive" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                        name={t.results.positive}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="negative" 
                        stroke="#F87171" 
                        strokeWidth={3}
                        dot={{ fill: '#F87171', strokeWidth: 2, r: 4 }}
                        name={t.results.negative}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="neutral" 
                        stroke="#64748B" 
                        strokeWidth={3}
                        dot={{ fill: '#64748B', strokeWidth: 2, r: 4 }}
                        name={t.results.neutral}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Chart Title - Below Chart with Different Style */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.5 }}
                  className="mt-6 text-center"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full border border-white/20 backdrop-blur-sm">
                    <BarChart3 className="text-blue-400" size={16} />
                    <span className="text-sm font-medium text-white/90 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {t.results.commentVolumeTrends}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Video Stats - Modern horizontal layout */}
            <div className="flex justify-center mt-4">
              <div className="w-full md:w-1/2 bg-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/10">
                <div className="grid grid-cols-3 gap-3 sm:gap-6">
                {[
                  { icon: Heart, label: t.results.likes, value: likes, color: 'text-red-400', bgColor: 'bg-red-400/10' },
                  { icon: MessageCircle, label: t.results.comments, value: commentCount.toString(), color: 'text-blue-400', bgColor: 'bg-blue-400/10' },
                  { icon: Bookmark, label: t.results.saves, value: saveCount, color: 'text-green-400', bgColor: 'bg-green-400/10' },
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                      className="flex flex-col items-center text-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.div
                        className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full ${stat.bgColor} mb-2 sm:mb-3`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.0 + index * 0.1, duration: 0.5, type: "spring" }}
                      >
                        <Icon className={stat.color} size={16} />
                      </motion.div>
                      <motion.div
                        className={`text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 ${stat.color}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.1 + index * 0.1, duration: 0.5, type: "spring" }}
                      >
                        {stat.value}
                      </motion.div>
                      <p className="text-white/70 font-medium text-xs sm:text-sm leading-tight">
                        {stat.label}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Comments Grid - All comments in same row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Most Liked Comment */}
          {mostLikedComment && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="glass rounded-2xl p-6 border border-pink-400/20"
            >
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <Heart className="text-pink-400" size={24} />
                {t.results.mostLikedComment}
              </h4>
              <motion.div
                className="bg-white/5 rounded-xl p-4 border border-white/10"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-600 rounded-full flex items-center justify-center">
                    <User className="text-white" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-white font-medium text-sm block truncate">@{mostLikedComment.user}</span>
                    <div className="flex items-center gap-1 text-pink-400 text-xs">
                      <Heart size={14} />
                      {mostLikedComment.likes}
                    </div>
                  </div>
                </div>
                <p className="text-white/80 leading-relaxed mb-3 text-sm" dir={mostLikedComment.lang === 'ar' ? 'rtl' : 'ltr'}>
                  {mostLikedComment.comment.length > 100 
                    ? mostLikedComment.comment.substring(0, 100) + '...' 
                    : mostLikedComment.comment}
                </p>
                {mostLikedComment.sentiment && (
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      mostLikedComment.sentiment === 'ايجابي' || (mostLikedComment.sentiment && mostLikedComment.sentiment.toLowerCase() === 'positive')
                        ? 'bg-green-500/20 text-green-400' 
                        : mostLikedComment.sentiment === 'سلبي' || (mostLikedComment.sentiment && mostLikedComment.sentiment.toLowerCase() === 'negative')
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {getSentimentLabel(mostLikedComment.sentiment)}
                    </span>
                    {mostLikedComment.sentiment_confidence && (
                      <span className="text-xs text-pink-400">
                        {(mostLikedComment.sentiment_confidence * 100).toFixed(1)}%
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* Top Positive Comment */}
          {(() => {
            const positiveComments = comments
              .filter((comment: CommentSentiment) => comment.sentiment === 'ايجابي' || (comment.sentiment && comment.sentiment.toLowerCase() === 'positive'))
              .sort((a: CommentSentiment, b: CommentSentiment) => {
                // First sort by confidence (descending)
                const confidenceDiff = (b.sentiment_confidence || 0) - (a.sentiment_confidence || 0);
                if (confidenceDiff !== 0) return confidenceDiff;
                
                // If confidence is equal, sort by likes (descending)
                return Number(b.likes || 0) - Number(a.likes || 0);
              })
              .slice(0, 1);
            
            return positiveComments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="glass rounded-2xl p-6 border border-green-400/20"
              >
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <Smile className="text-green-400" size={24} />
                  {t.results.topPositiveComment}
                </h4>
                <div className="space-y-4">
                  {positiveComments.map((comment: CommentSentiment, index: number) => (
                    <motion.div
                      key={index}
                      className="bg-white/5 rounded-xl p-4 border border-white/10"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 + index * 0.1 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
                          <User className="text-white" size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-white font-medium text-sm block truncate">@{comment.user}</span>
                          <span className="text-xs text-green-400">
                            {(comment.sentiment_confidence * 100).toFixed(1)}% {t.results.confidence}
                          </span>
                        </div>
                      </div>
                      <p className={`text-white/90 mb-3 text-sm ${rtl ? 'text-right' : 'text-left'}`}>
                        {comment.comment.length > 100 ? comment.comment.substring(0, 100) + '...' : comment.comment}
                      </p>
                      <div className="flex items-center gap-2">
                        <Heart className="text-pink-400" size={16} />
                        <span className="text-white/70 text-sm">{comment.likes}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })()}

          {/* Top Negative Comment */}
          {/* Top Negative Comment */}
          {(() => {
            const negativeComments = comments
              .filter((comment: CommentSentiment) => comment.sentiment === 'سلبي' || (comment.sentiment && comment.sentiment.toLowerCase() === 'negative'))
              .sort((a: CommentSentiment, b: CommentSentiment) => {
                // First sort by confidence (descending)
                const confidenceDiff = (b.sentiment_confidence || 0) - (a.sentiment_confidence || 0);
                if (confidenceDiff !== 0) return confidenceDiff;
                
                // If confidence is equal, sort by likes (descending)
                return Number(b.likes || 0) - Number(a.likes || 0);
              })
              .slice(0, 1);
            
            return negativeComments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                className="glass rounded-2xl p-6 border border-red-400/20"
              >
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <Frown className="text-red-400" size={24} />
                  {t.results.topNegativeComment}
                </h4>
                <div className="space-y-4">
                  {negativeComments.map((comment: CommentSentiment, index: number) => (
                    <motion.div
                      key={index}
                      className="bg-white/5 rounded-xl p-4 border border-white/10"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 + index * 0.1 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-rose-600 rounded-full flex items-center justify-center">
                          <User className="text-white" size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-white font-medium text-sm block truncate">@{comment.user}</span>
                          <span className="text-xs text-red-400">
                            {(comment.sentiment_confidence * 100).toFixed(1)}% {t.results.confidence}
                          </span>
                        </div>
                      </div>
                      <p className={`text-white/90 mb-3 text-sm ${rtl ? 'text-right' : 'text-left'}`}>
                        {comment.comment.length > 100 ? comment.comment.substring(0, 100) + '...' : comment.comment}
                      </p>
                      <div className="flex items-center gap-2">
                        <Heart className="text-pink-400" size={16} />
                        <span className="text-white/70 text-sm">{comment.likes}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })()}
        </div>
        
        {/* Video Description */}
        {description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="glass rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center">
                <User className="text-white" size={20} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">
                  {t.results.videoDescription}
                </h4>
                <p className="text-white/60 text-sm">@{influencerName}</p>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed">
              {description}
            </p>
          </motion.div>
        )}
        
        {/* Hashtags */}
        {hashtags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="glass rounded-2xl p-6 border border-white/10"
          >
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Hash className="text-blue-400" size={20} />
              {t.results.hashtags}
            </h4>
            <div className="flex flex-wrap gap-3">
              {hashtags.map((hashtag, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 + index * 0.1, duration: 0.3 }}
                  className="px-3 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full text-white border border-blue-400/30 hover:border-blue-400/60 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  {hashtag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  } catch (error) {
    // Silent error handling - don't expose backend details
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-4xl mx-auto mt-8 ${rtl ? 'font-arabic' : 'font-english'}`}
      >
        <motion.div
          className="glass rounded-2xl p-8 border border-red-400/20 text-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <AlertCircle className="mx-auto text-red-400 mb-4" size={48} />
          <h2 className="text-xl font-bold text-red-400 mb-2">
            {t.results.operationFailed}
          </h2>
        </motion.div>
      </motion.div>
    );
  }
}