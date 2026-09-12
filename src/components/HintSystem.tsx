import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, ChevronDown, ChevronUp, Zap, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HintSystemProps {
  hints: [string, string, string];
  revealedTier: number; // 0 (none), 1, 2, or 3
  onUnlockHint: (tier: number) => void;
  hintBoosts: number;
  onUseHintBoost: () => void;
  suggestedTier?: number; // Adaptive hint offer
}

export const HintSystem: React.FC<HintSystemProps> = ({
  hints,
  revealedTier,
  onUnlockHint,
  hintBoosts,
  onUseHintBoost,
  suggestedTier = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getDeductionText = (tier: number) => {
    switch (tier) {
      case 1:
        return '-20 XP';
      case 2:
        return '-40 XP';
      case 3:
        return '-60 XP';
      default:
        return '';
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
      {/* Header Toggle */}
      <button
        id="toggle-hint-system-btn"
        onClick={() => {
          sounds.playClick();
          setIsOpen(!isOpen);
        }}
        className="w-full px-4 py-3 flex items-center justify-between text-left bg-slate-900 hover:bg-slate-850 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">
                SISTEM PETUNJUK (HINT)
              </span>
              {revealedTier > 0 && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  LEVEL {revealedTier}/3 TERBUKA
                </span>
              )}
              {suggestedTier > revealedTier && !isOpen && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                  REKOMENDASI HINT {suggestedTier}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Gunakan jika kamu butuh arahan berpikir bertahap
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hintBoosts > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              <Zap className="w-3 h-3" /> {hintBoosts} Boost
            </span>
          )}
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {/* Expanded Accordion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4 pt-2 border-t border-slate-800 space-y-3"
          >
            {/* Hint Boost quick action if available */}
            {hintBoosts > 0 && revealedTier < 3 && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-cyan-200 font-medium">
                    Punya <strong>{hintBoosts}x Hint Boost</strong> (Buka hint tanpa pengurangan XP)
                  </span>
                </div>
                <button
                  id="use-hint-boost-btn"
                  onClick={() => {
                    sounds.playItemUse();
                    onUseHintBoost();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow transition-all cursor-pointer"
                >
                  Gunakan Boost
                </button>
              </div>
            )}

            {/* 3 Tier Hint Cards */}
            <div className="space-y-2.5">
              {hints.map((hintText, index) => {
                const tier = index + 1;
                const isRevealed = revealedTier >= tier;
                const isNextToUnlock = revealedTier === tier - 1;

                return (
                  <div
                    key={tier}
                    className={`rounded-xl p-3 border transition-all ${
                      isRevealed
                        ? 'bg-slate-800/80 border-amber-500/40 text-slate-200'
                        : isNextToUnlock
                        ? 'bg-slate-900/60 border-slate-700'
                        : 'bg-slate-950/40 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-400">
                          HINT {tier} — {tier === 1 ? 'Petunjuk Ringan' : tier === 2 ? 'Petunjuk Spesifik' : 'Arah Solusi'}
                        </span>
                        {!isRevealed && (
                          <span className="text-[10px] text-rose-400 font-semibold">
                            (Reward {getDeductionText(tier)})
                          </span>
                        )}
                      </div>

                      {isNextToUnlock && (
                        <button
                          id={`unlock-hint-btn-${tier}`}
                          onClick={() => {
                            sounds.playClick();
                            onUnlockHint(tier);
                          }}
                          className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold transition-all cursor-pointer"
                        >
                          Buka Hint {tier}
                        </button>
                      )}
                    </div>

                    {isRevealed ? (
                      <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium leading-relaxed">
                        {hintText}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500 italic mt-0.5">
                        {isNextToUnlock ? 'Klik tombol di atas untuk membuka petunjuk ini.' : `Buka Hint ${tier - 1} terlebih dahulu.`}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
