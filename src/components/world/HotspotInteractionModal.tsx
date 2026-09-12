import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle, Key, FileText, Search, Lock, X, ArrowRight } from 'lucide-react';
import { RoomHotspot, ClueData } from '../../types';
import { sounds } from '../../utils/audio';

interface HotspotInteractionModalProps {
  isOpen: boolean;
  hotspot: RoomHotspot | null;
  clue?: ClueData | null;
  onClose: () => void;
  onAction?: () => void;
  isUnlocked?: boolean;
}

export const HotspotInteractionModal: React.FC<HotspotInteractionModalProps> = ({
  isOpen,
  hotspot,
  clue,
  onClose,
  onAction,
  isUnlocked = false,
}) => {
  if (!isOpen || !hotspot) return null;

  const handleActionButton = () => {
    sounds.playClick();
    if (onAction) onAction();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl shadow-cyan-950/50 text-slate-100 overflow-hidden"
        >
          {/* Ambient light glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon & Title */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-3xl shadow-inner shrink-0">
              {hotspot.icon}
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400">
                OBJEK INTERAKTIF
              </span>
              <h3 className="text-xl font-black text-white">{hotspot.title}</h3>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 mb-4">
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {hotspot.description}
            </p>
          </div>

          {/* Clue Panel (if hotspot reveals a clue) */}
          {clue && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 to-yellow-500/5 border border-amber-500/30 mb-4"
            >
              <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>PETUNJUK TERUNGKAP ({clue.code})</span>
              </div>
              <p className="text-amber-100 text-sm font-semibold mb-1">
                "{clue.content}"
              </p>
              <p className="text-amber-400/80 text-xs italic">
                💡 {clue.hintSnippet}
              </p>
            </motion.div>
          )}

          {/* If it requires item or is locked */}
          {hotspot.requiresItem && !isUnlocked && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-3 text-rose-300 text-xs sm:text-sm font-medium mb-4">
              <Lock className="w-5 h-5 shrink-0" />
              <span>Memerlukan <strong>{hotspot.requiresItem}</strong> untuk membuka akses ini.</span>
            </div>
          )}

          {/* Action button */}
          <div className="flex items-center justify-end gap-3 mt-5">
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-semibold transition-colors"
            >
              Tutup
            </button>

            {onAction && (
              <button
                onClick={handleActionButton}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
              >
                <span>{hotspot.actionText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
