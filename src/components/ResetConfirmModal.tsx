import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          id="reset-confirm-modal"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-slate-900 border border-rose-500/40 w-full max-w-md rounded-2xl p-6 shadow-2xl shadow-rose-950/40 text-slate-100 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">RESET PROGRESS GAME</h3>
              <p className="text-xs text-slate-400">Konfirmasi Penghapusan Data</p>
            </div>
          </div>

          {/* Body */}
          <p className="text-sm text-slate-300 leading-relaxed mb-6 bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
            Apakah kamu yakin ingin menghapus seluruh progress permainan? Skor, XP, dan status level akan dikembalikan ke awal.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              id="cancel-reset-btn"
              onClick={() => {
                sounds.playClick();
                onCancel();
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-all cursor-pointer"
            >
              BATAL
            </button>
            <button
              id="confirm-reset-btn"
              onClick={() => {
                sounds.playClick();
                onConfirm();
              }}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              RESET
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
