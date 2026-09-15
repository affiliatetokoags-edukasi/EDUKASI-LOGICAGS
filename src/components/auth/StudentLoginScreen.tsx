import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  Cpu,
  Gamepad2,
  ShieldCheck,
} from 'lucide-react';
import { useStudentAuth } from '../../context/StudentAuthContext';
import { sounds } from '../../utils/audio';

interface StudentLoginScreenProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
  onCancel: () => void;
}

export const StudentLoginScreen: React.FC<StudentLoginScreenProps> = ({
  onSuccess,
  onSwitchToRegister,
  onCancel,
}) => {
  const { login, isLoading, authError, clearAuthError } = useStudentAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    setLocalError(null);
    clearAuthError();

    if (!email.trim()) {
      setLocalError('Silakan masukkan alamat email.');
      return false;
    }

    if (!password) {
      setLocalError('Silakan masukkan password.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isLoading) return;

    sounds.playClick();

    try {
      await login(email, password);
      sounds.playCorrect();
      onSuccess();
    } catch (err: any) {
      sounds.playWrong();
      // Error handled and shown via authError
    }
  };

  const activeError = localError || authError;

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 overflow-x-hidden selection:bg-cyan-500 selection:text-white">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/40"
      >
        {/* Back / Local Demo Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onCancel();
          }}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda (Local Demo)</span>
        </button>

        {/* Header Badge & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 text-white mb-3">
            <LogIn className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-wide">LOGIN SISWA</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Masuk ke akun Logic Escape Anda untuk memuat profil dan progres dari Cloud
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[11px] font-bold text-cyan-300">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Role: Siswa (Student)</span>
          </div>
        </div>

        {/* Error Alert Box */}
        {activeError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{activeError}</div>
          </motion.div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (activeError) clearAuthError();
                }}
                disabled={isLoading}
                placeholder="nama@sekolah.sch.id"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (activeError) clearAuthError();
                }}
                disabled={isLoading}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="btn-submit-login"
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm shadow-lg shadow-cyan-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Cpu className="w-4 h-4 animate-spin text-white" />
                <span>Memverifikasi akun...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>MASUK</span>
              </>
            )}
          </button>
        </form>

        {/* Switch to Register Link */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Belum punya akun?{' '}
            <button
              id="link-to-student-register"
              type="button"
              onClick={() => {
                sounds.playClick();
                clearAuthError();
                onSwitchToRegister();
              }}
              className="text-cyan-400 hover:text-cyan-300 font-bold underline transition-colors cursor-pointer"
            >
              Daftar
            </button>
          </p>
        </div>

        {/* Local Demo Quick Option */}
        <div className="mt-4 text-center">
          <button
            id="btn-continue-local-demo"
            type="button"
            onClick={() => {
              sounds.playClick();
              onCancel();
            }}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors py-1 cursor-pointer"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Main tanpa akun (Local Demo Mode)</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
