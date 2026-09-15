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
  Sparkles,
  School
} from 'lucide-react';
import { 
  verifyTeacherPassword, 
  getTeacherLockoutState 
} from '../../utils/teacherAuth';
import { sounds } from '../../utils/audio';

interface TeacherLoginScreenProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const TeacherLoginScreen: React.FC<TeacherLoginScreenProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Sync lockout countdown on mount and interval
  useEffect(() => {
    const checkLockout = () => {
      const state = getTeacherLockoutState();
      setIsLocked(state.isLocked);
      setRemainingSeconds(state.remainingSeconds);
      if (state.isLocked) {
        setErrorMessage(`🔒 Terlalu banyak percobaan. Coba lagi dalam ${state.remainingSeconds} detik.`);
      }
    };

    checkLockout();
    const interval = setInterval(() => {
      const state = getTeacherLockoutState();
      setIsLocked(state.isLocked);
      setRemainingSeconds(state.remainingSeconds);
      if (state.isLocked) {
        setErrorMessage(`🔒 Terlalu banyak percobaan. Coba lagi dalam ${state.remainingSeconds} detik.`);
      } else if (errorMessage && errorMessage.includes('Terlalu banyak percobaan')) {
        setErrorMessage('Silakan coba kembali.');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [errorMessage]);

  // Focus on password input when active and not locked
  useEffect(() => {
    if (!isLocked && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLocked]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked || isSubmitting) return;

    if (!password.trim()) {
      sounds.playWrong();
      setErrorMessage('❌ Silakan masukkan password guru.');
      inputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    const result = verifyTeacherPassword(password);

    if (result.success) {
      sounds.playUnlock();
      setErrorMessage(null);
      onSuccess();
    } else {
      sounds.playWrong();
      setPassword('');
      setIsSubmitting(false);

      if (result.isLocked) {
        setIsLocked(true);
        setRemainingSeconds(result.remainingSeconds || 30);
        setErrorMessage(`🔒 Terlalu banyak percobaan. Coba lagi dalam ${result.remainingSeconds || 30} detik.`);
      } else {
        setErrorMessage(result.error || '❌ Password salah. Silakan coba lagi.');
        setTimeout(() => {
          inputRef.current?.focus();
        }, 50);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-indigo-500 selection:text-white font-sans">
      {/* Subtle Background Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-950/80 relative z-10"
      >
        {/* Top Header Badge & Brand */}
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
                TEACHER ACCESS
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[10px] font-extrabold text-indigo-300">
                TERBATAS
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              Area khusus guru & pemantauan asesmen
            </p>
          </div>
        </div>

        {/* Security Notice Banner */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 mb-6 flex items-start gap-3">
          <KeyRound className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed">
            Area ini dilindungi untuk menjaga keamanan data pembelajaran, rekap nilai, dan analitik siswa.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label 
              htmlFor="teacher-password-input" 
              className="block text-xs font-bold text-slate-300 uppercase tracking-wider"
            >
              Password Guru
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                id="teacher-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage && !isLocked) setErrorMessage(null);
                }}
                disabled={isLocked || isSubmitting}
                placeholder="Masukkan password..."
                className={`w-full px-4 py-3.5 rounded-xl bg-slate-950 border text-sm font-semibold text-white placeholder-slate-500 transition-all focus:outline-none ${
                  errorMessage
                    ? 'border-rose-500/80 focus:border-rose-500 shadow-sm shadow-rose-500/20'
                    : 'border-slate-700/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                } ${isLocked ? 'opacity-50 cursor-not-allowed bg-slate-950/50' : ''}`}
                autoComplete="current-password"
              />
              <button
                type="button"
                id="toggle-password-visibility-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                disabled={isLocked}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Inline Error & Lockout Message */}
          <AnimatePresence>
            {errorMessage && (
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
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              id="teacher-login-submit-btn"
              disabled={isLocked || isSubmitting}
              className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                isLocked || isSubmitting
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-indigo-600/30 active:scale-98'
              }`}
            >
              {isLocked ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>TERKUNCI ({remainingSeconds}s)</span>
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
              id="teacher-login-cancel-btn"
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

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-slate-800/70 text-center">
          <p className="text-[11px] text-slate-400 font-medium">
            LOGIC ESCAPE V0.6 • Educational Informatics Assessment
          </p>
        </div>
      </motion.div>
    </div>
  );
};
