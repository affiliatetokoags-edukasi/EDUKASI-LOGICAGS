import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeartCrack, RotateCcw, ShieldCheck } from 'lucide-react';
import { sounds } from '../utils/audio';

interface EnergyDepletedModalProps {
  isOpen: boolean;
  onRetry: () => void;
}

export const EnergyDepletedModal: React.FC<EnergyDepletedModalProps> = ({
  isOpen,
  onRetry,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm bg-slate-900 border border-rose-500/40 rounded-3xl p-6 text-center shadow-2xl shadow-rose-950/50 space-y-4"
        >
          {/* Heart Icon */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-950/60 border border-rose-500/50 flex items-center justify-center text-rose-500 shadow-lg shadow-rose-950/80 animate-pulse">
            <HeartCrack className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-black text-white tracking-tight">
              ENERGI HABIS!
            </h3>
            <p className="text-xs text-rose-300 font-semibold">
              Semua Heart telah terpakai dalam percobaan ini.
            </p>
          </div>

          {/* Safety note: progress safe! */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-left text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Tenang!</strong> Progress level yang sudah kamu selesaikan tetap aman dan tersimpan.
            </span>
          </div>

          <button
            id="energy-depleted-retry-btn"
            onClick={() => {
              sounds.playClick();
              onRetry();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm tracking-wide shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PULIHKAN ENERGI & COBA LAGI</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
