/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is enabled by default in Next.js 13.4+
  
  // Set default port to 3001
  async rewrites() {
    return []
  },
  
  // Development server configuration
  ...(process.env.NODE_ENV === 'development' && {
    async headers() {
      return []
    }
  })
}

module.exports = nextConfig
