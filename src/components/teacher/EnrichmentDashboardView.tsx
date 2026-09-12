import React, { useState } from 'react';
import { 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Plus, 
  User, 
  Compass, 
  X
} from 'lucide-react';
import { StudentData } from '../../types';
import { LEARNING_TOPICS } from '../../data/learningData';

interface EnrichmentDashboardViewProps {
  students: StudentData[];
  selectedClass: string;
  onAssignEnrichment: (studentId: string, topicId: string, title: string, notes: string) => void;
  onSelectStudent: (studentId: string) => void;
}

export const EnrichmentDashboardView: React.FC<EnrichmentDashboardViewProps> = ({
  students,
  selectedClass,
  onAssignEnrichment,
  onSelectStudent,
}) => {
  const pool = selectedClass === 'ALL' ? students : students.filter((s) => s.className === selectedClass);
  const enrichmentCandidates = pool.filter((s) => s.mastery >= 80);

  const [activeModalStudent, setActiveModalStudent] = useState<StudentData | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState('ap-algoritma-dasar');
  const [customNotes, setCustomNotes] = useState('');

  const handleOpenAssignModal = (student: StudentData) => {
    setActiveModalStudent(student);
    setSelectedTopicId('ap-algoritma-dasar');
    setCustomNotes('');
  };

  const handleConfirmAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalStudent) return;
    const topic = LEARNING_TOPICS.find((t) => t.id === selectedTopicId);
    onAssignEnrichment(
      activeModalStudent.id,
      selectedTopicId,
      `Tantangan Pengayaan Mahir: ${topic?.title || selectedTopicId}`,
      customNotes || 'Selesaikan tantangan optimasi logika tingkat lanjut dengan efisiensi memori tinggi.'
    );
    setActiveModalStudent(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white tracking-wide flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>PUSAT PENGAYAAN & TANTANGAN TINGKAT LANJUT</span>
          </h2>
          <p className="text-xs text-slate-400">
            Daftar siswa berkemampuan tinggi (Mastery ≥ 80%) yang siap menerima tantangan komputasi lebih mendalam
          </p>
        </div>
        <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
          {enrichmentCandidates.length} Siswa Berprestasi
        </div>
      </div>

      {/* Enrichment Philosophy Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 text-xs space-y-2">
        <h3 className="font-bold text-amber-300 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Pengembangan Potensi Berkelanjutan</span>
        </h3>
        <p className="text-slate-300 leading-relaxed text-[11px]">
          Siswa yang telah menguasai target capaian dasar kurikulum diberikan kesempatan mengeksplorasi optimasi kode, teka-teki logika tingkat lanjut, dan proyek kolaboratif agar tidak mengalami kebosanan belajar.
        </p>
      </div>

      {/* Candidates List */}
      <div className="space-y-3">
        {enrichmentCandidates.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-400">
            <Award className="w-10 h-10 text-amber-400 mx-auto mb-2 opacity-50" />
            <h3 className="text-sm font-bold text-white">Belum Ada Siswa</h3>
            <p className="text-xs mt-1">
              Belum ada siswa dengan penguasaan ≥ 80% pada filter kelas ini.
            </p>
          </div>
        ) : (
          enrichmentCandidates.map((student) => (
            <div
              key={student.id}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Student Info */}
              <div className="flex items-start sm:items-center gap-3">
                <span className="text-2xl p-2 rounded-xl bg-slate-800 shrink-0">
                  {student.avatar}
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4
                      onClick={() => onSelectStudent(student.id)}
                      className="text-sm font-black text-white hover:text-amber-300 cursor-pointer"
                    >
                      {student.name}
                    </h4>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold">
                      Kelas {student.className}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                      {student.rankTitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>Mastery: <strong className="text-emerald-400">{student.mastery}%</strong></span>
                    <span>Akurasi: <strong className="text-cyan-300">{student.accuracy}%</strong></span>
                    <span>XP: <strong className="text-amber-400">{student.xp}</strong></span>
                  </div>
                </div>
              </div>

              {/* Strengths */}
              <div className="space-y-1.5 sm:max-w-xs flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Kekuatan Terbukti:</span>
                <div className="flex flex-wrap gap-1">
                  {student.strongConcepts.map((sc, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-semibold">
                      ✓ {sc}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400">
                  Rekomendasi: <span className="text-amber-300 font-semibold">Tantangan Algoritma Tingkat Master</span>
                </p>
              </div>

              {/* Action */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => handleOpenAssignModal(student)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Beri Pengayaan</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Assign Enrichment */}
      {activeModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <form
            onSubmit={handleConfirmAssign}
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase">
                  Tindakan Pedagogis Pengayaan
                </span>
                <h3 className="text-sm font-black text-white">
                  {activeModalStudent.name} (Kelas {activeModalStudent.className})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalStudent(null)}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Pilih Modul Tantangan Pengayaan
              </label>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              >
                {LEARNING_TOPICS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.domainId.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Arahan & Tantangan Guru
              </label>
              <textarea
                rows={3}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Contoh: Selesaikan puzzle algoritma dengan jumlah langkah paling minimal."
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModalStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
              >
                Kirimkan Tantangan Pengayaan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
