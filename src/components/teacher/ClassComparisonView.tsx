import React, { useState } from 'react';
import { 
  School, 
  Users, 
  Award, 
  Target, 
  Flame, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { StudentData, ClassRoomData } from '../../types';
import { computeClassRooms } from '../../utils/teacherStorage';

interface ClassComparisonViewProps {
  students: StudentData[];
  selectedClass: string;
  onSelectClass: (className: string) => void;
  onSelectStudent: (studentId: string) => void;
}

export const ClassComparisonView: React.FC<ClassComparisonViewProps> = ({
  students,
  selectedClass,
  onSelectClass,
  onSelectStudent,
}) => {
  const classRooms = computeClassRooms(students);
  const activeClassRooms = classRooms.filter((c) => c.studentCount > 0);

  const [heatmapClass, setHeatmapClass] = useState<string>(
    selectedClass !== 'ALL' ? selectedClass : 'VII A'
  );

  const heatmapStudents = students.filter((s) => s.className === heatmapClass);

  const topicsList = [
    { id: 'bk-dekomposisi', label: 'BK / Dekomposisi' },
    { id: 'tik-folder-file', label: 'TIK / Folder' },
    { id: 'sk-perangkat-keras', label: 'SK / Hardware' },
    { id: 'jki-jaringan-dasar', label: 'JKI / Jaringan' },
    { id: 'ad-analisis-data', label: 'AD / Analisis Data' },
    { id: 'ap-algoritma-dasar', label: 'AP / Algoritma' },
    { id: 'dsi-keamanan-digital', label: 'DSI / Keamanan' },
  ];

  const getHeatmapColor = (score: number | undefined) => {
    if (score === undefined || score === 0) return 'bg-slate-800 text-slate-400';
    if (score >= 80) return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
    if (score >= 60) return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
    return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white tracking-wide">
            KOMPARASI KELAS & HEATMAP PEMBELAJARAN
          </h2>
          <p className="text-xs text-slate-400">
            Analisis sebaran pencapaian kompetensi antar kelas dan peta penguasaan tiap siswa tanpa perbandingan destruktif
          </p>
        </div>
      </div>

      {/* Class Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeClassRooms.map((cls) => (
          <div
            key={cls.id}
            onClick={() => {
              onSelectClass(cls.name);
              setHeatmapClass(cls.name);
            }}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              selectedClass === cls.name
                ? 'bg-gradient-to-br from-slate-900 to-indigo-950/80 border-indigo-500 shadow-lg shadow-indigo-500/20'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <School className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-black text-white">Kelas {cls.name}</h3>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {cls.studentCount} Siswa
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Rata-rata Mastery</span>
                <span className="font-extrabold text-indigo-300">{cls.avgMastery}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${cls.avgMastery}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">Rata-rata Akurasi</span>
                <span className="font-extrabold text-cyan-300">{cls.avgAccuracy}%</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 font-bold">
                  {cls.enrichmentCount} Siap Pengayaan
                </span>
                <span className="text-rose-400 font-bold">
                  {cls.remedialCount} Perlu Remedial
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Class Mastery Heatmap Section */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Matriks Heatmap Penguasaan Siswa</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Matriks visual nilai mastery (%) siswa berdasarkan tiap modul kurikulum
            </p>
          </div>

          {/* Heatmap Class Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Tampilkan Kelas:</span>
            <select
              value={heatmapClass}
              onChange={(e) => setHeatmapClass(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              {activeClassRooms.map((c) => (
                <option key={c.name} value={c.name}>Kelas {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-400 p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <span className="text-slate-300">Legenda:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500/40 border border-emerald-500/60" />
            <span>≥ 80% (Mahir/Master)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-500/40 border border-amber-500/60" />
            <span>60–79% (Berkembang)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-rose-500/40 border border-rose-500/60" />
            <span>&lt; 60% (Perlu Latihan)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-slate-800 border border-slate-700" />
            <span>Belum Mulai</span>
          </div>
        </div>

        {/* Heatmap Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/80 text-slate-300 font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3.5 min-w-[160px] sticky left-0 bg-slate-800/90 z-10">
                  Nama Siswa
                </th>
                {topicsList.map((t) => (
                  <th key={t.id} className="py-3 px-2 text-center min-w-[90px]">
                    {t.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {heatmapStudents.length === 0 ? (
                <tr>
                  <td colSpan={topicsList.length + 1} className="py-8 text-center text-slate-400">
                    Tidak ada siswa pada kelas {heatmapClass}.
                  </td>
                </tr>
              ) : (
                heatmapStudents.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => onSelectStudent(s.id)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3.5 font-bold text-white group-hover:text-cyan-300 sticky left-0 bg-slate-900/90 z-10 flex items-center gap-2">
                      <span>{s.avatar}</span>
                      <span className="truncate max-w-[140px]">{s.name}</span>
                    </td>
                    {topicsList.map((t) => {
                      const val = s.topicMastery[t.id];
                      return (
                        <td key={t.id} className="py-2 px-2 text-center">
                          <div
                            className={`py-1 px-1.5 rounded-lg text-[11px] font-black mx-auto transition-transform group-hover:scale-105 ${getHeatmapColor(
                              val
                            )}`}
                          >
                            {val !== undefined && val > 0 ? `${val}%` : '—'}
                          </div>
                        </td>
                      );
                    })}
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
