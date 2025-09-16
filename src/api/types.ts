// TypeScript interfaces representing the /analyze endpoint request & response

export interface AnalyzeRequestBody {
  url: string;
}

export interface SentimentProbabilities {
  [label: string]: number; // e.g., "ايجابي", "سلبي", "محايد"
}

export interface CommentSentiment {
  user: string;
  comment: string;
  likes: string | number; // API sometimes returns numeric-like strings
  lang: string; // e.g., 'ar', 'other'
  sentiment: string; // label (Arabic)
  sentiment_confidence: number;
  sentiment_probs: SentimentProbabilities;
  sentiment_method: string; // e.g., 'neural_model'
  sentiment_latency_ms: number;
}

export interface ExtractionCompleteMeta {
  url: string;
  extracted_at: number; // epoch seconds
  influencer_name: string;
  likes: string; // may be numeric-like
  comment_count: string; // may be numeric-like
  save_count: string; // may be numeric-like
}

export interface AnalyzeMetadata {
  video_url: string;
  video_id: string;
  processed_at: number; // epoch seconds
  influencer_name: string;
  description: string;
  likes: string; // numeric-like
  comment_count: number; // Provided sample shows number (144) but nested extraction_complete has string
  save_count: string; // numeric-like
  comments_extracted: number;
  comments: CommentSentiment[];
  hashtags: string[];
  extraction_complete: ExtractionCompleteMeta;
}

export interface AnalyzeResponse {
  success: boolean;
  complete: boolean;
  cached: boolean;
  video_id: string;
  video_size_mb: number | null;
  cache_age_minutes: number;
  processing_time: number; // seconds
  metadata: AnalyzeMetadata;
}
