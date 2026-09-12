import React, { useState } from 'react';
import { 
  X, 
  Award, 
  Target, 
  Flame, 
  Compass, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  BookOpen, 
  Plus,
  Gamepad2,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { StudentData, InformaticsDomainId } from '../../types';
import { LEARNING_DOMAINS } from '../../data/learningData';

interface StudentProfileModalProps {
  student: StudentData | null;
  onClose: () => void;
  onAssignRemedial: (studentId: string, topicId: string, title: string, notes: string) => void;
  onAssignEnrichment: (studentId: string, topicId: string, title: string, notes: string) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  onClose,
  onAssignRemedial,
  onAssignEnrichment,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'assessments' | 'timeline' | 'interventions'>('profile');
  const [showInterventionForm, setShowInterventionForm] = useState(false);
  const [interventionType, setInterventionType] = useState<'remedial' | 'enrichment'>('remedial');
  const [interventionTopicId, setInterventionTopicId] = useState('ap-algoritma-dasar');
  const [interventionNotes, setInterventionNotes] = useState('');

  if (!student) return null;

  const handleCreateIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    const title = interventionType === 'remedial' 
      ? `Remedial Mandiri: ${interventionTopicId}` 
      : `Pengayaan Lanjut: ${interventionTopicId}`;
    
    if (interventionType === 'remedial') {
      onAssignRemedial(student.id, interventionTopicId, title, interventionNotes);
    } else {
      onAssignEnrichment(student.id, interventionTopicId, title, interventionNotes);
    }
    setShowInterventionForm(false);
    setInterventionNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-900/90 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-3xl sm:text-4xl p-2.5 rounded-2xl bg-slate-800 border border-slate-700 shadow-md">
              {student.avatar}
            </span>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  {student.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold">
                  Kelas {student.className}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                  {student.rankTitle} (Lv. {student.level})
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                XP: <span className="font-bold text-amber-400">{student.xp}</span> | Skor: <span className="font-bold text-cyan-400">{student.score}</span> | Streak: <span className="font-bold text-rose-400">{student.streak} Hari</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-700 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-900/50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 border-b-2 px-2 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Mastery & Progress
          </button>
          <button
            onClick={() => setActiveTab('assessments')}
            className={`pb-3 border-b-2 px-2 transition-all cursor-pointer ${
              activeTab === 'assessments'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Riwayat Asesmen ({student.assessments.length})
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-3 border-b-2 px-2 transition-all cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Aktivitas Game ({student.activityLog.length})
          </button>
          <button
            onClick={() => setActiveTab('interventions')}
            className={`pb-3 border-b-2 px-2 transition-all cursor-pointer ${
              activeTab === 'interventions'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Tindakan Guru ({student.assignedInterventions.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: Profile & Mastery */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Top Overview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Capaian Mastery</span>
                  <p className="text-2xl font-black text-indigo-300 mt-1">{student.mastery}%</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Akurasi Jawaban</span>
                  <p className="text-2xl font-black text-cyan-300 mt-1">{student.accuracy}%</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Area Terbuka</span>
                  <p className="text-2xl font-black text-purple-300 mt-1">
                    {student.gameProgress.areasUnlocked} / {student.gameProgress.totalAreas}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Quest Selesai</span>
                  <p className="text-2xl font-black text-emerald-300 mt-1">
                    {student.gameProgress.questsCompleted} / {student.gameProgress.totalQuests}
                  </p>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>KEKUATAN PEMBELAJARAN (STRENGTHS)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {student.strongConcepts.length > 0 ? (
                      student.strongConcepts.map((item, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 text-xs font-semibold">
                          ✓ {item}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">Belum cukup data teridentifikasi.</span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-rose-300 text-xs font-bold">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>PERLU LATIHAN (NEEDS PRACTICE)</span>
                    </div>
                    <button
                      onClick={() => {
                        setInterventionType('remedial');
                        setShowInterventionForm(true);
                        setActiveTab('interventions');
                      }}
                      className="text-[11px] font-bold text-rose-300 hover:text-rose-100 underline cursor-pointer"
                    >
                      Beri Remedial
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {student.weakConcepts.length > 0 ? (
                      student.weakConcepts.map((item, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-200 text-xs font-semibold">
                          ⚠ {item}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-emerald-300">Tidak ada kelemahan kritis yang terdeteksi!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Learning Mastery by Domain Bars */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Penguasaan 8 Domain Informatika
                </h3>
                <div className="space-y-2.5">
                  {LEARNING_DOMAINS.map((domain) => {
                    const score = student.domainMastery[domain.id] || 0;
                    return (
                      <div key={domain.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between gap-4">
                        <div className="w-44 shrink-0">
                          <p className="text-xs font-bold text-slate-200 truncate" title={domain.name}>
                            {domain.name}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {domain.id.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex-1">
                          <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>

                        <span className={`text-xs font-black w-12 text-right ${
                          score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {score}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Game Exploration & Progress */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Statistik Petualangan Game (In-Game Stats)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400">Petunjuk Ditemukan</span>
                    <p className="text-lg font-black text-white mt-0.5">
                      {student.gameProgress.cluesFound} / {student.gameProgress.totalClues}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400">Prestasi (Achievements)</span>
                    <p className="text-lg font-black text-amber-400 mt-0.5">
                      {student.gameProgress.achievementsEarned} / {student.gameProgress.totalAchievements}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400">Streak Harian</span>
                    <p className="text-lg font-black text-rose-400 mt-0.5">
                      {student.streak} Hari
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400">Level Karakter</span>
                    <p className="text-lg font-black text-indigo-400 mt-0.5">
                      Level {student.level}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Assessments */}
          {activeTab === 'assessments' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Catatan Nilai Asesmen & Ujian
              </h3>
              {student.assessments.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Siswa ini belum menyelesaikan tes asesmen formal.
                </div>
              ) : (
                <div className="border border-slate-700/80 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800 text-slate-300 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Nama Asesmen</th>
                        <th className="py-2.5 px-3">Tipe</th>
                        <th className="py-2.5 px-3">Skor</th>
                        <th className="py-2.5 px-3">Akurasi</th>
                        <th className="py-2.5 px-3">Mastery</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {student.assessments.map((as) => (
                        <tr key={as.id} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 font-bold text-white">
                            {as.assessmentTitle}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400 capitalize">
                            {as.type.replace('_', ' ')}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-cyan-300 font-bold">
                            {as.rawScore} / {as.maxScore}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-200">
                            {as.accuracy}%
                          </td>
                          <td className="py-2.5 px-3 font-bold text-indigo-300">
                            {as.mastery}%
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-200">
                              {as.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Activity Timeline */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Log Linimasa Aktivitas Game & Pembelajaran
              </h3>
              <div className="relative pl-6 border-l-2 border-slate-800 space-y-4">
                {student.activityLog.map((log) => (
                  <div key={log.id} className="relative group">
                    <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-cyan-500 ring-4 ring-slate-900" />
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-white">{log.action}</span>
                        <span className="text-slate-400 font-mono text-[10px]">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {log.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Interventions */}
          {activeTab === 'interventions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Daftar Tugas Intervensi & Tindakan Guru
                </h3>
                <button
                  onClick={() => setShowInterventionForm(!showInterventionForm)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Beri Tugas Intervensi</span>
                </button>
              </div>

              {/* Form Create Intervention */}
              {showInterventionForm && (
                <form onSubmit={handleCreateIntervention} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
                  <h4 className="text-xs font-bold text-cyan-300 uppercase">
                    Form Penugasan Intervensi Baru
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Jenis Intervensi
                      </label>
                      <select
                        value={interventionType}
                        onChange={(e) => setInterventionType(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                      >
                        <option value="remedial">Remedial (Pemulihan & Latihan Terpandu)</option>
                        <option value="enrichment">Pengayaan (Tantangan Mahir / Expert)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Target Modul Informatika
                      </label>
                      <select
                        value={interventionTopicId}
                        onChange={(e) => setInterventionTopicId(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                      >
                        <option value="ap-algoritma-dasar">Algoritma & Pemrograman Dasar</option>
                        <option value="jki-jaringan-dasar">Jaringan Komputer & Internet</option>
                        <option value="sk-perangkat-keras">Sistem Komputer & Hardware</option>
                        <option value="bk-dekomposisi">Dekomposisi Masalah</option>
                        <option value="ad-analisis-data">Analisis Data</option>
                        <option value="dsi-keamanan-digital">Keamanan Digital</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Catatan Arahan Guru (Opsional)
                    </label>
                    <input
                      type="text"
                      value={interventionNotes}
                      onChange={(e) => setInterventionNotes(e.target.value)}
                      placeholder="Contoh: Fokus pelajari urutan instruksi sebelum mencoba evaluasi."
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowInterventionForm(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
                    >
                      Simpan Penugasan
                    </button>
                  </div>
                </form>
              )}

              {/* Interventions List */}
              {student.assignedInterventions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Belum ada catatan intervensi khusus untuk siswa ini.
                </div>
              ) : (
                <div className="space-y-2">
                  {student.assignedInterventions.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.type === 'remedial' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {item.type}
                          </span>
                          <h4 className="text-xs font-bold text-white">{item.title}</h4>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          Modul: <span className="font-semibold text-cyan-300">{item.topicName}</span>
                        </p>
                        {item.notes && (
                          <p className="text-[11px] text-slate-400 italic">
                            &ldquo;{item.notes}&rdquo;
                          </p>
                        )}
                      </div>
                      <span className="px-2 py-1 rounded bg-slate-700/80 text-slate-300 text-[10px] font-bold shrink-0">
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer transition-colors"
          >
            Tutup Profil
          </button>
        </div>
      </div>
    </div>
  );
};
