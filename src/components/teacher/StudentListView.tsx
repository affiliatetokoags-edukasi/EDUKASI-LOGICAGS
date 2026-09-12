import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  User, 
  ChevronRight, 
  ArrowUpDown, 
  Award, 
  Target, 
  Flame,
  Clock,
  Sparkles
} from 'lucide-react';
import { StudentData, StudentMasteryTier } from '../../types';
import { AVAILABLE_CLASSES } from '../../data/teacherData';

interface StudentListViewProps {
  students: StudentData[];
  selectedClass: string;
  onSelectStudent: (studentId: string) => void;
}

export const StudentListView: React.FC<StudentListViewProps> = ({
  students,
  selectedClass,
  onSelectStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState<string>(selectedClass);
  const [filterMasteryRange, setFilterMasteryRange] = useState<'ALL' | 'LOW' | 'MID' | 'HIGH'>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'name' | 'mastery' | 'accuracy' | 'level' | 'xp'>('mastery');
  const [sortAsc, setSortAsc] = useState(false);

  // Sync with selectedClass if prop changes
  React.useEffect(() => {
    setFilterClass(selectedClass);
  }, [selectedClass]);

  // Filtering & Sorting
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        // Search
        if (searchQuery.trim() && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        // Class
        if (filterClass !== 'ALL' && s.className !== filterClass) {
          return false;
        }
        // Mastery Range
        if (filterMasteryRange === 'LOW' && (s.mastery >= 60 || s.status === 'not_started')) return false;
        if (filterMasteryRange === 'MID' && (s.mastery < 60 || s.mastery >= 80)) return false;
        if (filterMasteryRange === 'HIGH' && s.mastery < 80) return false;
        // Status
        if (filterStatus !== 'ALL' && s.status !== filterStatus) return false;

        return true;
      })
      .sort((a, b) => {
        let valA: number | string = a[sortField];
        let valB: number | string = b[sortField];

        if (typeof valA === 'string') {
          return sortAsc 
            ? (valA as string).localeCompare(valB as string) 
            : (valB as string).localeCompare(valA as string);
        }

        return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [students, searchQuery, filterClass, filterMasteryRange, filterStatus, sortField, sortAsc]);

  const getStatusBadge = (status: StudentMasteryTier) => {
    switch (status) {
      case 'master':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold">
            Master (90-100%)
          </span>
        );
      case 'advanced':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold">
            Mahir (80-89%)
          </span>
        );
      case 'capable':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
            Cakap (70-79%)
          </span>
        );
      case 'developing':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
            Berkembang (60-69%)
          </span>
        );
      case 'needs_practice':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold">
            Perlu Bimbingan (&lt;60%)
          </span>
        );
      case 'not_started':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[11px] font-bold">
            Belum Dimulai
          </span>
        );
    }
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white tracking-wide">
            DAFTAR SISWA & PERKEMBANGAN BELAJAR
          </h2>
          <p className="text-xs text-slate-400">
            Pantau profil, capaian materi kurikulum, dan akurasi tiap siswa secara transparan
          </p>
        </div>
        <div className="text-xs font-bold text-slate-400">
          Menampilkan <span className="text-cyan-400 font-extrabold">{filteredStudents.length}</span> dari {students.length} siswa
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama siswa..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Class Filter */}
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="ALL">Semua Kelas</option>
          {AVAILABLE_CLASSES.map((cls) => (
            <option key={cls} value={cls}>Kelas {cls}</option>
          ))}
        </select>

        {/* Mastery Filter */}
        <select
          value={filterMasteryRange}
          onChange={(e) => setFilterMasteryRange(e.target.value as any)}
          className="px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="ALL">Semua Rentang Mastery</option>
          <option value="HIGH">≥ 80% (Mahir & Master)</option>
          <option value="MID">60% – 79% (Cakap & Berkembang)</option>
          <option value="LOW">&lt; 60% (Perlu Latihan)</option>
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="ALL">Semua Status Belajar</option>
          <option value="master">Master</option>
          <option value="advanced">Mahir</option>
          <option value="capable">Cakap</option>
          <option value="developing">Berkembang</option>
          <option value="needs_practice">Perlu Bimbingan</option>
          <option value="not_started">Belum Dimulai</option>
        </select>
      </div>

      {/* Student List Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/70 border-b border-slate-700 text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1.5">
                    <span>Nama Siswa</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Kelas</th>
                <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort('level')}>
                  <div className="flex items-center gap-1.5">
                    <span>Level & Rank</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort('mastery')}>
                  <div className="flex items-center gap-1.5">
                    <span>Mastery</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort('accuracy')}>
                  <div className="flex items-center gap-1.5">
                    <span>Akurasi</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Status Belajar</th>
                <th className="py-3 px-3">Terakhir Aktif</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ditemukan data siswa dengan kriteria pencarian ini.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    onClick={() => onSelectStudent(student.id)}
                    className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    {/* Name & Avatar */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl shrink-0 p-1.5 rounded-lg bg-slate-800">
                          {student.avatar}
                        </span>
                        <div>
                          <p className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {student.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            ID: {student.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Class */}
                    <td className="py-3 px-3 font-semibold text-slate-300">
                      {student.className}
                    </td>

                    {/* Level & Rank */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">
                          Lv. {student.level}
                        </span>
                        <span className="text-slate-400 text-[11px] truncate max-w-[100px]" title={student.rankTitle}>
                          {student.rankTitle}
                        </span>
                      </div>
                    </td>

                    {/* Mastery Bar */}
                    <td className="py-3 px-3 min-w-[120px]">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className={student.mastery >= 80 ? 'text-emerald-400' : student.mastery >= 60 ? 'text-amber-400' : 'text-rose-400'}>
                            {student.mastery}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              student.mastery >= 80 ? 'bg-emerald-500' : student.mastery >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${student.mastery}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Accuracy */}
                    <td className="py-3 px-3 font-bold text-slate-200">
                      {student.accuracy}%
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3">
                      {getStatusBadge(student.status)}
                    </td>

                    {/* Last Active */}
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {student.lastActiveDaysAgo === 0
                        ? 'Hari ini'
                        : student.lastActiveDaysAgo === 1
                        ? 'Kemarin'
                        : `${student.lastActiveDaysAgo} hari lalu`}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStudent(student.id);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-[11px] transition-all cursor-pointer"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
