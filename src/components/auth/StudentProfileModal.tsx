import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Mail,
  Shield,
  GraduationCap,
  Cloud,
  LogOut,
  Trophy,
  Zap,
  Star,
  Award,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { useStudentAuth } from '../../context/StudentAuthContext';
import { PlayerStats } from '../../types';
import { sounds } from '../../utils/audio';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  onLogoutSuccess?: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  stats,
  onLogoutSuccess,
}) => {
  const { user, profile, logout, isOnlineAccount } = useStudentAuth();

  if (!isOpen) return null;

  const handleLogout = async () => {
    sounds.playClick();
    await logout();
    onClose();
    if (onLogoutSuccess) {
      onLogoutSuccess();
    }
  };

  const displayName = profile?.displayName || user?.displayName || stats.playerName || 'Siswa Logic Escape';
  const email = profile?.email || user?.email || 'Belum terhubung ke email';
  const roleDisplay = 'Siswa (Student)';
  const classDisplay = profile?.classId || 'Kelas belum dipilih';
  const levelDisplay = profile?.level || stats.currentLevel || 1;
  const xpDisplay = stats.xp ?? profile?.xp ?? 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-cyan-950/40 text-slate-100 overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-cyan-500/25 border-2 border-cyan-400/40">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px] text-white">
                ✓
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-white truncate">{displayName}</h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 shrink-0">
                  <Cloud className="w-3 h-3 text-cyan-400" />
                  {isOnlineAccount ? 'ONLINE ACCOUNT' : 'LOCAL DEMO'}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">{email}</p>
            </div>
          </div>

          {/* Academic & Account Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>Peran Akun</span>
              </div>
              <div className="text-sm font-bold text-white">{roleDisplay}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                <span>Kelas</span>
              </div>
              <div className="text-sm font-bold text-white">{classDisplay}</div>
            </div>
          </div>

          {/* Game Stats Snapshot (V0.1 - V0.6 Continuity) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900/90 border border-slate-800 mb-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Progres Game Siswa</span>
              <span className="text-[10px] text-cyan-400 font-normal">Tersinkronisasi</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400 flex items-center justify-center gap-1 mb-1">
                  <Star className="w-3 h-3 text-amber-400" />
                  <span>Level</span>
                </div>
                <div className="text-base font-black text-white">{levelDisplay}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400 flex items-center justify-center gap-1 mb-1">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  <span>XP</span>
                </div>
                <div className="text-base font-black text-cyan-300">{xpDisplay}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400 flex items-center justify-center gap-1 mb-1">
                  <Trophy className="w-3 h-3 text-yellow-400" />
                  <span>Skor</span>
                </div>
                <div className="text-base font-black text-yellow-300">{stats.score}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400 flex items-center justify-center gap-1 mb-1">
                  <Award className="w-3 h-3 text-purple-400" />
                  <span>Selesai</span>
                </div>
                <div className="text-base font-black text-purple-300">
                  {stats.completedLevels.length} Lvl
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              id="btn-student-logout"
              onClick={handleLogout}
              className="flex-1 py-3 px-4 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 border border-rose-700/50 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>LOGOUT SISWA</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all cursor-pointer"
            >
              TUTUP
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
