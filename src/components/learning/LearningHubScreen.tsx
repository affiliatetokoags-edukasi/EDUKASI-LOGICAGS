import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  ArrowLeft, 
  ChevronRight, 
  ChevronDown, 
  Target, 
  Wrench, 
  Crown, 
  BarChart3, 
  Lightbulb, 
  ShieldCheck, 
  Compass,
  Play,
  Award,
  AlertTriangle
} from 'lucide-react';
import { 
  PlayerStats, 
  LearningTopic, 
  InformaticsGrade, 
  InformaticsDomainId,
  LearningProgressData,
  LearningChallenge
} from '../../types';
import { 
  LEARNING_DOMAINS, 
  LEARNING_TOPICS, 
  GRADE_ROADMAP 
} from '../../data/learningData';
import { 
  getMasteryStatus, 
  getPrimaryLearningRecommendation,
  calculateDomainMasteryAverages 
} from '../../utils/learningEngine';
import { ConceptCardModal } from './ConceptCardModal';
import { LearningChallengeModal } from './LearningChallengeModal';
import { DiagnosticModal } from './DiagnosticModal';
import { RemedialModal } from './RemedialModal';
import { EnrichmentModal } from './EnrichmentModal';
import { sounds } from '../../utils/audio';
import { School } from 'lucide-react';

interface LearningHubScreenProps {
  stats: PlayerStats;
  onUpdateStats: (updater: (prev: PlayerStats) => PlayerStats) => void;
  onBackToGame: () => void;
  onOpenTeacherDashboard?: () => void;
}

export const LearningHubScreen: React.FC<LearningHubScreenProps> = ({
  stats,
  onUpdateStats,
  onBackToGame,
  onOpenTeacherDashboard,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<InformaticsGrade>(
    stats.learningProgress?.selectedGrade || 7
  );
  const [activeTab, setActiveTab] = useState<'curriculum' | 'analytics'>('curriculum');
  const [expandedDomainId, setExpandedDomainId] = useState<InformaticsDomainId | null>('bk');

  // Modals state
  const [conceptModalTopic, setConceptModalTopic] = useState<LearningTopic | null>(null);
  const [activeChallengeTopic, setActiveChallengeTopic] = useState<LearningTopic | null>(null);
  const [activeChallengeIndex, setActiveChallengeIndex] = useState<number>(0);
  const [diagnosticTopic, setDiagnosticTopic] = useState<LearningTopic | null>(null);
  const [remedialTopic, setRemedialTopic] = useState<LearningTopic | null>(null);
  const [enrichmentTopic, setEnrichmentTopic] = useState<LearningTopic | null>(null);

  const learningProgress = stats.learningProgress;
  const topicMastery = learningProgress?.topicMastery || {};
  const domainMastery = calculateDomainMasteryAverages(topicMastery, selectedGrade);

  // Grade topics
  const gradeTopics = LEARNING_TOPICS.filter((t) => t.grade === selectedGrade);

  // Overall grade mastery percentage
  const totalMasterySum = gradeTopics.reduce((acc, t) => acc + (topicMastery[t.id] || 0), 0);
  const overallGradeMastery = gradeTopics.length > 0 
    ? Math.round(totalMasterySum / gradeTopics.length) 
    : 0;

  // Single Primary Learning Recommendation
  const primaryRec = getPrimaryLearningRecommendation(learningProgress, gradeTopics);

  // Handlers
  const handleSelectGrade = (grade: InformaticsGrade) => {
    sounds.playClick();
    setSelectedGrade(grade);
    onUpdateStats((prev) => ({
      ...prev,
      learningProgress: {
        ...prev.learningProgress!,
        selectedGrade: grade,
      },
    }));
  };

  const handleLaunchTopicLessons = (topic: LearningTopic) => {
    sounds.playClick();
    setConceptModalTopic(topic);
    // Track event
    onUpdateStats((prev) => ({
      ...prev,
      learningProgress: {
        ...prev.learningProgress!,
        viewedLessonTopicIds: Array.from(
          new Set([...(prev.learningProgress?.viewedLessonTopicIds || []), topic.id])
        ),
      },
    }));
  };

  const handleLaunchTopicChallenge = (topic: LearningTopic, index: number = 0) => {
    sounds.playClick();
    setActiveChallengeTopic(topic);
    setActiveChallengeIndex(index);
  };

  const handleLaunchDiagnostic = (topic: LearningTopic) => {
    sounds.playClick();
    setDiagnosticTopic(topic);
  };

  const handleLaunchRemedial = (topic: LearningTopic) => {
    sounds.playClick();
    setRemedialTopic(topic);
  };

  const handleLaunchEnrichment = (topic: LearningTopic) => {
    sounds.playClick();
    setEnrichmentTopic(topic);
  };

  // Complete a Challenge from the modal
  const handleCompleteChallenge = (
    challenge: LearningChallenge,
    isCorrect: boolean,
    hintsUsed: number
  ) => {
    onUpdateStats((prev) => {
      const lp = prev.learningProgress!;
      const currentVal = lp.topicMastery[challenge.topicId] || 0;
      const alreadyCompleted = lp.completedChallengeIds.includes(challenge.id);

      // Mastery calculation
      const hintMultiplier = Math.max(0.5, 1 - hintsUsed * 0.25);
      const replayMultiplier = alreadyCompleted ? 0.4 : 1.0;
      const gain = isCorrect
        ? Math.round(challenge.masteryWeight * hintMultiplier * replayMultiplier)
        : -2;
      const newMastery = Math.min(100, Math.max(0, currentVal + gain));

      // Error tracking
      const updatedErrorLog = { ...lp.errorLog };
      if (!isCorrect && challenge.conceptKey) {
        updatedErrorLog[challenge.conceptKey] = (updatedErrorLog[challenge.conceptKey] || 0) + 1;
      }

      // Updated stats
      const nextXp = prev.xp + (isCorrect ? challenge.xpReward : 5);
      const nextCoins = (prev.coins ?? 0) + (isCorrect ? challenge.coinReward : 0);

      return {
        ...prev,
        xp: nextXp,
        coins: nextCoins,
        answersCorrect: prev.answersCorrect + (isCorrect ? 1 : 0),
        answersWrong: prev.answersWrong + (isCorrect ? 0 : 1),
        hintsUsed: prev.hintsUsed + hintsUsed,
        learningProgress: {
          ...lp,
          topicMastery: {
            ...lp.topicMastery,
            [challenge.topicId]: newMastery,
          },
          completedChallengeIds: isCorrect
            ? Array.from(new Set([...lp.completedChallengeIds, challenge.id]))
            : lp.completedChallengeIds,
          errorLog: updatedErrorLog,
          learningEvents: [
            ...lp.learningEvents,
            {
              timestamp: Date.now(),
              eventType: isCorrect ? 'answerCorrect' : 'answerWrong',
              topicId: challenge.topicId,
              challengeId: challenge.id,
              detail: `Tantangan ${challenge.title}: ${isCorrect ? 'Benar' : 'Salah'} (Mastery: ${newMastery}%)`,
            },
          ],
        },
      };
    });
  };

  const handleCompleteDiagnostic = (topicId: string, scorePercent: number) => {
    onUpdateStats((prev) => ({
      ...prev,
      learningProgress: {
        ...prev.learningProgress!,
        diagnosticScores: {
          ...prev.learningProgress?.diagnosticScores,
          [topicId]: scorePercent,
        },
        learningEvents: [
          ...(prev.learningProgress?.learningEvents || []),
          {
            timestamp: Date.now(),
            eventType: 'diagnosticCompleted',
            topicId,
            detail: `Tes Diagnostik diselesaikan dengan skor ${scorePercent}%`,
          },
        ],
      },
    }));
  };

  const handleCompleteRemedial = (topicId: string, recoveredMastery: number) => {
    onUpdateStats((prev) => ({
      ...prev,
      learningProgress: {
        ...prev.learningProgress!,
        topicMastery: {
          ...prev.learningProgress?.topicMastery,
          [topicId]: Math.max(prev.learningProgress?.topicMastery[topicId] || 0, recoveredMastery),
        },
        remedialCompletedTopicIds: Array.from(
          new Set([...(prev.learningProgress?.remedialCompletedTopicIds || []), topicId])
        ),
      },
    }));
  };

  const handleCompleteEnrichment = (topicId: string, bonusXp: number, bonusMastery: number) => {
    onUpdateStats((prev) => ({
      ...prev,
      xp: prev.xp + bonusXp,
      coins: (prev.coins ?? 0) + 50,
      learningProgress: {
        ...prev.learningProgress!,
        topicMastery: {
          ...prev.learningProgress?.topicMastery,
          [topicId]: Math.min(100, (prev.learningProgress?.topicMastery[topicId] || 80) + bonusMastery),
        },
        enrichmentCompletedTopicIds: Array.from(
          new Set([...(prev.learningProgress?.enrichmentCompletedTopicIds || []), topicId])
        ),
      },
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16">
      {/* Top Learning Hub Navigation */}
      <div className="sticky top-0 z-30 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              id="learning-hub-back-btn"
              onClick={() => {
                sounds.playClick();
                onBackToGame();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>KEMBALI KE GAME</span>
            </button>

            <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-black text-white leading-tight">
                  LEARNING ENGINE INFORMATIKA
                </h1>
                <p className="text-[11px] text-cyan-400 font-semibold">
                  Kurikulum Merdeka SMP • 8 Domain Utama
                </p>
              </div>
            </div>
          </div>

          {/* Right: Grade Selector & Teacher Dashboard Button */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
              {([7, 8, 9] as InformaticsGrade[]).map((grade) => (
                <button
                  key={grade}
                  id={`grade-tab-${grade}`}
                  onClick={() => handleSelectGrade(grade)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    selectedGrade === grade
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  KELAS {grade === 7 ? 'VII' : grade === 8 ? 'VIII' : 'IX'}
                </button>
              ))}
            </div>

            {onOpenTeacherDashboard && (
              <button
                id="learning-hub-teacher-btn"
                onClick={() => {
                  sounds.playClick();
                  onOpenTeacherDashboard();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-xs font-bold text-indigo-300 hover:text-indigo-100 transition-all cursor-pointer shadow-md shadow-indigo-950/50"
              >
                <School className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline">PANEL GURU</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 w-full space-y-6">
        {/* Grade 8 & 9 Syllabus Roadmap Banner (if selected) */}
        {selectedGrade !== 7 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-3xl bg-indigo-950/40 border border-indigo-500/40 text-indigo-200 flex items-start gap-4"
          >
            <Compass className="w-6 h-6 text-indigo-400 shrink-0 mt-1" />
            <div className="space-y-1.5">
              <span className="text-[11px] font-black uppercase text-indigo-300 tracking-wider">
                SILABUS KURIKULUM LANJUTAN
              </span>
              <h3 className="text-lg font-black text-white">
                {GRADE_ROADMAP[selectedGrade].title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {GRADE_ROADMAP[selectedGrade].description}
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                {GRADE_ROADMAP[selectedGrade].focusCompetencies.map((comp, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-semibold bg-indigo-900/60 border border-indigo-500/30 px-2.5 py-1 rounded-lg text-indigo-200"
                  >
                    • {comp}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Hero Banner: Single Primary Recommended Learning */}
        {selectedGrade === 7 && primaryRec && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950/80 border border-cyan-500/40 shadow-xl"
          >
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{primaryRec.badgeText}</span>
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Domain: {primaryRec.topic.domainId.toUpperCase()}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {primaryRec.topic.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {primaryRec.reason}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  id="primary-rec-lesson-btn"
                  onClick={() => handleLaunchTopicLessons(primaryRec.topic)}
                  className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Buka Konsep</span>
                </button>

                <button
                  id="primary-rec-action-btn"
                  onClick={() => {
                    if (primaryRec.priority === 'remedial') {
                      handleLaunchRemedial(primaryRec.topic);
                    } else if (primaryRec.priority === 'enrichment') {
                      handleLaunchEnrichment(primaryRec.topic);
                    } else {
                      handleLaunchTopicChallenge(primaryRec.topic, 0);
                    }
                  }}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-cyan-600/30 active:scale-98 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{primaryRec.actionText}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Learning Hub Header & Sub-Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              Kurikulum Informatika Kelas {selectedGrade === 7 ? 'VII' : selectedGrade === 8 ? 'VIII' : 'IX'}
            </h2>
            <p className="text-xs text-slate-400">
              Penguasaan Keseluruhan: <strong className="text-cyan-400">{overallGradeMastery}%</strong> • {gradeTopics.length} Modul Terstruktur
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="hub-tab-curriculum-btn"
              onClick={() => {
                sounds.playClick();
                setActiveTab('curriculum');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'curriculum'
                  ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Daftar Modul (8 Domain)</span>
            </button>

            <button
              id="hub-tab-analytics-btn"
              onClick={() => {
                sounds.playClick();
                setActiveTab('analytics');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analitik Belajar</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Curriculum & 8 Domains */}
        {activeTab === 'curriculum' && (
          <div className="space-y-4">
            {LEARNING_DOMAINS.map((domain) => {
              const domainTopics = gradeTopics.filter((t) => t.domainId === domain.id);
              const isExpanded = expandedDomainId === domain.id;
              const avgMastery = domainMastery[domain.id] || 0;
              const masteryInfo = getMasteryStatus(avgMastery);

              return (
                <div
                  key={domain.id}
                  className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-sm"
                >
                  {/* Domain Header Accordion Toggle */}
                  <button
                    id={`domain-header-${domain.id}`}
                    onClick={() => {
                      sounds.playClick();
                      setExpandedDomainId(isExpanded ? null : domain.id);
                    }}
                    className="w-full p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left hover:bg-slate-800/40 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-3xl p-2 rounded-2xl bg-slate-800/90 border border-slate-700/60 shadow-inner">
                        {domain.icon}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-cyan-400 uppercase tracking-wider">
                            DOMAIN {domain.code}
                          </span>
                          <span className="text-slate-600 text-xs">•</span>
                          <span className="text-xs text-slate-400">
                            {domainTopics.length} Topik Pembelajaran
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-white">
                          {domain.name}
                        </h3>
                        <p className="text-xs text-slate-400 max-w-xl line-clamp-1 mt-0.5">
                          {domain.shortDesc}
                        </p>
                      </div>
                    </div>

                    {/* Mastery Bar for Domain */}
                    <div className="flex items-center gap-4 shrink-0 sm:self-center">
                      <div className="flex flex-col items-end gap-1 min-w-[110px]">
                        <span className={`text-xs font-black ${masteryInfo.colorClass}`}>
                          {masteryInfo.label} ({avgMastery}%)
                        </span>
                        <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${avgMastery}%` }}
                            className={`h-full bg-gradient-to-r ${domain.gradient}`}
                          />
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>

                  {/* Domain Expanded Topics List */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
                      {domainTopics.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400 italic">
                          Materi modul untuk domain ini sedang dikembangkan sesuai silabus kurikulum.
                        </div>
                      ) : (
                        domainTopics.map((topic) => {
                          const topicScore = topicMastery[topic.id] || 0;
                          const statusData = getMasteryStatus(topicScore);
                          const isPrereqLocked = Boolean(
                            topic.prerequisiteId && (topicMastery[topic.prerequisiteId] || 0) < 60
                          );
                          const canRemedial = topicScore > 0 && topicScore < 60 && Boolean(topic.remedial);
                          const canEnrichment = topicScore >= 80 && Boolean(topic.enrichment);

                          return (
                            <div
                              key={topic.id}
                              className={`p-4 rounded-2xl border transition-all ${
                                isPrereqLocked
                                  ? 'bg-slate-900/40 border-slate-800/80 opacity-70'
                                  : 'bg-slate-800/60 border-slate-700/70 hover:border-slate-600'
                              }`}
                            >
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="space-y-1.5 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span
                                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusData.bgClass} ${statusData.colorClass} ${statusData.borderClass}`}
                                    >
                                      {statusData.badge} {statusData.label} ({topicScore}%)
                                    </span>
                                    <span className="text-xs font-semibold text-slate-400">
                                      {topic.subtopic}
                                    </span>
                                    {isPrereqLocked && (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/50 border border-rose-500/40 text-rose-300 flex items-center gap-1">
                                        <Lock className="w-3 h-3" />
                                        Prasyarat: Kuasai {topic.prerequisiteTitle || 'Topik Sebelumnya'} (min. 60%)
                                      </span>
                                    )}
                                  </div>

                                  <h4 className="text-base font-black text-white">
                                    {topic.title}
                                  </h4>

                                  <p className="text-xs text-slate-300 leading-relaxed">
                                    <strong className="text-cyan-300">Tujuan Pembelajaran:</strong> {topic.objective}
                                  </p>

                                  <p className="text-xs text-amber-300/90 font-medium">
                                    🎯 <strong>Target Misi:</strong> {topic.missionTarget}
                                  </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center gap-2 shrink-0">
                                  {/* Diagnostic Button */}
                                  {topic.diagnosticQuestions && topic.diagnosticQuestions.length > 0 && (
                                    <button
                                      id={`topic-diagnostic-btn-${topic.id}`}
                                      disabled={isPrereqLocked}
                                      onClick={() => handleLaunchDiagnostic(topic)}
                                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                                      title="Tes Cepat Diagnostik Awal"
                                    >
                                      <Target className="w-3.5 h-3.5" />
                                      <span className="hidden sm:inline">Diagnostik</span>
                                    </button>
                                  )}

                                  {/* Micro Lesson Button */}
                                  <button
                                    id={`topic-lesson-btn-${topic.id}`}
                                    disabled={isPrereqLocked}
                                    onClick={() => handleLaunchTopicLessons(topic)}
                                    className="px-3 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                                  >
                                    <BookOpen className="w-3.5 h-3.5" />
                                    <span>Pelajari ({topic.microLessons.length} Kartu)</span>
                                  </button>

                                  {/* Main Challenge Button */}
                                  <button
                                    id={`topic-challenge-btn-${topic.id}`}
                                    disabled={isPrereqLocked}
                                    onClick={() => handleLaunchTopicChallenge(topic, 0)}
                                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-md shadow-cyan-600/30 transition-all cursor-pointer flex items-center gap-1.5"
                                  >
                                    <Play className="w-3.5 h-3.5 fill-white" />
                                    <span>Tantangan ({topic.challenges.length})</span>
                                  </button>

                                  {/* Remedial Button if < 60% */}
                                  {canRemedial && (
                                    <button
                                      id={`topic-remedial-btn-${topic.id}`}
                                      onClick={() => handleLaunchRemedial(topic)}
                                      className="px-3 py-2 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-300 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 animate-pulse"
                                      title="Tingkatkan penguasaan di bawah 60%"
                                    >
                                      <Wrench className="w-3.5 h-3.5" />
                                      <span>Remedial</span>
                                    </button>
                                  )}

                                  {/* Enrichment Button if >= 80% */}
                                  {canEnrichment && (
                                    <button
                                      id={`topic-enrichment-btn-${topic.id}`}
                                      onClick={() => handleLaunchEnrichment(topic)}
                                      className="px-3 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-300 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5"
                                      title="Tantangan Master Pengayaan"
                                    >
                                      <Crown className="w-3.5 h-3.5 text-purple-400" />
                                      <span>Pengayaan</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Learning Analytics / Student Learning Dashboard */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-slate-400">Penguasaan Rata-Rata</span>
                <div className="text-3xl font-black text-cyan-400">{overallGradeMastery}%</div>
                <p className="text-[11px] text-slate-500">Kelas VII Informatika</p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-slate-400">Tantangan Diselesaikan</span>
                <div className="text-3xl font-black text-emerald-400">
                  {learningProgress?.completedChallengeIds?.length || 0}
                </div>
                <p className="text-[11px] text-slate-500">Total soal tuntas</p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-slate-400">Kartu Materi Dibaca</span>
                <div className="text-3xl font-black text-amber-400">
                  {learningProgress?.viewedLessonTopicIds?.length || 0}
                </div>
                <p className="text-[11px] text-slate-500">Topik telah dipelajari</p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-slate-400">Akurasi Jawaban</span>
                <div className="text-3xl font-black text-purple-400">
                  {stats.answersCorrect + stats.answersWrong > 0
                    ? `${Math.round((stats.answersCorrect / (stats.answersCorrect + stats.answersWrong)) * 100)}%`
                    : '100%'}
                </div>
                <p className="text-[11px] text-slate-500">{stats.answersCorrect} benar, {stats.answersWrong} salah</p>
              </div>
            </div>

            {/* Error Log / Concept Analysis */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">
                  Analisis Kesalahan Konsep (Error Log Engine)
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Sistem secara otomatis mendeteksi konsep mana yang sering memerlukan latihan ekstra untuk meningkatkan pemahamanmu.
              </p>

              {Object.keys(learningProgress?.errorLog || {}).length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 text-center text-xs text-emerald-400 font-semibold">
                  ✨ Belum ada catatan kesalahan konsep. Pertahankan pemahaman yang luar biasa!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(learningProgress?.errorLog || {}).map(([key, count]) => (
                    <div
                      key={key}
                      className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-between"
                    >
                      <span className="text-xs font-bold text-slate-200 uppercase">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs font-black text-rose-400 bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-500/30">
                        {count}x kekeliruan
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Learning Timeline */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                <span>Linimasa Aktivitas Belajar Terakhir</span>
              </h3>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {(learningProgress?.learningEvents || []).slice(-10).reverse().map((ev, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs flex items-center justify-between"
                  >
                    <span className="text-slate-200">{ev.detail || ev.eventType}</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ConceptCardModal
        isOpen={Boolean(conceptModalTopic)}
        topic={conceptModalTopic}
        onClose={() => setConceptModalTopic(null)}
        onStartChallenge={(topic) => {
          setConceptModalTopic(null);
          handleLaunchTopicChallenge(topic, 0);
        }}
      />

      <LearningChallengeModal
        isOpen={Boolean(activeChallengeTopic)}
        topic={activeChallengeTopic}
        challengeIndex={activeChallengeIndex}
        onClose={() => setActiveChallengeTopic(null)}
        onCompleteChallenge={handleCompleteChallenge}
        onOpenConceptCards={() => {
          if (activeChallengeTopic) {
            setConceptModalTopic(activeChallengeTopic);
          }
        }}
        onNextChallenge={() => {
          if (
            activeChallengeTopic &&
            activeChallengeIndex < activeChallengeTopic.challenges.length - 1
          ) {
            setActiveChallengeIndex((prev) => prev + 1);
          } else {
            setActiveChallengeTopic(null);
          }
        }}
        hasNextChallenge={
          Boolean(activeChallengeTopic && activeChallengeIndex < activeChallengeTopic.challenges.length - 1)
        }
      />

      <DiagnosticModal
        isOpen={Boolean(diagnosticTopic)}
        topic={diagnosticTopic}
        onClose={() => setDiagnosticTopic(null)}
        onCompleteDiagnostic={handleCompleteDiagnostic}
        onOpenLessons={(topic) => {
          setDiagnosticTopic(null);
          setConceptModalTopic(topic);
        }}
        onOpenChallenges={(topic) => {
          setDiagnosticTopic(null);
          handleLaunchTopicChallenge(topic, 0);
        }}
      />

      <RemedialModal
        isOpen={Boolean(remedialTopic)}
        topic={remedialTopic}
        onClose={() => setRemedialTopic(null)}
        onCompleteRemedial={handleCompleteRemedial}
      />

      <EnrichmentModal
        isOpen={Boolean(enrichmentTopic)}
        topic={enrichmentTopic}
        onClose={() => setEnrichmentTopic(null)}
        onCompleteEnrichment={handleCompleteEnrichment}
      />
    </div>
  );
};
