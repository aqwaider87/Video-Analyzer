import { clsx, type ClassValue } from 'clsx';
import { AnalyzeRequestBody, AnalyzeResponse } from '@/api/types';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const validateTikTokUrl = (url: string): boolean => {
  const tiktokRegex = /^https?:\/\/(www\.)?(vm\.)?tiktok\.com\/.+/i;
  return tiktokRegex.test(url.trim());
};

export const analyzeVideo = async (url: string): Promise<AnalyzeResponse> => {
  const requestBody: AnalyzeRequestBody = { url };
  
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  const data: AnalyzeResponse = await response.json();
  
  // Log the response to console as requested
  console.log('Video Analysis Response:', data);
  
  return data;
};
