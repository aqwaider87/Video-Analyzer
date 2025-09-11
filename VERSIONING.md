# Automatic Versioning System

This project includes an automatic versioning system that increments the version number with every push to the main branch.

## How it Works

### Automatic Version Increment
- Every push to the `main` branch triggers the GitHub Action
- The version number in `src/package.json` is automatically incremented (patch version)
- A new commit with the version bump is created
- A Git tag is created with the new version

### Version Display
- The current version is displayed in the bottom-left corner of the application
- The version is read from `src/package.json` at build time
- Uses a glassmorphism design that matches the app's aesthetic

## Manual Version Management

### Using npm scripts (in src directory):
```bash
cd src
npm run version:patch  # 1.0.0 -> 1.0.1
npm run version:minor  # 1.0.0 -> 1.1.0  
npm run version:major  # 1.0.0 -> 2.0.0
```

### Using PowerShell script (Windows):
```powershell
.\scripts\increment-version.ps1 patch
.\scripts\increment-version.ps1 minor
.\scripts\increment-version.ps1 major
```

### Using Bash script (Linux/macOS):
```bash
./scripts/increment-version.sh patch
./scripts/increment-version.sh minor
./scripts/increment-version.sh major
```

## Skipping Version Increment

To push changes without incrementing the version, include `[skip-version]` in your commit message:

```bash
git commit -m "docs: update README [skip-version]"
```

## Current Version: v0.1.0

The version is displayed as a small badge in the bottom-left corner of the application with:
- Glassmorphism background effect
- Subtle glow animation
- Monospace font for technical appearance
- Fade-in animation on page load

## Files Structure

```
├── .github/workflows/auto-version.yml  # GitHub Action for auto-increment
├── scripts/
│   ├── increment-version.ps1           # PowerShell version script
│   └── increment-version.sh            # Bash version script
├── src/
│   ├── package.json                    # Contains version number
│   ├── lib/version.ts                  # Version utility functions
│   └── components/Version.tsx          # Version display component
└── VERSIONING.md                       # This documentation
```
