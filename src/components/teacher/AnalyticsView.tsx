import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertOctagon, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  Target, 
  ArrowUpRight,
  Info
} from 'lucide-react';
import { StudentData } from '../../types';

interface AnalyticsViewProps {
  students: StudentData[];
  selectedClass: string;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  students,
  selectedClass,
}) => {
  const pool = selectedClass === 'ALL' ? students : students.filter((s) => s.className === selectedClass);

  // Hardest Questions Data
  const hardestQuestions = [
    {
      id: 'hq_1',
      topic: 'Algoritma & Pemrograman',
      prompt: 'Urutan instruksi percabangan IF x > 10 THEN loop langkah',
      failureRate: 46,
      successRate: 54,
      commonMistake: 'Siswa melewatkan kondisi batas ketika nilai x tepat sama dengan 10.',
    },
    {
      id: 'hq_2',
      topic: 'Jaringan Komputer',
      prompt: 'Perbedaan fungsi IP Address (logis) dengan MAC Address (fisik)',
      failureRate: 41,
      successRate: 59,
      commonMistake: 'Tertukar antara alamat hardware permanen pabrik dan alamat jaringan dinamis.',
    },
    {
      id: 'hq_3',
      topic: 'Sistem Komputer',
      prompt: 'Sifat penyimpanan RAM (Volatile) vs ROM / Storage (Non-Volatile)',
      failureRate: 38,
      successRate: 62,
      commonMistake: 'Mengira data RAM tetap tersimpan saat komputer dimatikan.',
    },
    {
      id: 'hq_4',
      topic: 'Dekomposisi Masalah',
      prompt: 'Memecah algoritma pencarian rute terpendek ke sub-masalah kecil',
      failureRate: 34,
      successRate: 66,
      commonMistake: 'Mencoba menyelesaikan seluruh peta sekaligus tanpa membagi simpul graf.',
    },
  ];

  // Error Patterns
  const errorPatterns = [
    { label: 'Kesalahan Urutan Langkah Algoritma (Sequencing)', percent: 32, count: 24 },
    { label: 'Ketertukaran Konsep IP Address & MAC Address', percent: 26, count: 19 },
    { label: 'Kekeliruan Logika Boolean (AND vs OR)', percent: 18, count: 13 },
    { label: 'Kebingungan Memori Volatile vs Non-Volatile', percent: 14, count: 10 },
    { label: 'Lain-lain / Ketidaktelitian Membaca Soal', percent: 10, count: 7 },
  ];

  // Weekly Trend
  const weeklyTrends = [
    { week: 'Minggu 1', mastery: 54, accuracy: 62, quests: 28 },
    { week: 'Minggu 2', mastery: 63, accuracy: 70, quests: 45 },
    { week: 'Minggu 3', mastery: 72, accuracy: 76, quests: 68 },
    { week: 'Minggu 4', mastery: 79, accuracy: 82, quests: 92 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Title */}
      <div>
        <h2 className="text-lg font-black text-white tracking-wide">
          ANALITIK SOAL & POLA KESALAHAN (ERROR PATTERNS)
        </h2>
        <p className="text-xs text-slate-400">
          Identifikasi miskonsepsi pembelajaran dan perkembangan kurva kompetensi siswa dari waktu ke waktu
        </p>
      </div>

      {/* 3 Overview Indicator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Tren Penguasaan</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-black text-emerald-300">+25% Meningkat</p>
          <p className="text-[11px] text-slate-400">
            Rerata naik dari 54% di Minggu 1 ke 79% di Minggu 4
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Miskonsepsi Terbesar</span>
            <AlertOctagon className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-black text-amber-300">Urutan Algoritma</p>
          <p className="text-[11px] text-slate-400">
            32% dari seluruh kesalahan bersumber pada sekuens langkah
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Akurasi Percobaan Pertama</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-xl font-black text-cyan-300">76% First-Try</p>
          <p className="text-[11px] text-slate-400">
            Siswa menyelesaikan tantangan tanpa meminta petunjuk
          </p>
        </div>
      </div>

      {/* Grid: Hardest Questions & Common Error Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hardest Questions */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-rose-400" />
            <span>Tantangan dengan Rasio Gagal Tertinggi</span>
          </h3>

          <div className="space-y-3">
            {hardestQuestions.map((q) => (
              <div
                key={q.id}
                className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    {q.topic}
                  </span>
                  <span className="text-xs font-black text-rose-400">
                    {q.failureRate}% Salah
                  </span>
                </div>
                <p className="text-xs font-bold text-white leading-relaxed">
                  {q.prompt}
                </p>
                <p className="text-[11px] text-slate-400 italic">
                  💡 Akar Masalah: {q.commonMistake}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Common Error Patterns Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>Distribusi Pola Kesalahan (Error Patterns)</span>
          </h3>

          <div className="space-y-3.5">
            {errorPatterns.map((err, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 truncate pr-2">
                    {err.label}
                  </span>
                  <span className="font-mono font-black text-amber-400 shrink-0">
                    {err.percent}% ({err.count} kasus)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500"
                    style={{ width: `${err.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 flex items-start gap-2 mt-4">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Guru disarankan menyajikan visual flow diagram sebelum meminta siswa menulis kode sekuensial.
            </p>
          </div>
        </div>
      </div>

      {/* Mastery Progress Over Time */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Grafik Perkembangan Rerata Kelas (4 Minggu Terakhir)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {weeklyTrends.map((w, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 text-center space-y-2"
            >
              <span className="text-xs font-black text-slate-400 uppercase">{w.week}</span>
              <p className="text-2xl font-black text-cyan-300">{w.mastery}%</p>
              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Akurasi: {w.accuracy}%</span>
                <span>{w.quests} Quest</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
