#!/bin/bash

# Script to manually increment version
# Usage: ./scripts/increment-version.sh [patch|minor|major]

VERSION_TYPE=${1:-patch}

echo "🔄 Incrementing $VERSION_TYPE version..."

# Navigate to src directory
cd src

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📦 Current version: v$CURRENT_VERSION"

# Increment version
npm version $VERSION_TYPE --no-git-tag-version

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "✅ New version: v$NEW_VERSION"

# Go back to root
cd ..

# Add and commit changes
git add src/package.json
git commit -m "chore: bump version to v$NEW_VERSION [skip-version]"

echo "🏷️  Version updated to v$NEW_VERSION"
echo "🚀 Push to main branch to deploy: git push origin main"
