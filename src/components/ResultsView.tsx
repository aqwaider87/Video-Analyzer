'use client';

import React, { useMemo } from 'react';
// import { motion } from 'framer-motion';
import { Heart, MessageCircle, Bookmark, TrendingUp, User, Hash, AlertCircle, Smile, Frown, Meh, BarChart3 } from 'lucide-react';
import { Translations, isRTL, Language } from '@/lib/i18n';
import { AnalyzeResponse, CommentSentiment } from '@/api/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ResultsViewProps {
  data: AnalyzeResponse;
  translations: Translations;
  language: Language;
}

export default function ResultsView({ data, translations: t, language }: ResultsViewProps) {
  const rtl = isRTL(language);

  // Safe data extraction for hooks (with defaults to prevent conditional hook calls)
  const metadata = data?.metadata;
  const comments = metadata?.comments || [];

  // Number formatting utility for proper display in Arabic and English
  const formatNumber = (num: number | string): string => {
    let numValue: number;
    
    // Handle string values with suffixes (e.g., "147.4K", "2.1M")
    if (typeof num === 'string') {
      const cleanNum = num.toString().trim();
      
      if (cleanNum.includes('K') || cleanNum.includes('k')) {
        const numericPart = parseFloat(cleanNum.replace(/[Kk]/g, ''));
        if (isNaN(numericPart)) return '0';
        numValue = numericPart * 1000;
      } else if (cleanNum.includes('M') || cleanNum.includes('m')) {
        const numericPart = parseFloat(cleanNum.replace(/[Mm]/g, ''));
        if (isNaN(numericPart)) return '0';
        numValue = numericPart * 1000000;
      } else {
        numValue = Number(cleanNum);
        if (isNaN(numValue)) return '0';
      }
    } else {
      numValue = Number(num);
      if (isNaN(numValue)) return '0';
    }
    
    // For Arabic, use Western numerals with Arabic locale formatting
    // This prevents Arabic-Indic numerals (٠-٩) and uses Western numerals (0-9)
    if (language === 'ar') {
      return numValue.toLocaleString('en-US');
    }
    return numValue.toLocaleString();
  };

  // Sentiment matching utility to handle both English and Arabic sentiment values
  const getSentimentCounts = (comments: any[], sentimentType: 'positive' | 'negative' | 'neutral') => {
    const englishLabels = {
      positive: ['positive', 'pos'],
      negative: ['negative', 'neg'],
      neutral: ['neutral', 'neu']
    };
    
    const arabicLabels = {
      positive: ['إيجابي', 'ايجابي'],
      negative: ['سلبي', 'سلبى'],
      neutral: ['محايد', 'محايده']
    };
    
    const allLabels = [...englishLabels[sentimentType], ...arabicLabels[sentimentType]];
    
    return comments.filter(c => {
      const sentiment = (c.sentiment || '').toLowerCase().trim();
      return allLabels.some(label => 
        sentiment === label.toLowerCase() || 
        sentiment.includes(label.toLowerCase()) ||
        label.toLowerCase().includes(sentiment)
      );
    }).length;
  };

  // Helper function to filter comments by sentiment type
  const getCommentsBySentiment = (comments: any[], sentimentType: 'positive' | 'negative' | 'neutral') => {
    const englishLabels = {
      positive: ['positive', 'pos'],
      negative: ['negative', 'neg'],
      neutral: ['neutral', 'neu']
    };
    
    const arabicLabels = {
      positive: ['إيجابي', 'ايجابي'],
      negative: ['سلبي', 'سلبى'],
      neutral: ['محايد', 'محايده']
    };
    
    const allLabels = [...englishLabels[sentimentType], ...arabicLabels[sentimentType]];
    
    return comments.filter(c => {
      const sentiment = (c.sentiment || '').toLowerCase().trim();
      return allLabels.some(label => 
        sentiment === label.toLowerCase() || 
        sentiment.includes(label.toLowerCase()) ||
        label.toLowerCase().includes(sentiment)
      );
    });
  };

  // Helper function to get sentiment color
  const getSentimentColor = (sentiment: string) => {
    const positiveLabels = ['positive', 'pos', 'إيجابي', 'ايجابي'];
    const negativeLabels = ['negative', 'neg', 'سلبي', 'سلبى'];
    const sentimentLower = (sentiment || '').toLowerCase().trim();
    
    if (positiveLabels.some(label => 
      sentimentLower === label.toLowerCase() || 
      sentimentLower.includes(label.toLowerCase()) ||
      label.toLowerCase().includes(sentimentLower)
    )) {
      return 'text-green-400';
    }
    
    if (negativeLabels.some(label => 
      sentimentLower === label.toLowerCase() || 
      sentimentLower.includes(label.toLowerCase()) ||
      label.toLowerCase().includes(sentimentLower)
    )) {
      return 'text-red-400';
    }
    
    return 'text-purple-400';
  };

  // Chart data with safe defaults and proper translation - MOVED BEFORE EARLY RETURNS
  const chartData = useMemo(() => {
    if (!comments.length) return [];
    
    // Group comments by sentiment type, not by raw sentiment values
    const positiveCount = getSentimentCounts(comments, 'positive');
    const negativeCount = getSentimentCounts(comments, 'negative');
    const neutralCount = getSentimentCounts(comments, 'neutral');
    
    const total = comments.length;
    
    // Return data with translated labels for chart display
    const data = [];
    
    if (positiveCount > 0) {
      data.push({
        sentiment: t?.results?.positive || 'Positive',
        count: positiveCount,
        percentage: ((positiveCount / total) * 100).toFixed(1)
      });
    }
    
    if (negativeCount > 0) {
      data.push({
        sentiment: t?.results?.negative || 'Negative',
        count: negativeCount,
        percentage: ((negativeCount / total) * 100).toFixed(1)
      });
    }
    
    if (neutralCount > 0) {
      data.push({
        sentiment: t?.results?.neutral || 'Neutral',
        count: neutralCount,
        percentage: ((neutralCount / total) * 100).toFixed(1)
      });
    }
    
    return data;
  }, [comments, t?.results]);

  // Overall sentiment calculation with safe handling - MOVED BEFORE EARLY RETURNS
  const overallSentiment = useMemo(() => {
    if (!comments.length) return { label: t?.results?.neutral || 'neutral', percentage: 0, color: 'text-gray-400' };
    
    const total = comments.length;
    const positive = getSentimentCounts(comments, 'positive');
    const negative = getSentimentCounts(comments, 'negative');
    
    if (positive > negative) {
      return { 
        label: t?.results?.positive || 'positive', 
        percentage: ((positive / total) * 100).toFixed(1), 
        color: 'text-green-400' 
      };
    } else if (negative > positive) {
      return { 
        label: t?.results?.negative || 'negative', 
        percentage: ((negative / total) * 100).toFixed(1), 
        color: 'text-red-400' 
      };
    }
    return { 
      label: t?.results?.neutral || 'neutral', 
      percentage: '50.0', 
      color: 'text-purple-400' 
    };
  }, [comments, t?.results]);

  // Safety check for translations
  if (!t || !t.results) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="surface-card rounded-[var(--radius-lg)] p-8 border border-red-300/40 text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Translation Error
          </h2>
          <p className="text-red-500/80 text-sm">
            Translations not properly loaded
          </p>
        </div>
      </div>
    );
  }

  // Data validation
  const hasValidData = Boolean(
    data &&
    data.metadata &&
    data.metadata.comments &&
    Array.isArray(data.metadata.comments) &&
    data.metadata.comments.length > 0
  );

  if (data.success === false || !hasValidData) {
    
    return (
      <div className={`w-full max-w-4xl mx-auto mt-8 ${rtl ? 'font-arabic' : 'font-english'}`}>
        <div className="surface-card rounded-[var(--radius-lg)] p-8 border border-red-300/40 text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            {t?.results?.operationFailed || 'Operation Failed'}
          </h2>
        </div>
      </div>
    );
  }

  // Safe data extraction with error handling
  try {
    const videoInfo = {
      description: metadata?.description || '',
      likes: metadata?.likes || '0',
      comment_count: metadata?.comment_count || '0',
      save_count: metadata?.save_count || '0',
      hashtags: metadata?.hashtags || []
    };

    // Comments analysis
    const topPositiveComment = getCommentsBySentiment(comments, 'positive')
      .sort((a, b) => (Number(b.sentiment_confidence || 0) - Number(a.sentiment_confidence || 0)))[0];
    
    const topNegativeComment = getCommentsBySentiment(comments, 'negative')
      .sort((a, b) => (Number(b.sentiment_confidence || 0) - Number(a.sentiment_confidence || 0)))[0];

    // Find most liked comment
    const mostLikedComment = comments
      .filter(c => c.likes && !isNaN(Number(c.likes)))
      .sort((a, b) => Number(b.likes) - Number(a.likes))[0];

    return (
      <div className={`w-full max-w-6xl mx-auto mt-4 space-y-6 ${rtl ? 'font-arabic' : 'font-english'}`}>
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-[var(--text-strong)] mb-2">
            {t?.results?.analysisResults || 'Analysis Results'}
          </h2>
          <p className="text-muted text-sm">
            {t?.results?.detailedAnalysis || 'Detailed Analysis'}
          </p>
        </div>

        {/* Charts Section */}
        <div className="mb-4">
          <div className="surface-card rounded-[var(--radius-lg)] p-6 md:p-7 border border-[var(--border-soft)]">
            <h4 className="text-xl font-semibold text-[var(--text-strong)] mb-5 flex items-center gap-3">
              <BarChart3 className="text-purple-500" size={24} />
              {t?.results?.sentimentAnalysis || 'Sentiment Analysis'}
            </h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enhanced Sentiment Analysis */}
              <div className="space-y-6">
                {/* Overall Sentiment Indicator */}
                <div className="text-center p-6 rounded-xl bg-[var(--bg-shell)] border border-[var(--border-soft)]">
                  <div className="text-3xl font-semibold mb-2">
                    <span className={overallSentiment.color} dir="ltr">{overallSentiment.percentage}%</span>
                  </div>
                  <p className={`text-xs uppercase tracking-wide ${overallSentiment.color}`}>{overallSentiment.label}</p>
                </div>

                {/* Video Stats - Modern horizontal layout */}
                <div className="lg:col-span-1">
                  <div className="rounded-xl p-6 border border-[var(--border-soft)] bg-[var(--bg-card)]">
                    <h5 className="text-sm font-medium text-muted mb-4 flex items-center gap-2">
                      <TrendingUp className="text-purple-500" size={18} />
                      {t?.videoResults}
                    </h5>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="space-y-1">
                        <div className={`text-xl font-semibold text-red-500 flex items-center justify-center gap-1 ${rtl ? 'flex-row-reverse' : ''}`}>
                          <Heart size={20} />
                          <span dir="ltr">{formatNumber(videoInfo.likes)}</span>
                        </div>
                        <p className="text-[10px] text-muted uppercase tracking-wide">{t?.results?.likes || 'Likes'}</p>
                      </div>
                      <div className="space-y-1">
                        <div className={`text-xl font-semibold text-blue-500 flex items-center justify-center gap-1 ${rtl ? 'flex-row-reverse' : ''}`}>
                          <MessageCircle size={20} />
                          <span dir="ltr">{formatNumber(videoInfo.comment_count)}</span>
                        </div>
                        <p className="text-[10px] text-muted uppercase tracking-wide">{t?.results?.comments || 'Comments'}</p>
                      </div>
                      <div className="space-y-1">
                        <div className={`text-xl font-semibold text-purple-500 flex items-center justify-center gap-1 ${rtl ? 'flex-row-reverse' : ''}`}>
                          <Bookmark size={20} />
                          <span dir="ltr">{formatNumber(videoInfo.save_count)}</span>
                        </div>
                        <p className="text-[10px] text-muted uppercase tracking-wide">{t?.results?.saves || 'Saves'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sentiment Overview Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-4 rounded-lg bg-green-400/10 border border-green-400/30">
                    <Smile className="mx-auto text-green-600 mb-2" size={22} />
                    <div className="text-lg font-semibold text-green-700">
                      <span dir="ltr">{formatNumber(getSentimentCounts(comments, 'positive'))}</span>
                    </div>
                    <p className="text-[10px] text-green-700/70 uppercase tracking-wide">{t?.results?.positive || 'Positive'}</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-red-400/10 border border-red-400/30">
                    <Frown className="mx-auto text-red-600 mb-2" size={22} />
                    <div className="text-lg font-semibold text-red-600">
                      <span dir="ltr">{formatNumber(getSentimentCounts(comments, 'negative'))}</span>
                    </div>
                    <p className="text-[10px] text-red-600/70 uppercase tracking-wide">{t?.results?.negative || 'Negative'}</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-purple-400/10 border border-purple-400/30">
                    <Meh className="mx-auto text-purple-600 mb-2" size={22} />
                    <div className="text-lg font-semibold text-purple-600">
                      <span dir="ltr">{formatNumber(getSentimentCounts(comments, 'neutral'))}</span>
                    </div>
                    <p className="text-[10px] text-purple-600/70 uppercase tracking-wide">{t?.results?.neutral || 'Neutral'}</p>
                  </div>
                </div>
              </div>

              {/* Chart Visualization */}
              <div className="lg:col-span-1">
                <div className="rounded-xl p-4 border border-[var(--border-soft)] bg-[var(--bg-card)]">
                  <div className="h-72 sm:h-80 md:h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0ddd8" />
                        <XAxis 
                          dataKey="sentiment" 
                          stroke="#7a7875"
                          fontSize={12}
                          angle={language === 'ar' ? 0 : -45}
                          textAnchor={language === 'ar' ? 'middle' : 'end'}
                          height={60}
                        />
                        <YAxis 
                          stroke="#7a7875"
                          fontSize={12}
                          label={{ 
                            value: t?.results?.confidence || 'Percentage', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { textAnchor: 'middle', fill: '#7a7875' }
                          }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#ffffff',
                            border: '1px solid #e1ded9',
                            borderRadius: '8px',
                            color: '#161615'
                          }}
                          formatter={(value, name) => [
                            `${value}%`, 
                            t?.results?.confidence || 'Percentage'
                          ]}
                          labelFormatter={(label) => `${t?.results?.sentimentAnalysis || 'Sentiment'}: ${label}`}
                        />
                        <Legend 
                          wrapperStyle={{
                            paddingTop: '20px',
                            fontSize: '14px'
                          }}
                          className="[&_.recharts-legend-wrapper]:text-white [&_.recharts-legend-item-text]:!text-white"
                          formatter={() => t?.results?.sentimentDistribution || 'Sentiment Distribution'}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="percentage" 
                          stroke="#8B5CF6" 
                          strokeWidth={3}
                          dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                          name={t?.results?.sentimentDistribution || 'Sentiment Distribution'}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">     
          {/* Most Liked Comment */}
          {mostLikedComment && (
            <div className="surface-card rounded-xl p-6 border border-purple-500/30">
              <h4 className="text-sm font-medium text-purple-600 mb-4 flex items-center gap-2 uppercase tracking-wide">
                <Heart size={20} />
                {t?.results?.likes || 'Likes'}
              </h4>
              <div className="space-y-3">
                <p className="text-[var(--text-strong)] italic">&quot;{mostLikedComment.comment}&quot;</p>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    @{mostLikedComment.user}
                  </span>
                  <span className="text-purple-600 font-semibold flex items-center gap-1">
                    <Heart size={14} />
                    <span dir="ltr">{formatNumber(mostLikedComment.likes)}</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Top Positive Comment */}
          {topPositiveComment && (
            <div className="surface-card rounded-xl p-6 border border-green-500/30">
              <h4 className="text-sm font-medium text-green-700 mb-4 flex items-center gap-2 uppercase tracking-wide">
                <Smile size={20} />
                {t?.results?.positive || 'Positive'}
              </h4>
              <div className="space-y-3">
                <p className="text-[var(--text-strong)] italic">&quot;{topPositiveComment.comment}&quot;</p>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    @{topPositiveComment.user}
                  </span>
                  <span className="text-green-700 font-semibold" dir="ltr">
                    {((topPositiveComment.sentiment_confidence || 0) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Top Negative Comment */}
          {topNegativeComment && (
            <div className="surface-card rounded-xl p-6 border border-red-500/30">
              <h4 className="text-sm font-medium text-red-600 mb-4 flex items-center gap-2 uppercase tracking-wide">
                <Frown size={20} />
                {t?.results?.negative || 'Negative'}
              </h4>
              <div className="space-y-3">
                <p className="text-[var(--text-strong)] italic">&quot;{topNegativeComment.comment}&quot;</p>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    @{topNegativeComment.user}
                  </span>
                  <span className="text-red-600 font-semibold" dir="ltr">
                    {((topNegativeComment.sentiment_confidence || 0) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Info Section */}
        <div className="surface-card rounded-xl p-6 border border-[var(--border-soft)]">
          <h4 className="text-lg font-semibold text-[var(--text-strong)] mb-4 flex items-center gap-2">
            <TrendingUp className="text-purple-500" size={22} />
            {t?.videoTitle}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h5 className="text-xs font-medium text-muted uppercase tracking-wide mb-1">{t?.results?.videoDescription || 'Description'}</h5>
                <p className="text-[var(--text-strong)] text-sm leading-relaxed">
                  {videoInfo.description || (
                    <span className="text-muted italic">
                      {language === 'ar' ? 'لا يوجد وصف متاح' : 'No description available'}
                    </span>
                  )}
                </p>
              </div>
              {videoInfo.hashtags && videoInfo.hashtags.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium text-muted uppercase tracking-wide mb-2">{t?.results?.hashtags || 'Hashtags'}</h5>
                  <div className="flex flex-wrap gap-2">
                    {videoInfo.hashtags.slice(0, 10).map((tag, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-[11px]">
                        <Hash size={10} />
                        {tag.replace('#', '')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* All Comments List */}
      </div>
    );

  } catch (error) {
    console.error('Error processing results:', error);
    return (
      <div className={`w-full max-w-4xl mx-auto mt-8 ${rtl ? 'font-arabic' : 'font-english'}`}>
        <div className="surface-card rounded-[var(--radius-lg)] p-8 border border-red-300/40 text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            {t?.results?.operationFailed || 'Operation Failed'}
          </h2>
          <p className="text-red-500/80 text-sm">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }
}