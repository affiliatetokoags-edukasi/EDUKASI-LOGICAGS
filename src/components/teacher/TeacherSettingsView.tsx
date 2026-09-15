import React, { useState } from 'react';
import { 
  Settings, 
  Database, 
  RotateCcw, 
  Trash2, 
  ShieldCheck, 
  Sliders, 
  Download, 
  CheckCircle2, 
  FileText,
  Sparkles
} from 'lucide-react';
import { AssessmentRubric, StudentData } from '../../types';
import { 
  resetDemoStudents, 
  clearDemoStudents, 
  saveStoredTeacherConfig 
} from '../../utils/teacherStorage';

interface TeacherSettingsViewProps {
  students: StudentData[];
  rubric: AssessmentRubric;
  onUpdateRubric: (newRubric: AssessmentRubric) => void;
  onRefreshStudents: () => void;
}

export const TeacherSettingsView: React.FC<TeacherSettingsViewProps> = ({
  students,
  rubric,
  onUpdateRubric,
  onRefreshStudents,
}) => {
  const [localRubric, setLocalRubric] = useState<AssessmentRubric>(rubric);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleResetDemo = () => {
    resetDemoStudents();
    onRefreshStudents();
    setStatusMessage('Data demo 25 siswa berhasil dimuat ulang dengan capaian realistis.');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleClearDemo = () => {
    if (window.confirm('Apakah Anda yakin ingin mengosongkan seluruh data siswa demo?')) {
      clearDemoStudents();
      onRefreshStudents();
      setStatusMessage('Data siswa telah dikosongkan.');
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleSaveRubric = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRubric(localRubric);
    saveStoredTeacherConfig({ selectedClass: 'ALL', rubric: localRubric });
    setStatusMessage('Ambang batas rubrik asesmen berhasil diperbarui!');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleExportCSV = () => {
    if (students.length === 0) {
      alert('Tidak ada data siswa untuk diekspor.');
      return;
    }
    const headers = 'ID,Nama,Kelas,Level,XP,Skor,Streak,Mastery,Akurasi,Status\n';
    const rows = students
      .map(
        (s) =>
          `"${s.id}","${s.name}","${s.className}",${s.level},${s.xp},${s.score},${s.streak},${s.mastery}%,${s.accuracy}%,"${s.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rekap_belajar_informatika_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatusMessage('File rekap CSV berhasil diunduh.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Title */}
      <div>
        <h2 className="text-lg font-black text-white tracking-wide flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" />
          <span>PENGATURAN RUBRIK & MANAJEMEN DATA DEMO</span>
        </h2>
        <p className="text-xs text-slate-400">
          Kelola parameter kriteria kelulusan, simulasi data kelas, dan privasi penyimpanan
        </p>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Demo Data Management Card */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            Manajemen Data Simulasi Kelas (Demo Data Hub)
          </h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Platform saat ini memuat <strong className="text-cyan-300">{students.length} siswa</strong> tersebar pada Kelas VII A, VII B, VII C, dan VIII A dengan data historis log petualangan game, capaian bab, dan nilai kuis formatif.
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            onClick={handleResetDemo}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Muat Ulang Data 25 Siswa Demo</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Rekap Nilai (CSV)</span>
          </button>

          <button
            onClick={handleClearDemo}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 text-xs font-bold transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Kosongkan Data Siswa</span>
          </button>
        </div>
      </div>

      {/* Assessment Rubric Configurator */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            Konfigurasi Ambang Batas Rubrik Asesmen (Grading Scale)
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Sesuaikan persentase standar penguasaan kompetensi sesuai dengan Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) sekolah Anda.
        </p>

        <form onSubmit={handleSaveRubric} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1.5">
            <label className="text-[11px] font-bold text-cyan-300 uppercase">
              Ambang Kategori Master (%)
            </label>
            <input
              type="number"
              min={80}
              max={100}
              value={localRubric.masterMin ?? 90}
              onChange={(e) => setLocalRubric({ ...localRubric, masterMin: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-bold"
            />
            <span className="text-[10px] text-slate-400">Default: 90%</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1.5">
            <label className="text-[11px] font-bold text-indigo-300 uppercase">
              Ambang Kategori Mahir (%)
            </label>
            <input
              type="number"
              min={70}
              max={89}
              value={localRubric.advancedMin ?? 80}
              onChange={(e) => setLocalRubric({ ...localRubric, advancedMin: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-bold"
            />
            <span className="text-[10px] text-slate-400">Default: 80%</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1.5">
            <label className="text-[11px] font-bold text-emerald-300 uppercase">
              Ambang Kategori Cakap (%)
            </label>
            <input
              type="number"
              min={60}
              max={79}
              value={localRubric.capableMin ?? 70}
              onChange={(e) => setLocalRubric({ ...localRubric, capableMin: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-bold"
            />
            <span className="text-[10px] text-slate-400">Default: 70%</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1.5">
            <label className="text-[11px] font-bold text-amber-300 uppercase">
              Ambang Berkembang / Remedial (%)
            </label>
            <input
              type="number"
              min={40}
              max={69}
              value={localRubric.developingMin ?? 60}
              onChange={(e) => setLocalRubric({ 
                ...localRubric, 
                developingMin: Number(e.target.value),
                needsPracticeMax: Number(e.target.value) - 1 
              })}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-bold"
            />
            <span className="text-[10px] text-slate-400">&lt; Ambang ini masuk Remedial</span>
          </div>

          <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer transition-colors shadow-md"
            >
              Simpan Perubahan Rubrik
            </button>
          </div>
        </form>
      </div>

      {/* Privacy & Storage Guarantee Card */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            Privasi & Keamanan Data (Offline-First Architecture)
          </h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Seluruh data nama siswa, nilai kuis, dan riwayat aktivitas tersimpan secara eksklusif di <strong className="text-cyan-300">Local Storage peramban (browser sandbox)</strong>. Tidak ada database awan eksternal yang dihubungi dan tidak ada data pribadi (seperti email atau kata sandi) yang dikumpulkan, menjamin privasi penuh di lingkungan sekolah.
        </p>
      </div>
    </div>
  );
};
