# TikTok Video Analyzer - Web Interface

A modern, bilingual (Arabic/English) web interface for AI-powered TikTok video analysis built with Next.js, React, TailwindCSS, and Framer Motion.

## 🌟 Features

### 🌍 **Bilingual Support**
- Full Arabic and English language support
- Automatic RTL/LTR layout switching  
- Context-aware translations for all UI elements
- Arabic fonts: Cairo, Tajawal | English fonts: Inter

### 🎨 **Modern Design**
- Glassmorphism design with backdrop blur effects
- Animated gradient backgrounds with aurora effects
- Neural network visualization with binary matrix
- Interactive AI brain with thinking animations
- Responsive design for all screen sizes
- Dark theme with elegant visual hierarchy

### ⚡ **Interactive Animations**
- Smooth entrance animations with Framer Motion
- Micro-interactions on input focus and button hover
- Loading states with progress indicators
- Floating particles and geometric patterns
- Performance-optimized animations with GPU acceleration

### 🔍 **Analysis Flow**
- TikTok URL validation with real-time feedback
- Simulated AI analysis with loading states
- Results placeholder with sample insights
- Error handling with user-friendly messages
- Progress tracking and status updates

### ♿ **Accessibility & Performance**
- ARIA labels and live regions
- Keyboard navigation support
- High contrast color schemes
- Screen reader friendly
- Optimized rendering with `will-change` and `contain` properties
- Reduced animation count for better performance

### 🔄 **Version Management**
- Automatic version increment on git push
- Version display in bottom-left corner
- Manual version control scripts
- GitHub Actions integration

## 🛠 Tech Stack

- **Framework**: Next.js 13.5.6 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: TailwindCSS 3.3.0
- **Animations**: Framer Motion 10.16.16
- **Icons**: Lucide React 0.298.0
- **Fonts**: Inter (English), Cairo (Arabic)
- **Development**: ESLint, PostCSS, Autoprefixer

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and animations
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main page component
├── components/
│   ├── AnimatedBrainI.tsx   # Animated brain icon component
│   ├── AnimatedHeading.tsx  # Text animation component
│   ├── BackgroundFX.tsx     # Animated background effects
│   ├── Hero.tsx             # Hero section with title
│   ├── InteractiveCharacter.tsx # Character interactions
│   ├── LanguageToggle.tsx   # Language switcher
│   ├── ResultsPlaceholder.tsx # Analysis results display
│   ├── UrlCard.tsx          # Main input card
│   └── Version.tsx          # Version display component
├── lib/
│   ├── i18n.ts              # Internationalization utilities
│   ├── utils.ts             # Helper functions
│   └── version.ts           # Version management utilities
├── public/
│   └── favicon.svg          # App favicon
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
├── next.config.js          # Next.js configuration
├── postcss.config.js       # PostCSS configuration
└── README.md               # This file
```
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main page component
├── components/
│   ├── BackgroundFX.tsx     # Animated background effects
│   ├── Hero.tsx             # Hero section with title
│   ├── LanguageToggle.tsx   # Language switcher
│   ├── ResultsPlaceholder.tsx # Analysis results display
│   └── UrlCard.tsx          # Main input card
├── lib/
│   ├── i18n.ts              # Internationalization utilities
│   └── utils.ts             # Helper functions
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Git for version control

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/aqwaider87/Video-Analyzer.git
cd Video-Analyzer
```

2. **Navigate to the source directory:**
```bash
cd src
```

3. **Install dependencies:**
```bash
npm install
```

4. **Start the development server:**
```bash
npm run dev
```

5. **Open your browser:**
Visit [http://localhost:3001](http://localhost:3001) to see the application

### 📋 Available Scripts

```bash
# Development
npm run dev              # Start development server on port 3001
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Version Management (added in v0.1.1)
npm run version:patch    # Increment patch version (0.1.0 → 0.1.1)
npm run version:minor    # Increment minor version (0.1.0 → 0.2.0)
npm run version:major    # Increment major version (0.1.0 → 1.0.0)
```

## 🔧 Key Components

### 🌐 Language System
The app uses a comprehensive i18n system with RTL/LTR support:

```typescript
// Switch language with automatic layout direction
setLanguage('ar'); // Arabic with RTL layout
setLanguage('en'); // English with LTR layout

// Get translations with context awareness
const t = getTranslation(language);
console.log(t.title); // "AI TikTok Video Analyzer" or "محلل فيديوهات تيك توك الذكي"
```

### 🔍 URL Validation
TikTok URLs are validated using comprehensive regex patterns:

```typescript
const isValid = validateTikTokUrl("https://www.tiktok.com/@user/video/123");
// Supports various TikTok URL formats and domains
```

### ✨ Animation System
Framer Motion powers smooth, GPU-accelerated animations:

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  style={{ contain: 'layout style paint' }} // Performance optimization
>
  Content with entrance animation
</motion.div>
```

### 🧠 Interactive Brain Component
Advanced SVG-based brain visualization with:
- Animated neural pathways
- Thinking state indicators
- Click interactions with sound effects
- Holographic display modes

### 🔄 Version Display
Real-time version information:
- Reads from package.json
- Glassmorphism design
- Bottom-left positioning
- Fade-in animation

## 🎨 Customization

### Adding New Languages
1. Add translations to `lib/i18n.ts`:
```typescript
const translations = {
  en: { /* English translations */ },
  ar: { /* Arabic translations */ },
  fr: { /* Add French translations */ }
};
```

2. Update the `Language` type
3. Add RTL support if needed
4. Include appropriate fonts

### Modifying Animations
All animations use Framer Motion with performance optimizations:
- Individual component animations
- Global keyframes in `globals.css`
- GPU acceleration with `translate3d()`
- Performance containment properties

### Styling Customization
The design system uses TailwindCSS with:
- Custom utility classes for glassmorphism
- Performance-optimized animations
- Responsive design patterns
- Dark theme color palette

## 🌐 Browser Support

- **Chrome**: 88+
- **Firefox**: 85+
- **Safari**: 14+
- **Edge**: 88+
- **Mobile browsers**: iOS 14+, Android 8+

## ⚡ Performance Features

- **React 18**: Concurrent features and automatic batching
- **Bundle optimization**: Code splitting and tree shaking
- **Animation optimization**: GPU acceleration and containment
- **Image optimization**: Next.js automatic image optimization
- **Progressive loading**: Lazy loading of heavy components
- **Memory management**: Efficient animation cleanup

## 🔒 Security Features

- **Input validation**: Comprehensive URL and form validation
- **XSS protection**: React's built-in XSS prevention
- **CSRF protection**: Ready for backend integration
- **Safe clipboard API**: Secure copy functionality
- **Content Security Policy**: Configurable CSP headers

## 🚀 Deployment Guide

### Build for Production
```bash
npm run build
```

### Deployment Platforms

#### **Vercel** (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### **Netlify**
```bash
# Build command: npm run build
# Publish directory: .next
```

#### **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

#### **Traditional Hosting**
Requires Node.js 18+ runtime:
```bash
npm run build
npm start
```

## 🔮 Future Enhancements

- [ ] **Backend Integration**: Real AI analysis API
- [ ] **User Authentication**: OAuth and session management
- [ ] **Analysis History**: User dashboard with saved analyses
- [ ] **Additional Languages**: Spanish, French, Chinese support
- [ ] **Dark/Light Mode**: Theme switcher with persistence
- [ ] **PWA Features**: Offline support and app installation
- [ ] **Advanced Visualizations**: 3D charts and interactive graphs
- [ ] **Real-time Updates**: WebSocket integration for live analysis
- [ ] **Export Features**: PDF and CSV report generation

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow coding standards**: ESLint and Prettier configuration
4. **Write tests**: Ensure new features have appropriate tests
5. **Update documentation**: Include README updates if needed
6. **Test thoroughly**: Cross-browser and responsive testing
7. **Submit a pull request**: Detailed description of changes

### Development Guidelines
- Use TypeScript for type safety
- Follow React best practices
- Maintain accessibility standards
- Optimize for performance
- Include proper error handling

## 📄 License

This project is part of the TikTok Arabic Video Analyzer suite.

---

<div align="center">
  <strong>Built with ❤️ by Ammar Qwaider</strong><br>
  <a href="https://www.linkedin.com/in/ammar1987/">LinkedIn</a> • 
  <a href="https://github.com/aqwaider87">GitHub</a>
</div>
