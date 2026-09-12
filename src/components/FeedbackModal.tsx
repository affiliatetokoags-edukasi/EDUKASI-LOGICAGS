import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, ArrowRight, RotateCcw, Sparkles, Award } from 'lucide-react';
import { FeedbackState } from '../types';
import { sounds } from '../utils/audio';

interface FeedbackModalProps {
  feedback: FeedbackState;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ feedback, onClose }) => {
  if (!feedback.isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          id="feedback-modal"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border text-slate-100 flex flex-col ${
            feedback.isCorrect
              ? 'bg-slate-900/95 border-emerald-500/40 shadow-emerald-950/40'
              : 'bg-slate-900/95 border-amber-500/40 shadow-amber-950/40'
          }`}
        >
          {/* Header & Icon */}
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              initial={{ scale: 0.5, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                feedback.isCorrect
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              }`}
            >
              {feedback.isCorrect ? (
                <CheckCircle className="w-8 h-8" />
              ) : (
                <AlertCircle className="w-8 h-8" />
              )}
            </motion.div>

            <div>
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-1 border ${
                  feedback.isCorrect
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}
              >
                {feedback.isCorrect ? 'Status: Terverifikasi' : 'Status: Evaluasi'}
              </span>
              <h3 className="text-xl font-extrabold tracking-tight text-white">
                {feedback.title}
              </h3>
            </div>
          </div>

          {/* Message & Explanation */}
          <div className="space-y-3 mb-6">
            <p className="text-sm font-medium text-slate-200 leading-relaxed bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              {feedback.message}
            </p>

            {feedback.explanation && (
              <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/40 text-xs text-slate-300">
                <span className="font-semibold text-slate-200 block mb-1">
                  {feedback.isCorrect ? '💡 Penjelasan Logika:' : '🔍 Petunjuk Berpikir:'}
                </span>
                <p className="leading-relaxed">{feedback.explanation}</p>
              </div>
            )}

            {/* Rewards if Correct */}
            {feedback.isCorrect && (feedback.xpGained || feedback.scoreGained || feedback.coinsGained) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex flex-wrap items-center gap-2.5 pt-1"
              >
                {feedback.xpGained !== undefined && feedback.xpGained > 0 && (
                  <div className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-xs sm:text-sm">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    +{feedback.xpGained} XP
                  </div>
                )}
                {feedback.scoreGained !== undefined && feedback.scoreGained > 0 && (
                  <div className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs sm:text-sm">
                    <Award className="w-4 h-4 text-amber-400" />
                    +{feedback.scoreGained} SKOR
                  </div>
                )}
                {feedback.coinsGained !== undefined && feedback.coinsGained > 0 && (
                  <div className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 font-bold text-xs sm:text-sm">
                    <span>🪙</span>
                    +{feedback.coinsGained} COIN
                  </div>
                )}
                {feedback.comboCount && feedback.comboCount > 1 && (
                  <div className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-black text-xs animate-pulse">
                    <span>🔥</span>
                    COMBO BERUNTUN x{feedback.comboCount}!
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Action Button */}
          <div>
            {feedback.isCorrect ? (
              <button
                id="feedback-continue-btn"
                onClick={() => {
                  sounds.playClick();
                  if (feedback.onContinue) {
                    feedback.onContinue();
                  } else {
                    onClose();
                  }
                }}
                className="w-full py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                LANJUT
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="feedback-retry-btn"
                onClick={() => {
                  sounds.playClick();
                  if (feedback.onRetry) {
                    feedback.onRetry();
                  } else {
                    onClose();
                  }
                }}
                className="w-full py-3 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-98 text-white font-bold text-sm shadow-lg shadow-amber-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                COBA LAGI
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
