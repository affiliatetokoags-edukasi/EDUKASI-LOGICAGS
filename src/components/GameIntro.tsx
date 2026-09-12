import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, ShieldAlert, ArrowRight, Terminal, Cpu } from 'lucide-react';
import { sounds } from '../utils/audio';

interface GameIntroProps {
  playerName: string;
  onStartMission: () => void;
}

export const GameIntro: React.FC<GameIntroProps> = ({ playerName, onStartMission }) => {
  const storyLines = [
    { text: `Selamat datang di Logic School, ${playerName || 'Petualang'}.`, highlight: false },
    { text: 'Sepertinya sistem keamanan sekolah mengalami gangguan serius.', highlight: true },
    { text: 'Protokol otomatis aktif: Semua gerbang terkunci rapat.', highlight: false },
    { text: 'Hanya ada satu cara untuk membuka jalan keluar...', highlight: false },
    { text: 'GUNAKAN LOGIKA.', highlight: true, accent: true },
  ];

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-slate-900/95 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/50 relative overflow-hidden"
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 animate-pulse" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-xs font-mono text-slate-400 ml-2">SYSTEM://LOGIC_SCHOOL_LOCKDOWN</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
            <Cpu className="w-3 h-3" />
            ONLINE
          </div>
        </div>

        {/* Center Alert Icon */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0.5, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12 }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500/20 to-amber-500/10 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-950/40 relative"
          >
            <Lock className="w-10 h-10" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
            </span>
          </motion.div>
        </div>

        {/* Story Narrative Box */}
        <div className="space-y-3.5 bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80 mb-6 font-mono text-sm leading-relaxed">
          {storyLines.map((line, idx) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.18, duration: 0.3 }}
              className={`flex items-start gap-2 ${
                line.accent
                  ? 'text-cyan-300 font-extrabold text-base tracking-wider'
                  : line.highlight
                  ? 'text-amber-300 font-semibold'
                  : 'text-slate-300'
              }`}
            >
              <span className="text-cyan-500 font-bold shrink-0">&gt;</span>
              <span>{line.text}</span>
            </motion.p>
          ))}
        </div>

        {/* Start Mission Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
        >
          <button
            id="start-mission-btn"
            onClick={() => {
              sounds.playClick();
              onStartMission();
            }}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-98 text-white font-black text-base shadow-xl shadow-cyan-600/30 transition-all cursor-pointer flex items-center justify-center gap-2.5 border border-cyan-400/40"
          >
            <span>MULAI MISI</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
