import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  X,
  RefreshCw,
  Database,
  KeyRound,
  Cloud,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Server,
  Info
} from 'lucide-react';
import { FirebaseHealthReport, checkFirebaseConnection } from '../services/firebase';
import { sounds } from '../utils/audio';

interface SystemStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  healthReport: FirebaseHealthReport;
  onRefreshReport: (newReport: FirebaseHealthReport) => void;
}

export const SystemStatusModal: React.FC<SystemStatusModalProps> = ({
  isOpen,
  onClose,
  healthReport,
  onRefreshReport,
}) => {
  const [isChecking, setIsChecking] = useState(false);

  if (!isOpen) return null;

  const handleRecheck = async () => {
    sounds.playClick();
    setIsChecking(true);
    try {
      const report = await checkFirebaseConnection();
      onRefreshReport(report);
      if (report.status === 'CONNECTED') {
        sounds.playUnlock();
      } else {
        sounds.playWrong();
      }
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = (status: 'CONNECTED' | 'NOT_CONNECTED' | 'ERROR') => {
    switch (status) {
      case 'CONNECTED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'ERROR':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'NOT_CONNECTED':
      default:
        return <XCircle className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-slate-950 text-slate-100 relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/30">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-white tracking-wide flex items-center gap-2">
                  LOGIC ESCAPE SYSTEM
                </h2>
                <p className="text-xs text-slate-400">
                  Status koneksi dan kesiapan layanan Firebase
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="py-5 space-y-4 text-sm">
            {/* Main Status Badge */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Mode Operasi Data
                </p>
                <div className="flex items-center gap-2">
                  {healthReport.dataMode === 'ONLINE' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-extrabold text-xs">
                      <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                      ☁ ONLINE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-extrabold text-xs">
                      <Laptop className="w-3.5 h-3.5 text-amber-400" />
                      💻 LOCAL DEMO
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-mono">
                    (v0.7.1)
                  </span>
                </div>
              </div>

              <button
                onClick={handleRecheck}
                disabled={isChecking}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 disabled:opacity-50 text-white font-bold text-xs transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                <span>{isChecking ? 'Menguji...' : 'Uji Koneksi'}</span>
              </button>
            </div>

            {/* Diagnostic Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Firebase App */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-indigo-400" />
                    Firebase App
                  </span>
                  {getStatusIcon(healthReport.status)}
                </div>
                <p className="text-xs font-black text-white">
                  {healthReport.status === 'CONNECTED'
                    ? '🟢 Connected'
                    : healthReport.status === 'ERROR'
                    ? '🟡 Error'
                    : '🔴 Not Connected'}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Project: {healthReport.projectId}
                </p>
              </div>

              {/* Authentication */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                    Authentication
                  </span>
                  {healthReport.authReady ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                </div>
                <p className="text-xs font-black text-white">
                  {healthReport.authReady ? '🟢 Ready' : '🔴 Not Ready'}
                </p>
                <p className="text-[10px] text-slate-400">
                  Firebase Auth Web SDK
                </p>
              </div>

              {/* Cloud Firestore */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-amber-400" />
                    Cloud Firestore
                  </span>
                  {healthReport.firestoreReady ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                </div>
                <p className="text-xs font-black text-white">
                  {healthReport.firestoreReady ? '🟢 Ready' : '🔴 Not Ready'}
                </p>
                <p className="text-[10px] text-slate-400">
                  Modular Firestore SDK
                </p>
              </div>

              {/* Security & Local Mode */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Teacher RBAC
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xs font-black text-white">
                  🟢 V0.7.3 Role Guard
                </p>
                <p className="text-[10px] text-slate-400">
                  Firebase Auth + Rules
                </p>
              </div>
            </div>

            {/* Diagnostic Message Alert */}
            <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-start gap-3">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {healthReport.message}
                </p>
                {healthReport.detailedReason && (
                  <p className="text-[11px] text-slate-400 font-mono">
                    Detail: {healthReport.detailedReason}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400">
            <span>Project: <strong className="text-slate-300">agslogic</strong></span>
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
