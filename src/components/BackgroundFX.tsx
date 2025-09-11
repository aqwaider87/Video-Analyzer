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
  <div className="fixed inset-0 overflow-hidden pointer-events-none [perspective:1200px]">
      {/* Base deep background */}
      <div className="absolute inset-0 bg-[#05060a]" />
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay [background-image:linear-gradient(transparent_95%,rgba(255,255,255,.25)_95%),linear-gradient(90deg,transparent_95%,rgba(255,255,255,.25)_95%)] [background-size:46px_46px]" />
      {/* Aurora / mesh gradients */}
      <div className="absolute inset-0 animate-[aurora_22s_linear_infinite] will-change-transform will-change-filter bg-[radial-gradient(circle_at_18%_32%,rgba(120,160,255,.35),transparent_60%),radial-gradient(circle_at_82%_68%,rgba(255,90,170,.35),transparent_60%),radial-gradient(circle_at_55%_55%,rgba(140,90,255,.25),transparent_60%),radial-gradient(circle_at_70%_30%,rgba(40,200,255,.25),transparent_60%)]" />
      {/* Soft blobs */}
      <div className="absolute inset-0">
        {blobs.map(b => (
          <div key={b.id} style={b.style} className="absolute w-[42vw] max-w-[640px] aspect-square rounded-full blur-[120px] opacity-25 animate-slow-pulse">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-fuchsia-500/40 via-violet-500/30 to-sky-400/30 mix-blend-screen" />
          </div>
        ))}
      </div>
      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.12] mix-blend-overlay [background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P4//8/AwAI/AL+2lP3VwAAAABJRU5ErkJggg==)]" />
      {/* Full-screen binary matrix layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {Array.from({ length: 46 }).map((_, i) => {
          const delay = (i * -0.9) + 's';
          const dur = 18 + (i % 10) * 2.2; // vary duration for parallax feel
          const left = (i / 46) * 100;
          const fontSize = i % 7 === 0 ? '0.7rem' : i % 5 === 0 ? '0.55rem' : '0.62rem';
          const opacity = i % 9 === 0 ? '0.22' : i % 4 === 0 ? '0.15' : '0.11';
          return (
            <div
              key={i}
              aria-hidden="true"
              className="absolute top-0 h-[220%] w-[4.2%] flex items-start justify-center"
              style={{ left: left + '%', animation: `binaryFull ${dur}s linear infinite`, animationDelay: delay }}
            >
              <div
                className="font-mono whitespace-pre leading-[1.05] tracking-tight will-change-transform text-cyan-200/80 [text-shadow:0_0_6px_rgba(0,255,255,0.15)]"
                style={{ fontSize, opacity }}
              >
{`1010 1101 0110 1001 1110\n0101 1010 0011 1110 0110\n1101 0110 1001 0101 0011\n1110 0101 1101 0110 1010\n1001 0011 0101 1110 1101\n0110 1001 0101 1010 0011\n1010 1101 0110 1001 1110\n0101 1010 0011 1110 0110\n1101 0110 1001 0101 0011\n1110 0101 1101 0110 1010\n1001 0011 0101 1110 1101\n0110 1001 0101 1010 0011\n1010 1101 0110 1001 1110\n0101 1010 0011 1110 0110\n1101 0110 1001 0101 0011\n1110 0101 1101 0110 1010\n1001 0011 0101 1110 1101\n0110 1001 0101 1010 0011`}
              </div>
            </div>
          );
        })}
        {/* Soft gradient mask top & bottom */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#05060a] via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#05060a] via-transparent to-transparent" />
      </div>
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,#05060a_100%)]" />

  {/* Right side neural network (visible on all sizes) */}
  <div className="flex absolute right-0 top-0 h-full w-[75%] sm:w-[60%] md:w-[48%] lg:w-[44%] items-center justify-center pr-[3.5vw]">
          <div className="relative w-full h-[70vh] max-h-[780px]">
            <div className="absolute right-[14%] top-1/2 -translate-y-1/2 w-[340px] h-[340px] max-w-full">
              {[...Array(4)].map((_,i)=>(
                <div key={i} className="absolute inset-0 rounded-full border border-cyan-400/10 animate-hud-spin" style={{ animationDelay: `${i * 1.4}s`, transform: `scale(${1 - i*0.17})` }} />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-400 to-cyan-300 shadow-[0_0_18px_6px_rgba(255,60,200,0.55)] animate-ping-slow" />
              </div>
            </div>
            <svg className="absolute inset-0 w-full h-full opacity-[0.42]" viewBox="0 0 800 800" fill="none">
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
              {Array.from({length:46}).map((_,i)=>{
                const x1 = 400 + Math.cos(i)* (140 + (i%7)*18);
                const y1 = 400 + Math.sin(i*1.2)* (160 + (i%5)*22);
                const x2 = 400 + Math.cos(i*1.4)* (210 + (i%9)*14);
                const y2 = 400 + Math.sin(i*1.1)* (230 + (i%6)*19);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#gradEdge)" strokeWidth={1.2} strokeLinecap="round" filter="url(#glow)" className="animate-edge-flicker" style={{animationDelay:`${i*0.18}s`}} />
              })}
              {Array.from({length:34}).map((_,i)=>{
                const angle = i * (Math.PI * 2 / 34);
                const radius = 140 + (i%5)*34;
                const x = 400 + Math.cos(angle)*radius;
                const y = 400 + Math.sin(angle)*(radius*0.72);
                return <circle key={i} cx={x} cy={y} r={i%6===0?14: i%4===0?9:6} fill="url(#gradNode)" className="animate-node-pulse" style={{animationDelay:`${i*0.3}s`}} />
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
      {/* Brain top-left (mobile visible) */}
      <div className="absolute left-0 top-0 z-40 w-auto h-auto flex items-start justify-start p-3 sm:p-4">
        <div className="relative">
          <div
            className={
              `relative w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] aspect-square ` +
              `cursor-pointer pointer-events-auto group select-none transition-transform duration-700 ease-out` +
              (thinking ? ' scale-[1.05] [filter:drop-shadow(0_0_20px_rgba(255,255,255,0.25))]' : ' hover:scale-[1.03]')
            }
            onClick={triggerThinking}
            role="button"
            aria-label="Activate AI thinking"
          >
            {/* Audio element */}
            <audio ref={audioRef} className="hidden" preload="auto" aria-hidden="true">
              <source src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQgAAAAA/////wAAAP///w==" type="audio/wav" />
            </audio>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500/25 via-sky-400/10 to-fuchsia-500/25 blur-3xl" />
            {/* Removed rotating ring, dashed rings, and radial tick lines per request */}
            {/* Orbiting nodes removed by request */}
            {/* Simplified animated brain icon component with ripple layer */}
            <div className="relative z-10 flex items-center justify-center w-full h-full overflow-hidden">
              <AnimatedBrainI thinking={thinking} />
              {ripples.map(r => (
                <span
                  key={r.id}
                  className="absolute block rounded-full bg-cyan-300/20 border border-cyan-300/40 animate-ripple"
                  style={{ left: r.x - 8, top: r.y - 8, width: 16, height: 16 }}
                />
              ))}
            </div>
            {/* Click hint ring (subtle) */}
            <div className={`absolute inset-0 rounded-full ${thinking ? 'opacity-0' : 'opacity-30 group-hover:opacity-70'} transition-opacity duration-700`}> 
              <div className="absolute inset-0 rounded-full border border-white/10" />
            </div>
            {thinking && (
              <div className="absolute inset-0">
                {[...Array(3)].map((_,i)=>(
                  <div key={i} className="absolute inset-0 rounded-full border border-fuchsia-400/10 animate-thinking-rings" style={{ animationDelay:`${i*0.6}s`, transform:`scale(${1 + i*0.25})` }} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
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
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/25 via-fuchsia-400/10 to-transparent blur-2xl" />
            </div>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({length:40}).map((_,i)=>{
                const delay = (i*0.15).toFixed(2)+'s';
                return <span key={i} className="absolute w-1 h-1 rounded-full bg-white/70 animate-holo-particle" style={{ left: `${(i*73)%100}%`, top: `${(i*37)%100}%`, animationDelay: delay }} />
              })}
            </div>
            {/* Auto-close hint */}
            <div className="absolute bottom-3 left-4 text-[11px] tracking-wide text-white/40">Click Close or wait for cooldown.</div>
          </div>
          <style>{`
            @keyframes ripple {0%{transform:scale(.2);opacity:.9}70%{opacity:.25}100%{transform:scale(6);opacity:0}}
            .animate-ripple{animation:ripple 1.1s ease-out forwards}
            @keyframes holoParticle{0%{transform:translateY(20px);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(-40px);opacity:0}}
            .animate-holo-particle{animation:holoParticle 6s linear infinite}
            @keyframes binaryFull {0%{transform:translateY(0%)}100%{transform:translateY(110%)} }
          `}</style>
        </div>
      )}
      {/* Global keyframes for ripple if not already defined */}
      <style>{`
        @keyframes hueCycle{0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(360deg)}}
        /* Global binary column scroll (overridden if already defined) */
  @keyframes binaryFull {0%{transform:translateY(0%)}100%{transform:translateY(110%)} }
      `}</style>
    </div>
  );
}

