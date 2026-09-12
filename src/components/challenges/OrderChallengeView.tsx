import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUp, ArrowDown, Shuffle, RotateCcw, Check, ListOrdered } from 'lucide-react';
import { ChallengeData } from '../../types';
import { sounds } from '../../utils/audio';

interface OrderChallengeViewProps {
  challenge: ChallengeData;
  onSubmitOrder: (orderedIds: string[]) => void;
  disabled?: boolean;
}

export const OrderChallengeView: React.FC<OrderChallengeViewProps> = ({
  challenge,
  onSubmitOrder,
  disabled = false,
}) => {
  // Scramble order initially or preserve existing order items
  const [items, setItems] = useState(() => {
    const raw = [...(challenge.orderItems || [])];
    // initial display order: reverse or slight mix
    return raw.length === 4
      ? [raw[2], raw[0], raw[3], raw[1]]
      : raw.sort(() => Math.random() - 0.5);
  });

  const [selectedForSwap, setSelectedForSwap] = useState<number | null>(null);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (disabled) return;
    sounds.playClick();
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const copy = [...items];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setItems(copy);
    setSelectedForSwap(null);
  };

  const handleCardClick = (index: number) => {
    if (disabled) return;
    sounds.playClick();

    if (selectedForSwap === null) {
      setSelectedForSwap(index);
    } else if (selectedForSwap === index) {
      setSelectedForSwap(null);
    } else {
      // Swap the two items
      const copy = [...items];
      const temp = copy[selectedForSwap];
      copy[selectedForSwap] = copy[index];
      copy[index] = temp;
      setItems(copy);
      setSelectedForSwap(null);
    }
  };

  const handleReset = () => {
    if (disabled) return;
    sounds.playClick();
    const raw = [...(challenge.orderItems || [])];
    setItems(raw.reverse());
    setSelectedForSwap(null);
  };

  const handleSubmit = () => {
    if (disabled) return;
    sounds.playClick();
    onSubmitOrder(items.map((i) => i.id));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <ListOrdered className="w-3.5 h-3.5" />
          <span>ORDER PUZZLE (ALGORITMA)</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white">
          {challenge.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300">
          {challenge.instruction}
        </p>
      </div>

      {/* Touch/Mobile Help indicator */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 bg-slate-950/60 px-3.5 py-2 rounded-xl border border-slate-800">
        <span>💡 <strong>Tips Urutan:</strong> Klik kartu untuk menandai lalu klik kartu lain untuk menukar posisi, atau gunakan panah ▲ ▼.</span>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer text-[11px] font-semibold"
        >
          <RotateCcw className="w-3 h-3" /> Acak Ulang
        </button>
      </div>

      {/* Cards List */}
      <div className="space-y-2.5">
        {items.map((item, index) => {
          const isSelected = selectedForSwap === index;
          return (
            <div
              key={item.id}
              id={`order-item-${item.id}`}
              onClick={() => handleCardClick(index)}
              className={`flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-emerald-950/60 border-emerald-400 ring-2 ring-emerald-500/40 shadow-lg'
                  : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800'
              }`}
            >
              {/* Left Step Badge & Title */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 border ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-900 text-slate-300 border-slate-700'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-100 truncate">
                  {item.text}
                </span>
              </div>

              {/* Up / Down Controls */}
              <div
                className="flex items-center gap-1 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  id={`order-up-${index}`}
                  disabled={index === 0 || disabled}
                  onClick={() => moveItem(index, 'up')}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-750 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  aria-label="Pindah ke Atas"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  id={`order-down-${index}`}
                  disabled={index === items.length - 1 || disabled}
                  onClick={() => moveItem(index, 'down')}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-750 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  aria-label="Pindah ke Bawah"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      <button
        id="order-submit-btn"
        disabled={disabled}
        onClick={handleSubmit}
        className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm tracking-wide shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
      >
        <Check className="w-4 h-4" />
        <span>KIRIM URUTAN ALGORITMA</span>
      </button>
    </div>
  );
};
