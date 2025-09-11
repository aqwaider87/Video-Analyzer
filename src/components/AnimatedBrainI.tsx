import { motion } from 'framer-motion';

interface AnimatedBrainIProps { thinking?: boolean }

export default function AnimatedBrainI({ thinking = false }: AnimatedBrainIProps) {
  return (
  <div
      className={
        'relative inline-flex items-center justify-center text-white select-none ' +
    (thinking ? 'scale-[1.05] animate-[hueShift_6s_linear_infinite]' : '')
      }
    >
      {/* Outer glow pulse when thinking */}
      <div
        className={
          'absolute inset-0 rounded-full blur-2xl transition-opacity duration-700 pointer-events-none ' +
          (thinking
            ? 'opacity-70 bg-[radial-gradient(circle_at_50%_50%,rgba(0,220,255,0.5),rgba(255,0,200,0)_70%)] animate-[brainPulse_2s_ease-in-out_infinite]'
            : 'opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(0,200,255,0.35),rgba(255,0,200,0)_70%)]')
        }
      />
      {/* Brain (enlarged) */}
      <motion.svg
        initial={{ rotate: -6 }}
        animate={{ rotate: thinking ? [ -6, 6, -6 ] : [ -4, 4, -4 ] }}
        transition={{ repeat: Infinity, duration: thinking ? 4 : 7, ease: 'easeInOut' }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        className="w-32 h-32"
        fill="none"
        strokeWidth={1.15}
        style={{
          filter:
            'drop-shadow(0 0 4px rgba(0,200,255,0.55)) drop-shadow(0 0 8px rgba(255,0,200,0.35))',
        }}
      >
        <defs>
          <linearGradient id="signalGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00e0ff" />
            <stop offset="100%" stopColor="#ff00ff" />
          </linearGradient>
          {/* Light orange gradient for traveling dots */}
          <linearGradient id="dotGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffd9a1" />
            <stop offset="45%" stopColor="#fdc47aff" />
            <stop offset="100%" stopColor="#f8b051ff" />
          </linearGradient>
          <radialGradient id="brainFill" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#1ce8ff" stopOpacity="0.35" />
            <stop offset="55%" stopColor="#0084ff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#001c40" stopOpacity="0" />
          </radialGradient>
          <filter id="gsoft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b" />
            <feColorMatrix in="b" type="matrix" values="0 0 0 0 0.2 0 0 0 0 0.0 0 0 0 0 0.5 0 0 0 0.9 0" />
            <feBlend in="SourceGraphic" mode="screen" />
          </filter>
        </defs>
        {/* Shell */}
        <path
          d="M32 4c-8 0-14 6-14 14v2h-2c-4 0-8 4-8 8v8c0 4 4 8 8 8h2v2c0 8 6 14 14 14h4c8 0 14-6 14-14v-2h2c4 0 8-4 8-8v-8c0-4-4-8-8-8h-2v-2c0-8-6-14-14-14h-4z"
          stroke="url(#signalGrad)"
          fill="url(#brainFill)"
          filter="url(#gsoft)"
        />
        {/* Pathways – traveling neural dots style */}
        <g strokeLinecap="round" fill="none">
          {/* Base pathways */}
          <path id="pA" d="M20 22c6 2 8 6 12 10s8 8 12 10" stroke="url(#signalGrad)" strokeOpacity={0.20} strokeWidth={0.8} />
          <path id="pB" d="M20 34c4 2 6 4 10 8s6 4 10 6" stroke="url(#signalGrad)" strokeOpacity={0.18} strokeWidth={0.7} />
            <path id="pC" d="M24 18c5 3 10 8 14 14s10 10 16 14" stroke="url(#signalGrad)" strokeOpacity={0.22} strokeWidth={0.85} />
          <path id="pD" d="M18 28c7 3 12 9 16 14s10 11 18 16" stroke="url(#signalGrad)" strokeOpacity={0.18} strokeWidth={0.75} />

          {/* Dots moving along each pathway */}
          <g filter="url(#gsoft)">
            {/* Path A dots */}
            <circle r={1.4} fill="url(#dotGrad)" opacity={0.9}>
              <animateMotion dur={thinking ? '3s' : '5.5s'} repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1">
                <mpath href="#pA" />
              </animateMotion>
              <animate attributeName="r" values="1.0;1.6;1.0" dur="1.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite" />
            </circle>
            <circle r={1.1} fill="url(#dotGrad)" opacity={0.75}>
              <animateMotion begin={thinking ? '0.6s' : '1s'} dur={thinking ? '3s' : '5.5s'} repeatCount="indefinite" rotate="auto">
                <mpath href="#pA" />
              </animateMotion>
              <animate attributeName="opacity" values="0.2;0.8;0.2" dur="1.4s" repeatCount="indefinite" />
            </circle>

            {/* Path B dots */}
            <circle r={1.3} fill="url(#dotGrad)" opacity={0.85}>
              <animateMotion dur={thinking ? '3.3s' : '6s'} repeatCount="indefinite" rotate="auto">
                <mpath href="#pB" />
              </animateMotion>
              <animate attributeName="r" values="0.9;1.5;0.9" dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.25;0.95;0.25" dur="1.6s" repeatCount="indefinite" />
            </circle>
            <circle r={0.95} fill="url(#dotGrad)" opacity={0.7}>
              <animateMotion begin={thinking ? '0.8s' : '1.2s'} dur={thinking ? '3.3s' : '6s'} repeatCount="indefinite" rotate="auto">
                <mpath href="#pB" />
              </animateMotion>
              <animate attributeName="opacity" values="0.15;0.6;0.15" dur="1.3s" repeatCount="indefinite" />
            </circle>

            {/* Path C dots */}
            <circle r={1.5} fill="url(#dotGrad)" opacity={0.92}>
              <animateMotion dur={thinking ? '2.8s' : '5.2s'} repeatCount="indefinite" rotate="auto">
                <mpath href="#pC" />
              </animateMotion>
              <animate attributeName="r" values="1.1;1.9;1.1" dur="1.3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.35;1;0.35" dur="1.3s" repeatCount="indefinite" />
            </circle>
            <circle r={1.2} fill="url(#dotGrad)" opacity={0.78}>
              <animateMotion begin={thinking ? '0.5s' : '0.9s'} dur={thinking ? '2.8s' : '5.2s'} repeatCount="indefinite" rotate="auto">
                <mpath href="#pC" />
              </animateMotion>
              <animate attributeName="opacity" values="0.2;0.7;0.2" dur="1.1s" repeatCount="indefinite" />
            </circle>

            {/* Path D dots */}
            <circle r={1.35} fill="url(#dotGrad)" opacity={0.88}>
              <animateMotion dur={thinking ? '3.6s' : '6.4s'} repeatCount="indefinite" rotate="auto">
                <mpath href="#pD" />
              </animateMotion>
              <animate attributeName="r" values="1.0;1.6;1.0" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.28;0.9;0.28" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle r={1.0} fill="url(#dotGrad)" opacity={0.7}>
              <animateMotion begin={thinking ? '0.9s' : '1.4s'} dur={thinking ? '3.6s' : '6.4s'} repeatCount="indefinite" rotate="auto">
                <mpath href="#pD" />
              </animateMotion>
              <animate attributeName="opacity" values="0.18;0.6;0.18" dur="1.4s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Soft glow overlay of whole map */}
          <g stroke="url(#signalGrad)" filter="url(#gsoft)">
            <path d="M20 22c6 2 8 6 12 10s8 8 12 10" strokeOpacity={0.35} strokeWidth={0.35} />
            <path d="M20 34c4 2 6 4 10 8s6 4 10 6" strokeOpacity={0.32} strokeWidth={0.3} />
            <path d="M24 18c5 3 10 8 14 14s10 10 16 14" strokeOpacity={0.4} strokeWidth={0.4} />
            <path d="M18 28c7 3 12 9 16 14s10 11 18 16" strokeOpacity={0.33} strokeWidth={0.35} />
          </g>
        </g>
  {/* Firing nodes removed by request */}
  {/* Midline divider glow */}
  <line x1="34" y1="10" x2="34" y2="54" stroke="#ffffff" strokeWidth={0.9} strokeOpacity={0.45} />
  <line x1="30" y1="10" x2="30" y2="54" stroke="#ffffff" strokeWidth={0.6} strokeOpacity={0.22} />
        <style>{`
          @keyframes brainPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
          @keyframes hueShift { 0%{filter:hue-rotate(0deg)} 100%{filter:hue-rotate(360deg)} }
        `}</style>
      </motion.svg>
    </div>
  );
}
