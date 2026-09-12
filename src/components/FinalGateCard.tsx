import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BaseQuestion, FeedbackState } from '../types';
import { 
  DoorOpen, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Sparkles, 
  Trophy, 
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { QuestionCard } from './QuestionCard';
import { OrderCard } from './OrderCard';
import { sounds } from '../utils/audio';

interface FinalGateCardProps {
  miniChallenges: BaseQuestion[];
  onCompleteAll: () => void;
  onAnswerAttempt: (isCorrect: boolean) => void;
  setFeedbackModal: (feedback: FeedbackState) => void;
}

export const FinalGateCard: React.FC<FinalGateCardProps> = ({
  miniChallenges,
  onCompleteAll,
  onAnswerAttempt,
  setFeedbackModal,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [solvedSteps, setSolvedSteps] = useState<number[]>([]);

  const activeChallenge = miniChallenges[currentStep];

  const handleMultipleChoice = (selectedId: string) => {
    const isCorrect = selectedId === activeChallenge.correctAnswer;
    onAnswerAttempt(isCorrect);

    if (isCorrect) {
      sounds.playCorrect();
      const updatedSolved = [...new Set([...solvedSteps, currentStep])];
      setSolvedSteps(updatedSolved);

      const isFinal = currentStep === miniChallenges.length - 1;

      setFeedbackModal({
        isOpen: true,
        isCorrect: true,
        title: '✓ KUNCI TERBUKA!',
        message: isFinal
          ? 'Luar biasa! Semua 3 kunci pengaman gerbang akhir telah terbuka sempurna!'
          : `Hebat! Kunci pengaman ${currentStep + 1} berhasil dibuka. Lanjut ke kunci berikutnya!`,
        explanation: activeChallenge.explanation,
        xpGained: isFinal ? 200 : 50,
        scoreGained: isFinal ? 200 : 50,
        onContinue: () => {
          setFeedbackModal({ isOpen: false, isCorrect: true, title: '', message: '' });
          if (isFinal) {
            sounds.playVictory();
            onCompleteAll();
          } else {
            setCurrentStep((prev) => prev + 1);
          }
        },
      });
    } else {
      sounds.playWrong();
      setFeedbackModal({
        isOpen: true,
        isCorrect: false,
        title: '✕ KUNCI BELUM COCOK',
        message: 'Kombinasi logika belum tepat untuk membuka mekanisme gembok ini.',
        explanation: activeChallenge.hint || 'Evaluasi kembali hubungan aturan atau operasi matematika pada soal.',
        onRetry: () => {
          setFeedbackModal({ isOpen: false, isCorrect: false, title: '', message: '' });
        },
      });
    }
  };

  const handleOrdering = (orderedIds: string[]) => {
    const correctSeq = activeChallenge.correctOrder || [];
    const isCorrect = JSON.stringify(orderedIds) === JSON.stringify(correctSeq);
    onAnswerAttempt(isCorrect);

    if (isCorrect) {
      sounds.playCorrect();
      const updatedSolved = [...new Set([...solvedSteps, currentStep])];
      setSolvedSteps(updatedSolved);

      const isFinal = currentStep === miniChallenges.length - 1;

      setFeedbackModal({
        isOpen: true,
        isCorrect: true,
        title: '✓ URUTAN SEMPURNA!',
        message: 'Langkah pengamanan gerbang tersusun dengan presisi tinggi!',
        explanation: activeChallenge.explanation,
        xpGained: isFinal ? 200 : 50,
        scoreGained: isFinal ? 200 : 50,
        onContinue: () => {
          setFeedbackModal({ isOpen: false, isCorrect: true, title: '', message: '' });
          if (isFinal) {
            sounds.playVictory();
            onCompleteAll();
          } else {
            setCurrentStep((prev) => prev + 1);
          }
        },
      });
    } else {
      sounds.playWrong();
      setFeedbackModal({
        isOpen: true,
        isCorrect: false,
        title: '✕ URUTAN BELUM TEPAT',
        message: 'Langkah-langkah belum berada pada urutan logis yang benar.',
        explanation: activeChallenge.hint || 'Pikirkan langkah mana yang harus dimulai pertama kali agar sistem aman.',
        onRetry: () => {
          setFeedbackModal({ isOpen: false, isCorrect: false, title: '', message: '' });
        },
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Gate Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/90 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl shadow-cyan-950/40 text-center relative overflow-hidden"
      >
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <DoorOpen className="w-8 h-8" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          FINAL GATE
        </h2>
        <p className="text-sm font-semibold text-cyan-300 mt-1">
          Gerbang terakhir hanya terbuka jika kamu dapat menyelesaikan tantangan.
        </p>

        {/* 3 Challenge Lock Steps */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800">
          {miniChallenges.map((ch, idx) => {
            const isSolved = solvedSteps.includes(idx);
            const isCurrent = currentStep === idx;

            return (
              <div
                key={ch.id}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isSolved
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : isCurrent
                    ? 'bg-cyan-950/50 border-cyan-400 text-white ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-950/40'
                    : 'bg-slate-800/40 border-slate-700/50 text-slate-500'
                }`}
              >
                <div className="flex justify-center mb-1.5">
                  {isSolved ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : isCurrent ? (
                    <Unlock className="w-5 h-5 text-cyan-400 animate-pulse" />
                  ) : (
                    <Lock className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider">
                  Kunci {idx + 1}
                </div>
                <div className="text-xs font-semibold truncate mt-0.5">
                  {idx === 0 ? 'Pola' : idx === 1 ? 'Logika' : 'Urutan'}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Render Active Sub-challenge */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeChallenge.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeChallenge.type === 'multiple_choice' ? (
            <QuestionCard
              question={activeChallenge}
              onSubmitAnswer={handleMultipleChoice}
              xpReward={currentStep === miniChallenges.length - 1 ? 200 : 50}
              scoreReward={currentStep === miniChallenges.length - 1 ? 200 : 50}
            />
          ) : (
            <OrderCard
              question={activeChallenge}
              onSubmitOrder={handleOrdering}
              xpReward={currentStep === miniChallenges.length - 1 ? 200 : 50}
              scoreReward={currentStep === miniChallenges.length - 1 ? 200 : 50}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
