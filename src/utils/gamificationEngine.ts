import {
  PlayerStats,
  PlayerRankData,
  AchievementData,
  DailyMissionData,
  MasteryCategory,
  RewardChestData,
} from '../types';
import {
  PLAYER_RANKS,
  XP_LEVEL_THRESHOLDS,
  getLevelDataFromXp,
  ACHIEVEMENTS_DATA,
  generateDeterministicDailyMissions,
} from '../data/gamificationData';

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculatePlayerRank(xp: number, achievementsCount: number): PlayerRankData {
  let highestRank = PLAYER_RANKS[0];
  for (const rank of PLAYER_RANKS) {
    if (xp >= rank.requiredXp && achievementsCount >= rank.requiredAchievements) {
      highestRank = rank;
    }
  }
  return highestRank;
}

export function checkLevelUpEvent(prevXp: number, newXp: number): {
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
} {
  const oldLevel = getLevelDataFromXp(prevXp).level;
  const newLevel = getLevelDataFromXp(newXp).level;
  return {
    leveledUp: newLevel > oldLevel,
    oldLevel,
    newLevel,
  };
}

export function getMasteryLabel(percent: number): {
  status: 'BEGINNER' | 'DEVELOPING' | 'CAPABLE' | 'ADVANCED' | 'EXPERT' | 'MASTER';
  color: string;
} {
  if (percent >= 100) return { status: 'MASTER', color: 'text-amber-400' };
  if (percent >= 81) return { status: 'EXPERT', color: 'text-purple-400' };
  if (percent >= 61) return { status: 'ADVANCED', color: 'text-cyan-400' };
  if (percent >= 41) return { status: 'CAPABLE', color: 'text-blue-400' };
  if (percent >= 21) return { status: 'DEVELOPING', color: 'text-emerald-400' };
  return { status: 'BEGINNER', color: 'text-slate-400' };
}

/**
 * Ensures player's daily missions match today's date
 */
export function ensureDailyMissions(stats: PlayerStats): {
  stats: PlayerStats;
  isNewDay: boolean;
} {
  const today = getTodayDateString();
  if (stats.lastDailyMissionDate === today && stats.dailyMissions && stats.dailyMissions.length > 0) {
    return { stats, isNewDay: false };
  }

  // Generate today's missions deterministically
  const newMissions = generateDeterministicDailyMissions(today);

  return {
    stats: {
      ...stats,
      lastDailyMissionDate: today,
      dailyMissions: newMissions,
    },
    isNewDay: true,
  };
}

/**
 * Increment daily mission progress
 */
export function updateDailyMissionStep(
  missions: DailyMissionData[],
  category: 'puzzle' | 'clue' | 'no_hint' | 'combo' | 'story',
  amount: number = 1
): { updatedMissions: DailyMissionData[]; newlyCompleted: DailyMissionData[] } {
  const newlyCompleted: DailyMissionData[] = [];
  const updatedMissions = missions.map((m) => {
    if (m.isCompleted || m.category !== category) return m;
    const nextCount = Math.min(m.targetCount, m.currentCount + amount);
    const completedNow = nextCount >= m.targetCount;
    if (completedNow) {
      newlyCompleted.push({ ...m, currentCount: nextCount, isCompleted: true });
    }
    return {
      ...m,
      currentCount: nextCount,
      isCompleted: completedNow,
    };
  });

  return { updatedMissions, newlyCompleted };
}

/**
 * Updates streak when daily mission is completed on a day
 */
export function updateStreakOnActiveDay(stats: PlayerStats): {
  newStreak: number;
  streakIncremented: boolean;
  rewardChest?: RewardChestData;
} {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  if (stats.lastStreakDate === today) {
    // Already counted today
    return { newStreak: stats.streak || 1, streakIncremented: false };
  }

  let nextStreak = 1;
  if (stats.lastStreakDate === yesterday) {
    nextStreak = (stats.streak || 0) + 1;
  }

  let rewardChest: RewardChestData | undefined;
  if (nextStreak === 3 && !stats.claimedEventIds.includes('streak_reward_3')) {
    rewardChest = {
      id: `chest_streak_3_${Date.now()}`,
      title: 'Peti Streak 3 Hari',
      source: 'Daily Streak 3 Hari Berturut-turut',
      icon: '🔥',
      opened: false,
      reward: {
        xp: 150,
        coins: 50,
        powerUpName: 'Hint Boost x2',
        powerUpType: 'hint_boost',
      },
    };
  } else if (nextStreak === 7 && !stats.claimedEventIds.includes('streak_reward_7')) {
    rewardChest = {
      id: `chest_streak_7_${Date.now()}`,
      title: 'Peti Legendaris Streak 7 Hari',
      source: 'Daily Streak 7 Hari Penuh Dedikasi',
      icon: '🎁',
      opened: false,
      reward: {
        xp: 300,
        coins: 100,
        powerUpName: 'Extra Heart x2',
        powerUpType: 'extra_heart',
        collectibleId: 'col_lost_note',
      },
    };
  }

  return {
    newStreak: nextStreak,
    streakIncremented: true,
    rewardChest,
  };
}

/**
 * Evaluates all 18 achievements based on current player stats
 */
export function evaluateAchievements(stats: PlayerStats): {
  newlyUnlocked: AchievementData[];
  updatedProgress: { [id: string]: number };
  newAchievementsList: string[];
} {
  const existingUnlocked = new Set(stats.achievements || []);
  const newlyUnlocked: AchievementData[] = [];
  const updatedProgress: { [id: string]: number } = { ...(stats.achievementProgress || {}) };

  for (const ach of ACHIEVEMENTS_DATA) {
    let current = updatedProgress[ach.id] || 0;

    // Evaluate live progress based on player stats
    switch (ach.id) {
      case 'first_step':
        current = stats.completedLevels.length >= 1 ? 1 : 0;
        break;
      case 'puzzle_solver':
        current = stats.answersCorrect || 0;
        break;
      case 'perfect_logic':
        current = stats.milestones.includes('perfect_run_3') ? 3 : (updatedProgress['perfect_logic'] || 0);
        break;
      case 'speed_thinker':
        current = stats.milestones.includes('speed_bonus_earned') ? 1 : 0;
        break;
      case 'explorer':
        current = stats.discoveredClues?.length || 0;
        break;
      case 'collector':
        current = (stats.collectibles?.length || 0) + (stats.collectedItems?.length || 0);
        break;
      case 'master_of_order':
        // tracked via achievementProgress directly
        break;
      case 'bug_hunter':
        // tracked via achievementProgress directly
        break;
      case 'path_finder':
        // tracked via achievementProgress directly
        break;
      case 'cyber_smart':
        // tracked via achievementProgress directly
        break;
      case 'no_hint':
        // tracked via achievementProgress directly
        break;
      case 'combo_master':
        current = stats.maxCombo || 0;
        break;
      case 'story_seeker':
        current = stats.unlockedChapters?.length || 1;
        break;
      case 'logic_master':
        current = stats.completedLevels.length || 0;
        break;
      case 'core_hero':
        current = stats.completedLevels.includes(5) ? 1 : 0;
        break;
      case 'secret_server':
        current = stats.milestones.includes('secret_server_unlocked') ? 1 : 0;
        break;
      case 'byte_bestie':
        // tracked via achievementProgress
        break;
      case 'streak_pioneer':
        current = stats.streak || 0;
        break;
      default:
        break;
    }

    updatedProgress[ach.id] = current;

    if (!existingUnlocked.has(ach.id) && current >= ach.targetProgress) {
      newlyUnlocked.push(ach);
      existingUnlocked.add(ach.id);
    }
  }

  return {
    newlyUnlocked,
    updatedProgress,
    newAchievementsList: Array.from(existingUnlocked),
  };
}
