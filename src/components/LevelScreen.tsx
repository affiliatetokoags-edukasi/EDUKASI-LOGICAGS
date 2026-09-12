import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LevelData, FeedbackState, ChallengeData, InteractiveObject } from '../types';
import { MissionBrief } from './MissionBrief';
import { HintSystem } from './HintSystem';
import { CharacterGuide } from './CharacterGuide';
import { InteractiveObjectModal } from './InteractiveObjectModal';
import { EnergyDepletedModal } from './EnergyDepletedModal';

// Challenge Views
import { PatternChallengeView } from './challenges/PatternChallengeView';
import { DecisionChallengeView } from './challenges/DecisionChallengeView';
import { OrderChallengeView } from './challenges/OrderChallengeView';
import { PathFinderChallengeView } from './challenges/PathFinderChallengeView';
import { MemoryChallengeView } from './challenges/MemoryChallengeView';
import { DebugChallengeView } from './challenges/DebugChallengeView';
import { QuizChallengeView } from './challenges/QuizChallengeView';

import { ArrowLeft, CheckCircle2, Shield, Layers, Flame, Sparkles, BookOpen } from 'lucide-react';
import { sounds } from '../utils/audio';
import { LEARNING_TOPICS } from '../data/learningData';
import { ConceptCardModal } from './learning/ConceptCardModal';

interface LevelScreenProps {
  level: LevelData;
  playerHearts: number;
  comboCount: number;
  hintBoosts: number;
  extraHearts: number;
  onBackToMap: () => void;
  onCompleteLevel: (levelId: number, xpGained: number, scoreGained: number, coinsGained: number) => void;
  onAnswerAttempt: (isCorrect: boolean) => void;
  onHeartLost: () => void;
  onResetHearts: () => void;
  onUseHintBoost: () => void;
  onUseExtraHeart: () => void;
  setFeedbackModal: (feedback: FeedbackState) => void;
  isAlreadyCompleted: boolean;
}

export const LevelScreen: React.FC<LevelScreenProps> = ({
  level,
  playerHearts,
  comboCount,
  hintBoosts,
  extraHearts,
  onBackToMap,
  onCompleteLevel,
  onAnswerAttempt,
  onHeartLost,
  onResetHearts,
  onUseHintBoost,
  onUseExtraHeart,
  setFeedbackModal,
  isAlreadyCompleted,
}) => {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [inspectedObject, setInspectedObject] = useState<InteractiveObject | null>(null);
  const [revealedHintTier, setRevealedHintTier] = useState(0);
  const [failedAttemptsThisChallenge, setFailedAttemptsThisChallenge] = useState(0);
  const [energyDepletedOpen, setEnergyDepletedOpen] = useState(false);
  const [characterMood, setCharacterMood] = useState<'normal' | 'happy' | 'thinking' | 'warning' | 'celebrate'>('thinking');
  const [characterMessage, setCharacterMessage] = useState<string>('Periksa petunjuk di ruangan atau analisis alur logika.');
  const [conceptModalOpen, setConceptModalOpen] = useState(false);

  // Find matching educational topic
  const matchingTopicId = level.id === 1 ? 'bk-dekomposisi'
    : level.id === 2 ? 'sk-perangkat-keras'
    : level.id === 3 ? 'jki-jaringan-dasar'
    : level.id === 4 ? 'ad-analisis-data'
    : 'ap-algoritma-dasar';

  const matchedTopic = LEARNING_TOPICS.find((t) => t.id === matchingTopicId) || LEARNING_TOPICS[0];

  // Accumulated rewards for multi-challenge levels
  const [accumulatedXp, setAccumulatedXp] = useState(0);
  const [accumulatedCoins, setAccumulatedCoins] = useState(0);

  const challenges = level.challenges && level.challenges.length > 0
    ? level.challenges
    : [];

  const currentChallenge: ChallengeData = challenges[currentChallengeIndex] || {
    id: 'default',
    type: 'quiz',
    title: level.title,
    instruction: level.description,
    hints: ['Pikirkan logika dasar.', 'Perhatikan detail instruksi.', 'Pilih opsi yang paling aman.'],
    explanation: 'Tantangan logika diselesaikan.',
    xpReward: level.xpReward,
    coinReward: level.coinReward || 20,
  };

  const totalChallenges = challenges.length || 1;

  // Reset challenge-specific states on level change or challenge transition
  useEffect(() => {
    setRevealedHintTier(0);
    setFailedAttemptsThisChallenge(0);
    setCharacterMood('thinking');
    setCharacterMessage(`Tantangan ${currentChallengeIndex + 1}/${totalChallenges}: Baca tujuan misi dan periksa objek di ruangan.`);
  }, [currentChallengeIndex, level.id, totalChallenges]);

  // Monitor hearts depletion
  useEffect(() => {
    if (playerHearts <= 0) {
      sounds.playWrong();
      setEnergyDepletedOpen(true);
      setCharacterMood('warning');
      setCharacterMessage('Energi habis! Tapi tenang, progressmu sebelumnya tidak hilang.');
    }
  }, [playerHearts]);

  // Calculate adaptive hint recommendation
  const suggestedHintTier = failedAttemptsThisChallenge >= 3 ? 3 : failedAttemptsThisChallenge >= 2 ? 2 : failedAttemptsThisChallenge >= 1 ? 1 : 0;

  const handleUnlockHint = (tier: number) => {
    setRevealedHintTier(tier);
    setCharacterMood('thinking');
    setCharacterMessage(`Hint level ${tier} terbuka. Perhatikan petunjuknya untuk menemukan jawaban.`);
  };

  const handleUseHintBoostAction = () => {
    if (hintBoosts > 0 && revealedHintTier < 3) {
      onUseHintBoost();
      const nextTier = revealedHintTier + 1;
      setRevealedHintTier(nextTier);
      sounds.playItemUse();
      setCharacterMood('happy');
      setCharacterMessage(`Hint Boost berhasil digunakan! Hint ${nextTier} terbuka tanpa penalti XP.`);
    }
  };

  const handleChallengeSuccess = (customFeedbackMessage?: string) => {
    onAnswerAttempt(true);
    sounds.playCorrect();

    // Calculate XP with hint deduction
    let penalty = 0;
    if (revealedHintTier === 1) penalty = 20;
    else if (revealedHintTier === 2) penalty = 40;
    else if (revealedHintTier === 3) penalty = 60;

    const earnedXp = Math.max(20, currentChallenge.xpReward - penalty);
    const earnedCoins = currentChallenge.coinReward;

    const nextAccumXp = accumulatedXp + (isAlreadyCompleted ? 0 : earnedXp);
    const nextAccumCoins = accumulatedCoins + (isAlreadyCompleted ? 0 : earnedCoins);

    setAccumulatedXp(nextAccumXp);
    setAccumulatedCoins(nextAccumCoins);

    setCharacterMood('celebrate');
    setCharacterMessage('Bagus sekali! Logika berpikirmu tepat sasaran!');

    const isLastChallenge = currentChallengeIndex >= totalChallenges - 1;

    setFeedbackModal({
      isOpen: true,
      isCorrect: true,
      title: '✓ BERHASIL!',
      message: customFeedbackMessage || currentChallenge.explanation,
      explanation: currentChallenge.hints[0],
      xpGained: isAlreadyCompleted ? 0 : earnedXp,
      scoreGained: isAlreadyCompleted ? 0 : earnedXp + (level.bonusReward || 50),
      coinsGained: isAlreadyCompleted ? 0 : earnedCoins,
      comboCount: comboCount + 1,
      onContinue: () => {
        setFeedbackModal({ isOpen: false, isCorrect: true, title: '', message: '' });
        if (isLastChallenge) {
          // Complete entire level
          const finalScore = nextAccumXp + (isAlreadyCompleted ? 0 : level.scoreReward + level.bonusReward);
          onCompleteLevel(level.id, nextAccumXp, finalScore, nextAccumCoins);
        } else {
          // Advance to next challenge phase
          sounds.playLevelUp();
          setCurrentChallengeIndex((prev) => prev + 1);
        }
      },
    });
  };

  const handleChallengeFailure = (hintTip?: string) => {
    onAnswerAttempt(false);
    onHeartLost();
    sounds.playWrong();
    sounds.playHeartLost();

    setFailedAttemptsThisChallenge((prev) => prev + 1);
    setCharacterMood('warning');
    setCharacterMessage('Hati-hati, energimu berkurang 1! Coba buka hint jika kesulitan.');

    setFeedbackModal({
      isOpen: true,
      isCorrect: false,
      title: '✕ BELUM TEPAT (-1 ❤️)',
      message: 'Analisis logika belum sesuai. Pikirkan kembali langkah atau pola yang tepat.',
      explanation: hintTip || currentChallenge.hints[Math.min(2, failedAttemptsThisChallenge)] || currentChallenge.instruction,
      onRetry: () => {
        setFeedbackModal({ isOpen: false, isCorrect: false, title: '', message: '' });
      },
    });
  };

  // Multiple Choice / Decision / Pattern Answer Handler
  const handleOptionAnswer = (selectedId: string) => {
    if (selectedId === currentChallenge.correctAnswer) {
      handleChallengeSuccess();
    } else {
      handleChallengeFailure();
    }
  };

  // Order Puzzle Answer Handler
  const handleOrderAnswer = (orderedIds: string[]) => {
    const isCorrect = JSON.stringify(orderedIds) === JSON.stringify(currentChallenge.correctOrder);
    if (isCorrect) {
      handleChallengeSuccess('Urutan langkah algoritma berhasil disusun secara runtut dan sistematis!');
    } else {
      handleChallengeFailure('Urutan langkah belum benar. Pastikan tahapan berjalan dari awal daya listrik hingga siap digunakan.');
    }
  };

  // Debugging Step Answer Handler
  const handleDebugAnswer = (stepId: number) => {
    if (stepId === currentChallenge.bugStepId) {
      sounds.playCoin();
      handleChallengeSuccess(currentChallenge.bugExplanation || 'BUG FOUND! Langkah yang salah berhasil kamu deteksi!');
    } else {
      handleChallengeFailure('Langkah tersebut bukan bug. Cari perintah yang membuat alur program macet atau terhenti sebelum tujuan.');
    }
  };

  const handleRetryAfterDepletion = () => {
    onResetHearts();
    setEnergyDepletedOpen(false);
    setCurrentChallengeIndex(0);
    setAccumulatedXp(0);
    setAccumulatedCoins(0);
    setCharacterMood('thinking');
    setCharacterMessage('Energi telah dipulihkan kembali! Mari mulai lagi dengan lebih teliti.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          id="level-back-to-map-btn"
          onClick={() => {
            sounds.playClick();
            onBackToMap();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-all text-xs sm:text-sm font-bold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>KEMBALI KE PETA</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id="level-learn-concept-btn"
            onClick={() => {
              sounds.playClick();
              setConceptModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-500/40 text-xs font-bold text-cyan-300 hover:text-cyan-100 transition-all cursor-pointer"
            title="Buka Materi & Konsep Dasar Terkait Misi Ini"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">KONSEP INFORMATIKA</span>
          </button>

          {totalChallenges > 1 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-cyan-300">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>TAHAP {currentChallengeIndex + 1} / {totalChallenges}</span>
            </div>
          )}

          {isAlreadyCompleted && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>MISI INI TELAH SELESAI</span>
            </div>
          )}
        </div>
      </div>

      {/* Companion Character Guide Bubble */}
      <CharacterGuide
        mood={characterMood}
        message={characterMessage}
      />

      {/* Mission Brief & Room Exploration */}
      <MissionBrief
        mission={level.mission}
        difficulty={level.difficulty}
        xpReward={level.xpReward}
        coinReward={level.coinReward}
        comboCount={comboCount}
        onInspectObject={(obj) => setInspectedObject(obj)}
      />

      {/* 3-Tier Hint Accordion */}
      <HintSystem
        hints={currentChallenge.hints}
        revealedTier={revealedHintTier}
        onUnlockHint={handleUnlockHint}
        hintBoosts={hintBoosts}
        onUseHintBoost={handleUseHintBoostAction}
        suggestedTier={suggestedHintTier}
      />

      {/* Active Challenge View by Type */}
      <div className="pt-2">
        {currentChallenge.type === 'pattern' && (
          <PatternChallengeView
            challenge={currentChallenge}
            onSubmitAnswer={handleOptionAnswer}
            disabled={playerHearts <= 0}
          />
        )}

        {currentChallenge.type === 'decision' && (
          <DecisionChallengeView
            challenge={currentChallenge}
            onSubmitAnswer={handleOptionAnswer}
            disabled={playerHearts <= 0}
          />
        )}

        {currentChallenge.type === 'order' && (
          <OrderChallengeView
            challenge={currentChallenge}
            onSubmitOrder={handleOrderAnswer}
            disabled={playerHearts <= 0}
          />
        )}

        {currentChallenge.type === 'pathfinder' && (
          <PathFinderChallengeView
            challenge={currentChallenge}
            onComplete={() => handleChallengeSuccess('Paket data berhasil menembus koridor jaringan tanpa membentur firewall!')}
            onObstacleHit={() => handleChallengeFailure('Menabrak firewall! Hati-hati, cari jalur koridor hijau yang bersih.')}
            disabled={playerHearts <= 0}
          />
        )}

        {currentChallenge.type === 'memory' && (
          <MemoryChallengeView
            challenge={currentChallenge}
            onComplete={() => handleChallengeSuccess('Seluruh konsep dasar informatika berhasil dicocokkan dengan akurat!')}
            onMismatch={() => handleChallengeFailure('Kartu yang dibuka tidak berpasangan. Ingat kembali istilah dan artinya!')}
            disabled={playerHearts <= 0}
          />
        )}

        {currentChallenge.type === 'debug' && (
          <DebugChallengeView
            challenge={currentChallenge}
            onSubmitStep={handleDebugAnswer}
            disabled={playerHearts <= 0}
          />
        )}

        {currentChallenge.type === 'quiz' && (
          <QuizChallengeView
            challenge={currentChallenge}
            onSubmitAnswer={handleOptionAnswer}
            disabled={playerHearts <= 0}
          />
        )}
      </div>

      {/* Interactive Object Clue Inspection Modal */}
      <InteractiveObjectModal
        object={inspectedObject}
        onClose={() => setInspectedObject(null)}
      />

      {/* Energy Depleted Modal */}
      <EnergyDepletedModal
        isOpen={energyDepletedOpen}
        onRetry={handleRetryAfterDepletion}
      />

      {/* Pedagogical Micro-Lesson Modal */}
      <ConceptCardModal
        isOpen={conceptModalOpen}
        topic={matchedTopic}
        onClose={() => setConceptModalOpen(false)}
        onStartChallenge={() => setConceptModalOpen(false)}
      />
    </div>
  );
};
