import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  KeyRound,
  Mail,
  Cloud,
  Laptop,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useTeacherAuth } from '../../context/TeacherAuthContext';
import { getTeacherLockoutState } from '../../utils/teacherAuth';
import { sounds } from '../../utils/audio';

interface TeacherLoginScreenProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialDataMode?: 'ONLINE' | 'LOCAL_DEMO';
}

export const TeacherLoginScreen: React.FC<TeacherLoginScreenProps> = ({
  onSuccess,
  onCancel,
  initialDataMode = 'ONLINE',
}) => {
  const { loginOnline, loginLocalDemo, isLoading, authError, deniedReason, clearAuthError } =
    useTeacherAuth();

  // Mode tab: 'online' (Firebase Auth) atau 'local_demo' (Legacy password V0.6.1)
  const [authMethod, setAuthMethod] = useState<'online' | 'local_demo'>(
    initialDataMode === 'LOCAL_DEMO' ? 'local_demo' : 'online'
  );

  // Form states untuk Online Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form state untuk Local Demo Password
  const [demoPassword, setDemoPassword] = useState('');
  const [showDemoPassword, setShowDemoPassword] = useState(false);

  // Local validation and lockout states
  const [localErrorMessage, setLocalErrorMessage] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const demoInputRef = useRef<HTMLInputElement>(null);

  // Monitor lockout timer untuk local demo
  useEffect(() => {
    const checkLockout = () => {
      const state = getTeacherLockoutState();
      setIsLocked(state.isLocked);
      setRemainingSeconds(state.remainingSeconds);
      if (state.isLocked) {
        setLocalErrorMessage(
          `🔒 Terlalu banyak percobaan. Coba lagi dalam ${state.remainingSeconds} detik.`
        );
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  // Autofocus input saat mode berganti
  useEffect(() => {
    clearAuthError();
    setLocalErrorMessage(null);
    if (authMethod === 'online') {
      emailInputRef.current?.focus();
    } else {
      demoInputRef.current?.focus();
    }
  }, [authMethod, clearAuthError]);

  // Handle Online Firebase Login
  const handleOnlineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalErrorMessage(null);
    clearAuthError();

    if (!email.trim()) {
      sounds.playWrong();
      setLocalErrorMessage('Silakan masukkan email guru.');
      emailInputRef.current?.focus();
      return;
    }

    if (!password) {
      sounds.playWrong();
      setLocalErrorMessage('Silakan masukkan password guru.');
      return;
    }

    try {
      await loginOnline(email.trim(), password);
      sounds.playCorrect();
      onSuccess();
    } catch (err: any) {
      sounds.playWrong();
      // Pesan error ramah telah ditangani di TeacherAuthContext
    }
  };

  // Handle Local Demo Password Login (V0.6.1)
  const handleLocalDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked || isLoading) return;
    setLocalErrorMessage(null);
    clearAuthError();

    if (!demoPassword.trim()) {
      sounds.playWrong();
      setLocalErrorMessage('Silakan masukkan password mode demo.');
      demoInputRef.current?.focus();
      return;
    }

    const result = loginLocalDemo(demoPassword);
    if (result.success) {
      sounds.playUnlock();
      onSuccess();
    } else {
      sounds.playWrong();
      setDemoPassword('');
      if (result.isLocked) {
        setIsLocked(true);
        setRemainingSeconds(result.remainingSeconds || 30);
        setLocalErrorMessage(
          `🔒 Terlalu banyak percobaan. Coba lagi dalam ${result.remainingSeconds || 30} detik.`
        );
      } else {
        setLocalErrorMessage(result.error || 'Password demo salah. Silakan coba lagi.');
        demoInputRef.current?.focus();
      }
    }
  };

  const activeError = localErrorMessage || authError || deniedReason;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-md bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-950 relative z-10"
      >
        {/* Header Badge */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white">
              <Lock className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-950 border border-slate-700 text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                LOGIN GURU
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[10px] font-extrabold text-indigo-300">
                V0.7.3
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              Area khusus guru & pemantauan asesmen informatika
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs (Online Firebase vs Local Demo) */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 mb-6">
          <button
            type="button"
            id="tab-teacher-online"
            onClick={() => {
              sounds.playClick();
              setAuthMethod('online');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authMethod === 'online'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Firebase Online</span>
          </button>

          <button
            type="button"
            id="tab-teacher-local-demo"
            onClick={() => {
              sounds.playClick();
              setAuthMethod('local_demo');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authMethod === 'local_demo'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Mode Demo Lokal</span>
          </button>
        </div>

        {/* ONLINE FIREBASE AUTHENTICATION (UTAMA V0.7.3) */}
        {authMethod === 'online' && (
          <form onSubmit={handleOnlineSubmit} className="space-y-4">
            <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-2xl p-3 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300 leading-relaxed">
                Masuk menggunakan akun Firebase Authentication guru. Hak akses role{' '}
                <strong className="text-cyan-300">"teacher"</strong> akan diverifikasi di Firestore.
              </p>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="teacher-email-input"
                className="block text-xs font-bold text-slate-300 uppercase tracking-wider"
              >
                Email Guru
              </label>
              <div className="relative">
                <input
                  ref={emailInputRef}
                  id="teacher-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  placeholder="guru@sekolah.sch.id"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm font-semibold text-white placeholder-slate-500 transition-all focus:outline-none"
                  autoComplete="email"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="teacher-password-online-input"
                className="block text-xs font-bold text-slate-300 uppercase tracking-wider"
              >
                Password Guru
              </label>
              <div className="relative">
                <input
                  id="teacher-password-online-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Masukkan password..."
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm font-semibold text-white placeholder-slate-500 transition-all focus:outline-none"
                  autoComplete="current-password"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  id="toggle-teacher-online-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Inline Error Notice */}
            <AnimatePresence>
              {activeError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="p-3 rounded-xl text-xs font-semibold flex items-center gap-2 bg-rose-500/15 border border-rose-500/30 text-rose-300"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{activeError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                id="teacher-online-login-submit-btn"
                disabled={isLoading}
                className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  isLoading
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-indigo-600/30 active:scale-98'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
                    <span>MEMVERIFIKASI AKUN GURU...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 text-cyan-200" />
                    <span>MASUK KE DASHBOARD</span>
                  </>
                )}
              </button>

              <button
                type="button"
                id="teacher-online-cancel-btn"
                onClick={() => {
                  sounds.playClick();
                  onCancel();
                }}
                disabled={isLoading}
                className="w-full py-3 px-6 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-slate-400" />
                <span>KEMBALI KE GAME</span>
              </button>
            </div>
          </form>
        )}

        {/* LOCAL DEMO PASSWORD MODE (LEGACY V0.6.1) */}
        {authMethod === 'local_demo' && (
          <form onSubmit={handleLocalDemoSubmit} className="space-y-4">
            <div className="bg-amber-950/30 border border-amber-500/20 rounded-2xl p-3 flex items-start gap-2.5">
              <Laptop className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200 leading-relaxed">
                Mode Demo Lokal memungkinkan guru membuka dashboard saat offline menggunakan password
                keamanan lokal (<code className="text-amber-300 font-mono">LOGICGURU2026</code>).
              </p>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="teacher-demo-password-input"
                className="block text-xs font-bold text-slate-300 uppercase tracking-wider"
              >
                Password Demo Guru
              </label>
              <div className="relative">
                <input
                  ref={demoInputRef}
                  id="teacher-demo-password-input"
                  type={showDemoPassword ? 'text' : 'password'}
                  value={demoPassword}
                  onChange={(e) => setDemoPassword(e.target.value)}
                  disabled={isLocked || isLoading}
                  placeholder="Masukkan password demo lokal..."
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm font-semibold text-white placeholder-slate-500 transition-all focus:outline-none"
                  autoComplete="current-password"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  id="toggle-teacher-demo-password"
                  onClick={() => setShowDemoPassword(!showDemoPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showDemoPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Inline Error Notice */}
            <AnimatePresence>
              {activeError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    isLocked
                      ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                      : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{activeError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                id="teacher-demo-login-submit-btn"
                disabled={isLocked || isLoading}
                className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  isLocked
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-amber-600/30 active:scale-98'
                }`}
              >
                {isLocked ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>TERKUNCI ({remainingSeconds}s)</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 text-amber-200" />
                    <span>MASUK MODE DEMO LOKAL</span>
                  </>
                )}
              </button>

              <button
                type="button"
                id="teacher-demo-cancel-btn"
                onClick={() => {
                  sounds.playClick();
                  onCancel();
                }}
                className="w-full py-3 px-6 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-slate-400" />
                <span>KEMBALI KE GAME</span>
              </button>
            </div>
          </form>
        )}

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-slate-800/70 text-center">
          <p className="text-[11px] text-slate-400 font-medium">
            LOGIC ESCAPE V0.7.3 • Teacher Authentication & Role Security
          </p>
        </div>
      </motion.div>
    </div>
  );
};
