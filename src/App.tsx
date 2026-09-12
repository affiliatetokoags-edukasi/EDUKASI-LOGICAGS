/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ScreenType, PlayerStats, FeedbackState, RoomHotspot, NPCData, ClueData, RewardChestData } from './types';
import { LEVELS_DATA } from './data/levels';
import { ROOMS_DATA, NPCS_DATA, CLUES_DATA, QUESTS_DATA, STORY_CHAPTERS } from './data/worldData';
import { loadGameData, saveGameData, clearGameData, DEFAULT_PLAYER_STATS } from './utils/storage';
import { sounds } from './utils/audio';

import { GameHUD } from './components/GameHUD';
import { HomeScreen } from './components/HomeScreen';
import { PlayerSetup } from './components/PlayerSetup';
import { GameIntro } from './components/GameIntro';
import { WorldMap } from './components/WorldMap';
import { LevelScreen } from './components/LevelScreen';
import { GameResult } from './components/GameResult';
import { HowToPlayModal } from './components/HowToPlayModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { FeedbackModal } from './components/FeedbackModal';
import { InventoryModal } from './components/InventoryModal';

import { RoomView } from './components/world/RoomView';
import { NpcDialogueModal } from './components/world/NpcDialogueModal';
import { HotspotInteractionModal } from './components/world/HotspotInteractionModal';
import { JournalModal } from './components/world/JournalModal';
import { ChapterCinematicModal } from './components/world/ChapterCinematicModal';

// V0.4 Gamification 2.0 Components & Data
import { CelebrationModal, CelebrationData } from './components/gamification/CelebrationModal';
import { RewardChestModal } from './components/gamification/RewardChestModal';
import { ProgressCenterModal } from './components/gamification/ProgressCenterModal';
import { LearningHubScreen } from './components/learning/LearningHubScreen';
import { TeacherDashboardScreen } from './components/teacher/TeacherDashboardScreen';
import {
  calculatePlayerRank,
  checkLevelUpEvent,
  ensureDailyMissions,
  updateDailyMissionStep,
  updateStreakOnActiveDay,
  evaluateAchievements,
  getTodayDateString,
} from './utils/gamificationEngine';
import { PLAYER_RANKS, PLAYER_TITLES, ACHIEVEMENTS_DATA } from './data/gamificationData';

export default function App() {
  const [stats, setStats] = useState<PlayerStats>(() => {
    const loaded = loadGameData();
    const { stats: syncedStats } = ensureDailyMissions(loaded);
    return syncedStats;
  });
  const [screen, setScreen] = useState<ScreenType>('home');
  const [activeLevelId, setActiveLevelId] = useState<number>(1);
  const [howToPlayOpen, setHowToPlayOpen] = useState<boolean>(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState<boolean>(false);
  const [inventoryOpen, setInventoryOpen] = useState<boolean>(false);
  const [journalOpen, setJournalOpen] = useState<boolean>(false);

  // V0.4 Gamification Modals State
  const [progressCenterOpen, setProgressCenterOpen] = useState<boolean>(false);
  const [activeChestModal, setActiveChestModal] = useState<{
    isOpen: boolean;
    chest: RewardChestData | null;
  }>({
    isOpen: false,
    chest: null,
  });
  const [celebrationData, setCelebrationData] = useState<CelebrationData>({
    isOpen: false,
    type: 'achievement',
    title: '',
    description: '',
  });

  // V0.3 World & Exploration Modals State
  const [activeNpcModal, setActiveNpcModal] = useState<{
    isOpen: boolean;
    npc: NPCData | null;
    dialogueLines: string[];
  }>({
    isOpen: false,
    npc: null,
    dialogueLines: [],
  });

  const [activeHotspotModal, setActiveHotspotModal] = useState<{
    isOpen: boolean;
    hotspot: RoomHotspot | null;
    clue?: ClueData | null;
  }>({
    isOpen: false,
    hotspot: null,
    clue: null,
  });

  const [cinematicModal, setCinematicModal] = useState<{
    isOpen: boolean;
    type: 'chapter' | 'area_unlock';
    title: string;
    subtitle: string;
    description: string;
    icon?: string;
  }>({
    isOpen: false,
    type: 'chapter',
    title: '',
    subtitle: '',
    description: '',
  });

  const [feedback, setFeedback] = useState<FeedbackState>({
    isOpen: false,
    isCorrect: false,
    title: '',
    message: '',
  });

  // Sync sound settings with audio manager
  useEffect(() => {
    sounds.setEnabled(stats.soundEnabled);
  }, [stats.soundEnabled]);

  // Persist game state whenever stats change
  useEffect(() => {
    saveGameData(stats);
  }, [stats]);

  const updateStats = (updater: (prev: PlayerStats) => PlayerStats) => {
    setStats((prev) => {
      const intermediate = updater(prev);
      return triggerGamificationChecks(prev, intermediate);
    });
  };

  // Gamification 2.0 automatic trigger evaluator
  const triggerGamificationChecks = (prev: PlayerStats, next: PlayerStats): PlayerStats => {
    let updated = { ...next };

    // 1. Check Level Up
    const levelUpInfo = checkLevelUpEvent(prev.xp, next.xp);
    if (levelUpInfo.leveledUp) {
      updated.playerLevel = levelUpInfo.newLevel;
      updated.coins = (updated.coins ?? 0) + 50;
      const inv = updated.inventory || { keys: 0, hintBoosts: 0, extraHearts: 0, timeBoosts: 0 };
      updated.inventory = { ...inv, hintBoosts: inv.hintBoosts + 1 };
      setCelebrationData({
        isOpen: true,
        type: 'level_up',
        title: `LEVEL UP! LEVEL ${levelUpInfo.newLevel}`,
        subtitle: 'Kapasitas Logika & Analisis Meningkat',
        description: 'Selamat! Pola pikirmu semakin matang dalam menyelesaikan tantangan komputasi.',
        icon: '✨',
        coinsGained: 50,
        rewardText: 'Hint Boost x1',
      });
    }

    // 2. Check Rank Up
    const prevRank = calculatePlayerRank(prev.xp, prev.achievements?.length || 0);
    const nextRank = calculatePlayerRank(updated.xp, updated.achievements?.length || 0);
    if (nextRank.rank > (prev.playerRank || 1)) {
      updated.playerRank = nextRank.rank;
      updated.xp = updated.xp + 100;
      updated.coins = (updated.coins ?? 0) + 50;
      setCelebrationData({
        isOpen: true,
        type: 'rank_up',
        title: `RANK UP: ${nextRank.title}`,
        subtitle: `Pangkat Tingkat ${nextRank.rank}/8 Dicapai!`,
        description: nextRank.description,
        icon: nextRank.emblem,
        xpGained: 100,
        coinsGained: 50,
      });
    }

    // 3. Evaluate Achievements
    const achCheck = evaluateAchievements(updated);
    updated.achievements = achCheck.newAchievementsList;
    updated.achievementProgress = achCheck.updatedProgress;

    if (achCheck.newlyUnlocked.length > 0) {
      const ach = achCheck.newlyUnlocked[0];
      updated.xp = updated.xp + ach.rewardXp;
      updated.coins = (updated.coins ?? 0) + ach.rewardCoins;
      if (ach.rewardTitleId && !updated.unlockedTitles?.includes(ach.rewardTitleId)) {
        updated.unlockedTitles = [...(updated.unlockedTitles || []), ach.rewardTitleId];
      }

      const titleName = ach.rewardTitleId ? PLAYER_TITLES.find(t => t.id === ach.rewardTitleId)?.title : undefined;
      setCelebrationData({
        isOpen: true,
        type: ach.isHidden ? 'secret_achievement' : 'achievement',
        title: ach.title,
        subtitle: ach.category.toUpperCase(),
        description: ach.description,
        icon: ach.icon,
        xpGained: ach.rewardXp,
        coinsGained: ach.rewardCoins,
        titleUnlocked: titleName,
      });
    }

    return updated;
  };

  // Gamification Action Handlers
  const handleClaimDailyMission = (missionId: string) => {
    updateStats((prev) => {
      const missions = prev.dailyMissions || [];
      const target = missions.find((m) => m.id === missionId);
      if (!target || target.isClaimed || !target.isCompleted) return prev;

      const eventId = `claim_${missionId}`;
      if (prev.claimedEventIds?.includes(eventId)) return prev;

      sounds.playCoin();

      const updatedMissions = missions.map((m) => (m.id === missionId ? { ...m, isClaimed: true } : m));
      const nextClaimedIds = [...(prev.claimedEventIds || []), eventId];

      const streakUpdate = updateStreakOnActiveDay(prev);
      let nextRewardChests = [...(prev.rewardChests || [])];
      if (streakUpdate.rewardChest) {
        nextRewardChests.push(streakUpdate.rewardChest);
        setActiveChestModal({ isOpen: true, chest: streakUpdate.rewardChest });
      }

      return {
        ...prev,
        dailyMissions: updatedMissions,
        claimedEventIds: nextClaimedIds,
        xp: prev.xp + target.rewardXp,
        coins: (prev.coins ?? 0) + target.rewardCoins,
        streak: streakUpdate.newStreak,
        lastStreakDate: getTodayDateString(),
        rewardChests: nextRewardChests,
      };
    });
  };

  const handleClaimChestReward = (chest: RewardChestData) => {
    updateStats((prev) => {
      const chests = (prev.rewardChests || []).map((c) => (c.id === chest.id ? { ...c, opened: true } : c));
      const inv = prev.inventory || { keys: 0, hintBoosts: 0, extraHearts: 0, timeBoosts: 0 };
      const nextInv = { ...inv };

      if (chest.reward.powerUpType === 'hint_boost') nextInv.hintBoosts += 2;
      if (chest.reward.powerUpType === 'extra_heart') nextInv.extraHearts += 2;

      let nextCollectibles = [...(prev.collectibles || [])];
      if (chest.reward.collectibleId && !nextCollectibles.includes(chest.reward.collectibleId)) {
        nextCollectibles.push(chest.reward.collectibleId);
      }

      return {
        ...prev,
        rewardChests: chests,
        openedChestsCount: (prev.openedChestsCount || 0) + 1,
        xp: prev.xp + chest.reward.xp,
        coins: (prev.coins ?? 0) + chest.reward.coins,
        inventory: nextInv,
        collectibles: nextCollectibles,
      };
    });
  };

  const handleSelectTitle = (titleId: string) => {
    sounds.playClick();
    updateStats((prev) => ({
      ...prev,
      activeTitle: titleId,
    }));
  };

  // Determine current active quest based on story chapter or questProgress
  const currentChapter = stats.storyChapter || 1;
  const activeQuestId = `quest_ch${Math.min(5, Math.max(1, currentChapter))}_main`;
  const currentQuest = QUESTS_DATA[activeQuestId] || QUESTS_DATA['quest_ch1_main'];
  const currentQuestProgress = stats.questProgress?.[activeQuestId] || [];

  // Helper to complete a quest objective
  const completeObjective = (questId: string, objectiveId: string) => {
    updateStats((prev) => {
      const existing = prev.questProgress?.[questId] || [];
      if (existing.includes(objectiveId)) return prev;

      const updatedObjectives = [...existing, objectiveId];
      const targetQuest = QUESTS_DATA[questId];
      const allDone = targetQuest && targetQuest.objectives.every(o => updatedObjectives.includes(o.id));

      const updatedCompletedQuests = allDone && !prev.completedQuests?.includes(questId)
        ? [...(prev.completedQuests || []), questId]
        : prev.completedQuests || [];

      if (allDone) {
        sounds.playQuestComplete();
      }

      return {
        ...prev,
        questProgress: {
          ...(prev.questProgress || {}),
          [questId]: updatedObjectives,
        },
        completedQuests: updatedCompletedQuests,
      };
    });
  };

  const handleStartGame = () => {
    if (stats.playerName && stats.playerName.trim().length >= 2) {
      setScreen('room');
    } else {
      setScreen('player_setup');
    }
  };

  const handleConfirmPlayerName = (name: string) => {
    updateStats((prev) => ({
      ...prev,
      playerName: name,
      startTime: prev.startTime || Date.now(),
    }));
    setScreen('intro');
  };

  const handleStartMission = () => {
    // Show Chapter 1 intro cinematic
    setCinematicModal({
      isOpen: true,
      type: 'chapter',
      title: 'CHAPTER 1: THE LOCKED SCHOOL',
      subtitle: 'Gerbang Terkunci & Misteri Logic School',
      description: 'Sistem sekolah terkunci secara otomatis. Bersama Nara, cari petunjuk di sekitar gerbang dan temukan urutan pola untuk membuka akses menuju Hall Utama.',
      icon: '🏫',
    });
    setScreen('room');
  };

  const handleSelectLevel = (levelId: number) => {
    setActiveLevelId(levelId);
    updateStats((prev) => ({
      ...prev,
      currentLevel: levelId,
      hearts: Math.max(1, prev.hearts ?? 3),
    }));
    setScreen('level');
  };

  const handleSelectArea = (areaId: string) => {
    updateStats((prev) => ({
      ...prev,
      currentArea: areaId,
    }));
    setScreen('room');
  };

  const handleAnswerAttempt = (isCorrect: boolean) => {
    updateStats((prev) => {
      const currentCombo = prev.combo ?? 0;
      const nextCombo = isCorrect ? currentCombo + 1 : 0;
      const maxCombo = Math.max(prev.maxCombo || 0, nextCombo);
      
      if (isCorrect && nextCombo > 1) {
        sounds.playCombo();
      }

      let dm = prev.dailyMissions || [];
      if (isCorrect) {
        dm = updateDailyMissionStep(dm, 'puzzle', 1).updatedMissions;
        if (nextCombo >= 3) {
          dm = updateDailyMissionStep(dm, 'combo', 1).updatedMissions;
        }
      }

      const milestones = [...(prev.milestones || [])];
      if (nextCombo >= 3 && !milestones.includes('streak_3_correct')) {
        milestones.push('streak_3_correct');
      }

      return {
        ...prev,
        answersCorrect: isCorrect ? prev.answersCorrect + 1 : prev.answersCorrect,
        answersWrong: !isCorrect ? prev.answersWrong + 1 : prev.answersWrong,
        combo: nextCombo,
        maxCombo,
        dailyMissions: dm,
        milestones,
      };
    });
  };

  const handleHeartLost = () => {
    updateStats((prev) => ({
      ...prev,
      hearts: Math.max(0, (prev.hearts ?? 3) - 1),
      combo: 0,
    }));
  };

  const handleResetHearts = () => {
    updateStats((prev) => ({
      ...prev,
      hearts: prev.maxHearts ?? 3,
    }));
  };

  const handleUseExtraHeart = () => {
    updateStats((prev) => {
      const currentHearts = prev.hearts ?? 3;
      const maxHearts = prev.maxHearts ?? 3;
      const extraHearts = prev.inventory?.extraHearts ?? 0;

      if (extraHearts <= 0 || currentHearts >= maxHearts) return prev;

      return {
        ...prev,
        hearts: currentHearts + 1,
        inventory: {
          ...prev.inventory,
          extraHearts: extraHearts - 1,
        },
      };
    });
  };

  const handleUseHintBoost = () => {
    updateStats((prev) => {
      const hintBoosts = prev.inventory?.hintBoosts ?? 0;
      if (hintBoosts <= 0) return prev;

      return {
        ...prev,
        inventory: {
          ...prev.inventory,
          hintBoosts: hintBoosts - 1,
        },
      };
    });
  };

  const handleCompleteLevel = (
    levelId: number,
    xpGained: number,
    scoreGained: number,
    coinsGained: number
  ) => {
    const isLevel5 = levelId === 5;
    const now = Date.now();

    // Map level completion to world areas and quests
    const areaUnlockMap: Record<number, { areaId: string; areaName: string; nextChapter: number }> = {
      1: { areaId: 'school_hall', areaName: 'School Hall', nextChapter: 2 },
      2: { areaId: 'computer_lab', areaName: 'Computer Lab', nextChapter: 2 },
      3: { areaId: 'digital_lab', areaName: 'Digital Lab', nextChapter: 3 },
      4: { areaId: 'cyber_security', areaName: 'Cyber Security Room', nextChapter: 4 },
      5: { areaId: 'core_room', areaName: 'Logic Core Room', nextChapter: 5 },
    };

    const nextAreaInfo = areaUnlockMap[levelId];

    updateStats((prev) => {
      const isAlreadyDone = prev.completedLevels.includes(levelId);
      const nextCompleted = isAlreadyDone ? prev.completedLevels : [...prev.completedLevels, levelId];
      const nextCurrentLevel = Math.min(5, Math.max(prev.currentLevel, levelId + 1));

      // Award bonus items per level completion
      const currentInv = prev.inventory || { keys: 0, hintBoosts: 0, extraHearts: 0, timeBoosts: 0 };
      const nextInv = { ...currentInv };

      if (!isAlreadyDone) {
        if (levelId === 1) nextInv.keys += 1;
        if (levelId === 2) nextInv.hintBoosts += 1;
        if (levelId === 3) nextInv.timeBoosts += 1;
        if (levelId === 4) nextInv.extraHearts += 1;
      }

      // Unlock next area
      const nextUnlockedAreas = [...(prev.unlockedAreas || ['main_gate'])];
      if (nextAreaInfo && !nextUnlockedAreas.includes(nextAreaInfo.areaId)) {
        nextUnlockedAreas.push(nextAreaInfo.areaId);
      }

      // Unlock chapter
      const nextChapters = [...(prev.unlockedChapters || [1])];
      if (nextAreaInfo && !nextChapters.includes(nextAreaInfo.nextChapter)) {
        nextChapters.push(nextAreaInfo.nextChapter);
      }

      // Mastery Progression by Domain
      const mastery = { ...(prev.skillMastery || { pattern: 0, logic: 0, algorithm: 0, path_finding: 0, debugging: 0, cyber_security: 0, problem_solving: 0 }) };
      if (levelId === 1) {
        mastery.pattern = Math.min(100, (mastery.pattern || 0) + 25);
        mastery.problem_solving = Math.min(100, (mastery.problem_solving || 0) + 15);
      } else if (levelId === 2) {
        mastery.logic = Math.min(100, (mastery.logic || 0) + 30);
        mastery.algorithm = Math.min(100, (mastery.algorithm || 0) + 15);
      } else if (levelId === 3) {
        mastery.algorithm = Math.min(100, (mastery.algorithm || 0) + 30);
        mastery.debugging = Math.min(100, (mastery.debugging || 0) + 20);
      } else if (levelId === 4) {
        mastery.path_finding = Math.min(100, (mastery.path_finding || 0) + 30);
        mastery.problem_solving = Math.min(100, (mastery.problem_solving || 0) + 20);
      } else if (levelId === 5) {
        mastery.cyber_security = Math.min(100, (mastery.cyber_security || 0) + 35);
        mastery.logic = Math.min(100, (mastery.logic || 0) + 25);
        mastery.debugging = Math.min(100, (mastery.debugging || 0) + 20);
      }

      // Collectibles
      const collectibles = [...(prev.collectibles || [])];
      if (levelId === 5) {
        if (!collectibles.includes('col_core_key')) collectibles.push('col_core_key');
        if (!collectibles.includes('col_quantum_core')) collectibles.push('col_quantum_core');
      }

      // Daily missions progression
      const dm = updateDailyMissionStep(prev.dailyMissions || [], 'puzzle', 1).updatedMissions;

      return {
        ...prev,
        completedLevels: nextCompleted,
        currentLevel: nextCurrentLevel,
        xp: prev.xp + xpGained,
        score: prev.score + scoreGained,
        coins: (prev.coins ?? 0) + coinsGained,
        inventory: nextInv,
        unlockedAreas: nextUnlockedAreas,
        unlockedChapters: nextChapters,
        storyChapter: nextAreaInfo ? Math.max(prev.storyChapter || 1, nextAreaInfo.nextChapter) : prev.storyChapter,
        skillMastery: mastery,
        collectibles,
        dailyMissions: dm,
        endTime: isLevel5 ? now : prev.endTime,
      };
    });

    // Advance quest objectives
    if (levelId === 1) completeObjective('quest_ch1_main', 'obj_solve_pattern');
    if (levelId === 2) completeObjective('quest_ch2_main', 'obj_solve_gates');
    if (levelId === 3) completeObjective('quest_ch2_main', 'obj_solve_sorting');
    if (levelId === 4) completeObjective('quest_ch3_main', 'obj_solve_path');
    if (levelId === 5) completeObjective('quest_ch5_main', 'obj_solve_master');

    if (isLevel5) {
      sounds.playVictory();
      setScreen('result');
    } else {
      sounds.playLevelUp();
      if (nextAreaInfo) {
        setCinematicModal({
          isOpen: true,
          type: 'area_unlock',
          title: `AREA TERBUKA: ${nextAreaInfo.areaName.toUpperCase()}`,
          subtitle: `Gerbang Tingkat ${levelId} Telah Ditaklukkan!`,
          description: `Akses baru ke ${nextAreaInfo.areaName} kini dapat kamu jelajahi. Temui sekutu baru dan kumpulkan petunjuk berikutnya!`,
          icon: '🔓',
        });
      }
      setScreen('room');
    }
  };

  // Hotspot interaction handler
  const handleSelectHotspot = (hotspot: RoomHotspot) => {
    sounds.playClick();

    // Check if this hotspot reveals a clue
    let foundClue: ClueData | null = null;
    if (hotspot.clueId) {
      foundClue = CLUES_DATA.find((c) => c.id === hotspot.clueId) || null;
      if (foundClue) {
        sounds.playClueFound();
        // Add to player's discovered clues
        updateStats((prev) => {
          const current = prev.discoveredClues || [];
          const dm = updateDailyMissionStep(prev.dailyMissions || [], 'clue', 1).updatedMissions;
          const collectibles = [...(prev.collectibles || [])];

          // Award Collectible for finding first logic clue
          if (hotspot.id === 'gate_notice' && !collectibles.includes('col_logic_fragment')) {
            collectibles.push('col_logic_fragment');
          }
          if (hotspot.id === 'cyber_terminal' && !collectibles.includes('col_encrypted_usb')) {
            collectibles.push('col_encrypted_usb');
          }

          if (!current.includes(foundClue!.id)) {
            return {
              ...prev,
              discoveredClues: [...current, foundClue!.id],
              xp: prev.xp + 25,
              dailyMissions: dm,
              collectibles,
            };
          }
          return { ...prev, dailyMissions: dm, collectibles };
        });

        // Check quest objective completions for clues
        if (hotspot.id === 'gate_notice') {
          completeObjective('quest_ch1_main', 'obj_read_board');
        }
        if (hotspot.id === 'hall_board') {
          completeObjective('quest_ch2_main', 'obj_read_hall_board');
        }
        if (hotspot.id === 'lib_catalog') {
          completeObjective('quest_ch3_main', 'obj_read_catalog');
        }
      }
    }

    // Check if hotspot gives an item
    if (hotspot.type === 'item' && hotspot.giveItem) {
      updateStats((prev) => {
        const inv = prev.inventory || { keys: 0, hintBoosts: 0, extraHearts: 0, timeBoosts: 0 };
        const collected = prev.collectedItems || [];
        if (!collected.includes(hotspot.id)) {
          return {
            ...prev,
            inventory: {
              ...inv,
              keys: inv.keys + 1,
            },
            collectedItems: [...collected, hotspot.id],
            xp: prev.xp + 50,
          };
        }
        return prev;
      });
      completeObjective('quest_ch1_main', 'obj_find_key');
    }

    setActiveHotspotModal({
      isOpen: true,
      hotspot,
      clue: foundClue,
    });
  };

  // NPC dialogue interaction handler
  const handleTalkNpc = (npcId: string) => {
    sounds.playClick();
    const cleanId = npcId.replace(/^npc_/, '');
    const npc = NPCS_DATA[cleanId] || NPCS_DATA[npcId];
    if (!npc) return;

    // Pick contextual dialogue lines based on game progression
    let dialogueLines: string[] = [];
    if (npc.dialogues) {
      if (cleanId === 'nara') {
        if (stats.completedLevels.includes(1) && npc.dialogues.puzzleSolved) {
          dialogueLines = npc.dialogues.puzzleSolved;
        } else if ((stats.discoveredClues?.length || 0) > 0 && npc.dialogues.clueFound) {
          dialogueLines = npc.dialogues.clueFound;
        } else {
          dialogueLines = npc.dialogues.initial;
        }
      } else if (cleanId === 'raka') {
        if (stats.completedLevels.includes(2) && npc.dialogues.puzzleSolved) {
          dialogueLines = npc.dialogues.puzzleSolved;
        } else if ((stats.discoveredClues?.length || 0) > 1 && npc.dialogues.clueFound) {
          dialogueLines = npc.dialogues.clueFound;
        } else {
          dialogueLines = npc.dialogues.initial;
        }
      } else if (cleanId === 'byte') {
        if (stats.completedLevels.includes(3) && npc.dialogues.puzzleSolved) {
          dialogueLines = npc.dialogues.puzzleSolved;
        } else if ((stats.discoveredClues?.length || 0) > 2 && npc.dialogues.clueFound) {
          dialogueLines = npc.dialogues.clueFound;
        } else {
          dialogueLines = npc.dialogues.initial;
        }
      } else if (cleanId === 'guardian') {
        if (stats.completedLevels.includes(5) && npc.dialogues.puzzleSolved) {
          dialogueLines = npc.dialogues.puzzleSolved;
        } else {
          dialogueLines = npc.dialogues.initial;
        }
      } else {
        dialogueLines = npc.dialogues.initial || [];
      }
    }

    if (!Array.isArray(dialogueLines) || dialogueLines.length === 0) {
      dialogueLines = npc.dialogues?.initial || ['Halo! Ada yang bisa kubantu?'];
    }

    // Trigger dialogue lines
    setActiveNpcModal({
      isOpen: true,
      npc,
      dialogueLines,
    });

    // Update Gamification stats (daily missions, collectibles, and byte interactions)
    updateStats((prev) => {
      const dm = updateDailyMissionStep(prev.dailyMissions || [], 'story', 1).updatedMissions;
      const collectibles = [...(prev.collectibles || [])];
      const achProg = { ...(prev.achievementProgress || {}) };

      if ((cleanId === 'raka' || npcId === 'npc_raka') && !collectibles.includes('col_data_chip')) {
        collectibles.push('col_data_chip');
      }

      if (cleanId === 'byte' || npcId === 'npc_byte') {
        const byteTalkCount = (achProg['byte_bestie'] || 0) + 1;
        achProg['byte_bestie'] = byteTalkCount;
        if (byteTalkCount >= 3 && !collectibles.includes('col_byte_chip')) {
          collectibles.push('col_byte_chip');
        }
      }

      return {
        ...prev,
        dailyMissions: dm,
        collectibles,
        achievementProgress: achProg,
      };
    });

    // Advance quest objectives
    if (cleanId === 'nara' || npcId === 'npc_nara') {
      completeObjective('quest_ch1_main', 'obj_talk_nara');
    } else if (cleanId === 'raka' || npcId === 'npc_raka') {
      completeObjective('quest_ch2_main', 'obj_meet_raka');
    } else if (cleanId === 'byte' || npcId === 'npc_byte') {
      completeObjective('quest_ch4_main', 'obj_talk_byte');
    } else if (cleanId === 'guardian' || npcId === 'npc_guardian') {
      completeObjective('quest_ch5_main', 'obj_confront_guardian');
    }
  };

  const handleResetGame = () => {
    clearGameData();
    setStats({ ...DEFAULT_PLAYER_STATS });
    setScreen('home');
    setResetConfirmOpen(false);
  };

  const handlePlayAgain = () => {
    updateStats((prev) => ({
      ...prev,
      score: 0,
      xp: 0,
      coins: 0,
      combo: 0,
      hearts: 3,
      currentLevel: 1,
      currentArea: 'main_gate',
      unlockedAreas: ['main_gate'],
      unlockedChapters: [1],
      completedLevels: [],
      discoveredClues: [],
      questProgress: {},
      answersCorrect: 0,
      answersWrong: 0,
      inventory: { keys: 0, hintBoosts: 1, extraHearts: 1, timeBoosts: 0 },
      startTime: Date.now(),
      endTime: null,
    }));
    setActiveLevelId(1);
    setScreen('room');
  };

  const handleToggleSound = () => {
    updateStats((prev) => {
      const toggled = !prev.soundEnabled;
      sounds.setEnabled(toggled);
      return { ...prev, soundEnabled: toggled };
    });
  };

  const activeLevelData = LEVELS_DATA.find((l) => l.id === activeLevelId) || LEVELS_DATA[0];
  const currentRoomArea = ROOMS_DATA[stats.currentArea || 'main_gate'] || ROOMS_DATA['main_gate'];

  if (screen === 'teacher') {
    return (
      <TeacherDashboardScreen
        onSwitchToStudentMode={() => setScreen('home')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white font-sans">
      {/* HUD Bar (shown across game exploration and puzzle levels) */}
      <GameHUD
        stats={stats}
        currentScreen={screen}
        onNavigateToMap={() => setScreen('world_map')}
        onOpenHowToPlay={() => setHowToPlayOpen(true)}
        onOpenResetConfirm={() => setResetConfirmOpen(true)}
        onOpenInventory={() => setInventoryOpen(true)}
        onOpenJournal={() => setJournalOpen(true)}
        onOpenProgressCenter={() => setProgressCenterOpen(true)}
        onOpenLearningHub={() => setScreen('learning')}
        onOpenTeacherDashboard={() => setScreen('teacher')}
        onOpenRewardChest={() => {
          const unopened = stats.rewardChests?.find((c) => !c.opened);
          if (unopened) {
            setActiveChestModal({ isOpen: true, chest: unopened });
          } else {
            setProgressCenterOpen(true);
          }
        }}
        onToggleSound={handleToggleSound}
      />

      {/* Main Screen Content */}
      <main className="flex-1 w-full flex flex-col justify-center">
        {screen === 'home' && (
          <HomeScreen
            onStartGame={handleStartGame}
            onOpenHowToPlay={() => setHowToPlayOpen(true)}
            onOpenLearningHub={() => setScreen('learning')}
            onOpenTeacherDashboard={() => setScreen('teacher')}
            hasSavedProgress={stats.completedLevels.length > 0 || (stats.unlockedAreas && stats.unlockedAreas.length > 1)}
            playerName={stats.playerName}
            currentLevel={stats.currentLevel}
          />
        )}

        {screen === 'player_setup' && (
          <PlayerSetup
            initialName={stats.playerName}
            onConfirmName={handleConfirmPlayerName}
            onBackToHome={() => setScreen('home')}
          />
        )}

        {screen === 'intro' && (
          <GameIntro
            playerName={stats.playerName}
            onStartMission={handleStartMission}
          />
        )}

        {screen === 'learning' && (
          <LearningHubScreen
            stats={stats}
            onUpdateStats={setStats}
            onBackToGame={() => setScreen('world_map')}
            onOpenTeacherDashboard={() => setScreen('teacher')}
          />
        )}

        {screen === 'room' && (
          <RoomView
            room={currentRoomArea}
            activeQuest={currentQuest}
            completedObjectives={currentQuestProgress}
            unlockedAreas={stats.unlockedAreas || ['main_gate']}
            playerHearts={stats.hearts ?? 3}
            inventoryKeys={stats.inventory?.keys ?? 0}
            onSelectHotspot={handleSelectHotspot}
            onTalkNpc={handleTalkNpc}
            onChangeArea={handleSelectArea}
            onOpenMap={() => setScreen('world_map')}
            onOpenJournal={() => setJournalOpen(true)}
            onOpenInventory={() => setInventoryOpen(true)}
            onLaunchLevel={handleSelectLevel}
          />
        )}

        {screen === 'world_map' && (
          <WorldMap
            stats={stats}
            onSelectLevel={handleSelectLevel}
            onSelectArea={handleSelectArea}
            onOpenJournal={() => setJournalOpen(true)}
          />
        )}

        {screen === 'level' && (
          <LevelScreen
            level={activeLevelData}
            playerHearts={stats.hearts ?? 3}
            comboCount={stats.combo ?? 0}
            hintBoosts={stats.inventory?.hintBoosts ?? 0}
            extraHearts={stats.inventory?.extraHearts ?? 0}
            onBackToMap={() => setScreen('room')}
            onCompleteLevel={handleCompleteLevel}
            onAnswerAttempt={handleAnswerAttempt}
            onHeartLost={handleHeartLost}
            onResetHearts={handleResetHearts}
            onUseHintBoost={handleUseHintBoost}
            onUseExtraHeart={handleUseExtraHeart}
            setFeedbackModal={setFeedback}
            isAlreadyCompleted={stats.completedLevels.includes(activeLevelData.id)}
          />
        )}

        {screen === 'result' && (
          <GameResult
            stats={stats}
            onPlayAgain={handlePlayAgain}
            onBackToHome={() => setScreen('home')}
          />
        )}
      </main>

      {/* V0.3 World Exploration Modals */}
      <NpcDialogueModal
        isOpen={activeNpcModal.isOpen}
        npc={activeNpcModal.npc}
        dialogueLines={activeNpcModal.dialogueLines}
        onClose={() => setActiveNpcModal((prev) => ({ ...prev, isOpen: false }))}
      />

      <HotspotInteractionModal
        isOpen={activeHotspotModal.isOpen}
        hotspot={activeHotspotModal.hotspot}
        clue={activeHotspotModal.clue}
        isUnlocked={(stats.inventory?.keys ?? 0) > 0}
        onClose={() => setActiveHotspotModal((prev) => ({ ...prev, isOpen: false }))}
        onAction={() => {
          if (activeHotspotModal.hotspot?.puzzleLevelId) {
            handleSelectLevel(activeHotspotModal.hotspot.puzzleLevelId);
          }
        }}
      />

      <JournalModal
        isOpen={journalOpen}
        onClose={() => setJournalOpen(false)}
        activeQuestId={activeQuestId}
        completedQuests={stats.completedQuests || []}
        questProgress={stats.questProgress || {}}
        discoveredClues={stats.discoveredClues || []}
        unlockedChapters={stats.unlockedChapters || [1]}
        unlockedAreas={stats.unlockedAreas || ['main_gate']}
        score={stats.score}
        xp={stats.xp}
      />

      <ChapterCinematicModal
        isOpen={cinematicModal.isOpen}
        type={cinematicModal.type}
        title={cinematicModal.title}
        subtitle={cinematicModal.subtitle}
        description={cinematicModal.description}
        icon={cinematicModal.icon}
        onContinue={() => setCinematicModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Global Modals */}
      <FeedbackModal
        feedback={feedback}
        onClose={() => setFeedback((prev) => ({ ...prev, isOpen: false }))}
      />

      <HowToPlayModal
        isOpen={howToPlayOpen}
        onClose={() => setHowToPlayOpen(false)}
      />

      <ResetConfirmModal
        isOpen={resetConfirmOpen}
        onCancel={() => setResetConfirmOpen(false)}
        onConfirm={handleResetGame}
      />

      <InventoryModal
        isOpen={inventoryOpen}
        onClose={() => setInventoryOpen(false)}
        inventory={stats.inventory || { keys: 0, hintBoosts: 0, extraHearts: 0, timeBoosts: 0 }}
        currentHearts={stats.hearts ?? 3}
        maxHearts={stats.maxHearts ?? 3}
        onUseExtraHeart={handleUseExtraHeart}
        onUseHintBoost={handleUseHintBoost}
      />

      {/* V0.4 Gamification 2.0 Modals */}
      <ProgressCenterModal
        isOpen={progressCenterOpen}
        onClose={() => setProgressCenterOpen(false)}
        stats={stats}
        onClaimDailyMission={handleClaimDailyMission}
        onOpenChest={(chest) => setActiveChestModal({ isOpen: true, chest })}
        onSelectTitle={handleSelectTitle}
      />

      <RewardChestModal
        isOpen={activeChestModal.isOpen}
        chest={activeChestModal.chest}
        onClose={() => setActiveChestModal({ isOpen: false, chest: null })}
        onClaim={handleClaimChestReward}
      />

      <CelebrationModal
        data={celebrationData}
        onClose={() => setCelebrationData((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

