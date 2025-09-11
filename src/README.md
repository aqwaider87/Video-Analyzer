# TikTok Video Analyzer - Web Interface

A modern, bilingual (Arabic/English) web interface for AI-powered TikTok video analysis built with Next.js, React, TailwindCSS, and Framer Motion.

## Features

### 🌍 **Bilingual Support**
- Full Arabic and English language support
- Automatic RTL/LTR layout switching
- Context-aware translations for all UI elements

### 🎨 **Modern Design**
- Glassmorphism design with backdrop blur effects
- Animated gradient backgrounds
- Responsive design for all screen sizes
- Dark theme with elegant visual hierarchy

### ⚡ **Interactive Animations**
- Smooth entrance animations with Framer Motion
- Micro-interactions on input focus and button hover
- Loading states with progress indicators
- Floating particles and geometric patterns

### 🔍 **Analysis Flow**
- TikTok URL validation with real-time feedback
- Simulated AI analysis with loading states
- Results placeholder with sample insights
- Error handling with user-friendly messages

### ♿ **Accessibility**
- ARIA labels and live regions
- Keyboard navigation support
- High contrast color schemes
- Screen reader friendly

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Inter (English), Cairo (Arabic)

## Project Structure

```
src/web/
├── app/
│   ├── globals.css          # Global styles and animations
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

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Navigate to the web directory:
```bash
cd "src/web"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Key Components

### Language System
The app uses a simple but effective i18n system:

```typescript
// Switch language
setLanguage('ar'); // Arabic with RTL
setLanguage('en'); // English with LTR

// Get translations
const t = getTranslation(language);
console.log(t.title); // "AI TikTok Video Analyzer" or "محلل فيديوهات تيك توك الذكي"
```

### URL Validation
TikTok URLs are validated using regex patterns:

```typescript
const isValid = validateTikTokUrl("https://www.tiktok.com/@user/video/123");
```

### Animation System
Framer Motion powers smooth animations:

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
  Content with entrance animation
</motion.div>
```

## Customization

### Adding New Languages
1. Add translations to `lib/i18n.ts`
2. Update the `Language` type
3. Add RTL support if needed

### Modifying Animations
All animations are in individual components using Framer Motion. Key animation classes are defined in `globals.css`.

### Styling
The design uses TailwindCSS with custom utility classes for glassmorphism effects and animations defined in the config.

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Performance Features

- Client-side rendering with React 18
- Optimized bundle splitting
- Progressive loading of animations
- Responsive images and icons

## Security Features

- Input validation and sanitization
- XSS protection
- CSRF token support (when connected to backend)
- Safe clipboard API usage

## Deployment

Build for production:

```bash
npm run build
```

The build output will be in the `.next` directory, ready for deployment to any Node.js hosting platform.

### Deployment Options

- **Vercel**: Optimal for Next.js apps
- **Netlify**: Static site generation support
- **AWS/Azure**: Container or serverless deployment
- **Traditional hosting**: Node.js server required

## Future Enhancements

- [ ] Real backend integration
- [ ] User authentication
- [ ] Analysis history
- [ ] Additional language support
- [ ] Dark/light mode toggle
- [ ] Progressive Web App (PWA) features
- [ ] Advanced AI insights visualization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the TikTok Arabic Video Analyzer suite.
