import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Flame, Star, CheckCircle, ArrowRight } from 'lucide-react';
import { sounds } from '../../utils/audio';

export interface CelebrationData {
  isOpen: boolean;
  type: 'level_up' | 'rank_up' | 'achievement' | 'secret_achievement' | 'mastery' | 'streak';
  title: string;
  subtitle?: string;
  description: string;
  icon?: string;
  rewardText?: string;
  xpGained?: number;
  coinsGained?: number;
  badge?: string;
  titleUnlocked?: string;
  onClose?: () => void;
}

interface CelebrationModalProps {
  data: CelebrationData;
  onClose: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({ data, onClose }) => {
  useEffect(() => {
    if (data.isOpen) {
      if (data.type === 'rank_up') {
        sounds.playRankUp();
      } else if (data.type === 'level_up') {
        sounds.playLevelUp();
      } else if (data.type === 'achievement' || data.type === 'secret_achievement') {
        sounds.playAchievement();
      } else if (data.type === 'streak') {
        sounds.playStreak();
      } else if (data.type === 'mastery') {
        sounds.playMastery();
      } else {
        sounds.playCorrect();
      }
    }
  }, [data.isOpen, data.type]);

  if (!data.isOpen) return null;

  const getThemeConfig = () => {
    switch (data.type) {
      case 'level_up':
        return {
          glow: 'from-cyan-500/30 to-blue-500/10',
          border: 'border-cyan-500/50',
          iconBg: 'bg-cyan-500/20 text-cyan-400',
          tag: '✨ LEVEL UP!',
          tagColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30',
        };
      case 'rank_up':
        return {
          glow: 'from-amber-500/30 to-yellow-500/10',
          border: 'border-amber-500/60',
          iconBg: 'bg-amber-500/20 text-amber-300',
          tag: '🏆 RANK UP!',
          tagColor: 'text-amber-400 bg-amber-950/60 border-amber-500/30',
        };
      case 'secret_achievement':
        return {
          glow: 'from-purple-500/30 to-pink-500/10',
          border: 'border-purple-500/50',
          iconBg: 'bg-purple-500/20 text-purple-300',
          tag: '🎉 SECRET ACHIEVEMENT!',
          tagColor: 'text-purple-400 bg-purple-950/60 border-purple-500/30',
        };
      case 'mastery':
        return {
          glow: 'from-emerald-500/30 to-teal-500/10',
          border: 'border-emerald-500/50',
          iconBg: 'bg-emerald-500/20 text-emerald-300',
          tag: '⭐ MASTERED!',
          tagColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30',
        };
      case 'streak':
        return {
          glow: 'from-rose-500/30 to-orange-500/10',
          border: 'border-rose-500/50',
          iconBg: 'bg-rose-500/20 text-rose-400',
          tag: '🔥 STREAK HARIAN!',
          tagColor: 'text-rose-400 bg-rose-950/60 border-rose-500/30',
        };
      default:
        return {
          glow: 'from-blue-500/30 to-indigo-500/10',
          border: 'border-blue-500/50',
          iconBg: 'bg-blue-500/20 text-blue-400',
          tag: '🏅 ACHIEVEMENT UNLOCKED!',
          tagColor: 'text-blue-400 bg-blue-950/60 border-blue-500/30',
        };
    }
  };

  const theme = getThemeConfig();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className={`relative w-full max-w-md bg-slate-900 border ${theme.border} rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-center`}
        >
          {/* Ambient Glow */}
          <div className={`absolute -top-24 -left-24 w-64 h-64 bg-gradient-to-br ${theme.glow} rounded-full blur-3xl pointer-events-none`} />
          <div className={`absolute -bottom-24 -right-24 w-64 h-64 bg-gradient-to-tl ${theme.glow} rounded-full blur-3xl pointer-events-none`} />

          {/* Tag Header */}
          <div className="flex justify-center mb-4">
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${theme.tagColor}`}>
              <Sparkles className="w-3.5 h-3.5" />
              {theme.tag}
            </span>
          </div>

          {/* Central Animated Emblem / Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.1, damping: 15 }}
            className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-5 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl shadow-inner border border-white/10 ${theme.iconBg}`}
          >
            {data.icon || '🏆'}
          </motion.div>

          {/* Main Title & Subtitle */}
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide mb-1">
            {data.title}
          </h2>
          {data.subtitle && (
            <p className="text-sm font-semibold text-cyan-300 mb-3">
              {data.subtitle}
            </p>
          )}

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 px-2">
            {data.description}
          </p>

          {/* Reward Badges Box */}
          {(data.xpGained || data.coinsGained || data.rewardText || data.titleUnlocked) && (
            <div className="mb-6 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              {data.xpGained ? (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  +{data.xpGained} XP
                </span>
              ) : null}

              {data.coinsGained ? (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-950/50 border border-amber-500/30 text-amber-300 text-xs font-bold">
                  🪙 +{data.coinsGained} Coins
                </span>
              ) : null}

              {data.titleUnlocked && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-950/50 border border-purple-500/30 text-purple-300 text-xs font-bold">
                  🏷️ Gelar: {data.titleUnlocked}
                </span>
              )}

              {data.rewardText && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                  🎁 {data.rewardText}
                </span>
              )}
            </div>
          )}

          {/* Continue Action */}
          <button
            id="celebration-continue-btn"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>LANJUTKAN PERJALANAN</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
