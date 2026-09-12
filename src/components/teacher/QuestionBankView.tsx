import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  X,
  BookOpen
} from 'lucide-react';
import { AssessmentQuestion } from '../../types';
import { QUESTION_BANK } from '../../data/teacherData';

export const QuestionBankView: React.FC = () => {
  const [questions] = useState<AssessmentQuestion[]>(QUESTION_BANK);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [previewQuestion, setPreviewQuestion] = useState<AssessmentQuestion | null>(null);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (searchQuery.trim() && !q.prompt.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (selectedTopic !== 'ALL' && q.topicId !== selectedTopic) {
        return false;
      }
      if (selectedDifficulty !== 'ALL' && q.difficulty !== selectedDifficulty) {
        return false;
      }
      if (selectedType !== 'ALL' && q.type !== selectedType) {
        return false;
      }
      return true;
    });
  }, [questions, searchQuery, selectedTopic, selectedDifficulty, selectedType]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white tracking-wide flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <span>BANK SOAL & BUTIR ASESMEN INFORMATIKA</span>
          </h2>
          <p className="text-xs text-slate-400">
            Koleksi butir soal terstandarisasi dengan analisis daya beda, tingkat kesulitan, dan pembahasan
          </p>
        </div>
        <div className="text-xs font-bold text-slate-400">
          Total <span className="text-cyan-400 font-extrabold">{filteredQuestions.length}</span> soal ditemukan
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari butir soal atau kata kunci materi..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="ALL">Semua Modul Materi</option>
          <option value="bk-dekomposisi">Dekomposisi Masalah (BK)</option>
          <option value="sk-perangkat-keras">Sistem Komputer (SK)</option>
          <option value="jki-jaringan-dasar">Jaringan & Internet (JKI)</option>
          <option value="ap-algoritma-dasar">Algoritma & Pemrograman (AP)</option>
          <option value="ad-analisis-data">Analisis Data (AD)</option>
          <option value="dsi-keamanan-digital">Keamanan Digital (DSI)</option>
        </select>

        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="ALL">Semua Tingkat Kesulitan</option>
          <option value="easy">Mudah (Dasar)</option>
          <option value="medium">Menengah</option>
          <option value="hard">Sukar (Analitis)</option>
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="ALL">Semua Tipe Interaksi</option>
          <option value="multiple_choice">Pilihan Ganda</option>
          <option value="sequence_order">Urutan Sekuensial</option>
          <option value="code_fill">Melengkapi Kode</option>
          <option value="drag_match">Menjodohkan</option>
        </select>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuestions.map((q) => (
          <div
            key={q.id}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase">
                  {q.topicName}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    q.difficulty === 'easy'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : q.difficulty === 'medium'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {q.difficulty}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Bobot: {q.masteryWeight}
                  </span>
                </div>
              </div>

              <p className="text-xs font-bold text-white line-clamp-3 leading-relaxed">
                {q.prompt}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                Akurasi Siswa: <strong className="text-cyan-300">{q.correctRate}%</strong>
              </span>

              <button
                onClick={() => setPreviewQuestion(q)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Lihat Detail & Kunci</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {previewQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase">
                  {previewQuestion.topicName} ({previewQuestion.domainId.toUpperCase()})
                </span>
                <h3 className="text-sm font-black text-white">Detail Butir Soal & Rubrik</h3>
              </div>
              <button
                onClick={() => setPreviewQuestion(null)}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Pertanyaan:</span>
              <p className="text-xs font-bold text-white leading-relaxed">
                {previewQuestion.prompt}
              </p>
            </div>

            {/* Options */}
            {previewQuestion.options && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Opsi Pilihan:</span>
                {previewQuestion.options.map((opt) => (
                  <div
                    key={opt.id}
                    className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-between ${
                      opt.isCorrect
                        ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
                        : 'bg-slate-800/40 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span>{opt.label ? `${opt.label}. ` : ''}{opt.text}</span>
                    {opt.isCorrect && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        Kunci Jawaban Benar
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Explanation & Objective */}
            <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs space-y-2">
              <div>
                <span className="text-[10px] font-bold text-indigo-300 uppercase">
                  Penjelasan Konsep & Pembahasan:
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5">
                  {previewQuestion.explanation}
                </p>
              </div>
              <div className="pt-2 border-t border-indigo-500/20">
                <span className="text-[10px] font-bold text-cyan-300 uppercase">
                  Tujuan Pembelajaran (Learning Objective):
                </span>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  {previewQuestion.learningObjective}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
              <span>Tingkat Ketercapaian: <strong className="text-emerald-400">{previewQuestion.correctRate}%</strong></span>
              <button
                onClick={() => setPreviewQuestion(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
