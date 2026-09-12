import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Unlock, ArrowRight, CheckCircle, ShieldAlert } from 'lucide-react';
import { ChallengeData } from '../../types';
import { sounds } from '../../utils/audio';

interface PatternChallengeViewProps {
  challenge: ChallengeData;
  onSubmitAnswer: (selectedId: string) => void;
  disabled?: boolean;
}

export const PatternChallengeView: React.FC<PatternChallengeViewProps> = ({
  challenge,
  onSubmitAnswer,
  disabled = false,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isUnlockedState, setIsUnlockedState] = useState(false);

  const sequence = challenge.patternSequence || ['2', '4', '6', '8', '?'];

  const handleSelect = (optId: string) => {
    if (disabled || isUnlockedState) return;
    sounds.playClick();
    setSelectedId(optId);

    const isCorrect = optId === challenge.correctAnswer;
    if (isCorrect) {
      setIsUnlockedState(true);
      sounds.playUnlock();
    }
    onSubmitAnswer(optId);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Title & Instruction */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
          <span>PATTERN PUZZLE</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white">
          {challenge.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300">
          {challenge.instruction}
        </p>
      </div>

      {/* Visual Electronic Gate / Lock Mechanism Display */}
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 p-6 flex flex-col items-center justify-center gap-4 overflow-hidden">
        {/* Lock Animation Status */}
        <motion.div
          animate={{ scale: isUnlockedState ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.4 }}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-lg transition-colors ${
            isUnlockedState
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-emerald-500/20'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          {isUnlockedState ? (
            <Unlock className="w-8 h-8 animate-bounce" />
          ) : (
            <Lock className="w-8 h-8" />
          )}
        </motion.div>

        {/* Visual Sequence Chain */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 my-2">
          {sequence.map((item, idx) => {
            const isTarget = item === '?';
            return (
              <React.Fragment key={idx}>
                <div
                  className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl flex items-center justify-center font-black text-lg sm:text-xl border shadow-inner transition-all ${
                    isTarget
                      ? isUnlockedState
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 animate-pulse'
                        : 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 ring-2 ring-cyan-500/30'
                      : 'bg-slate-800/90 border-slate-700 text-white'
                  }`}
                >
                  {isTarget && isUnlockedState
                    ? challenge.options?.find((o) => o.id === challenge.correctAnswer)?.text
                    : item}
                </div>

                {idx < sequence.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 font-medium">
          {isUnlockedState
            ? '✓ PANEL TERBUKA! GERBANG BERHASIL DILEWATI'
            : 'Pilih nilai pengganti tanda tanya (?) pada pilihan di bawah:'}
        </p>
      </div>

      {/* Options Keypad */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {challenge.options?.map((option) => {
          const isSelected = selectedId === option.id;
          return (
            <button
              key={option.id}
              id={`pattern-opt-${option.id}`}
              disabled={disabled || isUnlockedState}
              onClick={() => handleSelect(option.id)}
              className={`group flex flex-col items-center justify-center p-4 rounded-xl border font-bold text-center transition-all cursor-pointer shadow-md ${
                isSelected
                  ? 'bg-cyan-600 border-cyan-400 text-white ring-2 ring-cyan-400/50'
                  : 'bg-slate-800/90 border-slate-700/90 text-slate-100 hover:bg-slate-750 hover:border-cyan-500/50 hover:text-cyan-300'
              } ${disabled || isUnlockedState ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <span className="text-xs text-slate-400 group-hover:text-cyan-300/80 mb-1">
                KODE {option.label}
              </span>
              <span className="text-xl sm:text-2xl font-black">
                {option.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
