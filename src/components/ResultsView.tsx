'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Bookmark, TrendingUp, User, Hash, AlertCircle, ThumbsUp, ThumbsDown, BarChart3 } from 'lucide-react';
import { Translations, isRTL, Language } from '@/lib/i18n';
import { AnalyzeResponse, CommentSentiment } from '@/api/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

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
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <BarChart3 className="text-blue-400" size={28} />
              {t.results.sentimentAnalysis}
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sentiment Analysis */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="bg-white/5 rounded-xl p-6"
              >
                <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
                  <TrendingUp className="text-purple-400" size={24} />
                  {t.results.sentimentAnalysis}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { 
                      sentiment: 'positive', 
                      count: sentimentCounts.positive, 
                      percentage: sentimentCounts.total > 0 ? Math.round((sentimentCounts.positive / sentimentCounts.total) * 100) : 0,
                      label: t.results.positive,
                      color: 'from-green-400 to-emerald-600',
                      icon: ThumbsUp
                    },
                    { 
                      sentiment: 'negative', 
                      count: sentimentCounts.negative, 
                      percentage: sentimentCounts.total > 0 ? Math.round((sentimentCounts.negative / sentimentCounts.total) * 100) : 0,
                      label: t.results.negative,
                      color: 'from-red-400 to-rose-600',
                      icon: ThumbsDown
                    },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.sentiment}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                        className="text-center"
                      >
                        <motion.div
                          className={`relative w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Icon className="text-white" size={28} />
                          <motion.div
                            className="absolute inset-0 rounded-full border-4 border-white/20"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.0 + index * 0.1, duration: 0.5 }}
                          />
                        </motion.div>
                        <motion.div
                          className="text-xl font-bold text-white mb-1"
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 1.1 + index * 0.1 }}
                        >
                          {item.percentage}%
                        </motion.div>
                        <p className="text-white/70 text-sm">{item.label}</p>
                        <p className="text-white/50 text-xs">({item.count} {t.results.comments})</p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Comment Volume Trends by Sentiment */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="bg-white/5 rounded-xl p-6"
              >
                <h4 className="text-lg font-semibold text-white mb-4 text-center">
                  {t.results.commentVolumeTrends}
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={(() => {
                        // Create sample trend data based on comment distribution
                        const baseData = [
                          { time: '10 min ago', positive: Math.floor(sentimentCounts.positive * 0.1), negative: Math.floor(sentimentCounts.negative * 0.1), neutral: Math.floor(sentimentCounts.neutral * 0.1) },
                          { time: '8 min ago', positive: Math.floor(sentimentCounts.positive * 0.3), negative: Math.floor(sentimentCounts.negative * 0.2), neutral: Math.floor(sentimentCounts.neutral * 0.2) },
                          { time: '6 min ago', positive: Math.floor(sentimentCounts.positive * 0.5), negative: Math.floor(sentimentCounts.negative * 0.4), neutral: Math.floor(sentimentCounts.neutral * 0.4) },
                          { time: '4 min ago', positive: Math.floor(sentimentCounts.positive * 0.7), negative: Math.floor(sentimentCounts.negative * 0.6), neutral: Math.floor(sentimentCounts.neutral * 0.6) },
                          { time: '2 min ago', positive: Math.floor(sentimentCounts.positive * 0.9), negative: Math.floor(sentimentCounts.negative * 0.8), neutral: Math.floor(sentimentCounts.neutral * 0.8) },
                          { time: 'Now', positive: sentimentCounts.positive, negative: sentimentCounts.negative, neutral: sentimentCounts.neutral },
                        ];
                        return baseData;
                      })()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
                      <Legend />
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
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                        name={t.results.neutral}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Video Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Heart, label: t.results.likes, value: likes, color: 'from-red-400 to-pink-600' },
            { icon: MessageCircle, label: t.results.comments, value: commentCount.toString(), color: 'from-blue-400 to-cyan-600' },
            { icon: Bookmark, label: t.results.saves, value: saveCount, color: 'from-green-400 to-emerald-600' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                className="glass rounded-xl p-6 border border-white/10"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <motion.div
                  className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${stat.color} mb-4`}
                  animate={{ rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Icon className="text-white" size={24} />
                </motion.div>
                <motion.div
                  className="text-2xl md:text-3xl font-bold text-white mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5, type: "spring" }}
                >
                  {stat.value}
                </motion.div>
                <p className="text-white/70 font-medium">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

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
                  <ThumbsUp className="text-green-400" size={24} />
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
                  <ThumbsDown className="text-red-400" size={24} />
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