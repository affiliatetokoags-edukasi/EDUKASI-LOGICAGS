import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  X, 
  BookOpen, 
  ChevronUp, 
  ChevronDown, 
  Lightbulb, 
  Award,
  Target,
  Coins
} from 'lucide-react';
import { 
  LearningChallenge, 
  LearningTopic, 
  LearningChallengeOrderItem 
} from '../../types';
import { sounds } from '../../utils/audio';

interface LearningChallengeModalProps {
  isOpen: boolean;
  topic: LearningTopic | null;
  challengeIndex: number;
  onClose: () => void;
  onCompleteChallenge: (
    challenge: LearningChallenge,
    isCorrect: boolean,
    hintsUsed: number
  ) => void;
  onOpenConceptCards: () => void;
  onNextChallenge?: () => void;
  hasNextChallenge?: boolean;
}

export const LearningChallengeModal: React.FC<LearningChallengeModalProps> = ({
  isOpen,
  topic,
  challengeIndex,
  onClose,
  onCompleteChallenge,
  onOpenConceptCards,
  onNextChallenge,
  hasNextChallenge = false,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [orderedItems, setOrderedItems] = useState<LearningChallengeOrderItem[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsedCount, setHintsUsedCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [showObjectiveDetails, setShowObjectiveDetails] = useState(false);

  const currentChallenge: LearningChallenge | undefined = topic?.challenges?.[challengeIndex];

  // Reset local state whenever challenge changes
  useEffect(() => {
    if (currentChallenge) {
      setSelectedOptionId(null);
      setShowHint(false);
      setHintsUsedCount(0);
      setSubmitted(false);
      setIsAnswerCorrect(false);

      if (currentChallenge.type === 'order' && currentChallenge.orderItems) {
        // Scramble initial order for fair puzzle
        const shuffled = [...currentChallenge.orderItems].sort(() => Math.random() - 0.5);
        setOrderedItems(shuffled);
      }
    }
  }, [currentChallenge]);

  if (!isOpen || !topic || !currentChallenge) return null;

  const handleUseHint = () => {
    if (!showHint) {
      sounds.playUnlock();
      setShowHint(true);
      setHintsUsedCount((prev) => prev + 1);
    }
  };

  const handleMoveOrderStep = (index: number, direction: 'up' | 'down') => {
    sounds.playClick();
    const newItems = [...orderedItems];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    setOrderedItems(newItems);
  };

  const handleSubmitAnswer = () => {
    let correct = false;

    if (currentChallenge.type === 'order') {
      const currentOrderIds = orderedItems.map((item) => item.id);
      const targetOrder = currentChallenge.correctOrder || [];
      correct = JSON.stringify(currentOrderIds) === JSON.stringify(targetOrder);
    } else {
      const chosenOpt = currentChallenge.options?.find((o) => o.id === selectedOptionId);
      correct = chosenOpt ? Boolean(chosenOpt.isCorrect) : selectedOptionId === currentChallenge.correctAnswer;
    }

    setIsAnswerCorrect(correct);
    setSubmitted(true);

    if (correct) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }

    onCompleteChallenge(currentChallenge, correct, hintsUsedCount);
  };

  const handleRetry = () => {
    sounds.playClick();
    setSubmitted(false);
    setSelectedOptionId(null);
    if (currentChallenge.type === 'order' && currentChallenge.orderItems) {
      const reshuffled = [...currentChallenge.orderItems].sort(() => Math.random() - 0.5);
      setOrderedItems(reshuffled);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Top Header Bar */}
          <div className="px-6 py-3.5 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                #{challengeIndex + 1}
              </span>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400">
                  {topic.title}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-[280px] sm:max-w-md">
                  {currentChallenge.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="learning-challenge-open-concept-btn"
                onClick={() => {
                  sounds.playClick();
                  onOpenConceptCards();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all cursor-pointer"
                title="Buka Materi & Konsep Dasar"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PELAJARI KONSEP</span>
              </button>

              <button
                id="learning-challenge-close-btn"
                onClick={() => {
                  sounds.playClick();
                  onClose();
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mission Target & Objective Bar */}
          <div className="px-6 py-2.5 bg-slate-950/70 border-b border-slate-800/80 flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                <span>TARGET MISI: {currentChallenge.targetMisi}</span>
              </div>

              <button
                id="learning-toggle-objective-btn"
                onClick={() => setShowObjectiveDetails(!showObjectiveDetails)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold underline flex items-center gap-1 cursor-pointer"
              >
                <span>Tujuan Belajar</span>
                {showObjectiveDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {showObjectiveDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-xs text-slate-300 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 mt-1"
              >
                <strong className="text-cyan-300">Tujuan Formal:</strong> {currentChallenge.objectiveText}
              </motion.div>
            )}
          </div>

          {/* Question Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* Prompt */}
            <div className="space-y-2">
              <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {currentChallenge.prompt}
              </p>
              {currentChallenge.context && (
                <p className="text-sm text-slate-400 leading-relaxed italic">
                  {currentChallenge.context}
                </p>
              )}
            </div>

            {/* Answer Controls: Multiple Choice */}
            {currentChallenge.type !== 'order' && currentChallenge.options && (
              <div className="space-y-2.5">
                {currentChallenge.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      id={`learning-opt-${opt.id}`}
                      disabled={submitted}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedOptionId(opt.id);
                      }}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-md shadow-cyan-950/50'
                          : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-200'
                      } ${submitted ? 'cursor-default' : ''}`}
                    >
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {opt.label || opt.id.toUpperCase()}
                      </span>
                      <span className="text-sm sm:text-base leading-relaxed pt-0.5 font-medium">
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Answer Controls: Step Ordering Puzzle */}
            {currentChallenge.type === 'order' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  Gunakan tombol panah untuk menyusun urutan langkah dari atas (paling awal) ke bawah:
                </p>

                <div className="space-y-2">
                  {orderedItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-black text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-semibold text-slate-100">
                          {item.text}
                        </span>
                      </div>

                      {!submitted && (
                        <div className="flex items-center gap-1">
                          <button
                            id={`order-up-${idx}`}
                            disabled={idx === 0}
                            onClick={() => handleMoveOrderStep(idx, 'up')}
                            className={`p-1.5 rounded-lg border text-xs ${
                              idx === 0
                                ? 'opacity-30 border-transparent text-slate-600'
                                : 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-cyan-300 cursor-pointer'
                            }`}
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            id={`order-down-${idx}`}
                            disabled={idx === orderedItems.length - 1}
                            onClick={() => handleMoveOrderStep(idx, 'down')}
                            className={`p-1.5 rounded-lg border text-xs ${
                              idx === orderedItems.length - 1
                                ? 'opacity-30 border-transparent text-slate-600'
                                : 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-cyan-300 cursor-pointer'
                            }`}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hint Box */}
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs sm:text-sm flex items-start gap-3"
              >
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-amber-300 font-bold mb-0.5">Petunjuk Logika:</strong>
                  <p>{currentChallenge.hint}</p>
                </div>
              </motion.div>
            )}

            {/* Feedback Box (Educational "WHY?" Explanation) */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-5 rounded-2xl border space-y-3 ${
                  isAnswerCorrect
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2.5 font-black text-base">
                  {isAnswerCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-300">JAWABAN LOGIS & BENAR!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-400" />
                      <span className="text-rose-300">KURANG TEPAT — MARI AMATI LAGI</span>
                    </>
                  )}
                </div>

                <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed text-slate-200">
                  <p>
                    {isAnswerCorrect
                      ? currentChallenge.explanation.whyCorrect
                      : currentChallenge.explanation.whyWrong}
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-700/60 text-cyan-300">
                    <strong>Konsep Informatika:</strong> {currentChallenge.explanation.educationalConcept}
                  </div>
                </div>

                {isAnswerCorrect && (
                  <div className="flex items-center gap-3 pt-2 text-xs font-bold text-amber-300">
                    <span className="flex items-center gap-1 bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      +{currentChallenge.xpReward} XP
                    </span>
                    <span className="flex items-center gap-1 bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      +{currentChallenge.coinReward} Koin
                    </span>
                    <span className="flex items-center gap-1 bg-cyan-500/20 px-2.5 py-1 rounded-lg border border-cyan-500/30 text-cyan-300">
                      <Award className="w-3.5 h-3.5" />
                      +{currentChallenge.masteryWeight}% Mastery
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-4 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between gap-3">
            {!submitted ? (
              <>
                <button
                  id="learning-use-hint-btn"
                  disabled={showHint}
                  onClick={handleUseHint}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    showHint
                      ? 'opacity-50 text-slate-500 border-slate-800'
                      : 'text-amber-300 border-amber-500/40 bg-amber-950/30 hover:bg-amber-900/40 cursor-pointer'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Petunjuk Terbuka' : 'Bantuan Petunjuk'}</span>
                </button>

                <button
                  id="learning-submit-answer-btn"
                  disabled={currentChallenge.type !== 'order' && !selectedOptionId}
                  onClick={handleSubmitAnswer}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all ${
                    currentChallenge.type !== 'order' && !selectedOptionId
                      ? 'opacity-40 bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-600/30 cursor-pointer'
                  }`}
                >
                  <span>KUNCI JAWABAN</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                {!isAnswerCorrect ? (
                  <button
                    id="learning-retry-btn"
                    onClick={handleRetry}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Coba Ulang Pertanyaan</span>
                  </button>
                ) : (
                  <button
                    id="learning-view-concept-btn"
                    onClick={onOpenConceptCards}
                    className="text-xs font-semibold text-cyan-400 hover:underline cursor-pointer"
                  >
                    Ulas Kembali Konsep
                  </button>
                )}

                {hasNextChallenge && onNextChallenge ? (
                  <button
                    id="learning-next-challenge-btn"
                    onClick={() => {
                      sounds.playClick();
                      onNextChallenge();
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs sm:text-sm shadow-lg cursor-pointer"
                  >
                    <span>TANTANGAN BERIKUTNYA</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    id="learning-finish-hub-btn"
                    onClick={() => {
                      sounds.playClick();
                      onClose();
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>SELESAI & KE HUB</span>
                  </button>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
