import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Crown, 
  X, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Coins, 
  Award,
  ArrowRight
} from 'lucide-react';
import { EnrichmentData, LearningTopic } from '../../types';
import { sounds } from '../../utils/audio';

interface EnrichmentModalProps {
  isOpen: boolean;
  topic: LearningTopic | null;
  onClose: () => void;
  onCompleteEnrichment: (topicId: string, bonusXp: number, bonusMastery: number) => void;
}

export const EnrichmentModal: React.FC<EnrichmentModalProps> = ({
  isOpen,
  topic,
  onClose,
  onCompleteEnrichment,
}) => {
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  if (!isOpen || !topic || !topic.enrichment) return null;

  const enrichment = topic.enrichment;
  const challenge = enrichment.advancedChallenge;

  const handleSubmit = () => {
    const correct = selectedOpt === challenge.correctAnswer;
    setIsCorrect(correct);
    setSubmitted(true);

    if (correct) {
      sounds.playLevelUp();
      onCompleteEnrichment(topic.id, enrichment.bonusXp, enrichment.bonusMastery);
    } else {
      sounds.playWrong();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-xl bg-slate-900 border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider">
                  TANTANGAN PENGAYAAN TINGKAT MASTER
                </span>
                <h3 className="text-base font-bold text-white truncate max-w-[280px]">
                  {enrichment.title}
                </h3>
              </div>
            </div>

            <button
              id="enrichment-close-btn"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Intro Ribbon */}
          <div className="px-6 py-2.5 bg-purple-950/30 border-b border-purple-500/20 text-xs text-purple-200">
            {enrichment.introText}
          </div>

          {/* Challenge Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-5">
            <div className="space-y-2">
              <h4 className="text-base sm:text-lg font-bold text-white">
                {challenge.prompt}
              </h4>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {challenge.options?.map((opt) => (
                <button
                  key={opt.id}
                  disabled={submitted}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedOpt(opt.id);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                    selectedOpt === opt.id
                      ? 'bg-purple-950/80 border-purple-400 text-white'
                      : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <span className="w-7 h-7 rounded-xl bg-slate-700 flex items-center justify-center font-bold text-xs text-purple-300">
                    {opt.label || opt.id.toUpperCase()}
                  </span>
                  <span className="text-sm sm:text-base font-medium">{opt.text}</span>
                </button>
              ))}
            </div>

            {/* Feedback */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border space-y-2 text-xs sm:text-sm ${
                  isCorrect
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2 font-black">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>LUAR BIASA! TANTANGAN MASTER TERTUNTASKAN</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-400" />
                      <span>BELUM TEPAT — COBA LAGI NANTI</span>
                    </>
                  )}
                </div>
                <p>
                  {isCorrect ? challenge.explanation.whyCorrect : challenge.explanation.whyWrong}
                </p>

                {isCorrect && (
                  <div className="flex items-center gap-3 pt-2 text-xs font-bold text-amber-300">
                    <span className="flex items-center gap-1 bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      +{enrichment.bonusXp} XP Master
                    </span>
                    <span className="flex items-center gap-1 bg-purple-500/20 px-2.5 py-1 rounded-lg border border-purple-500/30 text-purple-300">
                      <Award className="w-3.5 h-3.5" />
                      +{enrichment.bonusMastery}% Mastery Maksimal
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between gap-3">
            {!submitted ? (
              <button
                id="enrichment-submit-btn"
                disabled={!selectedOpt}
                onClick={handleSubmit}
                className={`w-full py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 ${
                  !selectedOpt
                    ? 'opacity-40 bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white cursor-pointer'
                }`}
              >
                <span>SERAHKAN JAWABAN MASTER</span>
                <Crown className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="enrichment-close-finish-btn"
                onClick={() => {
                  sounds.playClick();
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm cursor-pointer"
              >
                SELESAI & KEMBALI KE HUB
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
