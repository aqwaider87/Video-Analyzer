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

  // Number formatting utility for proper display in Arabic and English
  const formatNumber = (num: number | string): string => {
    const numValue = Number(num);
    if (isNaN(numValue)) return '0';
    
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

  // Safety check for translations
  if (!t || !t.results) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="glass rounded-2xl p-8 border border-red-400/20 text-center">
          <AlertCircle className="mx-auto text-red-400 mb-4" size={48} />
          <h2 className="text-xl font-bold text-red-400 mb-2">
            Translation Error
          </h2>
          <p className="text-red-300 text-sm">
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
        <div className="glass rounded-2xl p-8 border border-red-400/20 text-center">
          <AlertCircle className="mx-auto text-red-400 mb-4" size={48} />
          <h2 className="text-xl font-bold text-red-400 mb-2">
            {t?.results?.operationFailed || 'Operation Failed'}
          </h2>
        </div>
      </div>
    );
  }

  // Safe data extraction with error handling
  try {
    const metadata = data.metadata;
    if (!metadata) throw new Error('No metadata');
    
    const comments = metadata.comments || [];
    
    const videoInfo = {
      description: metadata.description || '',
      likes: metadata.likes || '0',
      comment_count: metadata.comment_count || '0',
      save_count: metadata.save_count || '0',
      hashtags: metadata.hashtags || []
    };

    // Chart data with safe defaults and proper translation
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

    // Overall sentiment calculation with safe handling
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
      <div className={`w-full max-w-6xl mx-auto mt-8 space-y-6 ${rtl ? 'font-arabic' : 'font-english'}`}>
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {t?.results?.analysisResults || 'Analysis Results'}
          </h2>
          <p className="text-white/70 text-lg">
            {t?.results?.detailedAnalysis || 'Detailed Analysis'}
          </p>
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <div className="glass rounded-2xl p-6 border border-white/10">
            <h4 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <BarChart3 className="text-blue-400" size={28} />
              {t?.results?.sentimentAnalysis || 'Sentiment Analysis'}
            </h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enhanced Sentiment Analysis */}
              <div className="space-y-6">
                {/* Overall Sentiment Indicator */}
                <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
                  <div className="text-4xl font-bold mb-2">
                    <span className={overallSentiment.color} dir="ltr">{overallSentiment.percentage}%</span>
                  </div>
                  <p className={`text-sm ${overallSentiment.color}`}>{overallSentiment.label}</p>
                </div>

                {/* Video Stats - Modern horizontal layout */}
                <div className="lg:col-span-1">
                  <div className="glass rounded-xl p-6 border border-white/10">
                    <h5 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="text-purple-400" size={20} />
                      {t?.videoResults}
                    </h5>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="space-y-1">
                        <div className={`text-2xl font-bold text-red-400 flex items-center justify-center gap-1 ${rtl ? 'flex-row-reverse' : ''}`}>
                          <Heart size={20} />
                          <span dir="ltr">{formatNumber(videoInfo.likes)}</span>
                        </div>
                        <p className="text-xs text-white/60">{t?.results?.likes || 'Likes'}</p>
                      </div>
                      <div className="space-y-1">
                        <div className={`text-2xl font-bold text-blue-400 flex items-center justify-center gap-1 ${rtl ? 'flex-row-reverse' : ''}`}>
                          <MessageCircle size={20} />
                          <span dir="ltr">{formatNumber(videoInfo.comment_count)}</span>
                        </div>
                        <p className="text-xs text-white/60">{t?.results?.comments || 'Comments'}</p>
                      </div>
                      <div className="space-y-1">
                        <div className={`text-2xl font-bold text-purple-400 flex items-center justify-center gap-1 ${rtl ? 'flex-row-reverse' : ''}`}>
                          <Bookmark size={20} />
                          <span dir="ltr">{formatNumber(videoInfo.save_count)}</span>
                        </div>
                        <p className="text-xs text-white/60">{t?.results?.saves || 'Saves'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sentiment Overview Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Smile className="mx-auto text-green-400 mb-2" size={24} />
                    <div className="text-xl font-bold text-green-400">
                      <span dir="ltr">{formatNumber(getSentimentCounts(comments, 'positive'))}</span>
                    </div>
                    <p className="text-xs text-green-300">{t?.results?.positive || 'Positive'}</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <Frown className="mx-auto text-red-400 mb-2" size={24} />
                    <div className="text-xl font-bold text-red-400">
                      <span dir="ltr">{formatNumber(getSentimentCounts(comments, 'negative'))}</span>
                    </div>
                    <p className="text-xs text-red-300">{t?.results?.negative || 'Negative'}</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <Meh className="mx-auto text-purple-400 mb-2" size={24} />
                    <div className="text-xl font-bold text-purple-400">
                      <span dir="ltr">{formatNumber(getSentimentCounts(comments, 'neutral'))}</span>
                    </div>
                    <p className="text-xs text-purple-300">{t?.results?.neutral || 'Neutral'}</p>
                  </div>
                </div>
              </div>

              {/* Chart Visualization */}
              <div className="lg:col-span-1">
                <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                  <div className="h-72 sm:h-80 md:h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="sentiment" 
                          stroke="#9CA3AF"
                          fontSize={12}
                          angle={language === 'ar' ? 0 : -45}
                          textAnchor={language === 'ar' ? 'middle' : 'end'}
                          height={60}
                        />
                        <YAxis 
                          stroke="#9CA3AF"
                          fontSize={12}
                          label={{ 
                            value: t?.results?.confidence || 'Percentage', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { textAnchor: 'middle', fill: '#9CA3AF' }
                          }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#F9FAFB'
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
          {/* Top Positive Comment */}
          {topPositiveComment && (
            <div className="glass rounded-xl p-6 border border-green-400/20">
              <h4 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                <Smile size={20} />
                {t?.results?.positive || 'Positive'}
              </h4>
              <div className="space-y-3">
                <p className="text-white/90 italic">"{topPositiveComment.comment}"</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60 flex items-center gap-1">
                    <User size={14} />
                    @{topPositiveComment.user}
                  </span>
                  <span className="text-green-400 font-semibold" dir="ltr">
                    {((topPositiveComment.sentiment_confidence || 0) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Top Negative Comment */}
          {topNegativeComment && (
            <div className="glass rounded-xl p-6 border border-red-400/20">
              <h4 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                <Frown size={20} />
                {t?.results?.negative || 'Negative'}
              </h4>
              <div className="space-y-3">
                <p className="text-white/90 italic">"{topNegativeComment.comment}"</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60 flex items-center gap-1">
                    <User size={14} />
                    @{topNegativeComment.user}
                  </span>
                  <span className="text-red-400 font-semibold" dir="ltr">
                    {((topNegativeComment.sentiment_confidence || 0) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Most Liked Comment */}
          {mostLikedComment && (
            <div className="glass rounded-xl p-6 border border-purple-400/20">
              <h4 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                <Heart size={20} />
                {t?.results?.likes || 'Likes'}
              </h4>
              <div className="space-y-3">
                <p className="text-white/90 italic">"{mostLikedComment.comment}"</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60 flex items-center gap-1">
                    <User size={14} />
                    @{mostLikedComment.user}
                  </span>
                  <span className="text-purple-400 font-semibold flex items-center gap-1">
                    <Heart size={14} />
                    <span dir="ltr">{formatNumber(mostLikedComment.likes)}</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Info Section */}
        <div className="glass rounded-xl p-6 border border-white/10">
          <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="text-purple-400" size={24} />
            {t?.videoTitle}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium text-white/60 mb-1">{t?.results?.videoDescription || 'Description'}</h5>
                <p className="text-white text-sm leading-relaxed">
                  {videoInfo.description || (
                    <span className="text-white/50 italic">
                      {language === 'ar' ? 'لا يوجد وصف متاح' : 'No description available'}
                    </span>
                  )}
                </p>
              </div>
              {videoInfo.hashtags && videoInfo.hashtags.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-white/60 mb-2">{t?.results?.hashtags || 'Hashtags'}</h5>
                  <div className="flex flex-wrap gap-2">
                    {videoInfo.hashtags.slice(0, 10).map((tag, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">
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
        <div className="glass rounded-2xl p-8 border border-red-400/20 text-center">
          <AlertCircle className="mx-auto text-red-400 mb-4" size={48} />
          <h2 className="text-xl font-bold text-red-400 mb-2">
            {t?.results?.operationFailed || 'Operation Failed'}
          </h2>
          <p className="text-red-300 text-sm">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }
}