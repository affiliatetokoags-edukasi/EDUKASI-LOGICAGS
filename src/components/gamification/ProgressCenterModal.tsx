import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PlayerStats,
  MasteryCategory,
  DailyMissionData,
} from '../../types';
import {
  PLAYER_RANKS,
  XP_LEVEL_THRESHOLDS,
  getLevelDataFromXp,
  ACHIEVEMENTS_DATA,
  SKILL_TREE_DATA,
  COLLECTIBLES_DATA,
  PLAYER_TITLES,
} from '../../data/gamificationData';
import {
  calculatePlayerRank,
  getMasteryLabel,
  getTodayDateString,
} from '../../utils/gamificationEngine';
import {
  X,
  User,
  Sparkles,
  Trophy,
  Flame,
  Award,
  BookOpen,
  Brain,
  Cpu,
  Shield,
  Search,
  CheckCircle2,
  Lock,
  Coins,
  ChevronRight,
  Gift,
  Calendar,
  Layers,
  Star,
  Check,
} from 'lucide-react';
import { sounds } from '../../utils/audio';

interface ProgressCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  onSelectTitle: (titleId: string) => void;
  onClaimDailyMission: (missionId: string) => void;
  onOpenChest?: () => void;
}

type TabType = 'overview' | 'skills' | 'achievements' | 'collection' | 'daily';

export const ProgressCenterModal: React.FC<ProgressCenterModalProps> = ({
  isOpen,
  onClose,
  stats,
  onSelectTitle,
  onClaimDailyMission,
  onOpenChest,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedSkillBranch, setSelectedSkillBranch] = useState<'logic' | 'algorithm' | 'cyber' | 'problem_solving'>('logic');
  const [achievementFilter, setAchievementFilter] = useState<'all' | 'unlocked' | 'locked' | 'secret'>('all');

  if (!isOpen) return null;

  const currentRank = calculatePlayerRank(stats.xp, stats.achievements?.length || 0);
  const xpInfo = getLevelDataFromXp(stats.xp);
  const activeTitleObj = PLAYER_TITLES.find((t) => t.id === stats.activeTitle) || PLAYER_TITLES[0];

  const todayStr = getTodayDateString();
  const unlockedAchievementsCount = stats.achievements?.length || 0;
  const totalAchievements = ACHIEVEMENTS_DATA.length;

  const foundCollectiblesCount = stats.collectibles?.length || 0;
  const totalCollectibles = COLLECTIBLES_DATA.length;

  const masteryCategories: { key: MasteryCategory; name: string; icon: string }[] = [
    { key: 'pattern', name: 'Pattern Recognition', icon: '🧩' },
    { key: 'logic', name: 'Boolean Logic', icon: '🧠' },
    { key: 'algorithm', name: 'Algoritma & Sorting', icon: '💻' },
    { key: 'debugging', name: 'Debugging & Inspection', icon: '🐞' },
    { key: 'path_finding', name: 'Path Finding & Rute', icon: '🧭' },
    { key: 'cyber_security', name: 'Cyber Security & Ethics', icon: '🔐' },
  ];

  const unopenedChestsCount = stats.rewardChests?.filter((c) => !c.opened).length || 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        >
          {/* Top Modal Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                  PROGRESS CENTER
                </h2>
                <p className="text-xs text-slate-400">
                  Perkembangan Karakter, Rank, Skill Tree & Prestasi Belajar
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unopenedChestsCount > 0 && onOpenChest && (
                <button
                  id="progress-unopened-chest-btn"
                  onClick={() => {
                    sounds.playClick();
                    onOpenChest();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-bold animate-pulse cursor-pointer hover:bg-amber-500/30"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>{unopenedChestsCount} Peti!</span>
                </button>
              )}

              <button
                id="progress-close-btn"
                onClick={() => {
                  sounds.playClick();
                  onClose();
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-800/80 bg-slate-950/40 overflow-x-auto scrollbar-none shrink-0 text-xs font-bold">
            <button
              id="progress-tab-overview"
              onClick={() => {
                sounds.playClick();
                setActiveTab('overview');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>RINGKASAN</span>
            </button>

            <button
              id="progress-tab-skills"
              onClick={() => {
                sounds.playClick();
                setActiveTab('skills');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'skills'
                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>SKILL TREE</span>
            </button>

            <button
              id="progress-tab-achievements"
              onClick={() => {
                sounds.playClick();
                setActiveTab('achievements');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'achievements'
                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>ACHIEVEMENTS ({unlockedAchievementsCount}/{totalAchievements})</span>
            </button>

            <button
              id="progress-tab-collection"
              onClick={() => {
                sounds.playClick();
                setActiveTab('collection');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'collection'
                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>KOLEKSI ({foundCollectiblesCount}/{totalCollectibles})</span>
            </button>

            <button
              id="progress-tab-daily"
              onClick={() => {
                sounds.playClick();
                setActiveTab('daily');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'daily'
                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>MISI HARIAN</span>
              <span className="flex items-center gap-0.5 ml-1 text-rose-400">
                <Flame className="w-3 h-3 fill-rose-500" />
                {stats.streak || 1}
              </span>
            </button>
          </div>

          {/* Modal Tab Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Profile Hero Card */}
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-800/90 via-slate-800/40 to-slate-900 border border-slate-700/80 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Left: Avatar & Identity */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400/50 flex items-center justify-center text-3xl sm:text-4xl shadow-inner shrink-0">
                        {stats.playerAvatar === 'student_girl' ? '👧' : '🧑‍💻'}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl sm:text-2xl font-black text-white">
                            {stats.playerName || 'PETUALANG'}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold">
                            [{activeTitleObj.title}]
                          </span>
                        </div>

                        {/* Title Selector Picker */}
                        <div className="mt-1 flex items-center gap-1.5 flex-wrap text-xs text-slate-400">
                          <span>Gelar Aktif:</span>
                          <select
                            id="progress-active-title-select"
                            value={stats.activeTitle || 'title_beginner'}
                            onChange={(e) => onSelectTitle(e.target.value)}
                            className="bg-slate-800 border border-slate-700 text-cyan-300 font-semibold rounded-lg px-2 py-0.5 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
                          >
                            {(stats.unlockedTitles || ['title_beginner']).map((tId) => {
                              const titleData = PLAYER_TITLES.find((t) => t.id === tId);
                              return (
                                <option key={tId} value={tId}>
                                  {titleData ? `${titleData.badge} ${titleData.title}` : tId}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        {/* Rank Badge Indicator */}
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border ${currentRank.badgeColor}`}>
                            <span>{currentRank.emblem}</span>
                            <span>{currentRank.title}</span>
                          </span>
                          <span className="text-xs text-slate-400">
                            Rank {currentRank.rank}/8
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Streak & Coins */}
                    <div className="flex items-center gap-2 sm:flex-col sm:items-end w-full sm:w-auto">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-300 text-xs font-black">
                        <Coins className="w-4 h-4 text-amber-400" />
                        <span>{stats.coins ?? 0} COINS</span>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs font-black">
                        <Flame className="w-4 h-4 fill-rose-500 text-rose-400" />
                        <span>{stats.streak || 1} HARI STREAK</span>
                      </div>
                    </div>
                  </div>

                  {/* Level & XP Progress Bar */}
                  <div className="mt-6 pt-5 border-t border-slate-700/60">
                    <div className="flex justify-between items-baseline mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-black text-cyan-400">
                          LEVEL {xpInfo.level}
                        </span>
                        <span className="text-xs text-slate-400">
                          ({xpInfo.progressPercent}% menuju Level {xpInfo.level + 1})
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-300">
                        {stats.xp} XP / {stats.xp + (xpInfo.nextLevelXp - xpInfo.currentLevelXp)} XP
                      </span>
                    </div>

                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700/60 p-0.5">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${xpInfo.progressPercent}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                    <span className="text-xs text-slate-400 font-semibold block mb-1">Level Terselesaikan</span>
                    <span className="text-lg font-black text-white">{stats.completedLevels.length} / 5</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                    <span className="text-xs text-slate-400 font-semibold block mb-1">Achievements</span>
                    <span className="text-lg font-black text-amber-400">{unlockedAchievementsCount} / {totalAchievements}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                    <span className="text-xs text-slate-400 font-semibold block mb-1">Clue Terungkap</span>
                    <span className="text-lg font-black text-cyan-400">{stats.discoveredClues?.length || 0} / 6</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                    <span className="text-xs text-slate-400 font-semibold block mb-1">Collectible Item</span>
                    <span className="text-lg font-black text-emerald-400">{foundCollectiblesCount} / {totalCollectibles}</span>
                  </div>
                </div>

                {/* 6 Category Mastery Meters */}
                <div className="p-5 rounded-3xl bg-slate-800/40 border border-slate-700/70 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <Brain className="w-4 h-4 text-cyan-400" />
                        <span>KEMAMPUAN KOMPUTASIONAL & MASTERY</span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        Setiap challenge yang berhasil diselesaikan mengasah penguasaan materi berikut.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    {masteryCategories.map((cat) => {
                      const val = Math.min(100, Math.max(0, stats.mastery?.[cat.key] ?? 10));
                      const label = getMasteryLabel(val);
                      const isMastered = val >= 100;

                      return (
                        <div key={cat.key} className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-200 flex items-center gap-1.5">
                              <span>{cat.icon}</span>
                              <span>{cat.name}</span>
                            </span>
                            <span className={`font-black ${label.color}`}>
                              {isMastered ? '⭐ MASTERED' : `${val}% ${label.status}`}
                            </span>
                          </div>

                          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700/50">
                            <div
                              className={`h-full transition-all duration-500 ${
                                isMastered
                                  ? 'bg-gradient-to-r from-amber-400 to-yellow-300'
                                  : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                              }`}
                              style={{ width: `${val}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SKILL TREE */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white">POHON KEMAMPUAN LOGIKA (SKILL TREE)</h3>
                    <p className="text-xs text-slate-400">
                      Mencerminkan tahapan pembelajaran komputasional seiring penguasaan tantangan.
                    </p>
                  </div>
                </div>

                {/* Branch Switcher Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'logic', label: '🧠 LOGIC', color: 'border-blue-500 text-blue-300' },
                    { id: 'algorithm', label: '💻 ALGORITHM', color: 'border-cyan-500 text-cyan-300' },
                    { id: 'cyber', label: '🔐 CYBER', color: 'border-emerald-500 text-emerald-300' },
                    { id: 'problem_solving', label: '🔎 PROBLEM SOLVING', color: 'border-purple-500 text-purple-300' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedSkillBranch(b.id as any);
                      }}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        selectedSkillBranch === b.id
                          ? 'bg-slate-800 border-cyan-400 text-white shadow-md'
                          : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>

                {/* Skill Nodes for selected branch */}
                <div className="space-y-3 relative before:absolute before:top-4 before:bottom-4 before:left-6 before:w-0.5 before:bg-slate-700/60">
                  {SKILL_TREE_DATA.filter((s) => s.branch === selectedSkillBranch).map((node) => {
                    const playerBranchLevel = stats.skills?.[selectedSkillBranch] || 1;
                    const isUnlocked = playerBranchLevel >= node.level;

                    return (
                      <div
                        key={node.id}
                        className={`relative flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                          isUnlocked
                            ? 'bg-slate-800/80 border-cyan-500/50 shadow-md shadow-cyan-950/20'
                            : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-70'
                        }`}
                      >
                        {/* Node Circle */}
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 border z-10 ${
                            isUnlocked
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                              : 'bg-slate-800 border-slate-700 text-slate-500'
                          }`}
                        >
                          {isUnlocked ? node.icon : <Lock className="w-4 h-4" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <h4 className={`text-sm font-bold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                              Lv.{node.level} — {node.title}
                            </h4>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-800 border border-slate-700 text-slate-400">
                              {node.educationalCompetency}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            {node.description}
                          </p>

                          <div className="mt-2 text-[11px] font-semibold text-slate-400">
                            {isUnlocked ? (
                              <span className="text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Kompetensi Aktif & Terlatih
                              </span>
                            ) : (
                              <span>Syarat: Selesaikan tantangan {selectedSkillBranch} tingkat {node.level}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: ACHIEVEMENTS */}
            {activeTab === 'achievements' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white">PRESTASI & PENCAPAIAN (18 ACHIEVEMENTS)</h3>
                    <p className="text-xs text-slate-400">
                      Buktikan ketajaman logikamu dan kumpulkan seluruh lencana petualangan.
                    </p>
                  </div>

                  {/* Filter chips */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <button
                      onClick={() => setAchievementFilter('all')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        achievementFilter === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      Semua
                    </button>
                    <button
                      onClick={() => setAchievementFilter('unlocked')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        achievementFilter === 'unlocked' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      Terbuka
                    </button>
                    <button
                      onClick={() => setAchievementFilter('locked')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        achievementFilter === 'locked' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      Terkunci
                    </button>
                    <button
                      onClick={() => setAchievementFilter('secret')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        achievementFilter === 'secret' ? 'bg-purple-500 text-white font-bold' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      Rahasia
                    </button>
                  </div>
                </div>

                {/* Achievements Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {ACHIEVEMENTS_DATA.filter((ach) => {
                    const isUnlocked = stats.achievements?.includes(ach.id);
                    if (achievementFilter === 'unlocked') return isUnlocked;
                    if (achievementFilter === 'locked') return !isUnlocked;
                    if (achievementFilter === 'secret') return ach.isHidden;
                    return true;
                  }).map((ach) => {
                    const isUnlocked = stats.achievements?.includes(ach.id);
                    const currentProg = isUnlocked
                      ? ach.targetProgress
                      : Math.min(ach.targetProgress, stats.achievementProgress?.[ach.id] || 0);

                    const progressPercent = Math.min(100, Math.round((currentProg / ach.targetProgress) * 100));

                    return (
                      <div
                        key={ach.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isUnlocked
                            ? 'bg-slate-800/90 border-amber-500/40 shadow-sm'
                            : 'bg-slate-900/60 border-slate-800'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border ${
                              isUnlocked
                                ? 'bg-amber-500/20 border-amber-400/50'
                                : 'bg-slate-800 border-slate-700 text-slate-600'
                            }`}
                          >
                            {ach.isHidden && !isUnlocked ? '🔒' : ach.icon}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="text-xs sm:text-sm font-black text-white truncate">
                                {ach.isHidden && !isUnlocked ? '???' : ach.title}
                              </h4>
                              {isUnlocked ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[10px] font-black">
                                  SELESAI ✓
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-slate-400">
                                  {currentProg} / {ach.targetProgress}
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                              {ach.isHidden && !isUnlocked
                                ? 'Temukan rahasia tersembunyi di Logic School.'
                                : ach.description}
                            </p>

                            {/* Progress bar */}
                            {!isUnlocked && (
                              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2.5 border border-slate-700/40">
                                <div
                                  className="h-full bg-cyan-500 rounded-full"
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                            )}

                            {/* Rewards chip */}
                            <div className="mt-2.5 flex items-center gap-2 text-[11px] font-bold">
                              <span className="text-cyan-400">+{ach.rewardXp} XP</span>
                              <span className="text-amber-400">+{ach.rewardCoins} Coins</span>
                              {ach.rewardTitleId && (
                                <span className="text-purple-400">🏷️ Gelar</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: COLLECTION BOOK */}
            {activeTab === 'collection' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-800 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">BUKU KOLEKSI & ARTIFAK SEKOLAH</h3>
                    <p className="text-xs text-slate-300">
                      Temukan peninggalan teknologi di berbagai ruangan untuk mengungkap sejarah Logic School.
                    </p>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-black">
                    {foundCollectiblesCount} / {totalCollectibles} DITEMUKAN
                  </div>
                </div>

                {/* Collection Milestones */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className={`p-2.5 rounded-xl border ${foundCollectiblesCount >= 3 ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                    <span className="block font-bold">3 Koleksi</span>
                    <span className="text-[10px]">+50 XP {foundCollectiblesCount >= 3 && '✓'}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${foundCollectiblesCount >= 5 ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                    <span className="block font-bold">5 Koleksi</span>
                    <span className="text-[10px]">+100 XP {foundCollectiblesCount >= 5 && '✓'}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${foundCollectiblesCount >= 8 ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                    <span className="block font-bold">Semua Koleksi</span>
                    <span className="text-[10px]">Special Badge {foundCollectiblesCount >= 8 && '✓'}</span>
                  </div>
                </div>

                {/* Collectibles Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {COLLECTIBLES_DATA.map((col) => {
                    const isFound = stats.collectibles?.includes(col.id) || stats.collectedItems?.includes(col.id);

                    return (
                      <div
                        key={col.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isFound
                            ? 'bg-slate-800/80 border-cyan-500/40'
                            : 'bg-slate-900/60 border-slate-800 text-slate-500'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <div
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 border ${
                              isFound
                                ? 'bg-cyan-500/20 border-cyan-400/50 shadow-inner'
                                : 'bg-slate-800 border-slate-700 text-slate-600'
                            }`}
                          >
                            {isFound ? col.icon : '🔒'}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className={`text-sm font-bold truncate ${isFound ? 'text-white' : 'text-slate-400'}`}>
                                {isFound ? col.name : 'Artifak Terkunci'}
                              </h4>
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-800 border border-slate-700 text-slate-400">
                                {col.category}
                              </span>
                            </div>

                            {isFound ? (
                              <>
                                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                                  {col.description}
                                </p>
                                <blockquote className="text-[11px] italic text-cyan-300/80 border-l-2 border-cyan-500/50 pl-2 mt-2">
                                  "{col.lore}"
                                </blockquote>
                              </>
                            ) : (
                              <p className="text-xs text-slate-400 mt-1">
                                Petunjuk lokasi: <span className="text-slate-300">{col.locationHint}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 5: DAILY MISSIONS & STREAK */}
            {activeTab === 'daily' && (
              <div className="space-y-5">
                {/* Streak Banner */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950/40 via-slate-800 to-slate-900 border border-rose-500/40 shadow-lg relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-3xl shrink-0">
                        🔥
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 block">
                          DAILY LEARNING STREAK
                        </span>
                        <h3 className="text-xl font-black text-white">
                          {stats.streak || 1} HARI BERTURUT-TURUT
                        </h3>
                        <p className="text-xs text-slate-300">
                          Selesaikan minimal 1 misi harian setiap hari untuk mempertahankan streak!
                        </p>
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-right">
                      <span className="text-slate-400 block">Tanggal Hari Ini:</span>
                      <span className="text-white font-mono">{todayStr}</span>
                    </div>
                  </div>

                  {/* Streak Milestone Milestones */}
                  <div className="mt-4 pt-4 border-t border-slate-700/60 grid grid-cols-4 gap-2 text-center text-xs">
                    <div className={`p-2 rounded-xl border ${stats.streak >= 3 ? 'bg-rose-950/40 border-rose-500/40 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      <span className="block font-bold">3 Hari</span>
                      <span className="text-[10px]">+50 Coins {stats.streak >= 3 && '✓'}</span>
                    </div>
                    <div className={`p-2 rounded-xl border ${stats.streak >= 7 ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      <span className="block font-bold">7 Hari</span>
                      <span className="text-[10px]">Peti Legendaris {stats.streak >= 7 && '✓'}</span>
                    </div>
                    <div className={`p-2 rounded-xl border ${stats.streak >= 14 ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      <span className="block font-bold">14 Hari</span>
                      <span className="text-[10px]">+200 XP {stats.streak >= 14 && '✓'}</span>
                    </div>
                    <div className={`p-2 rounded-xl border ${stats.streak >= 30 ? 'bg-yellow-950/40 border-yellow-500/40 text-yellow-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      <span className="block font-bold">30 Hari</span>
                      <span className="text-[10px]">Gelar Spesial {stats.streak >= 30 && '✓'}</span>
                    </div>
                  </div>
                </div>

                {/* Daily Mission List */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    TARGET MISI HARI INI
                  </h4>

                  {(stats.dailyMissions || []).map((m) => {
                    const isCompleted = m.isCompleted || m.currentCount >= m.targetCount;
                    const isClaimed = m.isClaimed;

                    return (
                      <div
                        key={m.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                          isClaimed
                            ? 'bg-slate-900/50 border-slate-800 opacity-60'
                            : isCompleted
                            ? 'bg-slate-800/90 border-emerald-500/50 shadow-md'
                            : 'bg-slate-800/60 border-slate-700/60'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border ${
                              isCompleted
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
                                : 'bg-slate-800 border-slate-700 text-slate-400'
                            }`}
                          >
                            {isCompleted ? <Check className="w-5 h-5" /> : '🎯'}
                          </div>

                          <div>
                            <h5 className="text-sm font-bold text-white">{m.title}</h5>
                            <p className="text-xs text-slate-300 mt-0.5">{m.description}</p>

                            <div className="mt-2 flex items-center gap-3 text-xs">
                              <span className="text-slate-400 font-semibold">
                                Progress: {m.currentCount} / {m.targetCount}
                              </span>
                              <span className="text-cyan-400 font-bold">+{m.rewardXp} XP</span>
                              <span className="text-amber-400 font-bold">+{m.rewardCoins} Coins</span>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 w-full sm:w-auto">
                          {isClaimed ? (
                            <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-500 text-xs font-bold block text-center">
                              SUDAH DIKLAIM ✓
                            </span>
                          ) : isCompleted ? (
                            <button
                              id={`claim-mission-${m.id}`}
                              onClick={() => {
                                sounds.playClick();
                                onClaimDailyMission(m.id);
                              }}
                              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Gift className="w-3.5 h-3.5" />
                              <span>KLAIM REWARD</span>
                            </button>
                          ) : (
                            <span className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 text-xs font-semibold block text-center">
                              DALAM PROSES ({m.currentCount}/{m.targetCount})
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
