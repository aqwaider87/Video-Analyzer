export interface Translations {
  title: string;
  subtitle: string;
  inputPlaceholder: string;
  buttonText: string;
  pasteButton: string;
  errorInvalidUrl: string;
  loadingText: string;
  loadingDivText: string;
  resultsTitle: string;
  resultsSubtitle: string;
  sampleInsights: {
    engagement: string;
    sentiment: string;
    views: string;
    likes: string;
  };
  results: {
    operationFailed: string;
    analysisResults: string;
    detailedAnalysis: string;
    contentCreator: string;
    likes: string;
    comments: string;
    saves: string;
    sentimentAnalysis: string;
    positive: string;
    negative: string;
    neutral: string;
    confidence: string;
    topPositiveComment: string;
    mostLikedComment: string;
    hashtags: string;
    videoDescription: string;
  };
}

export const translations: Record<'en' | 'ar', Translations> = {
  en: {
    title: 'AI TikTok Video Analyzer',
    subtitle: 'Advanced AI-powered analysis for TikTok videos with sentiment analysis and engagement insights',
  inputPlaceholder: 'https://www.tiktok.com/video',
    buttonText: 'Start Analysis',
    pasteButton: 'Paste',
    errorInvalidUrl: 'Please enter a valid TikTok video URL',
    loadingText: 'Analyzing...',
    loadingDivText: 'Analyzing video content...',
    resultsTitle: 'Analysis Results',
    resultsSubtitle: 'The video has been successfully analyzed using AI techniques, based on user interactions and comments.',
    sampleInsights: {
      engagement: 'High Engagement Score',
      sentiment: 'Positive Sentiment',
      views: '2.5M Views Predicted',
      likes: '125K Likes Estimated'
    },
    results: {
      operationFailed: 'Operation Failed',
      analysisResults: 'Analysis Results',
      detailedAnalysis: 'Detailed analysis of video content and comments',
      contentCreator: 'Content Creator',
      likes: 'Likes',
      comments: 'Comments',
      saves: 'Saves',
      sentimentAnalysis: 'Sentiment Analysis',
      positive: 'Positive',
      negative: 'Negative',
      neutral: 'Neutral',
      confidence: 'confidence',
      topPositiveComment: 'Top Positive Comment',
      mostLikedComment: 'Most Liked Comment',
      hashtags: 'Hashtags',
      videoDescription: 'Video Description'
    }
  },
  ar: {
    title: 'محلل فيديوهات تيك توك الذكي',
    subtitle: 'تحليل متقدم مدعوم بالذكاء الاصطناعي لفيديوهات تيك توك مع تحليل المشاعر ومقاييس التفاعل',
  inputPlaceholder: 'https://www.tiktok.com/video',
    buttonText: 'بدء التحليل',
    pasteButton: 'لصق',
    errorInvalidUrl: 'يرجى إدخال رابط فيديو تيك توك صالح',
    loadingText: 'تحليل...',
    loadingDivText: 'جاري تحليل محتوى الفيديو...',
    resultsTitle: 'نتائج التحليل',
    resultsSubtitle: 'تم تحليل الفيديو بنجاح باستخدام تقنيات الذكاء الاصطناعي، استنادًا إلى تفاعل وتعليقات المستخدمين.',
    sampleInsights: {
      engagement: 'نسبة تفاعل عالية',
      sentiment: 'مشاعر إيجابية',
      views: '2.5 مليون مشاهدة متوقعة',
      likes: '125 ألف إعجاب متوقع'
    },
    results: {
      operationFailed: 'فشلت العملية',
      analysisResults: 'نتائج التحليل',
      detailedAnalysis: 'تحليل مفصل لمحتوى الفيديو والتعليقات',
      contentCreator: 'منشئ المحتوى',
      likes: 'الإعجابات',
      comments: 'التعليقات',
      saves: 'الحفظ',
      sentimentAnalysis: 'تحليل المشاعر',
      positive: 'إيجابي',
      negative: 'سلبي',
      neutral: 'محايد',
      confidence: 'ثقة',
      topPositiveComment: 'أفضل تعليق إيجابي',
      mostLikedComment: 'التعليق الأكثر إعجاباً',
      hashtags: 'الهاشتاغات',
      videoDescription: 'وصف الفيديو'
    }
  }
};

export type Language = 'en' | 'ar';

export const isRTL = (language: Language) => language === 'ar';

export const getTranslation = (language: Language): Translations => {
  return translations[language];
};
