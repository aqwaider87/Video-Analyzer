#!/bin/bash

# Quick start script for Video Analyzer
# This script sets up and starts the development environment

echo "🚀 Video Analyzer Quick Start"
echo "============================="

# Check if we're in the right directory
if [ ! -f "src/package.json" ]; then
    echo "❌ Error: Please run this script from the Video-Analyzer root directory"
    exit 1
fi

echo "📦 Installing dependencies..."
cd src
npm install

echo "🔧 Configuration:"
echo "  - Framework: Next.js 13.5.6"
echo "  - Port: 3001"
echo "  - Environment: Development"

echo ""
echo "🌐 Starting development server..."
echo "   URL: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
