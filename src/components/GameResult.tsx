import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Target, 
  RotateCcw, 
  Home, 
  ShieldCheck,
  Award
} from 'lucide-react';
import { PlayerStats } from '../types';
import { sounds } from '../utils/audio';
import { calculatePlayerRank } from '../utils/gamificationEngine';
import { PLAYER_TITLES } from '../data/gamificationData';

interface GameResultProps {
  stats: PlayerStats;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}

const DOMAIN_MASTERY_LIST = [
  { key: 'pattern' as const, label: 'Pola Logika' },
  { key: 'logic' as const, label: 'Aljabar Boolean' },
  { key: 'algorithm' as const, label: 'Algoritma Runtut' },
  { key: 'path_finding' as const, label: 'Pencarian Jalur' },
  { key: 'debugging' as const, label: 'Deteksi Bug' },
  { key: 'cyber_security' as const, label: 'Keamanan Sistem' },
];

export const GameResult: React.FC<GameResultProps> = ({
  stats,
  onPlayAgain,
  onBackToHome,
}) => {
  // Launch celebration confetti
  useEffect(() => {
    sounds.playVictory();
    try {
      // Confetti burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
      });

      const interval = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 400);

      return () => clearTimeout(interval);
    } catch {
      // ignore
    }
  }, []);

  // Compute stats
  const totalAttempts = stats.answersCorrect + stats.answersWrong;
  const accuracy = totalAttempts > 0 
    ? Math.round((stats.answersCorrect / totalAttempts) * 100) 
    : 100;

  const durationMs = stats.startTime 
    ? (stats.endTime ? stats.endTime - stats.startTime : Date.now() - stats.startTime)
    : 0;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentRank = calculatePlayerRank(stats.xp, stats.achievements?.length || 0);
  const activeTitleObj = PLAYER_TITLES.find((t) => t.id === stats.activeTitle);

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="w-full max-w-xl bg-slate-900/95 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/60 text-center relative overflow-hidden"
      >
        {/* Glow behind trophy */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Victory Trophy Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.15, damping: 15 }}
          className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500/20 to-yellow-400/20 border border-amber-500/50 flex items-center justify-center text-amber-400 mx-auto mb-4 shadow-xl shadow-amber-950/50"
        >
          <Trophy className="w-10 h-10 animate-bounce" />
        </motion.div>

        {/* Title */}
        <div className="space-y-1 mb-6">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-block text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-500/30">
              WORLD 1 CLEAR
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-950/50 px-3 py-1 rounded-full border border-amber-500/30">
              <span>{currentRank.emblem}</span>
              <span>{currentRank.title}</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            🎉 MISSION COMPLETE
          </h1>
          <div className="flex items-center justify-center gap-2">
            <p className="text-lg font-bold text-cyan-300">
              Selamat, {stats.playerName || 'Petualang'}!
            </p>
            {activeTitleObj && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/50 font-semibold">
                {activeTitleObj.title}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Gerbang Logic School berhasil dibuka! Kamu telah menaklukkan seluruh tantangan logika di World 1.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {/* TOTAL SCORE */}
          <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 flex flex-col items-center">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-1">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              TOTAL SCORE
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5">
              {stats.score}
            </span>
          </div>

          {/* TOTAL XP */}
          <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 flex flex-col items-center">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-1">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              TOTAL XP
            </span>
            <span className="text-xl sm:text-2xl font-black text-cyan-300 mt-0.5">
              {stats.xp}
            </span>
          </div>

          {/* LEVEL TERSELESAIKAN */}
          <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 flex flex-col items-center">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-1">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              LEVEL
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-300 mt-0.5">
              5 / 5
            </span>
          </div>

          {/* TOTAL COINS */}
          <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 flex flex-col items-center">
            <div className="w-8 h-8 rounded-xl bg-yellow-500/15 text-yellow-400 flex items-center justify-center mb-1">
              <span>🪙</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              TOTAL COIN
            </span>
            <span className="text-xl sm:text-2xl font-black text-yellow-300 mt-0.5">
              {stats.coins || 0}
            </span>
          </div>

          {/* AKURASI */}
          <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 flex flex-col items-center">
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center mb-1">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              AKURASI
            </span>
            <span className="text-xl sm:text-2xl font-black text-purple-300 mt-0.5">
              {accuracy}%
            </span>
          </div>

          {/* WAKTU PERMAINAN */}
          <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 flex flex-col items-center col-span-2 sm:col-span-1">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center mb-1">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              WAKTU
            </span>
            <span className="text-xl sm:text-2xl font-black text-blue-300 mt-0.5">
              {formatTime(durationMs)}
            </span>
          </div>
        </div>

        {/* Logic Mastery Radar Mini-Summary */}
        <div className="mb-8 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/70 text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>LOGIC MASTERY BREAKDOWN</span>
            </span>
            <span className="text-[11px] font-bold text-emerald-400">
              {stats.achievements?.length || 0} Achievement Terbuka
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DOMAIN_MASTERY_LIST.map((domain) => {
              const val = stats.skillMastery?.[domain.key] || 0;
              return (
                <div key={domain.key} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px]">
                  <div className="flex items-center justify-between text-slate-300 mb-1">
                    <span className="truncate">{domain.label}</span>
                    <span className="font-bold text-cyan-400">{val}%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            id="play-again-btn"
            onClick={() => {
              sounds.playClick();
              onPlayAgain();
            }}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-98 text-white font-black text-sm shadow-xl shadow-cyan-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>MAIN LAGI</span>
          </button>

          <button
            id="back-to-home-btn"
            onClick={() => {
              sounds.playClick();
              onBackToHome();
            }}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 hover:text-white font-bold text-sm border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>KEMBALI KE HOME</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
