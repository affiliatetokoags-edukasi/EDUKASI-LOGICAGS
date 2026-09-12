import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  X, 
  Sparkles, 
  Play, 
  BookOpen, 
  RotateCcw,
  Target
} from 'lucide-react';
import { DiagnosticQuestion, LearningTopic } from '../../types';
import { evaluateDiagnosticSubmission } from '../../utils/learningEngine';
import { sounds } from '../../utils/audio';

interface DiagnosticModalProps {
  isOpen: boolean;
  topic: LearningTopic | null;
  onClose: () => void;
  onCompleteDiagnostic: (topicId: string, scorePercent: number) => void;
  onOpenLessons: (topic: LearningTopic) => void;
  onOpenChallenges: (topic: LearningTopic) => void;
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({
  isOpen,
  topic,
  onClose,
  onCompleteDiagnostic,
  onOpenLessons,
  onOpenChallenges,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [qId: string]: string }>({});
  const [report, setReport] = useState<ReturnType<typeof evaluateDiagnosticSubmission> | null>(null);

  if (!isOpen || !topic || !topic.diagnosticQuestions || topic.diagnosticQuestions.length === 0) {
    return null;
  }

  const questions = topic.diagnosticQuestions;
  const currentQ: DiagnosticQuestion | undefined = questions[currentQIndex];

  const handleSelectOption = (optionId: string) => {
    if (!currentQ) return;
    sounds.playClick();
    const nextAnswers = { ...answers, [currentQ.id]: optionId };
    setAnswers(nextAnswers);

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      // Evaluate results
      const res = evaluateDiagnosticSubmission(nextAnswers, questions);
      setReport(res);
      if (res.passed) {
        sounds.playCorrect();
      } else {
        sounds.playUnlock();
      }
      onCompleteDiagnostic(topic.id, res.scorePercent);
    }
  };

  const handleReset = () => {
    sounds.playClick();
    setCurrentQIndex(0);
    setAnswers({});
    setReport(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-xl bg-slate-900 border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  TES DIAGNOSTIK AWAL
                </span>
                <h3 className="text-base font-bold text-white truncate max-w-[280px]">
                  {topic.title}
                </h3>
              </div>
            </div>

            <button
              id="diagnostic-close-btn"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {!report ? (
              // Active Diagnostic Question
              currentQ && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span>Soal {currentQIndex + 1} dari {questions.length}</span>
                    <span className="text-cyan-400">Cek Pemahaman Awal</span>
                  </div>

                  <h4 className="text-lg font-black text-white leading-relaxed">
                    {currentQ.prompt}
                  </h4>

                  <div className="space-y-2.5 pt-2">
                    {currentQ.options.map((opt) => (
                      <button
                        key={opt.id}
                        id={`diagnostic-opt-${opt.id}`}
                        onClick={() => handleSelectOption(opt.id)}
                        className="w-full text-left p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-cyan-500/50 text-slate-200 hover:text-white font-medium text-sm sm:text-base transition-all cursor-pointer flex items-center gap-3"
                      >
                        <span className="w-7 h-7 rounded-xl bg-slate-700 flex items-center justify-center font-bold text-xs shrink-0 text-cyan-300">
                          {opt.id.toUpperCase()}
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            ) : (
              // Diagnostic Report View
              <div className="space-y-5 text-center">
                <div className="inline-flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 w-full">
                  <span className="text-4xl mb-2">
                    {report.passed ? '🎯' : '💡'}
                  </span>
                  <div className="text-3xl font-black text-white">
                    Skor Diagnostik: <span className={report.passed ? 'text-emerald-400' : 'text-amber-400'}>{report.scorePercent}%</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md">
                    {report.passed
                      ? 'Hebat! Kamu sudah memiliki fondasi awal yang solid pada materi ini.'
                      : 'Kamu dianjurkan membaca kartu konsep terlebih dahulu sebelum mencoba tantangan tingkat tinggi.'}
                  </p>
                </div>

                {/* Question Feedback Breakdown */}
                <div className="text-left space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {report.conceptFeedback.map((fb, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs flex items-start gap-2.5"
                    >
                      {fb.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <strong className="block text-slate-200">{fb.questionTitle}</strong>
                        <p className="text-slate-400 mt-0.5">{fb.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          {report && (
            <div className="px-6 py-4 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                id="diagnostic-retry-btn"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs cursor-pointer transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Diagnostik</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  id="diagnostic-open-lesson-btn"
                  onClick={() => {
                    sounds.playClick();
                    onOpenLessons(topic);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-cyan-500/40 cursor-pointer transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Pelajari Materi</span>
                </button>

                <button
                  id="diagnostic-open-challenge-btn"
                  onClick={() => {
                    sounds.playClick();
                    onOpenChallenges(topic);
                  }}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 cursor-pointer transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Mulai Tantangan</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
