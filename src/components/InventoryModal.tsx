import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Key, Zap, Heart, Clock, Check, Sparkles } from 'lucide-react';
import { PlayerInventory } from '../types';
import { sounds } from '../utils/audio';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: PlayerInventory;
  currentHearts: number;
  maxHearts: number;
  onUseExtraHeart: () => void;
  onUseHintBoost: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  inventory,
  currentHearts,
  maxHearts,
  onUseExtraHeart,
  onUseHintBoost,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5"
        >
          {/* Close button */}
          <button
            id="inventory-close-btn"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                PERLENGKAPAN PETUALANG
              </span>
              <h3 className="text-lg font-black text-white">
                🎒 INVENTORY & POWER-UP
              </h3>
            </div>
          </div>

          {/* Items Grid */}
          <div className="space-y-3">
            {/* 1. Keys */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    KARTU AKSES (KEYCARD)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Otentikasi gerbang darurat laboratorium
                  </p>
                </div>
              </div>
              <span className="text-sm font-black text-amber-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                x{inventory.keys}
              </span>
            </div>

            {/* 2. Hint Boost */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    HINT BOOST
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Buka petunjuk tanpa pengurangan nilai XP
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-cyan-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                  x{inventory.hintBoosts}
                </span>
                {inventory.hintBoosts > 0 && (
                  <button
                    id="inv-use-hint-boost-btn"
                    onClick={() => {
                      sounds.playItemUse();
                      onUseHintBoost();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow cursor-pointer transition-all"
                  >
                    Pakai
                  </button>
                )}
              </div>
            </div>

            {/* 3. Extra Heart */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    EXTRA HEART
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Menambah +1 energi heart saat tersisa sedikit
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-rose-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                  x{inventory.extraHearts}
                </span>
                {inventory.extraHearts > 0 && currentHearts < maxHearts && (
                  <button
                    id="inv-use-extra-heart-btn"
                    onClick={() => {
                      sounds.playItemUse();
                      onUseExtraHeart();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow cursor-pointer transition-all"
                  >
                    Pakai
                  </button>
                )}
              </div>
            </div>

            {/* 4. Time Boost */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    TIME BOOST
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Menambah bonus waktu tantangan timer
                  </p>
                </div>
              </div>
              <span className="text-sm font-black text-blue-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                x{inventory.timeBoosts}
              </span>
            </div>
          </div>

          <button
            id="inventory-close-action-btn"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            TUTUP
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
