import { PlayerStats } from '../types';
import { createDefaultLearningProgress } from './learningEngine';

const STORAGE_KEY = 'ags_logic_escape_v1_save';
export const CURRENT_LOGIC_ESCAPE_VERSION = '0.5';

export const DEFAULT_PLAYER_STATS: PlayerStats = {
  playerName: '',
  playerAvatar: 'student_boy',
  score: 0,
  xp: 0,
  coins: 0,
  hearts: 3,
  maxHearts: 3,
  combo: 0,
  maxCombo: 0,
  currentWorld: 1,
  currentLevel: 1,
  completedLevels: [],
  answersCorrect: 0,
  answersWrong: 0,
  hintsUsed: 0,
  inventory: {
    keys: 1,
    hintBoosts: 2,
    extraHearts: 1,
    timeBoosts: 1,
  },
  currentArea: 'main_gate',
  unlockedAreas: ['main_gate'],
  completedAreas: [],
  activeQuestId: 'quest_ch1_main',
  completedQuests: [],
  questProgress: {},
  discoveredClues: [],
  collectedItems: [],
  storyChapter: 1,
  unlockedChapters: [1],
  npcProgress: {},

  // V0.4 Gamification 2.0 defaults
  playerRank: 1,
  playerLevel: 1,
  activeTitle: 'title_beginner',
  unlockedTitles: ['title_beginner'],
  streak: 1,
  lastDailyMissionDate: '',
  dailyMissions: [],
  skills: {
    logic: 1,
    algorithm: 1,
    cyber: 1,
    problem_solving: 1,
  },
  mastery: {
    pattern: 15,
    logic: 15,
    algorithm: 10,
    debugging: 5,
    path_finding: 5,
    cyber_security: 5,
  },
  achievements: [],
  achievementProgress: {},
  collectibles: [],
  claimedEventIds: [],
  rewardChests: [],
  openedChestsCount: 0,
  milestones: [],
  isPracticeMode: false,

  // V0.5 Learning Engine default progress
  learningProgress: createDefaultLearningProgress(),

  startTime: null,
  endTime: null,
  soundEnabled: true,
};

export function loadGameData(): PlayerStats {
  if (typeof window === 'undefined') return { ...DEFAULT_PLAYER_STATS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PLAYER_STATS };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PLAYER_STATS,
      ...parsed,
      inventory: {
        ...DEFAULT_PLAYER_STATS.inventory,
        ...(parsed.inventory || {}),
      },
      unlockedAreas: Array.isArray(parsed.unlockedAreas) && parsed.unlockedAreas.length > 0
        ? parsed.unlockedAreas
        : DEFAULT_PLAYER_STATS.unlockedAreas,
      unlockedChapters: Array.isArray(parsed.unlockedChapters) && parsed.unlockedChapters.length > 0
        ? parsed.unlockedChapters
        : DEFAULT_PLAYER_STATS.unlockedChapters,
      questProgress: parsed.questProgress || {},
      npcProgress: parsed.npcProgress || {},
      completedAreas: parsed.completedAreas || [],
      completedQuests: parsed.completedQuests || [],
      discoveredClues: parsed.discoveredClues || [],
      collectedItems: parsed.collectedItems || [],

      // V0.4 Gamification migration fallbacks
      playerRank: typeof parsed.playerRank === 'number' ? parsed.playerRank : DEFAULT_PLAYER_STATS.playerRank,
      playerLevel: typeof parsed.playerLevel === 'number' ? parsed.playerLevel : DEFAULT_PLAYER_STATS.playerLevel,
      activeTitle: parsed.activeTitle || DEFAULT_PLAYER_STATS.activeTitle,
      unlockedTitles: Array.isArray(parsed.unlockedTitles) && parsed.unlockedTitles.length > 0
        ? parsed.unlockedTitles
        : DEFAULT_PLAYER_STATS.unlockedTitles,
      streak: typeof parsed.streak === 'number' ? Math.max(1, parsed.streak) : DEFAULT_PLAYER_STATS.streak,
      lastDailyMissionDate: parsed.lastDailyMissionDate || '',
      dailyMissions: Array.isArray(parsed.dailyMissions) ? parsed.dailyMissions : [],
      skills: {
        ...DEFAULT_PLAYER_STATS.skills,
        ...(parsed.skills || {}),
      },
      mastery: {
        ...DEFAULT_PLAYER_STATS.mastery,
        ...(parsed.mastery || {}),
      },
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
      achievementProgress: parsed.achievementProgress || {},
      collectibles: Array.isArray(parsed.collectibles) ? parsed.collectibles : [],
      claimedEventIds: Array.isArray(parsed.claimedEventIds) ? parsed.claimedEventIds : [],
      rewardChests: Array.isArray(parsed.rewardChests) ? parsed.rewardChests : [],
      openedChestsCount: typeof parsed.openedChestsCount === 'number' ? parsed.openedChestsCount : 0,
      milestones: Array.isArray(parsed.milestones) ? parsed.milestones : [],
      isPracticeMode: Boolean(parsed.isPracticeMode),

      // V0.5 Learning Progress migration
      learningProgress: {
        ...DEFAULT_PLAYER_STATS.learningProgress!,
        ...(parsed.learningProgress || {}),
        topicMastery: {
          ...DEFAULT_PLAYER_STATS.learningProgress!.topicMastery,
          ...(parsed.learningProgress?.topicMastery || {}),
        },
        domainMastery: {
          ...DEFAULT_PLAYER_STATS.learningProgress!.domainMastery,
          ...(parsed.learningProgress?.domainMastery || {}),
        },
      },
    };
  } catch {
    return { ...DEFAULT_PLAYER_STATS };
  }
}

export function saveGameData(data: PlayerStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function clearGameData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
