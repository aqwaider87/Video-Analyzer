# Script to manually increment version
# Usage: .\scripts\increment-version.ps1 [patch|minor|major]

param(
    [string]$VersionType = "patch"
)

Write-Host "🔄 Incrementing $VersionType version..." -ForegroundColor Cyan

# Navigate to src directory
Set-Location src

# Get current version
$currentVersion = node -p "require('./package.json').version"
Write-Host "📦 Current version: v$currentVersion" -ForegroundColor Yellow

# Increment version
npm version $VersionType --no-git-tag-version

# Get new version
$newVersion = node -p "require('./package.json').version"
Write-Host "✅ New version: v$newVersion" -ForegroundColor Green

# Go back to root
Set-Location ..

# Add and commit changes
git add src/package.json
git commit -m "chore: bump version to v$newVersion [skip-version]"

Write-Host "🏷️  Version updated to v$newVersion" -ForegroundColor Green
Write-Host "🚀 Push to main branch to deploy: git push origin main" -ForegroundColor Cyan
