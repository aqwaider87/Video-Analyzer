@echo off
echo Installing TikTok Video Analyzer Web Interface...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Install dependencies
echo Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo.
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ✅ Installation completed successfully!
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo The application will be available at:
echo   http://localhost:3000
echo.
pause
