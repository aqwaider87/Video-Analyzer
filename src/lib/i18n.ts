export interface Translations {
  title: string;
  subtitle: string;
  inputPlaceholder: string;
  buttonText: string;
  pasteButton: string;
  errorInvalidUrl: string;
  loadingText: string;
  resultsTitle: string;
  resultsSubtitle: string;
  sampleInsights: {
    engagement: string;
    sentiment: string;
    views: string;
    likes: string;
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
    loadingText: 'Analyzing video content with AI...',
    resultsTitle: 'Analysis Results',
    resultsSubtitle: 'AI-powered insights for your TikTok video',
    sampleInsights: {
      engagement: 'High Engagement Score',
      sentiment: 'Positive Sentiment',
      views: '2.5M Views Predicted',
      likes: '125K Likes Estimated'
    }
  },
  ar: {
    title: 'محلل فيديوهات تيك توك الذكي',
    subtitle: 'تحليل متقدم مدعوم بالذكاء الاصطناعي لفيديوهات تيك توك مع تحليل المشاعر ومقاييس التفاعل',
  inputPlaceholder: 'https://www.tiktok.com/video',
    buttonText: 'بدء التحليل',
    pasteButton: 'لصق',
    errorInvalidUrl: 'يرجى إدخال رابط فيديو تيك توك صالح',
    loadingText: 'جاري تحليل محتوى الفيديو بالذكاء الاصطناعي...',
    resultsTitle: 'نتائج التحليل',
    resultsSubtitle: 'رؤى مدعومة بالذكاء الاصطناعي لفيديو تيك توك الخاص بك',
    sampleInsights: {
      engagement: 'نسبة تفاعل عالية',
      sentiment: 'مشاعر إيجابية',
      views: '2.5 مليون مشاهدة متوقعة',
      likes: '125 ألف إعجاب متوقع'
    }
  }
};

export type Language = 'en' | 'ar';

export const isRTL = (language: Language) => language === 'ar';

export const getTranslation = (language: Language): Translations => {
  return translations[language];
};
