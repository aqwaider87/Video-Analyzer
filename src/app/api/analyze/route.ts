import { NextRequest, NextResponse } from 'next/server';
import { AnalyzeRequestBody, AnalyzeResponse } from '@/api/types';

const DEFAULT_BASE_URL = process.env.ANALYZE_API_BASE_URL || "http://127.0.0.1:5003";
const ENDPOINT_PATH = "/api/analyze";
const TIMEOUT_MS = parseInt(process.env.ANALYZE_API_TIMEOUT_MS || "120000");

export async function POST(request: NextRequest) {
  console.log('API proxy called with request to:', `${DEFAULT_BASE_URL}${ENDPOINT_PATH}`);
  
  try {
    const body: AnalyzeRequestBody = await request.json();
    console.log('Request body:', body);
    
    // Validate request body
    if (!body.url || typeof body.url !== 'string') {
      console.log('Invalid request body - URL missing or not a string');
      return NextResponse.json(
        { error: 'URL is required and must be a string' },
        { status: 400 }
      );
    }

    // Create AbortController for timeout (default 2 minutes = 120,000ms)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log(`Request timeout after ${TIMEOUT_MS}ms`);
      controller.abort();
    }, TIMEOUT_MS);

    try {
      console.log('Attempting to connect to external API...');
      const startTime = Date.now();
      
      const response = await fetch(`${DEFAULT_BASE_URL}${ENDPOINT_PATH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const endTime = Date.now();
      console.log(`API response received in ${endTime - startTime}ms, status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.log('API returned error:', response.status, errorText);
        return NextResponse.json(
          { error: `API returned ${response.status}: ${response.statusText}. ${errorText}` },
          { status: response.status }
        );
      }

      const rawResponse = await response.json();
      
      // Log the raw response for debugging
      console.log('Raw API Response:', JSON.stringify(rawResponse, null, 2));
      
      // Check if the response is wrapped in a status/data structure
      let data: AnalyzeResponse;
      if (rawResponse.status && rawResponse.data) {
        // Wrapped response - extract the actual data
        data = rawResponse.data;
        console.log('Extracted data from wrapped response:', JSON.stringify(data, null, 2));
      } else {
        // Direct response
        data = rawResponse;
        console.log('Using direct response as data');
      }
   
      return NextResponse.json(data);
    } catch (error) {
      clearTimeout(timeoutId);
      
      console.error('Network error details:', error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request was aborted due to timeout');
        return NextResponse.json(
          { error: `Request timeout - analysis took longer than ${TIMEOUT_MS / 1000} seconds` },
          { status: 408 }
        );
      }
      
      // Handle specific connection errors
      if (error instanceof Error) {
        if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED') || error.message.includes('Connect Timeout')) {
          console.log('Connection to external API failed');
          return NextResponse.json(
            { error: 'Unable to connect to the analysis server. Please ensure the server is running and accessible.' },
            { status: 503 }
          );
        }
      }
      
      throw error;
    }
  } catch (error) {
    console.error('API proxy error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to process request: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}