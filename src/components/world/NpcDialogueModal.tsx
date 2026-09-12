import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, ChevronRight, CheckCircle, Sparkles, X } from 'lucide-react';
import { NPCData } from '../../types';
import { sounds } from '../../utils/audio';

interface NpcDialogueModalProps {
  isOpen: boolean;
  npc: NPCData | null;
  dialogueLines: string[] | Record<string, string[]> | any;
  onClose: () => void;
  onComplete?: () => void;
}

export const NpcDialogueModal: React.FC<NpcDialogueModalProps> = ({
  isOpen,
  npc,
  dialogueLines,
  onClose,
  onComplete,
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  // Normalize dialogueLines to always be string[]
  const lines: string[] = React.useMemo(() => {
    if (Array.isArray(dialogueLines)) {
      return dialogueLines.filter((l) => typeof l === 'string' && l.trim().length > 0);
    }
    if (dialogueLines && typeof dialogueLines === 'object') {
      // If object with initial/repeat/etc.
      if (Array.isArray(dialogueLines.initial)) return dialogueLines.initial;
      if (Array.isArray(dialogueLines.clueFound)) return dialogueLines.clueFound;
      if (Array.isArray(dialogueLines.puzzleSolved)) return dialogueLines.puzzleSolved;
      if (Array.isArray(dialogueLines.repeat)) return dialogueLines.repeat;
      const values = Object.values(dialogueLines);
      for (const val of values) {
        if (Array.isArray(val) && val.length > 0) return val;
      }
    }
    if (typeof dialogueLines === 'string') {
      return [dialogueLines];
    }
    return ['Halo, mari kita selesaikan tantangan logika ini bersama!'];
  }, [dialogueLines]);

  useEffect(() => {
    if (isOpen) {
      setCurrentLineIndex(0);
      sounds.playNpcDialogue();
    }
  }, [isOpen, npc]);

  if (!isOpen || !npc || lines.length === 0) return null;

  const currentLine = lines[currentLineIndex] || lines[0];
  const isLastLine = currentLineIndex >= lines.length - 1;

  const handleNext = () => {
    sounds.playClick();
    if (isLastLine) {
      if (onComplete) onComplete();
      onClose();
    } else {
      sounds.playNpcDialogue();
      setCurrentLineIndex((prev) => prev + 1);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.96 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-slate-900/95 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-cyan-950/40 text-slate-100 overflow-hidden"
        >
          {/* Subtle ambient light */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={() => {
              sounds.playClick();
              if (onComplete) onComplete();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Tutup dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header with NPC Badge */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${npc.badgeColor} p-0.5 shadow-lg shadow-cyan-500/20 shrink-0 flex items-center justify-center`}>
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-3xl">
                {npc.avatarIcon}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white tracking-wide">
                  {npc.name}
                </h3>
                <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {npc.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                {npc.personality}
              </p>
            </div>
          </div>

          {/* Dialogue Box Text Area */}
          <div className="relative min-h-[90px] sm:min-h-[105px] p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center">
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-medium">
              "{currentLine}"
            </p>
          </div>

          {/* Footer Controls */}
          <div className="mt-5 flex items-center justify-between">
            {/* Sentence progression dots */}
            <div className="flex items-center gap-1.5">
              {lines.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentLineIndex
                      ? 'w-6 bg-cyan-400'
                      : idx < currentLineIndex
                      ? 'w-2 bg-slate-600'
                      : 'w-2 bg-slate-800'
                  }`}
                />
              ))}
              <span className="text-xs text-slate-500 ml-2 font-mono">
                {currentLineIndex + 1}/{lines.length}
              </span>
            </div>

            {/* Next / Finish Button */}
            <button
              onClick={handleNext}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg transition-all active:scale-95 ${
                isLastLine
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 shadow-cyan-500/25'
              }`}
            >
              {isLastLine ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Selesai Bicara</span>
                </>
              ) : (
                <>
                  <span>Lanjut</span>
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
