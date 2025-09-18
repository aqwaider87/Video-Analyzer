'use client';

// Redesigned immersive aurora + mesh gradient + grid + noise background
// Replaces previous geometric + particles background with a cleaner, more premium aesthetic.

import { Language } from '@/lib/i18n';
import { useMemo, useState, useEffect, useRef } from 'react';
import AnimatedBrainI from './AnimatedBrainI';

interface BackgroundFXProps { language: Language }

export default function BackgroundFX({ language }: BackgroundFXProps) {
  const blobs = useMemo(() => new Array(4).fill(0).map((_, i) => ({
    id: i,
    style: { animationDelay: `${i * 3}s` } as React.CSSProperties
  })), []);

  const [thinking, setThinking] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const rippleId = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto cool down after thinking phase
  useEffect(() => {
    if (thinking) {
      const to = setTimeout(() => setThinking(false), 6000);
      return () => clearTimeout(to);
    }
  }, [thinking]);

  const triggerThinking = (e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = rippleId.current++;
    setRipples(rs => [...rs, { id, x, y }]);
    setTimeout(() => setRipples(rs => rs.filter(r => r.id !== id)), 1200);
    setThinking(true);
    setExpanded(true);
    // play sound
    if (audioRef.current) {
      try { audioRef.current.currentTime = 0; audioRef.current.play().catch(()=>{}); } catch {}
    }
  };

  return (
  <div className="fixed inset-0 overflow-hidden pointer-events-none [perspective:1200px]" data-bg-clean>
      {/* Optional radial color washes (now much lighter). Remove entirely if pure photo needed. */}
      <div className="absolute inset-0 animate-[aurora_48s_linear_infinite] opacity-[0.18] bg-[radial-gradient(circle_at_18%_32%,rgba(120,160,255,.12),transparent_60%),radial-gradient(circle_at_82%_68%,rgba(255,140,200,.14),transparent_65%),radial-gradient(circle_at_55%_55%,rgba(150,120,255,.10),transparent_60%),radial-gradient(circle_at_70%_30%,rgba(40,180,255,.12),transparent_60%)]" />
      {/* Blobs disabled (commented) to avoid adding color cast */}
      {false && (
        <div className="absolute inset-0">
          {blobs.map(b => (
            <div key={b.id} style={b.style} className="absolute w-[42vw] max-w-[640px] aspect-square rounded-full blur-[120px] opacity-10 animate-slow-pulse">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-fuchsia-500/20 via-violet-400/15 to-sky-400/15" />
            </div>
          ))}
        </div>
      )}
      {/* Noise further reduced */}
      <div className="absolute inset-0 opacity-[0.025] [background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P4//8/AwAI/AL+2lP3VwAAAABJRU5ErkJggg==)]" />

  {/* Right side neural network (softened & lower opacity for light theme) */}
  <div className="flex absolute right-0 top-0 h-full w-[75%] sm:w-[60%] md:w-[48%] lg:w-[44%] items-center justify-center pr-[3.5vw] opacity-30">
          <div className="relative w-full h-[70vh] max-h-[780px]">
            <div className="absolute right-[14%] top-1/2 -translate-y-1/2 w-[340px] h-[340px] max-w-full">
              {[...Array(4)].map((_,i)=>(
                <div key={i} className="absolute inset-0 rounded-full border border-cyan-400/10 animate-hud-spin" style={{ animationDelay: `${i * 1.4}s`, transform: `scale(${1 - i*0.17})` }} />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-400 to-cyan-300 shadow-[0_0_18px_6px_rgba(255,60,200,0.55)] animate-ping-slow" />
              </div>
            </div>
            <svg className="absolute inset-0 w-full h-full opacity-[0.20]" viewBox="0 0 800 800" fill="none">
              <defs>
                <radialGradient id="gradNode" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ff5ecf"/>
                  <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0"/>
                </radialGradient>
                <linearGradient id="gradEdge" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ff5ecf" stopOpacity="0.7"/>
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05"/>
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {Array.from({length:24}).map((_,i)=>{ // reduced from 46 to 24 for better performance
                const x1 = 400 + Math.cos(i)* (140 + (i%5)*15);
                const y1 = 400 + Math.sin(i*1.2)* (160 + (i%4)*18);
                const x2 = 400 + Math.cos(i*1.4)* (210 + (i%6)*12);
                const y2 = 400 + Math.sin(i*1.1)* (230 + (i%5)*16);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#gradEdge)" strokeWidth={1.2} strokeLinecap="round" filter="url(#glow)" className="animate-edge-flicker" style={{animationDelay:`${i*0.25}s`}} />
              })}
              {Array.from({length:20}).map((_,i)=>{ // reduced from 34 to 20 for better performance
                const angle = i * (Math.PI * 2 / 20);
                const radius = 140 + (i%4)*30;
                const x = 400 + Math.cos(angle)*radius;
                const y = 400 + Math.sin(angle)*(radius*0.72);
                return <circle key={i} cx={x} cy={y} r={i%5===0?12: i%3===0?8:5} fill="url(#gradNode)" className="animate-node-pulse" style={{animationDelay:`${i*0.4}s`}} />
              })}
            </svg>
            <div className="absolute right-[6%] top-1/2 -translate-y-[62%] w-[220px] md:w-[260px] lg:w-[300px] opacity-80">
              <div className="w-full aspect-[3/5] rounded-full bg-gradient-to-br from-slate-300/10 via-white/5 to-slate-100/5 backdrop-blur-[2px] border border-white/10 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.55)] flex items-center justify-center text-[10px] font-english text-white/30 tracking-wider">
                AMMAR
              </div>
            </div>
            <div className="absolute right-[15%] top-1/2 -translate-y-1/2 w-10 h-10">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-400 to-cyan-300 blur-md opacity-80 animate-spark-flash" />
              <div className="absolute inset-0 rounded-full border border-fuchsia-300/50 animate-ping" />
            </div>
          </div>
        </div>
  {/* Brain moved into main section (InteractiveBrain component) */}
      {/* Expanded hologram modal */}
      {expanded && (
        <div className="pointer-events-auto fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm" role="dialog" aria-label="Expanded brain hologram">
          <div className="relative w-[min(92vw,900px)] h-[min(80vh,620px)] flex items-center justify-center">
            <button
              onClick={() => setExpanded(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors text-sm px-3 py-1 rounded-md bg-white/10 backdrop-blur border border-white/15"
              aria-label="Close hologram"
            >Close</button>
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_40%,rgba(0,200,255,0.4),transparent_60%),radial-gradient(circle_at_70%_60%,rgba(255,60,180,0.4),transparent_65%)] animate-[aurora_24s_linear_infinite]" />
            <div className="absolute inset-0 mix-blend-screen">
              {[...Array(4)].map((_,i)=>(
                <div key={i} className="absolute inset-0 border border-cyan-300/10 rounded-full animate-hud-spin" style={{animationDelay:`${i*1.8}s`, transform:`scale(${1 - i*0.12})`}} />
              ))}
            </div>
            {/* Reuse miniature brain enlarged */}
            <div className="relative">
              <AnimatedBrainI thinking={thinking} />
            </div>
            {/* Decorative volumetric beams */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[520px] h-[180px] pointer-events-none opacity-60">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/15 via-fuchsia-400/8 to-transparent blur-2xl" />
            </div>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({length:20}).map((_,i)=>{ // reduced from 40 to 20 for better performance
                const delay = (i*0.2).toFixed(2)+'s';
                return <span key={i} className="absolute w-1 h-1 rounded-full bg-white/60 animate-holo-particle" style={{ left: `${(i*73)%100}%`, top: `${(i*37)%100}%`, animationDelay: delay, transform: 'translateZ(0)' }} />
              })}
            </div>
            {/* Auto-close hint */}
            <div className="absolute bottom-3 left-4 text-[11px] tracking-wide text-white/40">Click Close or wait for cooldown.</div>
          </div>
          <style>{`
            @keyframes ripple {0%{transform:scale(.2);opacity:.9}70%{opacity:.25}100%{transform:scale(6);opacity:0}}
            .animate-ripple{animation:ripple 1.1s ease-out forwards}
            @keyframes holoParticle{0%{transform:translateY(20px);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(-40px);opacity:0}}
            .animate-holo-particle{animation:holoParticle 6s linear infinite; will-change: transform, opacity;}
            @keyframes binaryFull {0%{transform:translate3d(0, -100%, 0)}100%{transform:translate3d(0, 100vh, 0)} }
          `}</style>
        </div>
      )}
      {/* Global keyframes for ripple if not already defined */}
      <style>{`
        @keyframes hueCycle{0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(360deg)}}
        /* Optimized binary column scroll */
        @keyframes binaryFull {0%{transform:translate3d(0, -100%, 0)}100%{transform:translate3d(0, 100vh, 0)} }
      `}</style>
    </div>
  );
}

