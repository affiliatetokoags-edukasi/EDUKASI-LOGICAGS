import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, Monitor, Lock, Package, Map, Search } from 'lucide-react';
import { InteractiveObject } from '../types';
import { sounds } from '../utils/audio';

interface InteractiveObjectModalProps {
  object: InteractiveObject | null;
  onClose: () => void;
}

export const InteractiveObjectModal: React.FC<InteractiveObjectModalProps> = ({
  object,
  onClose,
}) => {
  if (!object) return null;

  const renderIcon = () => {
    switch (object.icon) {
      case 'note':
        return <FileText className="w-6 h-6 text-amber-400" />;
      case 'computer':
        return <Monitor className="w-6 h-6 text-cyan-400" />;
      case 'lock':
        return <Lock className="w-6 h-6 text-rose-400" />;
      case 'box':
        return <Package className="w-6 h-6 text-emerald-400" />;
      case 'map':
        return <Map className="w-6 h-6 text-blue-400" />;
      case 'clue':
        return <Search className="w-6 h-6 text-purple-400" />;
      default:
        return <Search className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl"
        >
          {/* Close button */}
          <button
            id="object-modal-close-btn"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header with Icon */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
              {renderIcon()}
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                OBJEK INTERAKTIF
              </span>
              <h3 className="text-lg font-bold text-white leading-snug">
                {object.title}
              </h3>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <p className="text-sm text-slate-300 leading-relaxed">
              {object.description}
            </p>

            {/* Found Clue Callout if available */}
            {object.foundClue && (
              <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs sm:text-sm font-medium shadow-inner">
                {object.foundClue}
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="mt-6 flex justify-end">
            <button
              id="object-modal-continue-btn"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-cyan-600/30 transition-all cursor-pointer"
            >
              KEMBALI KE MISI
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
