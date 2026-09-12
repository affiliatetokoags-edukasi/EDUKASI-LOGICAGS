import React, { useState } from 'react';
import { 
  LifeBuoy, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  Plus, 
  User, 
  ArrowRight,
  Clock,
  Sparkles,
  X
} from 'lucide-react';
import { StudentData } from '../../types';
import { LEARNING_TOPICS } from '../../data/learningData';

interface RemedialDashboardViewProps {
  students: StudentData[];
  selectedClass: string;
  onAssignRemedial: (studentId: string, topicId: string, title: string, notes: string) => void;
  onSelectStudent: (studentId: string) => void;
}

export const RemedialDashboardView: React.FC<RemedialDashboardViewProps> = ({
  students,
  selectedClass,
  onAssignRemedial,
  onSelectStudent,
}) => {
  const pool = selectedClass === 'ALL' ? students : students.filter((s) => s.className === selectedClass);
  const remedialCandidates = pool.filter((s) => s.mastery > 0 && s.mastery < 60);

  const [activeModalStudent, setActiveModalStudent] = useState<StudentData | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState('ap-algoritma-dasar');
  const [customNotes, setCustomNotes] = useState('');

  const handleOpenAssignModal = (student: StudentData) => {
    setActiveModalStudent(student);
    // Suggest first weak concept if available
    const weak = student.weakConcepts[0] || 'Algoritma';
    if (weak.toLowerCase().includes('jaringan')) setSelectedTopicId('jki-jaringan-dasar');
    else if (weak.toLowerCase().includes('hardware')) setSelectedTopicId('sk-perangkat-keras');
    else setSelectedTopicId('ap-algoritma-dasar');
    setCustomNotes('');
  };

  const handleConfirmAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalStudent) return;
    const topic = LEARNING_TOPICS.find((t) => t.id === selectedTopicId);
    onAssignRemedial(
      activeModalStudent.id,
      selectedTopicId,
      `Remedial Terpandu: ${topic?.title || selectedTopicId}`,
      customNotes || 'Kerjakan micro-learning ringkas lalu selesaikan 3 latihan terpandu.'
    );
    setActiveModalStudent(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white tracking-wide flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-rose-400" />
            <span>PUSAT INTERVENSI & REMEDIAL PEMBELAJARAN</span>
          </h2>
          <p className="text-xs text-slate-400">
            Daftar siswa yang memerlukan pendampingan penguasaan materi (Mastery &lt; 60%)
          </p>
        </div>
        <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
          {remedialCandidates.length} Siswa Teridentifikasi
        </div>
      </div>

      {/* Overview Guidance Box */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 text-xs space-y-2">
        <h3 className="font-bold text-rose-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <span>Pedoman Pendekatan Remedial Tanpa Label Negatif</span>
        </h3>
        <p className="text-slate-300 leading-relaxed text-[11px]">
          Remedial dalam Logic Escape dirancang sebagai siklus pembinaan: <strong className="text-white">Micro-Lesson Ringkas (2 menit) → 3 Latihan Terpandu → 5 Tantangan Pembuktian</strong>. Hindari penyebutan nilai gagal di depan umum; fokuslah pada konsep spesifik yang belum tuntas.
        </p>
      </div>

      {/* Remedial Students List */}
      <div className="space-y-3">
        {remedialCandidates.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-400">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-white">Luar Biasa!</h3>
            <p className="text-xs mt-1">
              Tidak ada siswa pada filter kelas ini yang memiliki nilai penguasaan di bawah 60%.
            </p>
          </div>
        ) : (
          remedialCandidates.map((student) => (
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
                      className="text-sm font-black text-white hover:text-cyan-300 cursor-pointer"
                    >
                      {student.name}
                    </h4>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold">
                      Kelas {student.className}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>Mastery: <strong className="text-rose-400">{student.mastery}%</strong></span>
                    <span>Akurasi: <strong className="text-slate-200">{student.accuracy}%</strong></span>
                    <span>Aktif: <strong className="text-slate-300">{student.lastActiveDaysAgo} hari lalu</strong></span>
                  </div>
                </div>
              </div>

              {/* Weak concepts & System Recommendation */}
              <div className="space-y-1.5 sm:max-w-xs flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Miskonsepsi Terdeteksi:</span>
                <div className="flex flex-wrap gap-1">
                  {student.weakConcepts.map((wc, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 text-[10px] font-semibold">
                      ⚠ {wc}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400">
                  Saran Sistem: <span className="text-cyan-300 font-semibold">Modul Pembelajaran Mandiri + 3 Latihan</span>
                </p>
              </div>

              {/* Action */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => handleOpenAssignModal(student)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Beri Remedial</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Assign Remedial */}
      {activeModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <form
            onSubmit={handleConfirmAssign}
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-rose-400 uppercase">
                  Tindakan Pedagogis Remedial
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
                Pilih Modul Materi yang Perlu Diperbaiki
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
                Pesan Khusus & Instruksi Belajar
              </label>
              <textarea
                rows={3}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Contoh: Baca kembali slide ringkas tentang alur instruksi sebelum mengulang kuis."
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
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Kirimkan Tugas Remedial
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
