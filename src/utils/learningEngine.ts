import { 
  MasteryStatus, 
  LearningTopic, 
  LearningProgressData, 
  LearningEvent, 
  PlayerStats, 
  DiagnosticQuestion,
  InformaticsDomainId 
} from '../types';
import { LEARNING_TOPICS, LEARNING_DOMAINS } from '../data/learningData';

/**
 * Converts numeric mastery percentage (0-100) to standard Informatics Mastery Level.
 */
export function getMasteryStatus(percentage: number): {
  status: MasteryStatus;
  label: string;
  badge: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
} {
  const p = Math.max(0, Math.min(100, Math.round(percentage)));

  if (p >= 100) {
    return {
      status: 'MASTERED',
      label: 'TUNTAS / MASTER',
      badge: '👑',
      colorClass: 'text-amber-400',
      bgClass: 'bg-amber-950/40',
      borderClass: 'border-amber-500/50',
    };
  }
  if (p >= 80) {
    return {
      status: 'EXPERT',
      label: 'SANGAT MAHIR',
      badge: '⭐',
      colorClass: 'text-emerald-400',
      bgClass: 'bg-emerald-950/40',
      borderClass: 'border-emerald-500/50',
    };
  }
  if (p >= 60) {
    return {
      status: 'ADVANCED',
      label: 'MAHIR',
      badge: '🔷',
      colorClass: 'text-cyan-400',
      bgClass: 'bg-cyan-950/40',
      borderClass: 'border-cyan-500/50',
    };
  }
  if (p >= 40) {
    return {
      status: 'CAPABLE',
      label: 'CAKAP',
      badge: '🔹',
      colorClass: 'text-blue-400',
      bgClass: 'bg-blue-950/40',
      borderClass: 'border-blue-500/50',
    };
  }
  if (p >= 20) {
    return {
      status: 'DEVELOPING',
      label: 'BERKEMBANG',
      badge: '🌱',
      colorClass: 'text-yellow-400',
      bgClass: 'bg-yellow-950/40',
      borderClass: 'border-yellow-500/50',
    };
  }
  return {
    status: 'INTRODUCED',
    label: 'PERKENALAN',
    badge: '📖',
    colorClass: 'text-slate-400',
    bgClass: 'bg-slate-900/60',
    borderClass: 'border-slate-700/60',
  };
}

/**
 * Calculates new topic mastery when completing a challenge.
 */
export function calculateUpdatedTopicMastery(
  currentMastery: number,
  isCorrect: boolean,
  hintsUsed: number,
  weight: number = 20,
  isReplay: boolean = false
): number {
  if (!isCorrect) {
    // Small penalty if already advanced, but don't drop below 0
    return Math.max(0, currentMastery - 2);
  }

  // Calculate efficiency multiplier based on hints
  const hintMultiplier = Math.max(0.5, 1 - (hintsUsed * 0.25));
  // Diminishing returns on replay
  const replayMultiplier = isReplay ? 0.35 : 1.0;

  const gain = Math.round(weight * hintMultiplier * replayMultiplier);
  const newMastery = Math.min(100, (currentMastery || 0) + Math.max(5, gain));
  return newMastery;
}

/**
 * Recalculates all domain mastery averages based on topic masteries.
 */
export function calculateDomainMasteryAverages(
  topicMasteries: { [topicId: string]: number },
  grade: number = 7
): { [domainId: string]: number } {
  const domainTotals: { [key: string]: { sum: number; count: number } } = {};

  // Initialize for all known domains
  LEARNING_DOMAINS.forEach((d) => {
    domainTotals[d.id] = { sum: 0, count: 0 };
  });

  const gradeTopics = LEARNING_TOPICS.filter((t) => t.grade === grade);

  gradeTopics.forEach((t) => {
    const val = topicMasteries[t.id] || 0;
    if (domainTotals[t.domainId]) {
      domainTotals[t.domainId].sum += val;
      domainTotals[t.domainId].count += 1;
    }
  });

  const result: { [domainId: string]: number } = {};
  Object.keys(domainTotals).forEach((dId) => {
    const item = domainTotals[dId];
    result[dId] = item.count > 0 ? Math.round(item.sum / item.count) : 0;
  });

  return result;
}

/**
 * Generates the Single Primary Learning Recommendation for the Learning Hub banner.
 */
export function getPrimaryLearningRecommendation(
  progress: LearningProgressData | undefined,
  topics: LearningTopic[] = LEARNING_TOPICS
): {
  topic: LearningTopic;
  reason: string;
  actionText: string;
  badgeText: string;
  priority: 'remedial' | 'next_topic' | 'mastery_push' | 'enrichment';
} {
  const p = progress || {
    selectedGrade: 7,
    topicMastery: {},
    domainMastery: {},
    completedTopicIds: [],
    completedChallengeIds: [],
    viewedLessonTopicIds: [],
    diagnosticScores: {},
    remedialCompletedTopicIds: [],
    enrichmentCompletedTopicIds: [],
    errorLog: {},
    learningEvents: [],
  };

  const gradeTopics = topics.filter((t) => t.grade === (p.selectedGrade || 7));

  // 1. Check for Remedial Need (Mastery > 0 but < 60%)
  for (const topic of gradeTopics) {
    const mastery = p.topicMastery[topic.id] || 0;
    if (mastery > 0 && mastery < 60 && topic.remedial) {
      return {
        topic,
        reason: `Penguasaan ${topic.title} (${mastery}%) masih di bawah batas kelulusan 60%. Perkuat kembali pemahaman dasarmu!`,
        actionText: 'MULAI REMEDIAL',
        badgeText: '🛠️ REMEDIAL PERLU',
        priority: 'remedial',
      };
    }
  }

  // 2. Check for Next Incomplete Topic where Prerequisite is satisfied
  for (const topic of gradeTopics) {
    const mastery = p.topicMastery[topic.id] || 0;
    if (mastery === 0) {
      // Check prerequisite
      const isPrereqMet = !topic.prerequisiteId || (p.topicMastery[topic.prerequisiteId] || 0) >= 60;
      if (isPrereqMet) {
        return {
          topic,
          reason: `Siap melanjutkan kurikulum: ${topic.title}. Kuasai konsep baru untuk memperkuat kompetensi informatikamu!`,
          actionText: 'PELAJARI MATERI',
          badgeText: '🎯 MATERI BERIKUTNYA',
          priority: 'next_topic',
        };
      }
    }
  }

  // 3. Check for Mastery Push (60-79%) to reach Expert/80%
  for (const topic of gradeTopics) {
    const mastery = p.topicMastery[topic.id] || 0;
    if (mastery >= 60 && mastery < 80) {
      return {
        topic,
        reason: `Penguasaan ${topic.title} telah mencapai ${mastery}%. Sedikit lagi mencapai ambang Mahir (80%)!`,
        actionText: 'ASAH PENGUASAAN',
        badgeText: '⚡ DORONG KE 80%',
        priority: 'mastery_push',
      };
    }
  }

  // 4. Check for Enrichment eligibility (>=80%)
  for (const topic of gradeTopics) {
    const mastery = p.topicMastery[topic.id] || 0;
    const isEnrichmentDone = p.enrichmentCompletedTopicIds?.includes(topic.id);
    if (mastery >= 80 && !isEnrichmentDone && topic.enrichment) {
      return {
        topic,
        reason: `Kamu telah menuntaskan ${topic.title} dengan nilai tinggi (${mastery}%). Buktikan keahlianmu di Tantangan Pengayaan!`,
        actionText: 'TANTANGAN PENGAYAAN',
        badgeText: '👑 PENGAYAAN TERBUKA',
        priority: 'enrichment',
      };
    }
  }

  // Fallback to first topic
  const fallback = gradeTopics[0] || LEARNING_TOPICS[0];
  return {
    topic: fallback,
    reason: `Mulai jelajahi petualangan logika informatika dari ${fallback.title}.`,
    actionText: 'PELAJARI SEKARANG',
    badgeText: '🌟 MULAI BELAJAR',
    priority: 'next_topic',
  };
}

/**
 * Evaluates quick diagnostic questions and returns comprehensive report.
 */
export function evaluateDiagnosticSubmission(
  answers: { [questionId: string]: string },
  questions: DiagnosticQuestion[]
): {
  scorePercent: number;
  correctCount: number;
  totalCount: number;
  passed: boolean;
  conceptFeedback: { questionTitle: string; isCorrect: boolean; explanation: string }[];
} {
  let correctCount = 0;
  const conceptFeedback = questions.map((q) => {
    const chosenOptionId = answers[q.id];
    const correctOption = q.options.find((o) => o.isCorrect);
    const isCorrect = chosenOptionId === correctOption?.id;
    if (isCorrect) correctCount += 1;

    return {
      questionTitle: q.title,
      isCorrect,
      explanation: q.explanation,
    };
  });

  const totalCount = questions.length;
  const scorePercent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const passed = scorePercent >= 66;

  return {
    scorePercent,
    correctCount,
    totalCount,
    passed,
    conceptFeedback,
  };
}

/**
 * Creates default initial LearningProgressData structure.
 */
export function createDefaultLearningProgress(): LearningProgressData {
  return {
    selectedGrade: 7,
    topicMastery: {
      ct_pattern: 0,
      ct_decomposition: 0,
      ap_sequencing: 0,
      sk_hardware: 0,
      dsi_phishing: 0,
      jki_network_basics: 0,
      ad_data_clustering: 0,
    },
    domainMastery: {
      bk: 0,
      tik: 0,
      sk: 0,
      jki: 0,
      ad: 0,
      ap: 0,
      dsi: 0,
      plb: 0,
    },
    completedTopicIds: [],
    completedChallengeIds: [],
    viewedLessonTopicIds: [],
    diagnosticScores: {},
    remedialCompletedTopicIds: [],
    enrichmentCompletedTopicIds: [],
    errorLog: {},
    learningEvents: [
      {
        timestamp: Date.now(),
        eventType: 'topicStarted',
        topicId: 'ct_pattern',
        detail: 'Siswa memulai eksplorasi kurikulum informatika Kelas VII',
      },
    ],
    lastActiveTopicId: 'ct_pattern',
  };
}
