import React from 'react';
import { 
  GraduationCap, 
  Gamepad2, 
  Users, 
  Bell, 
  LogOut,
  Lock,
  ChevronDown,
  Cloud,
  Laptop
} from 'lucide-react';
import { AVAILABLE_CLASSES } from '../../data/teacherData';

interface TeacherHeaderProps {
  selectedClass: string;
  onSelectClass: (className: string) => void;
  totalStudents: number;
  activeStudents: number;
  alertCount: number;
  onSwitchToStudentMode: () => void;
  onLogoutTeacher?: () => void;
  onOpenAlerts: () => void;
  dataMode?: 'ONLINE' | 'LOCAL_DEMO';
  onOpenSystemStatus?: () => void;
  teacherProfile?: { displayName?: string; email?: string; role?: string } | null;
  isOnlineAccount?: boolean;
}

export const TeacherHeader: React.FC<TeacherHeaderProps> = ({
  selectedClass,
  onSelectClass,
  totalStudents,
  activeStudents,
  alertCount,
  onSwitchToStudentMode,
  onLogoutTeacher,
  onOpenAlerts,
  dataMode = 'LOCAL_DEMO',
  onOpenSystemStatus,
  teacherProfile,
  isOnlineAccount = false,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-extrabold text-white tracking-wide">
              LOGIC ESCAPE
            </span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-[10px] font-bold text-indigo-300 tracking-wider flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>TEACHER MODE 🔒</span>
            </span>
            {isOnlineAccount && teacherProfile ? (
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-500/30 text-[10px] font-bold text-cyan-300 tracking-wider">
                👤 {teacherProfile.displayName || teacherProfile.email || 'Guru Terverifikasi'}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-[10px] font-bold text-amber-300 tracking-wider">
                💻 Sesi Demo Lokal
              </span>
            )}
            {onOpenSystemStatus && (
              <button
                id="teacher-system-status-btn"
                onClick={onOpenSystemStatus}
                title="Status Koneksi & Firebase System (Klik untuk Diagnostik)"
                className={`px-2 py-0.5 rounded-md border text-[10px] font-bold tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                  dataMode === 'ONLINE'
                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30'
                    : 'bg-amber-500/20 border-amber-500/30 text-amber-300 hover:bg-amber-500/30'
                }`}
              >
                {dataMode === 'ONLINE' ? (
                  <>
                    <Cloud className="w-3 h-3 text-emerald-400" />
                    <span>☁ ONLINE</span>
                  </>
                ) : (
                  <>
                    <Laptop className="w-3 h-3 text-amber-400" />
                    <span>💻 LOCAL DEMO</span>
                  </>
                )}
              </button>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Sistem Pemantauan & Asesmen Pembelajaran Informatika
          </p>
        </div>
      </div>


      {/* Center/Right Controls: Class Selector & Switcher */}
      <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
        {/* Class Selector Dropdown */}
        <div className="relative">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs font-semibold text-slate-200">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 hidden sm:inline">Kelas:</span>
            <select
              value={selectedClass}
              onChange={(e) => onSelectClass(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer pr-1"
            >
              <option value="ALL" className="bg-slate-900 text-white">Semua Kelas ({totalStudents} Siswa)</option>
              {AVAILABLE_CLASSES.map((cls) => (
                <option key={cls} value={cls} className="bg-slate-900 text-white">
                  Kelas {cls}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Attention Alerts Button */}
        <button
          onClick={onOpenAlerts}
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer"
          title="Perhatian & Siswa yang Membutuhkan Dukungan"
        >
          <Bell className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">PERHATIAN</span>
          {alertCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
              {alertCount}
            </span>
          )}
        </button>

        {/* Mode Switcher: Back to Student Mode */}
        <button
          onClick={onSwitchToStudentMode}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95"
          title="Kembali ke Mode Siswa / Petualangan Game"
        >
          <Gamepad2 className="w-4 h-4 text-cyan-400" />
          <span className="hidden md:inline">STUDENT MODE</span>
          <span className="md:hidden">GAME</span>
        </button>

        {/* Logout Guru Button */}
        {onLogoutTeacher && (
          <button
            id="teacher-header-logout-btn"
            onClick={onLogoutTeacher}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 hover:text-rose-100 text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95"
            title="Keluar dari sesi Teacher Mode"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>LOGOUT GURU</span>
          </button>
        )}
      </div>
    </header>
  );
};
