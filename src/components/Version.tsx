'use client';

import { motion } from 'framer-motion';
import { getVersionDisplay } from '@/lib/version';

interface VersionProps {
  className?: string;
}

export default function Version({ className = '' }: VersionProps) {
  const version = getVersionDisplay();

  return (
    <motion.div
      className={`fixed bottom-4 left-4 z-50 select-none ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
    >
      <div className="relative">
        {/* Background with glass effect */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10" />
        
        {/* Version text */}
        <div className="relative px-3 py-2">
          <span className="text-xs font-mono text-white/70 tracking-wider">
            {version}
          </span>
        </div>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg blur-sm -z-10" />
      </div>
    </motion.div>
  );
}
