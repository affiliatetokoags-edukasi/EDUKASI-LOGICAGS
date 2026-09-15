import React from 'react';
import { motion } from 'motion/react';
import {
  Play,
  HelpCircle,
  Shield,
  Sparkles,
  Brain,
  Cpu,
  Compass,
  GraduationCap,
  School,
  Lock,
  Cloud,
  Laptop,
  User,
  LogIn,
  UserPlus,
  LogOut,
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface HomeScreenProps {
  onStartGame: () => void;
  onOpenHowToPlay: () => void;
  onOpenLearningHub?: () => void;
  onOpenTeacherDashboard?: () => void;
  hasSavedProgress?: boolean;
  playerName?: string;
  currentLevel?: number;
  dataMode?: 'ONLINE' | 'LOCAL_DEMO';
  onOpenSystemStatus?: () => void;
  isOnlineAccount?: boolean;
  studentProfile?: { displayName: string; email: string; level: number; classId?: string | null } | null;
  onOpenStudentLogin?: () => void;
  onOpenStudentRegister?: () => void;
  onOpenStudentProfile?: () => void;
  onLogout?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartGame,
  onOpenHowToPlay,
  onOpenLearningHub,
  onOpenTeacherDashboard,
  hasSavedProgress,
  playerName,
  currentLevel,
  dataMode = 'LOCAL_DEMO',
  onOpenSystemStatus,
  isOnlineAccount,
  studentProfile,
  onOpenStudentLogin,
  onOpenStudentRegister,
  onOpenStudentProfile,
  onLogout,
}) => {
  const activeStudentName = studentProfile?.displayName || playerName;
  const activeStudentLevel = studentProfile?.level || currentLevel || 1;

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-xl text-center flex flex-col items-center"
      >
        {/* Top Header Mode Indicator & Student Account Status */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
          {onOpenSystemStatus && (
            <button
              id="home-system-status-btn"
              onClick={() => {
                sounds.playClick();
                onOpenSystemStatus();
              }}
              title="Status Sistem & Koneksi Firebase (Klik untuk Diagnostik)"
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black transition-all cursor-pointer shadow-md ${
                dataMode === 'ONLINE'
                  ? 'bg-emerald-950/80 hover:bg-emerald-900 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/80 hover:bg-amber-900 border-amber-500/40 text-amber-300'
              }`}
            >
              {dataMode === 'ONLINE' ? (
                <>
                  <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                  <span>☁ ONLINE</span>
                </>
              ) : (
                <>
                  <Laptop className="w-3.5 h-3.5 text-amber-400" />
                  <span>💻 LOCAL DEMO</span>
                </>
              )}
            </button>
          )}

          {/* Student Auth Pill */}
          {isOnlineAccount && studentProfile ? (
            <button
              id="home-student-profile-pill"
              onClick={() => {
                sounds.playClick();
                if (onOpenStudentProfile) onOpenStudentProfile();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 hover:bg-cyan-900/90 border border-cyan-500/40 text-xs font-bold text-cyan-300 transition-all cursor-pointer shadow-md"
              title="Buka Profil Siswa"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>👤 {activeStudentName} (Lvl {activeStudentLevel})</span>
            </button>
          ) : (
            onOpenStudentLogin && (
              <button
                id="home-login-prompt-btn"
                onClick={() => {
                  sounds.playClick();
                  onOpenStudentLogin();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
                title="Masuk atau Daftar Akun Siswa"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>Masuk / Daftar Siswa</span>
              </button>
            )
          )}
        </div>

        {/* Badge & Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold tracking-wider uppercase mb-6 shadow-lg shadow-cyan-950/50"
        >
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span>Logic School • World 1</span>
        </motion.div>

        {/* Game Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="space-y-2 mb-4"
        >
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-sm font-sans">
            LOGIC <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">ESCAPE</span>
          </h1>
          <p className="text-lg sm:text-xl font-bold text-cyan-300/90 tracking-wide">
            Misi Menaklukkan Dunia Logika
          </p>
        </motion.div>

        {/* Short Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-slate-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-8"
        >
          Gunakan logika, pecahkan tantangan, dan buka jalan menuju kebebasan.
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="grid grid-cols-3 gap-2.5 w-full max-w-md mb-8"
        >
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300">
            <Brain className="w-5 h-5 text-cyan-400 mb-1" />
            <span className="text-xs font-semibold">5 Level Logika</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300">
            <Cpu className="w-5 h-5 text-blue-400 mb-1" />
            <span className="text-xs font-semibold">Teka-teki Seru</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300">
            <Sparkles className="w-5 h-5 text-emerald-400 mb-1" />
            <span className="text-xs font-semibold">Sistem XP & Skor</span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="w-full max-w-xs space-y-3"
        >
          <button
            id="home-start-game-btn"
            onClick={() => {
              sounds.playClick();
              onStartGame();
            }}
            className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 active:scale-98 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-cyan-600/30 transition-all cursor-pointer flex items-center justify-center gap-3 group border border-cyan-400/30"
          >
            <Play className="w-5 h-5 fill-current text-white group-hover:translate-x-0.5 transition-transform" />
            <span>
              {isOnlineAccount
                ? `LANJUTKAN MISI (${activeStudentName})`
                : hasSavedProgress && playerName
                ? 'LANJUTKAN MISI'
                : 'MULAI GAME'}
            </span>
          </button>

          {/* Student Auth Quick Buttons */}
          {!isOnlineAccount && onOpenStudentLogin && (
            <div className="grid grid-cols-2 gap-2">
              <button
                id="home-btn-login-student"
                onClick={() => {
                  sounds.playClick();
                  onOpenStudentLogin();
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>MASUK SISWA</span>
              </button>

              <button
                id="home-btn-register-student"
                onClick={() => {
                  sounds.playClick();
                  if (onOpenStudentRegister) onOpenStudentRegister();
                }}
                className="py-2.5 px-3 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/50 text-cyan-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
                <span>DAFTAR SISWA</span>
              </button>
            </div>
          )}

          {isOnlineAccount && onOpenStudentProfile && (
            <button
              id="home-btn-open-student-profile"
              onClick={() => {
                sounds.playClick();
                onOpenStudentProfile();
              }}
              className="w-full py-3 px-4 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <User className="w-4 h-4 text-cyan-400" />
              <span>PROFIL AKUN SISWA (FIRESTORE)</span>
            </button>
          )}

          {onOpenLearningHub && (
            <button
              id="home-learning-hub-btn"
              onClick={() => {
                sounds.playClick();
                onOpenLearningHub();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-cyan-950/70 hover:bg-cyan-900/80 active:scale-98 text-cyan-300 hover:text-cyan-100 font-extrabold text-sm border border-cyan-500/40 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span>LEARNING HUB INFORMATIKA</span>
            </button>
          )}

          {onOpenTeacherDashboard && (
            <button
              id="home-teacher-dashboard-btn"
              onClick={() => {
                sounds.playClick();
                onOpenTeacherDashboard();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-indigo-950/70 hover:bg-indigo-900/80 active:scale-98 text-indigo-300 hover:text-indigo-100 font-extrabold text-sm border border-indigo-500/40 shadow-md transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 group"
            >
              <div className="flex items-center justify-center gap-2">
                <Lock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>TEACHER MODE 🔒</span>
              </div>
              <span className="text-[10px] text-indigo-400/80 font-medium">
                {dataMode === 'ONLINE' ? 'Portal Guru (Firebase Auth)' : 'Akses Demo Lokal (Password)'}
              </span>
            </button>
          )}

          <button
            id="home-how-to-play-btn"
            onClick={() => {
              sounds.playClick();
              onOpenHowToPlay();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 active:scale-98 text-slate-200 hover:text-white font-bold text-sm border border-slate-700/80 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>CARA BERMAIN</span>
          </button>
        </motion.div>

        {/* Saved Player / Account Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-xs text-slate-400 bg-slate-900/40 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2"
        >
          {isOnlineAccount ? (
            <>
              <Cloud className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                Akun Online:{' '}
                <strong className="text-cyan-300">{activeStudentName}</strong> (Level{' '}
                {activeStudentLevel})
              </span>
            </>
          ) : (
            <>
              <Laptop className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Mode Lokal:{' '}
                <strong className="text-amber-300">
                  {playerName || 'Petualang Tamu'}
                </strong>{' '}
                (Level {currentLevel || 1})
              </span>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

