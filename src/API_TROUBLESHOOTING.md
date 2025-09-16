# API Integration Troubleshooting

## Error: Connect Timeout Error / fetch failed

This error occurs when the external API server is not running or not accessible.

### Solution Steps:

1. **Check if the API server is running:**
   - Ensure the analysis server is running on `127.0.0.1:5003`
   - The server should have an `/api/analyze` endpoint

2. **Test the connection:**
   - Visit http://127.0.0.1:3000/api/health to check the health status
   - This will show if the external API is reachable

3. **Update configuration:**
   - Edit `.env.local` to change the API base URL if needed:
     ```
     ANALYZE_API_BASE_URL=http://your-server:port
     ```

4. **Common fixes:**
   - Start the external API server
   - Check firewall settings
   - Verify the IP address and port
   - Ensure the external API accepts POST requests to `/api/analyze`

## API Endpoints

### Health Check
- **URL:** `/api/health`
- **Method:** GET
- **Purpose:** Check if the external API is reachable

### Video Analysis
- **URL:** `/api/analyze`
- **Method:** POST
- **Body:** `{ "url": "https://tiktok.com/..." }`
- **Purpose:** Analyze TikTok video (proxied to external API)

## Environment Variables

- `ANALYZE_API_BASE_URL`: Base URL of the external analysis API (default: http://127.0.0.1:5003)
- `ANALYZE_API_TIMEOUT_MS`: Request timeout in milliseconds (default: 120000 = 2 minutes)