import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BaseQuestion } from '../types';
import { ArrowUp, ArrowDown, GripVertical, Check, HelpCircle, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/audio';

interface OrderCardProps {
  question: BaseQuestion;
  onSubmitOrder: (orderedIds: string[]) => void;
  xpReward?: number;
  scoreReward?: number;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  question,
  onSubmitOrder,
  xpReward = 150,
  scoreReward = 150,
}) => {
  // Start with shuffled or default items (scrambled order so user has to sort it)
  const [items, setItems] = useState(() => {
    const original = question.orderItems || [];
    // Provide a preset mixed order so it's a real puzzle to solve
    if (original.length === 4) {
      // Shuffled order: 2, 0, 3, 1
      return [original[1], original[0], original[3], original[2]];
    }
    return [...original];
  });

  const [showHint, setShowHint] = useState<boolean>(false);
  const [selectedForSwap, setSelectedForSwap] = useState<number | null>(null);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    sounds.playClick();
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setItems(newItems);
  };

  const handleCardClick = (index: number) => {
    sounds.playClick();
    if (selectedForSwap === null) {
      setSelectedForSwap(index);
    } else if (selectedForSwap === index) {
      setSelectedForSwap(null);
    } else {
      // Swap the two
      const newItems = [...items];
      const temp = newItems[selectedForSwap];
      newItems[selectedForSwap] = newItems[index];
      newItems[index] = temp;
      setItems(newItems);
      setSelectedForSwap(null);
    }
  };

  const handleSubmit = () => {
    sounds.playClick();
    onSubmitOrder(items.map((i) => i.id));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/30"
      >
        {/* Header Title & Reward */}
        <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400">
              TANTANGAN ALGORITMA & URUTAN
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

        {/* Prompt */}
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 mb-6">
          <p className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed">
            {question.prompt}
          </p>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
            <span>💡 Gunakan tombol panah (▲/▼) atau klik dua kartu untuk menukar urutan langkah secara logis (1 ke 4).</span>
          </p>
        </div>

        {/* Ordering List Items */}
        <div className="space-y-3 mb-6">
          {items.map((item, idx) => {
            const isSelected = selectedForSwap === idx;
            return (
              <motion.div
                key={item.id}
                layout
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className={`p-3.5 sm:p-4 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                  isSelected
                    ? 'bg-cyan-950/70 border-cyan-400 ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-950/40'
                    : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                {/* Left: Step Number & Title */}
                <div
                  onClick={() => handleCardClick(idx)}
                  className="flex items-center gap-3.5 flex-1 cursor-pointer select-none"
                >
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-black text-sm flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-slate-100">
                    {item.text}
                  </span>
                </div>

                {/* Right: Up / Down Arrows & Swap Trigger */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    title="Pindah ke atas"
                    disabled={idx === 0}
                    onClick={() => moveItem(idx, 'up')}
                    className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 transition-colors cursor-pointer"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    title="Pindah ke bawah"
                    disabled={idx === items.length - 1}
                    onClick={() => moveItem(idx, 'down')}
                    className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 transition-colors cursor-pointer"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Hint Section */}
        {question.hint && (
          <div className="mb-6">
            {!showHint ? (
              <button
                type="button"
                id="show-order-hint-btn"
                onClick={() => {
                  sounds.playClick();
                  setShowHint(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-amber-400/90 hover:text-amber-300 font-semibold cursor-pointer p-1"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Butuh petunjuk urutan?</span>
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200"
              >
                <span className="font-bold block mb-1">💡 Petunjuk Urutan:</span>
                <p>{question.hint}</p>
              </motion.div>
            )}
          </div>
        )}

        {/* Submit Order Button */}
        <button
          id="submit-order-btn"
          onClick={handleSubmit}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-98 text-white font-black text-sm sm:text-base shadow-xl shadow-cyan-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>PERIKSA URUTAN</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};
