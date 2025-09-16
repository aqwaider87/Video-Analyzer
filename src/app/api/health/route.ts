import { NextResponse } from 'next/server';

const DEFAULT_BASE_URL = process.env.ANALYZE_API_BASE_URL || "http://127.0.0.1:5003";

export async function GET() {
  const healthCheck = {
    timestamp: new Date().toISOString(),
    service: 'TikTok Video Analyzer Proxy',
    status: 'checking...',
    externalApi: {
      url: DEFAULT_BASE_URL,
      status: 'checking...',
      responseTime: 0,
      error: null as string | null
    }
  };

  try {
    console.log('Health check: Testing connection to external API...');
    const startTime = Date.now();
    
    // Try to connect to the external API with a shorter timeout for health check
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    try {
      const response = await fetch(`${DEFAULT_BASE_URL}/health`, {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      const endTime = Date.now();
      
      healthCheck.externalApi.responseTime = endTime - startTime;
      healthCheck.externalApi.status = response.ok ? 'healthy' : `error_${response.status}`;
      
      if (!response.ok) {
        healthCheck.externalApi.error = `HTTP ${response.status}: ${response.statusText}`;
      }
      
    } catch (error) {
      clearTimeout(timeoutId);
      const endTime = Date.now();
      
      healthCheck.externalApi.responseTime = endTime - startTime;
      healthCheck.externalApi.status = 'unreachable';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          healthCheck.externalApi.error = 'Connection timeout (5s)';
        } else if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
          healthCheck.externalApi.error = 'Connection refused - server may not be running';
        } else {
          healthCheck.externalApi.error = error.message;
        }
      }
    }
    
    // Determine overall status
    healthCheck.status = healthCheck.externalApi.status === 'healthy' ? 'healthy' : 'degraded';
    
    console.log('Health check result:', healthCheck);
    
    return NextResponse.json(healthCheck, {
      status: healthCheck.status === 'healthy' ? 200 : 503
    });
    
  } catch (error) {
    console.error('Health check error:', error);
    
    healthCheck.status = 'error';
    healthCheck.externalApi.status = 'error';
    healthCheck.externalApi.error = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(healthCheck, { status: 500 });
  }
}