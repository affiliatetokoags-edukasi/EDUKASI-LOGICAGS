import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, CheckCircle, HelpCircle } from 'lucide-react';
import { ChallengeData } from '../../types';
import { sounds } from '../../utils/audio';

interface QuizChallengeViewProps {
  challenge: ChallengeData;
  onSubmitAnswer: (selectedId: string) => void;
  disabled?: boolean;
}

export const QuizChallengeView: React.FC<QuizChallengeViewProps> = ({
  challenge,
  onSubmitAnswer,
  disabled = false,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    if (disabled) return;
    sounds.playClick();
    setSelectedId(id);
    onSubmitAnswer(id);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>SECURITY CONFIRMATION QUIZ</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white">
          {challenge.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300">
          {challenge.instruction}
        </p>
      </div>

      {/* Detail or Prompt Box */}
      {challenge.detail && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm font-medium">
          {challenge.detail}
        </div>
      )}

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {challenge.options?.map((option) => {
          const isSelected = selectedId === option.id;
          return (
            <button
              key={option.id}
              id={`quiz-opt-${option.id}`}
              disabled={disabled}
              onClick={() => handleSelect(option.id)}
              className={`flex items-center gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer shadow-sm ${
                isSelected
                  ? 'bg-cyan-950/60 border-cyan-400 text-white ring-2 ring-cyan-500/40'
                  : 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-200'
              } ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-900 text-slate-300 border border-slate-700'
                }`}
              >
                {option.label}
              </div>

              <span className="text-sm sm:text-base font-semibold text-white">
                {option.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
