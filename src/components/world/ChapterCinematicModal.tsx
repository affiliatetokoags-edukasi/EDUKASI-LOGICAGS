import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, Shield, ArrowRight } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface ChapterCinematicModalProps {
  isOpen: boolean;
  type: 'chapter' | 'area_unlock';
  title: string;
  subtitle: string;
  description: string;
  badgeText?: string;
  icon?: string;
  onContinue: () => void;
}

export const ChapterCinematicModal: React.FC<ChapterCinematicModalProps> = ({
  isOpen,
  type,
  title,
  subtitle,
  description,
  badgeText,
  icon = '✨',
  onContinue,
}) => {
  useEffect(() => {
    if (isOpen) {
      if (type === 'chapter') {
        sounds.playChapterComplete();
      } else {
        sounds.playDoorUnlock();
      }
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg">
        {/* Animated ambient beam */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-slate-900/90 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-500/20 text-slate-100 text-center overflow-hidden"
        >
          {/* Top highlight bar */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-black uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{badgeText || (type === 'chapter' ? 'BAB CERITA BARU' : 'AREA BARU TERBUKA')}</span>
          </div>

          {/* Large Icon */}
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-4xl shadow-xl shadow-cyan-950/50">
            {icon}
          </div>

          {/* Title & Subtitle */}
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide mb-1 font-sans">
            {title}
          </h2>
          <p className="text-cyan-400 font-semibold text-sm sm:text-base tracking-wider uppercase mb-4">
            {subtitle}
          </p>

          {/* Story / Lore description */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 mb-6 text-slate-300 text-sm sm:text-base leading-relaxed">
            "{description}"
          </div>

          {/* Continue Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onContinue();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-98 transition-all"
          >
            <span>{type === 'chapter' ? 'MULAI PETUALANGAN' : 'MASUKI AREA SEKARANG'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
