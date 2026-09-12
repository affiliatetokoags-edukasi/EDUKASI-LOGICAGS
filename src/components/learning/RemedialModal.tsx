import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wrench, 
  X, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';
import { RemedialData, LearningTopic } from '../../types';
import { sounds } from '../../utils/audio';

interface RemedialModalProps {
  isOpen: boolean;
  topic: LearningTopic | null;
  onClose: () => void;
  onCompleteRemedial: (topicId: string, recoveredMastery: number) => void;
}

export const RemedialModal: React.FC<RemedialModalProps> = ({
  isOpen,
  topic,
  onClose,
  onCompleteRemedial,
}) => {
  const [step, setStep] = useState<'review' | 'guided' | 'eval' | 'success'>('review');
  const [guidedAnswer, setGuidedAnswer] = useState<string | null>(null);
  const [evalAnswer, setEvalAnswer] = useState<string | null>(null);
  const [guidedError, setGuidedError] = useState(false);
  const [evalError, setEvalError] = useState(false);

  if (!isOpen || !topic || !topic.remedial) return null;

  const remedial = topic.remedial;

  const handleNextToGuided = () => {
    sounds.playClick();
    setStep('guided');
  };

  const handleCheckGuided = () => {
    if (guidedAnswer === remedial.guidedPractice.correctAnswer) {
      sounds.playCorrect();
      setGuidedError(false);
      setStep('eval');
    } else {
      sounds.playWrong();
      setGuidedError(true);
    }
  };

  const handleCheckEval = () => {
    if (evalAnswer === remedial.evaluationChallenge.correctAnswer) {
      sounds.playCorrect();
      setEvalError(false);
      setStep('success');
      onCompleteRemedial(topic.id, 65); // Recover to 65% (passing)
    } else {
      sounds.playWrong();
      setEvalError(true);
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
          className="relative w-full max-w-xl bg-slate-900 border border-yellow-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-300">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-yellow-400 tracking-wider">
                  MODUL REMEDIAL • PENGUATAN KONSEP
                </span>
                <h3 className="text-base font-bold text-white truncate max-w-[280px]">
                  {remedial.title}
                </h3>
              </div>
            </div>

            <button
              id="remedial-close-btn"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Reason Alert */}
          <div className="px-6 py-2.5 bg-yellow-950/30 border-b border-yellow-500/20 text-xs text-yellow-200">
            {remedial.reason}
          </div>

          {/* Step Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {step === 'review' && (
              <div className="space-y-4">
                <h4 className="text-sm font-extrabold uppercase text-cyan-400 tracking-wider">
                  1. Rangkuman Konsep Kunci
                </h4>
                {remedial.reviewCards.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-white text-sm">
                      <span>{c.illustrationEmoji || '💡'}</span>
                      <span>{c.title}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {c.content}
                    </p>
                    {c.tip && (
                      <p className="text-xs text-cyan-300 bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-500/30">
                        {c.tip}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {step === 'guided' && (
              <div className="space-y-4">
                <h4 className="text-sm font-extrabold uppercase text-cyan-400 tracking-wider">
                  2. Latihan Terbimbing
                </h4>
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                  <p className="text-sm font-bold text-white">
                    {remedial.guidedPractice.prompt}
                  </p>
                  <div className="space-y-2">
                    {remedial.guidedPractice.options?.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setGuidedAnswer(opt.id)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2.5 ${
                          guidedAnswer === opt.id
                            ? 'bg-cyan-950/80 border-cyan-400 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-200'
                        }`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-slate-700 text-cyan-300 font-bold flex items-center justify-center text-xs">
                          {opt.label || opt.id.toUpperCase()}
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {guidedError && (
                  <p className="text-xs text-rose-300 bg-rose-950/40 p-3 rounded-xl border border-rose-500/40">
                    Jawaban belum tepat. Ingat: {remedial.guidedPractice.hint}
                  </p>
                )}
              </div>
            )}

            {step === 'eval' && (
              <div className="space-y-4">
                <h4 className="text-sm font-extrabold uppercase text-amber-400 tracking-wider">
                  3. Evaluasi Kenaikan Mastery
                </h4>
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                  <p className="text-sm font-bold text-white">
                    {remedial.evaluationChallenge.prompt}
                  </p>
                  <div className="space-y-2">
                    {remedial.evaluationChallenge.options?.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setEvalAnswer(opt.id)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2.5 ${
                          evalAnswer === opt.id
                            ? 'bg-amber-950/80 border-amber-400 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-200'
                        }`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-slate-700 text-amber-300 font-bold flex items-center justify-center text-xs">
                          {opt.label || opt.id.toUpperCase()}
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {evalError && (
                  <p className="text-xs text-rose-300 bg-rose-950/40 p-3 rounded-xl border border-rose-500/40">
                    {remedial.evaluationChallenge.explanation.whyWrong}
                  </p>
                )}
              </div>
            )}

            {step === 'success' && (
              <div className="space-y-4 text-center py-6">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-3xl">
                  ✨
                </div>
                <h4 className="text-2xl font-black text-white">
                  REMEDIAL BERHASIL!
                </h4>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Penguasaan topik <strong className="text-emerald-300">{topic.title}</strong> kamu kini telah pulih ke ambang kelulusan <strong>65% (Cakap)</strong>!
                </p>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="px-6 py-4 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between gap-3">
            {step === 'review' && (
              <button
                id="remedial-go-guided-btn"
                onClick={handleNextToGuided}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <span>LANJUT KE LATIHAN TERBIMBING</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 'guided' && (
              <button
                id="remedial-check-guided-btn"
                disabled={!guidedAnswer}
                onClick={handleCheckGuided}
                className={`w-full py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 ${
                  !guidedAnswer
                    ? 'opacity-40 bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer'
                }`}
              >
                <span>VALIDASI LATIHAN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 'eval' && (
              <button
                id="remedial-check-eval-btn"
                disabled={!evalAnswer}
                onClick={handleCheckEval}
                className={`w-full py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 ${
                  !evalAnswer
                    ? 'opacity-40 bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 cursor-pointer'
                }`}
              >
                <span>KUNCI JAWABAN EVALUASI</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}

            {step === 'success' && (
              <button
                id="remedial-finish-btn"
                onClick={() => {
                  sounds.playClick();
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg cursor-pointer"
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
