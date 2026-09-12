import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserCheck, Sparkles, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { sounds } from '../utils/audio';

interface PlayerSetupProps {
  initialName?: string;
  onConfirmName: (name: string) => void;
  onBackToHome: () => void;
}

export const PlayerSetup: React.FC<PlayerSetupProps> = ({
  initialName = '',
  onConfirmName,
  onBackToHome,
}) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      sounds.playWrong();
      setError('Nama tidak boleh kosong.');
      return;
    }

    if (trimmed.length < 2) {
      sounds.playWrong();
      setError('Nama minimal harus 2 karakter.');
      return;
    }

    sounds.playClick();
    setError(null);
    onConfirmName(trimmed);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 relative"
      >
        {/* Back Button */}
        <button
          id="player-setup-back-btn"
          onClick={() => {
            sounds.playClick();
            onBackToHome();
          }}
          className="absolute top-6 left-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Kembali ke Home"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Icon & Heading */}
        <div className="text-center pt-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600/30 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto mb-4 shadow-lg shadow-cyan-600/20">
            <UserCheck className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            IDENTITAS SISWA
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            SIAPA NAMA PETUALANG?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Catat namamu pada kartu akses siswa Logic School sebelum gerbang ditutup.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="player-name-input" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Nama Lengkap / Panggilan:
            </label>
            <div className="relative">
              <input
                id="player-name-input"
                type="text"
                autoFocus
                maxLength={25}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Contoh: Andi, Rina, Budi..."
                className={`w-full px-4 py-3.5 rounded-2xl bg-slate-800/90 border text-white placeholder-slate-500 font-medium text-base focus:outline-none focus:ring-2 transition-all ${
                  error
                    ? 'border-rose-500 focus:ring-rose-500/40'
                    : 'border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/40'
                }`}
              />
              <Sparkles className="w-4 h-4 text-cyan-400/60 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-rose-400 text-xs mt-2 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="submit"
              id="confirm-player-name-btn"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-98 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-cyan-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>MULAI PETUALANGAN</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
