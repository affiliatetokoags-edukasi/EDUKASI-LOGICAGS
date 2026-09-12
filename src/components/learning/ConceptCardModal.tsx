import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Lightbulb, 
  Play, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';
import { MicroLessonCard, LearningTopic } from '../../types';
import { sounds } from '../../utils/audio';

interface ConceptCardModalProps {
  isOpen: boolean;
  topic: LearningTopic | null;
  onClose: () => void;
  onStartChallenge: (topic: LearningTopic) => void;
}

export const ConceptCardModal: React.FC<ConceptCardModalProps> = ({
  isOpen,
  topic,
  onClose,
  onStartChallenge,
}) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  if (!isOpen || !topic) return null;

  const cards = topic.microLessons || [];
  const currentCard: MicroLessonCard | undefined = cards[currentCardIndex];
  const totalCards = cards.length;
  const isLastCard = currentCardIndex === totalCards - 1;

  const handleNext = () => {
    if (currentCardIndex < totalCards - 1) {
      sounds.playClick();
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      sounds.playCorrect();
      onStartChallenge(topic);
    }
  };

  const handlePrev = () => {
    if (currentCardIndex > 0) {
      sounds.playClick();
      setCurrentCardIndex((prev) => prev - 1);
    }
  };

  const getTypeBadge = (type: MicroLessonCard['type']) => {
    switch (type) {
      case 'concept':
        return { label: 'KONSEP UTAMA', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
      case 'example':
        return { label: 'CONTOH NYATA', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'try':
        return { label: 'UJI PENALARAN', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'summary':
        return { label: 'RINGKASAN LOGIKA', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      default:
        return { label: 'MATERI INFORMATIKA', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
    }
  };

  const typeInfo = currentCard ? getTypeBadge(currentCard.type) : { label: 'KONSEP', color: '' };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-xl bg-slate-900 border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase text-cyan-400 tracking-wider">
                    MICRO-LEARNING • KELAS {topic.grade}
                  </span>
                  <span className="text-slate-500 text-xs">•</span>
                  <span className="text-xs text-slate-400 font-semibold">{topic.subtopic}</span>
                </div>
                <h3 className="text-base font-bold text-white truncate max-w-[280px] sm:max-w-md">
                  {topic.title}
                </h3>
              </div>
            </div>

            <button
              id="concept-card-close-btn"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Formal Learning Objective Callout */}
          <div className="px-6 py-2.5 bg-cyan-950/30 border-b border-cyan-500/20 flex items-start gap-2.5 text-xs text-cyan-300/90">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-cyan-200">Tujuan Pembelajaran:</strong> {topic.objective}
            </p>
          </div>

          {/* Card Content Area */}
          <div className="p-6 overflow-y-auto flex-1 flex flex-col justify-between space-y-6">
            {currentCard && (
              <motion.div
                key={currentCard.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Badge & Step Indicator */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${typeInfo.color}`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{typeInfo.label}</span>
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Kartu {currentCardIndex + 1} dari {totalCards}
                  </span>
                </div>

                {/* Card Title with Emoji */}
                <div className="flex items-center gap-3">
                  {currentCard.illustrationEmoji && (
                    <span className="text-3xl sm:text-4xl p-2 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-inner">
                      {currentCard.illustrationEmoji}
                    </span>
                  )}
                  <h4 className="text-xl sm:text-2xl font-black text-white">
                    {currentCard.title}
                  </h4>
                </div>

                {/* Explanation Content */}
                <div className="text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                  {currentCard.content}
                </div>

                {/* Example Box (if any) */}
                {currentCard.example && (
                  <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <div>
                      <strong className="block text-amber-300 font-bold mb-1">Contoh Nyata:</strong>
                      <p className="whitespace-pre-line leading-relaxed">{currentCard.example}</p>
                    </div>
                  </div>
                )}

                {/* Tip Box (if any) */}
                {currentCard.tip && (
                  <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 text-xs sm:text-sm flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-cyan-300 font-bold mb-0.5">Tips Logika:</strong>
                      <p className="leading-relaxed">{currentCard.tip}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {cards.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentCardIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentCardIndex ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
                  }`}
                  aria-label={`Pindah ke kartu ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="px-6 py-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              id="concept-prev-btn"
              disabled={currentCardIndex === 0}
              onClick={handlePrev}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                currentCardIndex === 0
                  ? 'opacity-40 cursor-not-allowed text-slate-500 bg-slate-800'
                  : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            <button
              id="concept-next-btn"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-98 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-cyan-600/30 transition-all cursor-pointer border border-cyan-400/40"
            >
              {isLastCard ? (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>SIAP MAIN TANTANGAN</span>
                </>
              ) : (
                <>
                  <span>Lanjut Membaca</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
