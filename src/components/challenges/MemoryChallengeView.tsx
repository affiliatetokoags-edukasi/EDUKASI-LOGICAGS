import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Brain, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { ChallengeData, MemoryCard } from '../../types';
import { sounds } from '../../utils/audio';

interface MemoryChallengeViewProps {
  challenge: ChallengeData;
  onComplete: () => void;
  onMismatch: () => void;
  disabled?: boolean;
}

export const MemoryChallengeView: React.FC<MemoryChallengeViewProps> = ({
  challenge,
  onComplete,
  onMismatch,
  disabled = false,
}) => {
  const [cards, setCards] = useState<MemoryCard[]>(() => {
    const pairs = challenge.memoryPairs || [
      { id: 'p1', term: 'ALGORITMA', definition: 'LANGKAH TERURUT' },
      { id: 'p2', term: 'PASSWORD', definition: 'KEAMANAN AKUN' },
      { id: 'p3', term: 'FIREWALL', definition: 'FILTER JARINGAN' },
    ];

    const deck: MemoryCard[] = [];
    pairs.forEach((p) => {
      deck.push({
        id: `${p.id}-term`,
        pairId: p.id,
        text: p.term,
        category: 'ISTILAH',
      });
      deck.push({
        id: `${p.id}-def`,
        pairId: p.id,
        text: p.definition,
        category: 'PENGERTIAN',
      });
    });

    // Shuffle deck
    return deck.sort(() => Math.random() - 0.5);
  });

  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPairs = (challenge.memoryPairs || []).length || 3;

  const handleCardClick = (card: MemoryCard) => {
    if (
      disabled ||
      isProcessing ||
      flippedIds.includes(card.id) ||
      matchedPairIds.includes(card.pairId)
    ) {
      return;
    }

    sounds.playClick();
    const nextFlipped = [...flippedIds, card.id];
    setFlippedIds(nextFlipped);

    if (nextFlipped.length === 2) {
      setIsProcessing(true);
      const firstCard = cards.find((c) => c.id === nextFlipped[0])!;
      const secondCard = card;

      if (firstCard.pairId === secondCard.pairId) {
        // Matched!
        sounds.playCorrect();
        const nextMatched = [...matchedPairIds, firstCard.pairId];
        setMatchedPairIds(nextMatched);
        setFlippedIds([]);
        setIsProcessing(false);

        if (nextMatched.length === totalPairs) {
          sounds.playUnlock();
          onComplete();
        }
      } else {
        // Mismatch
        sounds.playWrong();
        onMismatch();
        setTimeout(() => {
          setFlippedIds([]);
          setIsProcessing(false);
        }, 1100);
      }
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Brain className="w-3.5 h-3.5" />
            <span>MEMORY PUZZLE (INFORMATIKA)</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            {challenge.title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-purple-300">
          <span>PASANGAN: {matchedPairIds.length} / {totalPairs}</span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-slate-300">
        {challenge.instruction}
      </p>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {cards.map((card) => {
          const isFlipped =
            flippedIds.includes(card.id) || matchedPairIds.includes(card.pairId);
          const isMatched = matchedPairIds.includes(card.pairId);

          return (
            <motion.button
              key={card.id}
              id={`memory-card-${card.id}`}
              disabled={disabled || isMatched}
              whileTap={{ scale: isMatched ? 1 : 0.96 }}
              onClick={() => handleCardClick(card)}
              className={`h-28 sm:h-32 rounded-2xl p-3 border flex flex-col items-center justify-center text-center transition-all cursor-pointer shadow-md select-none ${
                isMatched
                  ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200 ring-2 ring-emerald-500/30 cursor-default'
                  : isFlipped
                  ? 'bg-slate-800 border-purple-400 text-white shadow-purple-950/50'
                  : 'bg-slate-950 hover:bg-slate-900 border-slate-800 hover:border-purple-500/40 text-slate-400'
              }`}
            >
              {isFlipped ? (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black tracking-wider text-purple-400 block">
                    {card.category}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-white leading-tight">
                    {card.text}
                  </p>
                  {isMatched && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold mt-1">
                      <CheckCircle2 className="w-3 h-3" /> Cocok!
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-slate-500">
                  <Sparkles className="w-5 h-5 text-purple-400/60" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    BUKA KARTU
                  </span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
