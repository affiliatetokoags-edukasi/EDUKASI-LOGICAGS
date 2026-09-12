import React from 'react';
import { 
  Users, 
  UserCheck, 
  Award, 
  Target, 
  Gamepad2, 
  AlertTriangle, 
  ArrowUpRight, 
  CheckCircle2, 
  BookOpen, 
  Sparkles, 
  ChevronRight, 
  TrendingUp, 
  ArrowRight
} from 'lucide-react';
import { 
  StudentData, 
  TeacherAlert, 
  TeacherInsightItem, 
  TeacherDashboardTab 
} from '../../types';
import { LEARNING_TOPICS } from '../../data/learningData';

interface TeacherOverviewViewProps {
  students: StudentData[];
  selectedClass: string;
  alerts: TeacherAlert[];
  insights: TeacherInsightItem[];
  onNavigateTab: (tab: TeacherDashboardTab) => void;
  onSelectStudent: (studentId: string) => void;
  onFilterTopicInRemedial?: (topicId: string) => void;
}

export const TeacherOverviewView: React.FC<TeacherOverviewViewProps> = ({
  students,
  selectedClass,
  alerts,
  insights,
  onNavigateTab,
  onSelectStudent,
}) => {
  const pool = selectedClass === 'ALL' ? students : students.filter((s) => s.className === selectedClass);
  const totalCount = pool.length;
  const activeCount = pool.filter((s) => s.lastActiveDaysAgo <= 3).length;
  const avgMastery = totalCount > 0 ? Math.round(pool.reduce((acc, s) => acc + s.mastery, 0) / totalCount) : 0;
  const avgAccuracy = totalCount > 0 ? Math.round(pool.reduce((acc, s) => acc + s.accuracy, 0) / totalCount) : 0;
  const remedialCount = pool.filter((s) => s.mastery > 0 && s.mastery < 60).length;
  const enrichmentCount = pool.filter((s) => s.mastery >= 80).length;

  // Average game completion
  const avgGameCompletion = totalCount > 0
    ? Math.round(
        (pool.reduce((acc, s) => acc + (s.gameProgress.questsCompleted / (s.gameProgress.totalQuests || 15)), 0) / totalCount) * 100
      )
    : 0;

  // 6 Primary Topic Averages
  const topicsData = [
    { id: 'bk-dekomposisi', name: 'Dekomposisi (BK)', color: 'bg-cyan-500' },
    { id: 'sk-perangkat-keras', name: 'Sistem Komputer (SK)', color: 'bg-indigo-500' },
    { id: 'jki-jaringan-dasar', name: 'Jaringan & Internet (JKI)', color: 'bg-emerald-500' },
    { id: 'ap-algoritma-dasar', name: 'Algoritma & Pemrograman (AP)', color: 'bg-amber-500' },
    { id: 'ad-analisis-data', name: 'Analisis Data (AD)', color: 'bg-blue-500' },
    { id: 'dsi-keamanan-digital', name: 'Keamanan Digital (DSI)', color: 'bg-purple-500' },
  ].map((t) => {
    const valid = pool.filter((s) => typeof s.topicMastery[t.id] === 'number' && s.topicMastery[t.id] > 0);
    const avg = valid.length > 0 ? Math.round(valid.reduce((acc, s) => acc + s.topicMastery[t.id], 0) / valid.length) : 0;
    const needPracticeCount = pool.filter((s) => (s.topicMastery[t.id] || 0) < 60 && (s.topicMastery[t.id] || 0) > 0).length;
    return { ...t, avg, studentCount: valid.length, needPracticeCount };
  });

  // 3 Essential Pedagogical Answers:
  const lowestTopic = [...topicsData].sort((a, b) => a.avg - b.avg)[0];
  const studentsNeedingAttention = pool.filter((s) => s.mastery > 0 && s.mastery < 60).slice(0, 4);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Three Core Questions Fast-Answer Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-indigo-500/30 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-black uppercase tracking-widest text-cyan-300">
            Tiga Pertanyaan Kunci Pembelajaran (Quick Teacher Glance)
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              1. Siapa yang Perlu Bimbingan?
            </span>
            <p className="text-sm font-black text-rose-300">
              {remedialCount > 0 ? `${remedialCount} Siswa (<60% Mastery)` : 'Seluruh Siswa Memenuhi Target'}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {studentsNeedingAttention.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSelectStudent(s.id)}
                  className="px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-[11px] font-bold transition-all cursor-pointer"
                >
                  {s.name.split(' ')[0]} ({s.mastery}%)
                </button>
              ))}
              {remedialCount > 4 && (
                <button
                  onClick={() => onNavigateTab('remedial')}
                  className="px-1.5 py-0.5 text-xs text-rose-400 font-bold hover:underline"
                >
                  +{remedialCount - 4} lagi
                </button>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              2. Modul Paling Menantang?
            </span>
            <p className="text-sm font-black text-amber-300">
              {lowestTopic?.name || 'Algoritma'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Rata-rata kelas: <span className="font-bold text-amber-400">{lowestTopic?.avg || 0}%</span> (Sering keliru pada instruksi berurut)
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                3. Tindakan Terjadwal?
              </span>
              <p className="text-xs text-slate-300">
                Berikan remedial instruksi berurut & buka pengayaan bagi {enrichmentCount} siswa berprestasi.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('remedial')}
              className="mt-2.5 flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer"
            >
              <span>Buka Pusat Tindakan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 6 Top Key Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Total Siswa</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white">{totalCount}</p>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">{selectedClass === 'ALL' ? 'Semua Kelas' : selectedClass}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Siswa Aktif</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">{activeCount}</p>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Aktif 3 hari terakhir</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Rata-rata Mastery</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-indigo-300">{avgMastery}%</p>
          <p className="text-[11px] text-indigo-400/80 mt-1 font-medium">Capaian Kurikulum</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Akurasi Jawaban</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-cyan-300">{avgAccuracy}%</p>
          <p className="text-[11px] text-cyan-400/80 mt-1 font-medium">Ketepatan Menjawab</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Game Progress</span>
            <Gamepad2 className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-purple-300">{avgGameCompletion}%</p>
          <p className="text-[11px] text-purple-400/80 mt-1 font-medium">Penyelesaian Quest</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">Perlu Remedial</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-rose-400">{remedialCount}</p>
          <p className="text-[11px] text-rose-400/80 mt-1 font-medium">Mastery &lt; 60%</p>
        </div>
      </div>

      {/* Grid: Alert Center & Rule-Based Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert / Attention Center */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Pusat Perhatian (Need Attention)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-bold">
              {alerts.length} Peringatan Aktif
            </span>
          </div>

          <div className="space-y-2.5">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs font-medium">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                Semua siswa berada pada jalur pembelajaran yang baik tanpa anomali.
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => {
                    if (alert.type === 'remedial') onNavigateTab('remedial');
                    else onNavigateTab('students');
                  }}
                  className="p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/40 transition-all cursor-pointer group flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-amber-300">
                        {alert.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {alert.description}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white shrink-0 mt-1" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI-Ready Rule-Based Teacher Insights */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Wawasan Analitik Guru (Rule-Based Insights)
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/30 text-[10px] font-bold text-cyan-300">
              Otomatis
            </span>
          </div>

          <div className="space-y-3">
            {insights.map((ins) => (
              <div
                key={ins.id}
                className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-cyan-300">
                    {ins.title}
                  </h4>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-700/80 text-slate-300">
                    {ins.metric}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {ins.description}
                </p>
                <div className="pt-2 border-t border-slate-700/50 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Saran Tindakan: {ins.recommendedAction}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Topic Performance Grid */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Capaian Tiap Domain Informatika (Topic Performance)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Rata-rata pemahaman kompetensi siswa pada 6 modul kurikulum utama
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('mastery')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Detail Lengkap</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topicsData.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 truncate" title={t.name}>
                  {t.name}
                </span>
                <span className="text-xs font-black text-white ml-2">
                  {t.avg}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    t.avg >= 80 ? 'bg-emerald-500' : t.avg >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, t.avg)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>{t.studentCount} Siswa Dinilai</span>
                {t.needPracticeCount > 0 ? (
                  <span className="text-rose-400 font-bold">
                    {t.needPracticeCount} perlu latihan
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold">Target Tercapai</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
