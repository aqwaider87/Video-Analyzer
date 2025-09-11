# Quick start script for Video Analyzer (Windows PowerShell)
# This script sets up and starts the development environment

Write-Host "🚀 Video Analyzer Quick Start" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "src\package.json")) {
    Write-Host "❌ Error: Please run this script from the Video-Analyzer root directory" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
Set-Location src
npm install

Write-Host "🔧 Configuration:" -ForegroundColor Green
Write-Host "  - Framework: Next.js 13.5.6" -ForegroundColor White
Write-Host "  - Port: 3001" -ForegroundColor White  
Write-Host "  - Environment: Development" -ForegroundColor White

Write-Host ""
Write-Host "🌐 Starting development server..." -ForegroundColor Cyan
Write-Host "   URL: http://localhost:3001" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

npm run dev
