import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RewardChestData } from '../../types';
import { Sparkles, Gift, Check, ArrowRight, PackageOpen } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface RewardChestModalProps {
  isOpen: boolean;
  chest: RewardChestData | null;
  onClaim: (chest: RewardChestData) => void;
  onClose: () => void;
}

export const RewardChestModal: React.FC<RewardChestModalProps> = ({
  isOpen,
  chest,
  onClaim,
  onClose,
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  if (!isOpen || !chest) return null;

  const handleOpenChest = () => {
    setIsOpening(true);
    sounds.playChestOpen();

    setTimeout(() => {
      setIsOpening(false);
      setIsOpened(true);
    }, 700);
  };

  const handleClaim = () => {
    sounds.playCoin();
    onClaim(chest);
    setIsOpened(false);
    setIsOpening(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-sm sm:max-w-md bg-slate-900 border border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-20 -left-20 w-56 h-56 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Gift className="w-3.5 h-3.5" />
              PETI HADIAH SPESIAL
            </span>
          </div>

          <h3 className="text-xl font-black text-white mb-1">
            {chest.title}
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Sumber: {chest.source}
          </p>

          {/* Chest Visual */}
          <div className="my-6 relative flex items-center justify-center">
            {!isOpened ? (
              <motion.div
                animate={isOpening ? { rotate: [-5, 5, -8, 8, -4, 4, 0], scale: [1, 1.1, 1.2, 1.15] } : { y: [0, -6, 0] }}
                transition={isOpening ? { duration: 0.7 } : { repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                onClick={!isOpening ? handleOpenChest : undefined}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-transparent border-2 border-amber-500/60 flex items-center justify-center text-6xl shadow-xl shadow-amber-500/20 cursor-pointer hover:border-amber-400 transition-all select-none"
              >
                {chest.icon || '🎁'}
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 14 }}
                className="space-y-4 w-full"
              >
                <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 border-2 border-emerald-400/70 flex items-center justify-center text-5xl shadow-xl shadow-emerald-500/20">
                  <PackageOpen className="w-12 h-12 text-emerald-400" />
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2 text-left">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-2">
                    Isi Peti Hadiah
                  </p>
                  <div className="flex items-center justify-between py-1 border-b border-slate-700/60 text-sm">
                    <span className="text-slate-300">Pengalaman (XP)</span>
                    <span className="font-bold text-cyan-400">+{chest.reward.xp} XP</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-700/60 text-sm">
                    <span className="text-slate-300">Koin Logika</span>
                    <span className="font-bold text-amber-400">+{chest.reward.coins} Coins</span>
                  </div>
                  {chest.reward.powerUpName && (
                    <div className="flex items-center justify-between py-1 border-b border-slate-700/60 text-sm">
                      <span className="text-slate-300">Power-Up Spesial</span>
                      <span className="font-bold text-purple-400">{chest.reward.powerUpName}</span>
                    </div>
                  )}
                  {chest.reward.collectibleId && (
                    <div className="flex items-center justify-between py-1 text-sm">
                      <span className="text-slate-300">Collectible Item</span>
                      <span className="font-bold text-emerald-400">📜 Lost Note</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-4">
            {!isOpened ? (
              <button
                id="chest-open-btn"
                onClick={handleOpenChest}
                disabled={isOpening}
                className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isOpening ? 'MEMBUKA PETI...' : 'BUKA PETI SEKARANG'}</span>
              </button>
            ) : (
              <button
                id="chest-claim-btn"
                onClick={handleClaim}
                className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>KLAIM REWARD PETI</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
