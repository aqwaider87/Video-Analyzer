"use client";

import { useState, useRef, useEffect } from 'react';
import AnimatedBrainI from './AnimatedBrainI';

interface InteractiveBrainProps {
  className?: string;
}

export default function InteractiveBrain({ className = '' }: InteractiveBrainProps) {
  const [thinking, setThinking] = useState(false);
  const [expanded, setExpanded] = useState(false);
  // Ripple effect removed for ultra-minimal appearance
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (thinking) {
      const to = setTimeout(() => setThinking(false), 6000);
      return () => clearTimeout(to);
    }
  }, [thinking]);

  const triggerThinking = (e: React.MouseEvent) => {
  // Ripple logic removed
    setThinking(true);
    setExpanded(true);
    if (audioRef.current) {
      try { audioRef.current.currentTime = 0; audioRef.current.play().catch(()=>{}); } catch {}
    }
  };

  return (
    <div className={"relative inline-flex flex-col items-start gap-3 " + className}>
      <div
        className={
          `relative w-[84px] md:w-[92px] aspect-square cursor-pointer group select-none transition-transform duration-500 ease-out` +
          (thinking ? ' scale-[1.03]' : ' hover:scale-[1.04]')
        }
        onClick={triggerThinking}
        role="button"
        aria-label="Activate AI thinking"
      >
        <audio ref={audioRef} className="hidden" preload="auto" aria-hidden="true">
          <source src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQgAAAAA/////wAAAP///w==" type="audio/wav" />
        </audio>
        {/* Minimal brain (no outer gradient background) */}
        <div className="relative z-10 flex items-center justify-center w-full h-full overflow-visible">
          <AnimatedBrainI thinking={thinking} minimal />
        </div>
        {/* Removed decorative ring & thinking rings for minimal variant */}
      </div>
      {expanded && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm" role="dialog" aria-label="Expanded brain hologram">
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
            <div className="relative">
              <AnimatedBrainI thinking={thinking} />
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[520px] h-[180px] pointer-events-none opacity-60">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/15 via-fuchsia-400/8 to-transparent blur-2xl" />
            </div>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({length:20}).map((_,i)=>{
                const delay = (i*0.2).toFixed(2)+'s';
                return <span key={i} className="absolute w-1 h-1 rounded-full bg-white/60 animate-holo-particle" style={{ left: `${(i*73)%100}%`, top: `${(i*37)%100}%`, animationDelay: delay, transform: 'translateZ(0)' }} />
              })}
            </div>
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
    </div>
  );
}
