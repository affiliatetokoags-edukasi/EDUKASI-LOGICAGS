import React, { useState } from 'react';
import { 
  FileCheck2, 
  Layers, 
  HelpCircle, 
  Clock, 
  Award, 
  Play, 
  Eye, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar,
  X,
  Sparkles
} from 'lucide-react';
import { 
  AssessmentBlueprint, 
  StudentData, 
  TeacherAssignment, 
  AssessmentQuestion 
} from '../../types';
import { MOCK_ASSESSMENT_BLUEPRINTS, MOCK_TEACHER_ASSIGNMENTS } from '../../data/teacherData';

interface AssessmentEngineViewProps {
  students: StudentData[];
  selectedClass: string;
}

export const AssessmentEngineView: React.FC<AssessmentEngineViewProps> = ({
  students,
  selectedClass,
}) => {
  const [blueprints] = useState<AssessmentBlueprint[]>(MOCK_ASSESSMENT_BLUEPRINTS);
  const [assignments, setAssignments] = useState<TeacherAssignment[]>(MOCK_TEACHER_ASSIGNMENTS);
  const [previewBlueprint, setPreviewBlueprint] = useState<AssessmentBlueprint | null>(null);
  const [previewQuestionIndex, setPreviewQuestionIndex] = useState<number>(0);
  const [selectedPreviewOption, setSelectedPreviewOption] = useState<string | null>(null);
  const [showAnswerExplanation, setShowAnswerExplanation] = useState(false);

  // New assignment modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTargetClass, setNewTargetClass] = useState('VII A');
  const [newDueDate, setNewDueDate] = useState('2026-09-30');
  const [newMinMastery, setNewMinMastery] = useState(80);

  const pool = selectedClass === 'ALL' ? students : students.filter((s) => s.className === selectedClass);

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newAsg: TeacherAssignment = {
      id: `asg_${Date.now()}`,
      title: newTitle,
      topicId: 'ap-algoritma-dasar',
      topicName: 'Algoritma & Pemrograman Dasar',
      targetClass: newTargetClass,
      type: 'mastery_check',
      minimumMastery: newMinMastery,
      dueDate: newDueDate,
      createdAt: Date.now(),
      studentCompletedCount: 0,
      totalStudents: pool.length || 8,
    };
    setAssignments([newAsg, ...assignments]);
    setCreateModalOpen(false);
    setNewTitle('');
  };

  const currentQ = previewBlueprint ? previewBlueprint.questions[previewQuestionIndex] : null;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white tracking-wide">
            MESIN ASESMEN & SISTEM EVALUASI PEMBELAJARAN
          </h2>
          <p className="text-xs text-slate-400">
            Pemisahan skor permainan (Game XP) dengan capaian akademis valid (Learning Mastery & Accuracy)
          </p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Penugasan Asesmen</span>
        </button>
      </div>

      {/* 4 Pillars of Informatics Assessment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 uppercase">
            1. Diagnostik Awal
          </span>
          <h3 className="text-xs font-bold text-white">Pre-Assessment Mandiri</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            3–5 soal cepat untuk mengukur pengetahuan awal sebelum masuk ruang materi.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 uppercase">
            2. Formatif Berkelanjutan
          </span>
          <h3 className="text-xs font-bold text-white">In-Game Formative Log</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Data kontinu dari teka-teki, retry, petunjuk yang dipakai, dan pola kesalahan siswa.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 uppercase">
            3. Mastery Check
          </span>
          <h3 className="text-xs font-bold text-white">Evaluasi Per Modul</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            5 soal pembuktian tuntas. Menentukan apakah siswa siap lanjut atau butuh remedial.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 uppercase">
            4. Sumatif Bab Akhir
          </span>
          <h3 className="text-xs font-bold text-white">Evaluasi Komprehensif</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            10 tantangan terintegrasi bab 1–3 dengan antarmuka game edukatif tanpa tekanan ujian kuno.
          </p>
        </div>
      </div>

      {/* Blueprints Repository */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider">
          Daftar Blueprint & Paket Asesmen Tersedia
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {blueprints.map((bp) => (
            <div
              key={bp.id}
              className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase">
                    {bp.type.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {bp.durationMinutes} Menit
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{bp.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{bp.topicName}</p>
                <div className="mt-2.5 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Tujuan:</span>
                  <ul className="text-[11px] text-slate-300 list-disc list-inside space-y-0.5">
                    {bp.objectives.map((obj, idx) => (
                      <li key={idx} className="truncate">{obj}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {bp.questionsCount} Soal / Passing: {bp.masteryThreshold}%
                </span>
                <button
                  onClick={() => {
                    setPreviewBlueprint(bp);
                    setPreviewQuestionIndex(0);
                    setSelectedPreviewOption(null);
                    setShowAnswerExplanation(false);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Uji Soal</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Assignments Monitor */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider">
          Status Penugasan Asesmen Siswa (Class Assignments)
        </h3>

        <div className="space-y-3">
          {assignments.map((asg) => {
            const completionPercent = Math.round((asg.studentCompletedCount / asg.totalStudents) * 100);
            return (
              <div
                key={asg.id}
                className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                      Kelas {asg.targetClass}
                    </span>
                    <h4 className="text-xs font-bold text-white">{asg.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Batas Waktu: <span className="text-slate-300 font-semibold">{asg.dueDate}</span> | Ambang Batas Kelulusan: <span className="text-indigo-300 font-bold">{asg.minimumMastery}%</span>
                  </p>
                </div>

                <div className="flex items-center gap-4 sm:w-64">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-400">Selesai:</span>
                      <span className="text-emerald-400">{asg.studentCompletedCount} / {asg.totalStudents} ({completionPercent}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${completionPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Preview Assessment Blueprint */}
      {previewBlueprint && currentQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                  Pratinjau Asesmen (Teacher Simulator)
                </span>
                <h3 className="text-sm font-black text-white">{previewBlueprint.title}</h3>
              </div>
              <button
                onClick={() => setPreviewBlueprint(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Soal {previewQuestionIndex + 1} dari {previewBlueprint.questions.length}</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-cyan-300">
                Tipe: {currentQ.type.toUpperCase()} | Bobot: {currentQ.masteryWeight}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
              <p className="text-xs font-bold text-white leading-relaxed">{currentQ.prompt}</p>
            </div>

            {/* Options */}
            {currentQ.options && (
              <div className="space-y-2">
                {currentQ.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSelectedPreviewOption(opt.id);
                      setShowAnswerExplanation(true);
                    }}
                    className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                      selectedPreviewOption === opt.id
                        ? opt.isCorrect
                          ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
                          : 'bg-rose-950/50 border-rose-500 text-rose-200'
                        : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{opt.label ? `${opt.label}. ` : ''}{opt.text}</span>
                    {showAnswerExplanation && opt.isCorrect && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        Kunci Jawaban
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Explanation card */}
            {showAnswerExplanation && (
              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs space-y-1">
                <span className="font-bold text-indigo-300 uppercase text-[10px]">
                  Pembahasan Guru & Konsep:
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {currentQ.explanation}
                </p>
                <p className="text-cyan-300 text-[10px]">
                  Target Tujuan: {currentQ.learningObjective}
                </p>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                disabled={previewQuestionIndex === 0}
                onClick={() => {
                  setPreviewQuestionIndex((prev) => prev - 1);
                  setSelectedPreviewOption(null);
                  setShowAnswerExplanation(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-white cursor-pointer"
              >
                Sebelumnya
              </button>

              <button
                disabled={previewQuestionIndex >= previewBlueprint.questions.length - 1}
                onClick={() => {
                  setPreviewQuestionIndex((prev) => prev + 1);
                  setSelectedPreviewOption(null);
                  setShowAnswerExplanation(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-xs font-bold text-white cursor-pointer"
              >
                Soal Berikutnya
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Create Assignment */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <form onSubmit={handleCreateAssignment} className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white">Buat Penugasan Asesmen Baru</h3>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Judul Asesmen
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Contoh: Mastery Check Algoritma Percabangan"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Kelas Sasaran
                </label>
                <select
                  value={newTargetClass}
                  onChange={(e) => setNewTargetClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                >
                  <option value="VII A">Kelas VII A</option>
                  <option value="VII B">Kelas VII B</option>
                  <option value="VII C">Kelas VII C</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Ambang Kelulusan (%)
                </label>
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={newMinMastery}
                  onChange={(e) => setNewMinMastery(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Batas Waktu Pengerjaan
              </label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Terbitkan Tugas
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
