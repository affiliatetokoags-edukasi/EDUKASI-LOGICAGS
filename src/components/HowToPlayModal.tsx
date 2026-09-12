import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, CheckCircle2, X } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    { num: 1, title: 'Nama Petualang & Misi', desc: 'Isi nama petualangmu untuk memulai misi penyelamatan di Logic School.' },
    { num: 2, title: 'Eksplorasi Ruangan & Petunjuk', desc: 'Periksa objek ruangan (komputer, catatan, brankas) untuk mengumpulkan petunjuk sebelum memecahkan teka-teki.' },
    { num: 3, title: '7 Ragam Tantangan Logika', desc: 'Hadapi Pola Kunci, Keputusan Siber, Urutan Algoritma, Path Finder (labirin), Pasangan Memori, dan Debugging baris kode.' },
    { num: 4, title: 'Sistem Energi (❤️ Heart)', desc: 'Setiap kesalahan mengurangi 1 Heart. Jika habis, gunakan Extra Heart dari inventory atau pulihkan energi tanpa kehilangan progress level.' },
    { num: 5, title: 'Sistem 3-Tier Petunjuk (Hint)', desc: 'Gunakan Hint 1, 2, atau 3 jika membutuhkan arahan berpikir bertahap, atau gunakan Hint Boost tanpa penalti XP.' },
    { num: 6, title: 'Combo & Koin Hadiah', desc: 'Jawab benar berturut-turut untuk memicu bonus COMBO x2, x3 dan kumpulkan koin reward.' },
    { num: 7, title: 'Tembus Gerbang Akhir (Final Gate)', desc: 'Selesaikan 4 fase pamungkas di Gerbang Akhir untuk memulihkan sekolah dan keluar sebagai Pahlawan Logika!' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          id="how-to-play-modal"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-slate-900 border border-cyan-500/30 w-full max-w-lg rounded-2xl p-6 shadow-2xl shadow-cyan-950/40 text-slate-100 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">CARA BERMAIN</h2>
                <p className="text-xs text-slate-400">Panduan petualangan di AGS-Logic Escape</p>
              </div>
            </div>
            <button
              id="close-how-to-play-btn"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Steps List */}
          <div className="overflow-y-auto space-y-3 pr-1 flex-1 py-1">
            {steps.map((step) => (
              <div
                key={step.num}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-cyan-500/30 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-sm flex items-center justify-center shrink-0 border border-cyan-500/30 mt-0.5">
                  {step.num}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Action */}
          <div className="pt-4 mt-4 border-t border-slate-800 flex justify-end">
            <button
              id="confirm-how-to-play-btn"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold shadow-lg shadow-cyan-600/20 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              KEMBALI
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
