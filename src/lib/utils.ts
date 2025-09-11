import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const validateTikTokUrl = (url: string): boolean => {
  const tiktokRegex = /^https?:\/\/(www\.)?(vm\.)?tiktok\.com\/.+/i;
  return tiktokRegex.test(url.trim());
};

export const simulateAnalysis = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, 2000); // 2 second delay
  });
};
