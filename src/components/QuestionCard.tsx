import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BaseQuestion } from '../types';
import { Check, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface QuestionCardProps {
  question: BaseQuestion;
  onSubmitAnswer: (selectedOptionId: string) => void;
  xpReward?: number;
  scoreReward?: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onSubmitAnswer,
  xpReward = 100,
  scoreReward = 100,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  const handleSelect = (id: string) => {
    sounds.playClick();
    setSelectedId(id);
  };

  const handleSubmit = () => {
    if (!selectedId) return;
    onSubmitAnswer(selectedId);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/30"
      >
        {/* Header Question Title & Reward */}
        <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400">
              TANTANGAN LOGIKA
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {question.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
              +{xpReward} XP
            </span>
            <span className="text-xs font-bold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/30">
              +{scoreReward} SKOR
            </span>
          </div>
        </div>

        {/* Prompt / Question Box */}
        <div className="bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-slate-800 mb-6">
          <p className="text-base sm:text-lg font-bold text-slate-100 whitespace-pre-line leading-relaxed">
            {question.prompt}
          </p>
          {question.detail && (
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              {question.detail}
            </p>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-3 mb-6">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            PILIH JAWABAN:
          </span>
          {question.options?.map((option) => {
            const isSelected = selectedId === option.id;
            return (
              <button
                key={option.id}
                id={`option-btn-${option.id}`}
                onClick={() => handleSelect(option.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-cyan-950/50 border-cyan-400 text-white shadow-lg shadow-cyan-950/50 ring-2 ring-cyan-400/40'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                        : 'bg-slate-700/80 text-slate-300 border-slate-600'
                    }`}
                  >
                    {option.label}
                  </div>
                  <span className="text-sm sm:text-base font-semibold">
                    {option.text}
                  </span>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Hint Box (Collapsible) */}
        {question.hint && (
          <div className="mb-6">
            {!showHint ? (
              <button
                type="button"
                id="show-hint-btn"
                onClick={() => {
                  sounds.playClick();
                  setShowHint(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-amber-400/90 hover:text-amber-300 font-semibold cursor-pointer p-1"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Butuh petunjuk berpikir?</span>
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200"
              >
                <span className="font-bold block mb-1">💡 Petunjuk:</span>
                <p>{question.hint}</p>
              </motion.div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          id="submit-answer-btn"
          disabled={!selectedId}
          onClick={handleSubmit}
          className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            selectedId
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-600/30 active:scale-98'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
          }`}
        >
          <span>PERIKSA JAWABAN</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};
