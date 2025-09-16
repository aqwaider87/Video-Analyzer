import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:3000'),
  title: 'AI Video Analyzer | محلل فيديوهات الذكي',
  description: 'Advanced AI-powered analysis for TikTok videos with sentiment analysis, engagement metrics, and content insights.',
  keywords: ['TikTok', 'AI', 'Video Analysis', 'Sentiment Analysis', 'Social Media'],
  authors: [{ name: 'Video Analyzer Team' }],
  openGraph: {
    title: 'AI Video Analyzer',
    description: 'Advanced AI-powered analysis for TikTok videos',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ar_SA',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
