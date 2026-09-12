import React from 'react';
import { 
  GraduationCap, 
  Gamepad2, 
  Users, 
  Bell, 
  SlidersHorizontal,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { AVAILABLE_CLASSES } from '../../data/teacherData';

interface TeacherHeaderProps {
  selectedClass: string;
  onSelectClass: (className: string) => void;
  totalStudents: number;
  activeStudents: number;
  alertCount: number;
  onSwitchToStudentMode: () => void;
  onOpenAlerts: () => void;
}

export const TeacherHeader: React.FC<TeacherHeaderProps> = ({
  selectedClass,
  onSelectClass,
  totalStudents,
  activeStudents,
  alertCount,
  onSwitchToStudentMode,
  onOpenAlerts,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-white tracking-wide">
              LOGIC ESCAPE
            </span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-[10px] font-bold text-indigo-300 tracking-wider">
              PANEL GURU V0.6
            </span>
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
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer active:scale-95"
          title="Kembali ke Mode Siswa / Petualangan Game"
        >
          <Gamepad2 className="w-4 h-4 text-cyan-200" />
          <span>MODE SISWA</span>
        </button>
      </div>
    </header>
  );
};
