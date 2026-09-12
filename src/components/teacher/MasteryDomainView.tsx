import React, { useState } from 'react';
import { 
  Award, 
  Target, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';
import { StudentData, InformaticsDomainId } from '../../types';
import { LEARNING_DOMAINS } from '../../data/learningData';

interface MasteryDomainViewProps {
  students: StudentData[];
  selectedClass: string;
  onSelectStudent: (studentId: string) => void;
}

export const MasteryDomainView: React.FC<MasteryDomainViewProps> = ({
  students,
  selectedClass,
  onSelectStudent,
}) => {
  const [selectedDomainId, setSelectedDomainId] = useState<InformaticsDomainId>('ap');

  const pool = selectedClass === 'ALL' ? students : students.filter((s) => s.className === selectedClass);
  const selectedDomain = LEARNING_DOMAINS.find((d) => d.id === selectedDomainId) || LEARNING_DOMAINS[0];

  // Distribution calculations for selectedDomainId
  const masterStudents = pool.filter((s) => (s.domainMastery[selectedDomainId] || 0) >= 90);
  const advancedStudents = pool.filter((s) => {
    const val = s.domainMastery[selectedDomainId] || 0;
    return val >= 80 && val < 90;
  });
  const capableStudents = pool.filter((s) => {
    const val = s.domainMastery[selectedDomainId] || 0;
    return val >= 70 && val < 80;
  });
  const developingStudents = pool.filter((s) => {
    const val = s.domainMastery[selectedDomainId] || 0;
    return val >= 60 && val < 70;
  });
  const needsPracticeStudents = pool.filter((s) => {
    const val = s.domainMastery[selectedDomainId] || 0;
    return val > 0 && val < 60;
  });

  const domainScores = pool.map((s) => s.domainMastery[selectedDomainId] || 0).filter((v) => v > 0);
  const avgDomainScore = domainScores.length > 0 ? Math.round(domainScores.reduce((a, b) => a + b, 0) / domainScores.length) : 0;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Title */}
      <div>
        <h2 className="text-lg font-black text-white tracking-wide">
          PENGUASAAN 8 ELEMEN INFORMATIKA (MASTERY DOMAINS)
        </h2>
        <p className="text-xs text-slate-400">
          Distribusi pencapaian kompetensi siswa pada tiap domain inti Kurikulum Merdeka Informatika
        </p>
      </div>

      {/* 8 Domain Chips Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {LEARNING_DOMAINS.map((dom) => {
          const isSelected = dom.id === selectedDomainId;
          const scores = pool.map((s) => s.domainMastery[dom.id] || 0).filter((v) => v > 0);
          const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

          return (
            <button
              key={dom.id}
              onClick={() => setSelectedDomainId(dom.id)}
              className={`px-3.5 py-2.5 rounded-xl border text-left shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 border-cyan-400 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold opacity-80 uppercase">
                  {dom.id}
                </span>
                <span className="text-xs font-black">{avg}%</span>
              </div>
              <p className="text-xs font-bold truncate max-w-[150px] mt-0.5">
                {dom.name}
              </p>
            </button>
          );
        })}
      </div>

      {/* Domain Detail Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold uppercase">
                {selectedDomain.id}
              </span>
              <h3 className="text-base font-black text-white">{selectedDomain.name}</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {selectedDomain.shortDesc}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Rata-rata Penguasaan</span>
            <p className="text-2xl font-black text-cyan-300">{avgDomainScore}%</p>
            <span className="text-[10px] text-slate-400">{pool.length} Siswa Dinilai</span>
          </div>
        </div>

        {/* 5-Tier Competency Distribution */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Distribusi Siswa Menurut Kategori Capaian
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {/* Master */}
            <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between text-cyan-300 text-xs font-black">
                <span>MASTER</span>
                <span>{masterStudents.length}</span>
              </div>
              <span className="text-[10px] text-cyan-400 block font-mono">≥ 90%</span>
              <div className="space-y-1 pt-1 max-h-32 overflow-y-auto">
                {masterStudents.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onSelectStudent(s.id)}
                    className="w-full text-left text-[11px] font-semibold text-slate-300 hover:text-cyan-300 truncate block cursor-pointer"
                  >
                    • {s.name} ({s.domainMastery[selectedDomainId]}%)
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced */}
            <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
              <div className="flex items-center justify-between text-indigo-300 text-xs font-black">
                <span>MAHIR</span>
                <span>{advancedStudents.length}</span>
              </div>
              <span className="text-[10px] text-indigo-400 block font-mono">80–89%</span>
              <div className="space-y-1 pt-1 max-h-32 overflow-y-auto">
                {advancedStudents.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onSelectStudent(s.id)}
                    className="w-full text-left text-[11px] font-semibold text-slate-300 hover:text-indigo-300 truncate block cursor-pointer"
                  >
                    • {s.name} ({s.domainMastery[selectedDomainId]}%)
                  </button>
                ))}
              </div>
            </div>

            {/* Capable */}
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-emerald-300 text-xs font-black">
                <span>CAKAP</span>
                <span>{capableStudents.length}</span>
              </div>
              <span className="text-[10px] text-emerald-400 block font-mono">70–79%</span>
              <div className="space-y-1 pt-1 max-h-32 overflow-y-auto">
                {capableStudents.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onSelectStudent(s.id)}
                    className="w-full text-left text-[11px] font-semibold text-slate-300 hover:text-emerald-300 truncate block cursor-pointer"
                  >
                    • {s.name} ({s.domainMastery[selectedDomainId]}%)
                  </button>
                ))}
              </div>
            </div>

            {/* Developing */}
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between text-amber-300 text-xs font-black">
                <span>BERKEMBANG</span>
                <span>{developingStudents.length}</span>
              </div>
              <span className="text-[10px] text-amber-400 block font-mono">60–69%</span>
              <div className="space-y-1 pt-1 max-h-32 overflow-y-auto">
                {developingStudents.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onSelectStudent(s.id)}
                    className="w-full text-left text-[11px] font-semibold text-slate-300 hover:text-amber-300 truncate block cursor-pointer"
                  >
                    • {s.name} ({s.domainMastery[selectedDomainId]}%)
                  </button>
                ))}
              </div>
            </div>

            {/* Needs Practice */}
            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-2">
              <div className="flex items-center justify-between text-rose-300 text-xs font-black">
                <span>PERLU LATIHAN</span>
                <span>{needsPracticeStudents.length}</span>
              </div>
              <span className="text-[10px] text-rose-400 block font-mono">&lt; 60%</span>
              <div className="space-y-1 pt-1 max-h-32 overflow-y-auto">
                {needsPracticeStudents.length === 0 ? (
                  <span className="text-[11px] text-emerald-400">Tidak ada</span>
                ) : (
                  needsPracticeStudents.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => onSelectStudent(s.id)}
                      className="w-full text-left text-[11px] font-semibold text-rose-200 hover:underline truncate block cursor-pointer"
                    >
                      • {s.name} ({s.domainMastery[selectedDomainId]}%)
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
