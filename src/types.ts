export type ScreenType = 
  | 'home'
  | 'player_setup'
  | 'intro'
  | 'world_map'
  | 'room'
  | 'level'
  | 'result'
  | 'learning'
  | 'teacher';

export type ChallengeType = 
  | 'quiz' 
  | 'pattern' 
  | 'order' 
  | 'pathfinder' 
  | 'memory' 
  | 'debug' 
  | 'decision';

export type LevelType = 'pattern' | 'logic' | 'ordering' | 'scenario' | 'final_gate' | 'adventure';

// V0.3 NPC System
export interface NPCData {
  id: string;
  name: string;
  role: string;
  personality: string;
  avatarIcon: string;
  badgeColor: string;
  // Progress-based dialogues: [stage]: array of sentences
  dialogues: {
    initial: string[];
    clueFound?: string[];
    puzzleSolved?: string[];
    chapterCompleted?: string[];
    repeat: string[];
  };
}

// V0.3 Quest System
export interface QuestObjective {
  id: string;
  text: string;
  completed: boolean;
}

export interface QuestData {
  id: string;
  chapter: number;
  title: string;
  description: string;
  type: 'main' | 'discovery' | 'puzzle';
  objectives: QuestObjective[];
  xpReward: number;
  coinReward: number;
  itemReward?: string;
  unlockedAreaId?: string;
}

// V0.3 Clue System
export interface ClueData {
  id: string;
  code: string; // e.g. 'CLUE #01'
  title: string;
  content: string;
  hintSnippet: string;
  location: string;
}

// V0.3 Story Chapter
export interface StoryChapterData {
  chapter: number;
  title: string;
  subtitle: string;
  summary: string;
  loreSnippet: string;
}

// V0.3 Hotspot in Room
export type HotspotType = 'examine' | 'read' | 'unlock' | 'puzzle' | 'npc' | 'item';

export interface RoomHotspot {
  id: string;
  name: string;
  icon: string;
  type: HotspotType;
  x: number; // percentage from left 0-100
  y: number; // percentage from top 0-100
  actionText: string; // e.g. 'PERIKSA', 'BACA', 'BUKA', 'AMBIL', 'BICARA'
  title: string;
  description: string;
  clueId?: string;
  itemId?: string;
  giveItem?: boolean;
  dialogueNpcId?: string;
  puzzleLevelId?: number;
  requiresItem?: string;
  unlockTargetAreaId?: string;
}

// V0.3 Room / Area System
export interface RoomAreaData {
  id: string;
  chapter: number;
  name: string;
  shortName: string;
  tagline: string;
  icon: string;
  themeColor: string;
  bgGradient: string;
  description: string;
  associatedLevelId?: number;
  npcs: string[]; // NPC ids in this room
  hotspots: RoomHotspot[];
  connectedAreas: string[]; // area ids accessible from here
}

export interface InteractiveObject {
  id: string;
  name: string;
  icon: 'note' | 'computer' | 'lock' | 'box' | 'map' | 'clue';
  title: string;
  description: string;
  foundClue?: string;
  unlocked?: boolean;
}

export interface InventoryItem {
  id: 'key' | 'hint_boost' | 'extra_heart' | 'time_boost';
  name: string;
  count: number;
  icon: string;
  description: string;
}

export interface PlayerInventory {
  keys: number;
  hintBoosts: number;
  extraHearts: number;
  timeBoosts: number;
}

export interface MemoryCard {
  id: string;
  pairId: string;
  text: string;
  subtext?: string;
  category: string;
}

export interface PathfinderCell {
  x: number;
  y: number;
  type: 'road' | 'wall' | 'start' | 'exit';
}

export interface DebugStep {
  id: number;
  code: string;
  description: string;
  isBug: boolean;
}

export interface ChallengeData {
  id: string;
  type: ChallengeType;
  title: string;
  instruction: string;
  detail?: string;
  
  // For Quiz, Decision & Pattern
  options?: { id: string; label: string; text: string; icon?: string; detail?: string }[];
  correctAnswer?: string; // option id
  
  // For Pattern visual sequence
  patternSequence?: string[];
  patternTargetIndex?: number;
  
  // For Order
  orderItems?: { id: string; text: string; stepNumber?: number }[];
  correctOrder?: string[]; // sequence of ids
  
  // For Pathfinder
  gridSize?: { rows: number; cols: number };
  startPos?: { x: number; y: number };
  exitPos?: { x: number; y: number };
  walls?: { x: number; y: number }[]; // wall coordinates
  optimalSteps?: number;
  
  // For Memory
  memoryPairs?: { id: string; term: string; definition: string }[];
  
  // For Debug
  debugSteps?: DebugStep[];
  bugStepId?: number;
  bugExplanation?: string;
  
  // 3-tier Hints
  hints: [string, string, string]; // Hint 1 (light), Hint 2 (specific), Hint 3 (direct)
  
  explanation: string;
  timeLimit?: number; // in seconds (optional)
  xpReward: number;
  coinReward: number;
}

export interface MissionData {
  brief: string;
  objective: string;
  lore: string;
  interactiveObjects: InteractiveObject[];
}

export interface LevelData {
  id: number;
  title: string;
  subtitle: string;
  iconName: string;
  type: LevelType;
  difficulty: 'Mudah' | 'Mudah - Sedang' | 'Sedang' | 'Sedang - Sulit' | 'Sulit';
  xpReward: number;
  scoreReward: number;
  bonusReward: number;
  coinReward: number;
  description: string;
  mission: MissionData;
  challenges: ChallengeData[];
  
  // Legacy backward compatibility support
  question?: any;
  miniChallenges?: any[];
}

export interface PlayerStats {
  playerName: string;
  playerAvatar?: string;
  score: number;
  xp: number;
  coins: number;
  hearts: number; // 0 to 3
  maxHearts: number;
  combo: number;
  maxCombo: number;
  currentWorld: number;
  currentLevel: number;
  completedLevels: number[];
  answersCorrect: number;
  answersWrong: number;
  hintsUsed: number;
  inventory: PlayerInventory;
  
  // V0.3 World + Story fields
  currentArea: string;
  unlockedAreas: string[];
  completedAreas: string[];
  activeQuestId: string;
  completedQuests: string[];
  questProgress: { [questId: string]: string[] }; // completed objective ids per quest
  discoveredClues: string[];
  collectedItems: string[];
  storyChapter: number;
  unlockedChapters: number[];
  npcProgress: { [npcId: string]: number };

  // V0.4 Gamification 2.0 fields
  playerRank: number; // 1 to 8
  playerLevel: number; // calculated from XP
  activeTitle: string; // ID of active equipped title
  unlockedTitles: string[];
  streak: number;
  lastStreakDate?: string;
  lastDailyMissionDate: string; // 'YYYY-MM-DD'
  dailyMissions: DailyMissionData[];
  skills: {
    logic: number; // 1-5
    algorithm: number;
    cyber: number;
    problem_solving: number;
  };
  mastery: {
    pattern: number; // 0 to 100
    logic: number;
    algorithm: number;
    debugging: number;
    path_finding: number;
    cyber_security: number;
  };
  skillMastery?: {
    pattern?: number;
    logic?: number;
    algorithm?: number;
    debugging?: number;
    path_finding?: number;
    cyber_security?: number;
    problem_solving?: number;
  };
  achievements: string[]; // unlocked achievement IDs
  achievementProgress: { [id: string]: number };
  collectibles: string[]; // discovered collectible IDs
  claimedEventIds: string[]; // anti-cheat deduplication registry
  rewardChests: RewardChestData[];
  openedChestsCount: number;
  milestones: string[];
  isPracticeMode?: boolean;

  // V0.5 Learning Engine fields
  learningProgress?: LearningProgressData;

  startTime: number | null;
  endTime: number | null;
  soundEnabled: boolean;
}

// V0.4 Gamification 2.0 Interfaces
export interface PlayerRankData {
  rank: number;
  title: string;
  emblem: string;
  badgeColor: string;
  requiredXp: number;
  requiredAchievements: number;
  description: string;
  perkText: string;
}

export interface SkillNodeData {
  id: string;
  branch: 'logic' | 'algorithm' | 'cyber' | 'problem_solving';
  level: number; // 1 to 5
  title: string;
  description: string;
  requiredMastery: number; // 0-100%
  icon: string;
  educationalCompetency: string;
}

export type MasteryCategory = 'pattern' | 'logic' | 'algorithm' | 'debugging' | 'path_finding' | 'cyber_security';

export interface DailyMissionData {
  id: string;
  title: string;
  description: string;
  category: 'puzzle' | 'clue' | 'no_hint' | 'combo' | 'story';
  targetCount: number;
  currentCount: number;
  rewardXp: number;
  rewardCoins: number;
  isCompleted: boolean;
  isClaimed: boolean;
}

export interface AchievementData {
  id: string;
  icon: string;
  title: string;
  description: string;
  isHidden?: boolean;
  secretHint?: string;
  category: 'general' | 'puzzle' | 'mastery' | 'exploration' | 'story' | 'secret';
  targetProgress: number;
  rewardXp: number;
  rewardCoins: number;
  rewardTitleId?: string;
}

export interface CollectibleData {
  id: string;
  name: string;
  icon: string;
  category: 'fragment' | 'chip' | 'key' | 'document' | 'artifact';
  description: string;
  lore: string;
  locationHint: string;
}

export interface PlayerTitleData {
  id: string;
  title: string;
  description: string;
  badge: string;
  requirementText: string;
}

export interface RewardChestData {
  id: string;
  title: string;
  source: string;
  icon: string;
  opened: boolean;
  reward: {
    xp: number;
    coins: number;
    powerUpName?: string;
    powerUpType?: 'hint_boost' | 'extra_heart' | 'time_boost' | 'keys';
    collectibleId?: string;
    badge?: string;
  };
}

export interface BaseQuestion {
  id: string;
  prompt: string;
  options?: { id: string; label: string; text: string }[];
  correctAnswer?: string;
  explanation: string;
  hint: string;
  patternSequence?: string[];
  orderItems?: { id: string; text: string; stepNumber: number }[];
  correctOrder?: string[];
}

export interface FeedbackState {
  isOpen: boolean;
  isCorrect: boolean;
  title: string;
  message: string;
  explanation?: string;
  xpGained?: number;
  scoreGained?: number;
  coinsGained?: number;
  comboCount?: number;
  onContinue?: () => void;
  onRetry?: () => void;
}

// ============================================================================
// V0.5 LEARNING ENGINE & INFORMATICS DOMAINS (SMP KELAS VII, VIII, IX)
// ============================================================================

export type InformaticsGrade = 7 | 8 | 9;

export type InformaticsDomainId = 
  | 'bk'   // Berpikir Komputasional
  | 'tik'  // Teknologi Informasi dan Komunikasi
  | 'sk'   // Sistem Komputer
  | 'jki'  // Jaringan Komputer dan Internet
  | 'ad'   // Analisis Data
  | 'ap'   // Algoritma dan Pemrograman
  | 'dsi'  // Dampak Sosial Informatika
  | 'plb'; // Praktik Lintas Bidang

export interface LearningDomain {
  id: InformaticsDomainId;
  code: string;
  name: string;
  shortDesc: string;
  icon: string;
  accentColor: string; // Tailwind color class or hex
  gradient: string;
  grades: InformaticsGrade[];
}

export type MasteryStatus = 
  | 'INTRODUCED'  // 0-20%
  | 'DEVELOPING'  // 21-40%
  | 'CAPABLE'     // 41-60%
  | 'ADVANCED'    // 61-80%
  | 'EXPERT'      // 81-99%
  | 'MASTERED';   // 100%

export interface MicroLessonCard {
  id: string;
  cardNumber: number;
  title: string;
  type: 'concept' | 'example' | 'illustration' | 'try' | 'summary';
  content: string;
  example?: string;
  illustrationEmoji?: string;
  tip?: string;
}

export interface LearningChallengeOption {
  id: string;
  label?: string;
  text: string;
  isCorrect?: boolean;
}

export interface LearningChallengeOrderItem {
  id: string;
  text: string;
  stepNumber?: number;
}

export interface LearningChallengeExplanation {
  whyCorrect: string;
  whyWrong: string;
  educationalConcept: string;
}

export interface LearningChallenge {
  id: string;
  topicId: string;
  objectiveId: string;
  objectiveText: string;
  targetMisi: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'quiz' | 'pattern' | 'order' | 'decision' | 'debugging' | 'matching';
  title: string;
  prompt: string;
  context?: string;
  options?: LearningChallengeOption[];
  correctAnswer?: string;
  orderItems?: LearningChallengeOrderItem[];
  correctOrder?: string[];
  patternSequence?: string[];
  explanation: LearningChallengeExplanation;
  hint: string;
  masteryWeight: number; // typically 10-25
  xpReward: number;
  coinReward: number;
  conceptKey?: string; // for error tracking e.g. 'ordering', 'branching', 'hardware_input'
}

export interface DiagnosticQuestion {
  id: string;
  topicId: string;
  title: string;
  prompt: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
  conceptTested: string;
}

export interface RemedialData {
  topicId: string;
  title: string;
  reason: string;
  reviewCards: MicroLessonCard[];
  guidedPractice: LearningChallenge;
  evaluationChallenge: LearningChallenge;
}

export interface EnrichmentData {
  topicId: string;
  title: string;
  introText: string;
  advancedChallenge: LearningChallenge;
  bonusXp: number;
  bonusMastery: number;
}

export interface LearningTopic {
  id: string;
  grade: InformaticsGrade;
  domainId: InformaticsDomainId;
  title: string;
  subtopic: string;
  objective: string; // "Tujuan Pembelajaran" formal
  missionTarget: string; // "Target Misi" game style
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisiteId?: string;
  prerequisiteTitle?: string;
  masteryThreshold: number; // default 80
  microLessons: MicroLessonCard[];
  challenges: LearningChallenge[];
  diagnosticQuestions?: DiagnosticQuestion[];
  remedial?: RemedialData;
  enrichment?: EnrichmentData;
}

export interface LearningEvent {
  timestamp: number;
  eventType: 
    | 'challengeStarted'
    | 'challengeCompleted'
    | 'answerCorrect'
    | 'answerWrong'
    | 'hintUsed'
    | 'lessonViewed'
    | 'topicStarted'
    | 'topicCompleted'
    | 'masteryUpdated'
    | 'remedialStarted'
    | 'remedialCompleted'
    | 'enrichmentCompleted'
    | 'diagnosticCompleted';
  topicId?: string;
  challengeId?: string;
  detail?: string;
}

export interface LearningProgressData {
  selectedGrade: InformaticsGrade;
  topicMastery: { [topicId: string]: number }; // 0 to 100
  domainMastery: { [domainId: string]: number }; // 0 to 100
  completedTopicIds: string[];
  completedChallengeIds: string[];
  viewedLessonTopicIds: string[];
  diagnosticScores: { [topicId: string]: number }; // percentage 0-100
  remedialCompletedTopicIds: string[];
  enrichmentCompletedTopicIds: string[];
  errorLog: { [conceptKey: string]: number }; // e.g. { 'ordering': 2, 'phishing': 1 }
  learningEvents: LearningEvent[];
  lastActiveTopicId?: string;
}

// ==========================================
// V0.6 TEACHER DASHBOARD & ASSESSMENT ENGINE
// ==========================================

export type AppMode = 'student' | 'teacher';

export type TeacherDashboardTab = 
  | 'dashboard'
  | 'students'
  | 'classes'
  | 'assessment'
  | 'mastery'
  | 'analytics'
  | 'remedial'
  | 'enrichment'
  | 'questions'
  | 'settings';

export type StudentMasteryTier = 
  | 'master'           // 90-100%
  | 'advanced'         // 80-89%
  | 'capable'          // 70-79%
  | 'developing'       // 60-69%
  | 'needs_practice'   // <60%
  | 'not_started';     // 0% or uninitiated

export type AssessmentType = 
  | 'diagnostic'
  | 'formative'
  | 'mastery_check'
  | 'summative'
  | 'practice';

export interface AssessmentQuestion {
  id: string;
  topicId: string;
  topicName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'quiz' | 'order' | 'pattern' | 'debugging' | 'decision';
  prompt: string;
  options?: { id: string; label?: string; text: string; isCorrect?: boolean }[];
  correctAnswer?: string;
  explanation: string;
  hint: string;
  learningObjective: string;
  masteryWeight: number;
  correctRate?: number; // e.g. 78% of students answered correctly
}

export interface AssessmentBlueprint {
  id: string;
  title: string;
  grade: InformaticsGrade;
  topicId: string;
  topicName: string;
  type: AssessmentType;
  objectives: string[];
  questionsCount: number;
  durationMinutes: number;
  masteryThreshold: number; // e.g. 80
  questions: AssessmentQuestion[];
}

export interface StudentAssessmentRecord {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  type: AssessmentType;
  rawScore: number;
  maxScore: number;
  accuracy: number; // 0-100%
  mastery: number;  // 0-100%
  completedAt: number; // timestamp
  status: StudentMasteryTier;
  errors: string[];
  hintsUsed: number;
}

export interface StudentActivityLogItem {
  id: string;
  timestamp: number;
  action: string;
  category: 'challenge' | 'clue' | 'puzzle' | 'assessment' | 'remedial' | 'enrichment';
  detail: string;
}

export interface StudentInterventionItem {
  id: string;
  type: 'remedial' | 'enrichment' | 'practice' | 'review';
  topicId: string;
  topicName: string;
  title: string;
  assignedAt: number;
  status: 'pending' | 'in_progress' | 'completed';
  notes?: string;
}

export interface StudentData {
  id: string;
  name: string;
  grade: InformaticsGrade;
  className: string; // 'VII A', 'VII B', 'VII C', 'VIII A', 'VIII B', 'IX A', 'IX B'
  avatar: string;
  level: number;
  xp: number;
  score: number;
  mastery: number; // overall % 0-100
  accuracy: number; // overall % 0-100
  streak: number;
  rankTitle: string;
  status: StudentMasteryTier;
  lastActiveDaysAgo: number; // 0 = today, 1 = yesterday, etc.
  topicMastery: Record<string, number>; // topicId -> mastery %
  domainMastery: Record<InformaticsDomainId, number>; // domainId -> mastery %
  gameProgress: {
    areasUnlocked: number;
    totalAreas: number;
    questsCompleted: number;
    totalQuests: number;
    cluesFound: number;
    totalClues: number;
    achievementsEarned: number;
    totalAchievements: number;
  };
  activityLog: StudentActivityLogItem[];
  assessments: StudentAssessmentRecord[];
  assignedInterventions: StudentInterventionItem[];
  weakConcepts: string[];
  strongConcepts: string[];
}

export interface ClassRoomData {
  id: string;
  name: string; // e.g. 'VII A'
  grade: InformaticsGrade;
  studentCount: number;
  avgMastery: number;
  avgAccuracy: number;
  activeCount: number;
  remedialCount: number;
  enrichmentCount: number;
}

export interface TeacherAssignment {
  id: string;
  title: string;
  topicId: string;
  topicName: string;
  targetClass: string;
  type: AssessmentType;
  minimumMastery: number;
  dueDate: string;
  createdAt: number;
  studentCompletedCount: number;
  totalStudents: number;
}

export interface AssessmentRubric {
  masterMin: number;       // default 90
  advancedMin: number;     // default 80
  capableMin: number;      // default 70
  developingMin: number;   // default 60
  needsPracticeMax: number;// < 60
}

export interface TeacherAlert {
  id: string;
  type: 'remedial' | 'uncompleted_topic' | 'drop_performance' | 'inactive';
  title: string;
  count: number;
  description: string;
  filterCriteria: {
    maxMastery?: number;
    topicId?: string;
    inactiveDays?: number;
    status?: StudentMasteryTier;
  };
}

export interface TeacherInsightItem {
  id: string;
  type: 'warning' | 'positive' | 'info';
  title: string;
  description: string;
  metric: string;
  recommendedAction: string;
  targetTopicId?: string;
}

export interface TeacherState {
  selectedClass: string; // 'ALL' or 'VII A', etc.
  activeTab: TeacherDashboardTab;
  selectedStudentId: string | null;
  searchQuery: string;
  assignments: TeacherAssignment[];
  rubric: AssessmentRubric;
  isDemoDataLoaded: boolean;
}



