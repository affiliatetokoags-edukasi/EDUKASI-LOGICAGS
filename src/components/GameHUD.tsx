import React from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Sparkles, 
  Trophy, 
  MapPin, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  HelpCircle,
  LayoutGrid,
  Heart,
  HeartCrack,
  Coins,
  Flame,
  Backpack,
  BookOpen,
  Gift,
  GraduationCap,
  School,
  Lock
} from 'lucide-react';
import { PlayerStats, ScreenType } from '../types';
import { sounds } from '../utils/audio';

interface GameHUDProps {
  stats: PlayerStats;
  currentScreen: ScreenType;
  onNavigateToMap: () => void;
  onOpenHowToPlay: () => void;
  onOpenResetConfirm: () => void;
  onOpenInventory: () => void;
  onOpenJournal: () => void;
  onOpenProgressCenter: () => void;
  onOpenLearningHub?: () => void;
  onOpenTeacherDashboard?: () => void;
  onOpenRewardChest?: () => void;
  onToggleSound: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  stats,
  currentScreen,
  onNavigateToMap,
  onOpenHowToPlay,
  onOpenResetConfirm,
  onOpenInventory,
  onOpenJournal,
  onOpenProgressCenter,
  onOpenLearningHub,
  onOpenTeacherDashboard,
  onOpenRewardChest,
  onToggleSound,
}) => {
  const totalLevels = 5;
  const completedCount = stats.completedLevels.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalLevels) * 100));

  const activeLevelDisplay = stats.currentLevel;
  const heartsCount = stats.hearts ?? 3;
  const maxHearts = stats.maxHearts ?? 3;
  const coinsCount = stats.coins ?? 0;
  const comboCount = stats.combo ?? 0;
  const streakCount = stats.streak || 1;
  const unopenedChests = stats.rewardChests?.filter((c) => !c.opened).length || 0;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Player Badge, Rank, Level */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="hud-player-profile-btn"
            onClick={() => {
              sounds.playClick();
              onOpenProgressCenter();
            }}
            title="Buka Progress Center & Profil"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700/60 shadow-inner cursor-pointer transition-all text-left"
          >
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
              {stats.playerAvatar === 'student_girl' ? '👧' : '🧑‍💻'}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider leading-none flex items-center gap-1">
                <span>R{stats.playerRank || 1}</span>
                <span className="text-slate-400 font-normal">|</span>
                <span className="text-slate-400">LVL {stats.playerLevel || 1}</span>
              </span>
              <span className="text-xs font-bold text-white truncate max-w-[85px] sm:max-w-[130px]">
                {stats.playerName || 'PETUALANG'}
              </span>
            </div>
          </button>

          {/* Daily Streak Badge */}
          <button
            id="hud-streak-btn"
            onClick={() => {
              sounds.playClick();
              onOpenProgressCenter();
            }}
            title={`Streak Belajar: ${streakCount} Hari Berturut-turut`}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 text-rose-300 text-xs font-black cursor-pointer transition-all"
          >
            <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-400" />
            <span>{streakCount}D</span>
          </button>

          {/* Hearts Display */}
          <div
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-400"
            title={`Energi: ${heartsCount}/${maxHearts}`}
          >
            {Array.from({ length: maxHearts }).map((_, i) => (
              <span key={i} className="inline-block">
                {i < heartsCount ? (
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 drop-shadow" />
                ) : (
                  <HeartCrack className="w-3.5 h-3.5 text-slate-600" />
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Center: XP, Score, Coins, Combo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* XP */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] font-semibold text-cyan-400/70">XP</span>
              <motion.span
                key={stats.xp}
                initial={{ scale: 1.2, color: '#22d3ee' }}
                animate={{ scale: 1, color: '#67e8f9' }}
                className="text-xs sm:text-sm font-black"
              >
                {stats.xp}
              </motion.span>
            </div>
          </div>

          {/* COINS */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] font-semibold text-amber-400/70">COIN</span>
              <motion.span
                key={coinsCount}
                initial={{ scale: 1.2, color: '#f59e0b' }}
                animate={{ scale: 1, color: '#fcd34d' }}
                className="text-xs sm:text-sm font-black"
              >
                {coinsCount}
              </motion.span>
            </div>
          </div>

          {/* COMBO (if > 1) */}
          {comboCount > 1 && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-400 text-[11px] font-black"
            >
              <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-400" />
              <span>x{comboCount}</span>
            </motion.div>
          )}

          {/* Unopened Chests Alert */}
          {unopenedChests > 0 && (
            <button
              id="hud-unopened-chest-badge"
              onClick={() => {
                sounds.playClick();
                onOpenProgressCenter();
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-400/60 text-amber-300 text-xs font-black animate-bounce cursor-pointer"
              title="Ada peti hadiah yang belum dibuka!"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>{unopenedChests}</span>
            </button>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {/* Learning Hub Button */}
          {onOpenLearningHub && (
            <button
              id="hud-learning-hub-btn"
              onClick={() => {
                sounds.playClick();
                onOpenLearningHub();
              }}
              title="Buka Learning Engine & Materi Informatika"
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                currentScreen === 'learning'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-md shadow-cyan-600/30'
                  : 'bg-cyan-950/60 hover:bg-cyan-900/70 border-cyan-500/50 text-cyan-300 hover:text-cyan-100'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden sm:inline">BELAJAR</span>
            </button>
          )}

          {onOpenTeacherDashboard && (
            <button
              id="hud-teacher-dashboard-btn"
              onClick={() => {
                sounds.playClick();
                onOpenTeacherDashboard();
              }}
              title="Panel Guru & Asesmen Pembelajaran (Terproteksi Password)"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/70 border border-indigo-500/50 text-xs font-bold text-indigo-300 hover:text-indigo-100 transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">GURU 🔒</span>
            </button>
          )}

          {/* Progress Center Button */}
          <button
            id="hud-progress-center-btn"
            onClick={() => {
              sounds.playClick();
              onOpenProgressCenter();
            }}
            title="Buka Progress Center & Skill Tree"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/40 text-xs font-bold text-cyan-300 hover:text-cyan-200 transition-all cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">PROGRESS</span>
          </button>

          {/* Journal Button */}
          <button
            id="hud-journal-btn"
            onClick={() => {
              sounds.playClick();
              onOpenJournal();
            }}
            title="Jurnal Misi & Cerita"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-300 hover:text-amber-200 transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">JURNAL</span>
          </button>

          {/* Backpack / Inventory Button */}
          <button
            id="hud-inventory-btn"
            onClick={() => {
              sounds.playClick();
              onOpenInventory();
            }}
            title="Tas Perlengkapan Petualang"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-cyan-300 hover:text-cyan-200 transition-all cursor-pointer"
          >
            <Backpack className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">ITEMS</span>
          </button>

          {(currentScreen === 'level' || currentScreen === 'room') && (
            <button
              id="hud-map-btn"
              onClick={() => {
                sounds.playClick();
                onNavigateToMap();
              }}
              title="Kembali ke Peta Sekolah"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">MAP</span>
            </button>
          )}

          <button
            id="hud-sound-toggle-btn"
            onClick={onToggleSound}
            title={stats.soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            aria-label="Toggle Sound"
          >
            {stats.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          <button
            id="hud-how-to-play-btn"
            onClick={() => {
              sounds.playClick();
              onOpenHowToPlay();
            }}
            title="Cara Bermain"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            aria-label="Cara Bermain"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
          </button>

          <button
            id="hud-reset-game-btn"
            onClick={() => {
              sounds.playClick();
              onOpenResetConfirm();
            }}
            title="Reset Game"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
            aria-label="Reset Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};



