import { clsx, type ClassValue } from 'clsx';
import { AnalyzeRequestBody, AnalyzeResponse } from '@/api/types';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const validateTikTokUrl = (url: string): boolean => {
  const allowedDomains = [
    'tiktok.com',
    'www.tiktok.com',
    'm.tiktok.com',
    'vm.tiktok.com',
    'vt.tiktok.com'
  ];
  
  const trimmedUrl = url.trim();
  
  // Check if URL starts with http:// or https://
  if (!/^https?:\/\//.test(trimmedUrl)) {
    return false;
  }
  
  // Extract domain from URL
  try {
    const urlObj = new URL(trimmedUrl);
    const domain = urlObj.hostname.toLowerCase();
    
    // Check if domain is in allowed list and has a path
    return allowedDomains.includes(domain) && urlObj.pathname.length > 1;
  } catch {
    return false;
  }
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
