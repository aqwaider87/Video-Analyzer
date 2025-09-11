# Video-Analyzer
Advanced AI-powered analysis for TikTok videos with sentiment analysis and engagement insights

[![Version](https://img.shields.io/badge/version-v0.1.1-blue.svg)](./VERSIONING.md)
[![Next.js](https://img.shields.io/badge/Next.js-13.5.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-38B2AC)](https://tailwindcss.com/)

## 🚀 Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/aqwaider87/Video-Analyzer.git
cd Video-Analyzer
```

2. **Install dependencies**
```bash
cd src
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open browser**
Visit [http://localhost:3001](http://localhost:3001) to see the application

## Features

- 🤖 **AI-powered video analysis** - Advanced sentiment and engagement analysis
- 📊 **Real-time insights** - Comprehensive analytics dashboard
- 🌍 **Multi-language support** - Full Arabic/English localization with RTL support
- 🎨 **Modern glassmorphism UI** - Beautiful animations and interactive effects
- 📱 **Responsive design** - Optimized for all devices and screen sizes
- 🔄 **Automatic versioning** - GitHub Actions powered version management
- ⚡ **Performance optimized** - Smooth animations and optimized rendering
- ♿ **Accessibility focused** - WCAG compliant with keyboard navigation

## Project Structure

```
├── .github/workflows/       # GitHub Actions for auto-versioning
├── scripts/                 # Version management scripts
├── src/                     # Main application source
│   ├── app/
│   │   ├── globals.css      # Global styles and animations
│   │   ├── layout.tsx       # Root layout with metadata
│   │   └── page.tsx         # Main page component
│   ├── components/
│   │   ├── BackgroundFX.tsx     # Animated background effects
│   │   ├── Hero.tsx             # Hero section with title
│   │   ├── LanguageToggle.tsx   # Language switcher
│   │   ├── ResultsPlaceholder.tsx # Analysis results display
│   │   ├── UrlCard.tsx          # Main input card
│   │   └── Version.tsx          # Version display component
│   ├── lib/
│   │   ├── i18n.ts              # Internationalization utilities
│   │   ├── utils.ts             # Helper functions
│   │   └── version.ts           # Version management utilities
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── next.config.js
├── README.md                # This file
└── VERSIONING.md           # Version management documentation
```

## 🛠 Technology Stack

- **Framework**: Next.js 13.5.6 with App Router
- **Language**: TypeScript 5.0
- **Styling**: TailwindCSS 3.3.0
- **Animations**: Framer Motion 10.16.16
- **Icons**: Lucide React 0.298.0
- **Development**: ESLint, PostCSS, Autoprefixer

## 📋 Available Scripts

```bash
# Development
npm run dev          # Start development server on port 3001
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Version Management
npm run version:patch    # Increment patch version (0.1.0 → 0.1.1)
npm run version:minor    # Increment minor version (0.1.0 → 0.2.0)
npm run version:major    # Increment major version (0.1.0 → 1.0.0)
```

## 🔄 Automatic Versioning

This project includes an automatic versioning system:

- **Auto-increment**: Version automatically bumps on each push to main branch
- **Manual control**: Use npm scripts or PowerShell/Bash scripts for manual increments
- **Version display**: Current version shown in bottom-left corner of app
- **Skip option**: Include `[skip-version]` in commit message to skip auto-increment

For detailed information, see [VERSIONING.md](./VERSIONING.md)

## 🌍 Internationalization

Full bilingual support with:
- **Languages**: English and Arabic
- **Layout**: Automatic RTL/LTR switching
- **Fonts**: Inter (English), Cairo (Arabic)
- **Context-aware translations** for all UI elements

## 🎨 Design Features

- **Glassmorphism**: Modern glass-like UI elements with backdrop blur
- **Neural Network**: Animated background with binary matrix effects
- **Interactive Brain**: Clickable AI brain with thinking animations
- **Responsive**: Optimized for desktop, tablet, and mobile
- **Accessibility**: WCAG compliant with keyboard navigation

## 🚀 Deployment

The application is optimized for deployment on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS/Azure**
- **Traditional Node.js hosting**

```bash
npm run build    # Creates optimized production build
npm run start    # Runs production server
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ammar Qwaider**
- LinkedIn: [ammar1987](https://www.linkedin.com/in/ammar1987/)
- GitHub: [aqwaider87](https://github.com/aqwaider87)

---

<div align="center">
  <strong>Built with ❤️ using Next.js and modern web technologies</strong>
</div>
