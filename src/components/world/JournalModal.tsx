import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Compass, 
  Search, 
  CheckCircle2, 
  Circle, 
  Lock, 
  Sparkles, 
  MapPin, 
  X,
  Award,
  Layers
} from 'lucide-react';
import { QuestData, ClueData, StoryChapterData, RoomAreaData } from '../../types';
import { CLUES_DATA, STORY_CHAPTERS, QUESTS_DATA, ROOMS_DATA } from '../../data/worldData';
import { sounds } from '../../utils/audio';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeQuestId: string;
  completedQuests: string[];
  questProgress: Record<string, string[]>;
  discoveredClues: string[];
  unlockedChapters: number[];
  unlockedAreas: string[];
  score: number;
  xp: number;
}

type TabType = 'quest' | 'story' | 'clues' | 'progress';

export const JournalModal: React.FC<JournalModalProps> = ({
  isOpen,
  onClose,
  activeQuestId,
  completedQuests,
  questProgress,
  discoveredClues,
  unlockedChapters,
  unlockedAreas,
  score,
  xp,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('quest');

  if (!isOpen) return null;

  const currentQuest: QuestData = QUESTS_DATA[activeQuestId] || QUESTS_DATA['quest_ch1_main'];
  const completedObjectiveIds = questProgress[currentQuest.id] || [];

  // Calculate Quest completion percentage
  const totalObjs = currentQuest.objectives.length;
  const completedObjsCount = currentQuest.objectives.filter(o => completedObjectiveIds.includes(o.id)).length;
  const questPercent = Math.round((completedObjsCount / totalObjs) * 100);

  // Overall world exploration stats
  const totalAreas = Object.keys(ROOMS_DATA).length;
  const discoveredAreasCount = unlockedAreas.length;
  const areasPercent = Math.round((discoveredAreasCount / totalAreas) * 100);

  const totalClues = CLUES_DATA.length;
  const discoveredCluesCount = discoveredClues.length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl shadow-cyan-950/40 text-slate-100 flex flex-col max-h-[88vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-wide">
                  JURNAL LOGIKA PETUALANG
                </h2>
                <p className="text-xs text-slate-400">
                  Catatan investigasi, misi, cerita, dan petunjuk misteri Logic Core
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 sm:px-6 gap-2 shrink-0 overflow-x-auto py-2">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('quest');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'quest'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Misi Aktif</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('story');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'story'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Log Cerita ({unlockedChapters.length}/5)</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('clues');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'clues'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Koleksi Clue ({discoveredCluesCount}/{totalClues})</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('progress');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'progress'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Progress Dunia</span>
            </button>
          </div>

          {/* Tab Content Body (scrollable) */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
            {/* TAB 1: CURRENT QUEST */}
            {activeTab === 'quest' && (
              <div className="space-y-5">
                {/* Active Quest Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/30">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-black uppercase tracking-wider border border-cyan-500/30">
                      MAIN QUEST — CHAPTER {currentQuest.chapter}
                    </span>
                    <span className="text-xs font-bold text-cyan-400 font-mono">
                      {questPercent}% SELESAI
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white tracking-wide">
                    {currentQuest.title}
                  </h3>
                  <p className="text-slate-300 text-sm mt-1">
                    {currentQuest.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2.5 mt-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${questPercent}%` }}
                    />
                  </div>

                  {/* Objectives List */}
                  <div className="mt-5 space-y-2.5">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      TARGET OBJEKTIF:
                    </span>
                    {currentQuest.objectives.map((obj) => {
                      const isDone = completedObjectiveIds.includes(obj.id);
                      return (
                        <div
                          key={obj.id}
                          className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                            isDone
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                          )}
                          <span className={`text-sm font-medium ${isDone ? 'line-through opacity-80' : ''}`}>
                            {obj.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Rewards preview */}
                  <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>Hadiah Penyelesaian:</span>
                    <div className="flex items-center gap-3 font-bold text-slate-200">
                      <span className="text-cyan-300">+{currentQuest.xpReward} XP</span>
                      <span className="text-yellow-300">+{currentQuest.coinReward} Coin</span>
                      {currentQuest.itemReward && (
                        <span className="text-emerald-300">🎁 {currentQuest.itemReward}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: STORY LOG */}
            {activeTab === 'story' && (
              <div className="space-y-4">
                {STORY_CHAPTERS.map((chap) => {
                  const isUnlocked = unlockedChapters.includes(chap.chapter);
                  return (
                    <div
                      key={chap.chapter}
                      className={`p-5 rounded-2xl border transition-all ${
                        isUnlocked
                          ? 'bg-slate-950/70 border-slate-700/80 text-slate-100'
                          : 'bg-slate-950/30 border-slate-800/60 opacity-60 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
                            CHAPTER {chap.chapter}
                          </span>
                          {!isUnlocked && (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                              <Lock className="w-3 h-3" /> TERKUNCI
                            </span>
                          )}
                        </div>
                        {isUnlocked && (
                          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Terbuka
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg font-black text-white">{chap.title}</h4>
                      <p className="text-xs text-slate-400 italic mb-2">{chap.subtitle}</p>

                      {isUnlocked ? (
                        <div className="space-y-2 mt-2">
                          <p className="text-sm text-slate-300 leading-relaxed">
                            {chap.summary}
                          </p>
                          <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-xs text-cyan-200">
                            📜 <em>"{chap.loreSnippet}"</em>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 mt-2">
                          Selesaikan chapter sebelumnya untuk membuka catatan bab ini.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 3: CLUE COLLECTION */}
            {activeTab === 'clues' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CLUES_DATA.map((clue) => {
                  const isFound = discoveredClues.includes(clue.id);
                  return (
                    <div
                      key={clue.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isFound
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-slate-950/40 border-slate-800/80 opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
                          {clue.code}
                        </span>
                        {isFound ? (
                          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> DITEMUKAN
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> TERKUNCI
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-white mb-1">
                        {isFound ? clue.title : 'Petunjuk Rahasia'}
                      </h4>

                      {isFound ? (
                        <>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            "{clue.content}"
                          </p>
                          <p className="text-[11px] text-amber-400/80 italic mt-2">
                            💡 {clue.hintSnippet}
                          </p>
                          <div className="mt-3 pt-2 border-t border-amber-500/20 flex items-center gap-1 text-[10px] text-slate-400">
                            <MapPin className="w-3 h-3 text-amber-400" />
                            <span>{clue.location}</span>
                          </div>
                        </>
                      ) : (
                        <p className="text-xs text-slate-500 mt-2">
                          Eksplorasi ruangan di Logic School dan periksa objek interaktif untuk menemukan petunjuk ini.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 4: WORLD PROGRESS */}
            {activeTab === 'progress' && (
              <div className="space-y-5">
                {/* Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col items-center text-center">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Area Terbuka</span>
                    <span className="text-2xl font-black text-cyan-300 mt-1">
                      {discoveredAreasCount} / {totalAreas}
                    </span>
                    <span className="text-[10px] text-slate-500">{areasPercent}% dieksplorasi</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col items-center text-center">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Petunjuk</span>
                    <span className="text-2xl font-black text-amber-300 mt-1">
                      {discoveredCluesCount} / {totalClues}
                    </span>
                    <span className="text-[10px] text-slate-500">Clue ditemukan</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col items-center text-center">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Total XP</span>
                    <span className="text-2xl font-black text-purple-300 mt-1">{xp}</span>
                    <span className="text-[10px] text-slate-500">Poin Pengalaman</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col items-center text-center">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Skor Logika</span>
                    <span className="text-2xl font-black text-emerald-300 mt-1">{score}</span>
                    <span className="text-[10px] text-slate-500">Skor Total</span>
                  </div>
                </div>

                {/* Rooms Checklist */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <h4 className="text-sm font-black uppercase tracking-wider text-slate-300 mb-3">
                    STATUS 8 AREA LOGIC SCHOOL
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {Object.values(ROOMS_DATA).map((room) => {
                      const isRoomUnlocked = unlockedAreas.includes(room.id);
                      return (
                        <div
                          key={room.id}
                          className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                            isRoomUnlocked
                              ? 'bg-slate-900/90 border-slate-700/80 text-slate-200'
                              : 'bg-slate-950/40 border-slate-800/60 text-slate-500'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{room.icon}</span>
                            <span className="font-bold">{room.name}</span>
                          </div>
                          {isRoomUnlocked ? (
                            <span className="text-cyan-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> TERBUKA
                            </span>
                          ) : (
                            <span className="text-slate-600 font-semibold flex items-center gap-1">
                              <Lock className="w-3 h-3" /> TERKUNCI
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-400">
              Tips: Periksa setiap sudut ruangan untuk menemukan petunjuk tersembunyi.
            </span>
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
            >
              Tutup Jurnal
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
