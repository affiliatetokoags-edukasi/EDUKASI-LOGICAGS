/**
 * Teacher Route Guard (V0.7.3)
 * Melindungi akses Teacher Dashboard dengan validasi ketat:
 * - Memverifikasi sesi Firebase Authentication
 * - Memverifikasi role di Firestore users/{uid} === 'teacher'
 * - Memeriksa isActive !== false
 * - Fallback aman ke Mode Demo Lokal (Password Legacy V0.6.1)
 * - Menolak akses akun siswa dengan tampilan 'AKSES DITOLAK'
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, ArrowLeft, Loader2, LogOut, Lock, UserX } from 'lucide-react';
import { useTeacherAuth } from '../../context/TeacherAuthContext';
import { TeacherLoginScreen } from './TeacherLoginScreen';
import { TeacherDashboardScreen } from './TeacherDashboardScreen';
import { sounds } from '../../utils/audio';

interface TeacherRouteGuardProps {
  onBackToHome: () => void;
  dataMode?: 'ONLINE' | 'LOCAL_DEMO';
  onOpenSystemStatus?: () => void;
}

export const TeacherRouteGuard: React.FC<TeacherRouteGuardProps> = ({
  onBackToHome,
  dataMode = 'LOCAL_DEMO',
  onOpenSystemStatus,
}) => {
  const {
    firebaseUser,
    teacherProfile,
    isAuthenticated,
    isOnlineTeacher,
    isLocalDemoTeacher,
    isLoading,
    verificationStatus,
    deniedReason,
    logoutTeacher,
  } = useTeacherAuth();

  // 1. Loading State
  if (isLoading || verificationStatus === 'VERIFYING_AUTH' || verificationStatus === 'VERIFYING_ROLE') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {verificationStatus === 'VERIFYING_ROLE' ? 'Memverifikasi Hak Akses...' : 'Memverifikasi Akun Guru...'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {verificationStatus === 'VERIFYING_ROLE'
                ? 'Memeriksa otorisasi role di Firestore users/{uid}'
                : 'Menghubungkan ke Firebase Authentication'}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. Akun Ditolak (Role bukan 'teacher', misal siswa mencoba masuk ke portal guru)
  if (verificationStatus === 'DENIED' && firebaseUser && !isLocalDemoTeacher) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/90 border border-rose-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-rose-950/40 flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-extrabold text-white tracking-wide">
            🔒 AKSES DITOLAK
          </h2>
          <p className="text-xs sm:text-sm text-rose-300 font-semibold mt-2">
            Halaman ini hanya dapat diakses oleh akun guru.
          </p>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 my-5 w-full text-left space-y-1.5">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Identitas Login Terdeteksi:
            </div>
            <div className="text-xs text-slate-200 font-mono break-all">
              {firebaseUser.email || 'Pengguna Tanpa Email'}
            </div>
            <div className="text-xs text-amber-400 font-medium">
              {deniedReason || 'Role akun Anda bukan "teacher". Akses ke Teacher Dashboard diblokir demi keamanan data.'}
            </div>
          </div>

          <div className="w-full space-y-2">
            <button
              id="guard-back-to-game-btn"
              onClick={() => {
                sounds.playClick();
                onBackToHome();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>KEMBALI KE GAME</span>
            </button>

            <button
              id="guard-switch-teacher-account-btn"
              onClick={async () => {
                sounds.playClick();
                await logoutTeacher();
              }}
              className="w-full py-3 px-6 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>GANTI KE AKUN GURU</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 3. Akun Guru Tidak Aktif (isActive === false)
  if (verificationStatus === 'INACTIVE') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/90 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4">
            <UserX className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-extrabold text-white">AKUN GURU TIDAK AKTIF</h2>
          <p className="text-xs sm:text-sm text-amber-300 mt-2 font-medium">
            Akun guru ini tidak aktif. Hubungi administrator sekolah untuk mengaktifkan kembali.
          </p>

          <div className="w-full mt-6 space-y-2">
            <button
              id="guard-inactive-back-btn"
              onClick={() => {
                sounds.playClick();
                onBackToHome();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>KEMBALI</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 4. Belum Terautentikasi -> Tampilkan Layar Login Guru
  if (!isAuthenticated) {
    return (
      <TeacherLoginScreen
        onSuccess={() => {
          // Callback setelah verifikasi sukses
        }}
        onCancel={onBackToHome}
        initialDataMode={dataMode}
      />
    );
  }

  // 5. Terautentikasi Penuh (Online Role Teacher ATAU Local Demo) -> Render Dashboard Guru
  return (
    <TeacherDashboardScreen
      onSwitchToStudentMode={onBackToHome}
      onLogoutTeacher={async () => {
        await logoutTeacher();
        onBackToHome();
      }}
      dataMode={isOnlineTeacher ? 'ONLINE' : 'LOCAL_DEMO'}
      onOpenSystemStatus={onOpenSystemStatus}
      teacherProfile={teacherProfile}
      isOnlineAccount={isOnlineTeacher}
    />
  );
};
