import {
  PlayerRankData,
  AchievementData,
  SkillNodeData,
  CollectibleData,
  PlayerTitleData,
  DailyMissionData,
} from '../types';

// ==========================================
// 1. PLAYER RANKS (Rank 1 - 8)
// ==========================================
export const PLAYER_RANKS: PlayerRankData[] = [
  {
    rank: 1,
    title: 'LOGIC BEGINNER',
    emblem: '○',
    badgeColor: 'border-slate-500 text-slate-400 bg-slate-800/60',
    requiredXp: 0,
    requiredAchievements: 0,
    description: 'Langkah awal petualangan di Logic School. Memulai pemahaman pola & algoritma dasar.',
    perkText: 'Akses penuh ke modul pengenalan pola & gerbang logika.',
  },
  {
    rank: 2,
    title: 'LOGIC EXPLORER',
    emblem: '◈',
    badgeColor: 'border-cyan-500 text-cyan-400 bg-cyan-950/40',
    requiredXp: 500,
    requiredAchievements: 2,
    description: 'Mampu menelusuri lorong sekolah, memecahkan clue tersembunyi, dan mengurai masalah.',
    perkText: 'Bonus +5% XP dari setiap pencarian clue.',
  },
  {
    rank: 3,
    title: 'LOGIC SOLVER',
    emblem: '◇',
    badgeColor: 'border-blue-500 text-blue-400 bg-blue-950/40',
    requiredXp: 1200,
    requiredAchievements: 4,
    description: 'Terampil menyusun urutan algoritma dan mendeteksi bug logika dengan cermat.',
    perkText: 'Kemampuan membuka hint tier 1 dengan pengurangan penalti.',
  },
  {
    rank: 4,
    title: 'LOGIC MASTER',
    emblem: '◆',
    badgeColor: 'border-indigo-500 text-indigo-400 bg-indigo-950/40',
    requiredXp: 2200,
    requiredAchievements: 7,
    description: 'Pemikir sistematis tingkat lanjut yang mampu melewati tantangan komputasi kompleks.',
    perkText: 'Bonus koin tambahan pada setiap kombo berturut-turut.',
  },
  {
    rank: 5,
    title: 'ALGORITHM MASTER',
    emblem: '★',
    badgeColor: 'border-amber-500 text-amber-400 bg-amber-950/40',
    requiredXp: 3500,
    requiredAchievements: 10,
    description: 'Menguasai struktur data, optimasi langkah, serta rute efisien tanpa kegagalan.',
    perkText: 'Peluang mendapatkan ekstra reward power-up saat level up.',
  },
  {
    rank: 6,
    title: 'CYBER GUARDIAN',
    emblem: '🛡️',
    badgeColor: 'border-emerald-500 text-emerald-400 bg-emerald-950/40',
    requiredXp: 5000,
    requiredAchievements: 12,
    description: 'Pelindung keamanan digital dan integritas sistem Logic School dari serangan ancaman.',
    perkText: 'Resistensi tinggi terhadap kesalahan beruntun dalam tantangan keamanan.',
  },
  {
    rank: 7,
    title: 'DIGITAL STRATEGIST',
    emblem: '⚡',
    badgeColor: 'border-purple-500 text-purple-400 bg-purple-950/40',
    requiredXp: 7000,
    requiredAchievements: 14,
    description: 'Pemikir holistik dengan kemampuan analisa mendalam dan pengambilan keputusan etis.',
    perkText: 'Akses ke tantangan master dan bonus speed multiplier.',
  },
  {
    rank: 8,
    title: 'LOGIC LEGEND',
    emblem: '👑',
    badgeColor: 'border-yellow-400 text-yellow-300 bg-yellow-950/50 shadow-lg shadow-yellow-500/20',
    requiredXp: 9500,
    requiredAchievements: 16,
    description: 'Legenda komputasi sejati yang telah menaklukkan Core Logic dan memulihkan sekolah.',
    perkText: 'Gelar kehormatan tertinggi dan lencana emas eksklusif.',
  },
];

// ==========================================
// 2. XP THRESHOLDS & LEVEL CALCULATOR
// ==========================================
export const XP_LEVEL_THRESHOLDS: { level: number; xp: number }[] = [
  { level: 1, xp: 0 },
  { level: 2, xp: 500 },
  { level: 3, xp: 1000 },
  { level: 4, xp: 1500 },
  { level: 5, xp: 2200 },
  { level: 6, xp: 3000 },
  { level: 7, xp: 4000 },
  { level: 8, xp: 5200 },
  { level: 9, xp: 6600 },
  { level: 10, xp: 8200 },
  { level: 11, xp: 10000 },
  { level: 12, xp: 12000 },
];

export function getLevelDataFromXp(xp: number): {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
} {
  let level = 1;
  for (let i = XP_LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= XP_LEVEL_THRESHOLDS[i].xp) {
      level = XP_LEVEL_THRESHOLDS[i].level;
      break;
    }
  }

  const currentThreshold = XP_LEVEL_THRESHOLDS.find((t) => t.level === level)?.xp ?? 0;
  const nextThreshold = XP_LEVEL_THRESHOLDS.find((t) => t.level === level + 1)?.xp ?? (currentThreshold + 1500);

  const span = Math.max(1, nextThreshold - currentThreshold);
  const progressPercent = Math.min(100, Math.max(0, Math.round(((xp - currentThreshold) / span) * 100)));

  return {
    level,
    currentLevelXp: xp - currentThreshold,
    nextLevelXp: span,
    progressPercent,
  };
}

// ==========================================
// 3. ACHIEVEMENTS 2.0 (18 ACHIEVEMENTS)
// ==========================================
export const ACHIEVEMENTS_DATA: AchievementData[] = [
  {
    id: 'first_step',
    icon: '🎯',
    title: 'FIRST STEP',
    description: 'Selesaikan level pertama di Logic School.',
    category: 'general',
    targetProgress: 1,
    rewardXp: 100,
    rewardCoins: 25,
    rewardTitleId: 'title_beginner',
  },
  {
    id: 'puzzle_solver',
    icon: '🧩',
    title: 'PUZZLE SOLVER',
    description: 'Selesaikan minimal 5 tantangan logika secara akurat.',
    category: 'puzzle',
    targetProgress: 5,
    rewardXp: 150,
    rewardCoins: 35,
    rewardTitleId: 'title_puzzle_solver',
  },
  {
    id: 'perfect_logic',
    icon: '⭐',
    title: 'PERFECT LOGIC',
    description: 'Selesaikan 3 tantangan berturut-turut tanpa membuat kesalahan.',
    category: 'puzzle',
    targetProgress: 3,
    rewardXp: 180,
    rewardCoins: 50,
  },
  {
    id: 'speed_thinker',
    icon: '⚡',
    title: 'SPEED THINKER',
    description: 'Selesaikan level dengan perolehan bonus kecepatan.',
    category: 'puzzle',
    targetProgress: 1,
    rewardXp: 120,
    rewardCoins: 30,
  },
  {
    id: 'explorer',
    icon: '🔎',
    title: 'EXPLORER',
    description: 'Temukan 5 petunjuk (clue) tersembunyi di ruangan sekolah.',
    category: 'exploration',
    targetProgress: 5,
    rewardXp: 160,
    rewardCoins: 40,
    rewardTitleId: 'title_clue_hunter',
  },
  {
    id: 'collector',
    icon: '📦',
    title: 'COLLECTOR',
    description: 'Kumpulkan minimal 5 item atau collectible di Logic School.',
    category: 'exploration',
    targetProgress: 5,
    rewardXp: 150,
    rewardCoins: 45,
  },
  {
    id: 'master_of_order',
    icon: '🔢',
    title: 'MASTER OF ORDER',
    description: 'Selesaikan 3 tantangan urutan algoritma (ordering challenge).',
    category: 'mastery',
    targetProgress: 3,
    rewardXp: 140,
    rewardCoins: 30,
  },
  {
    id: 'bug_hunter',
    icon: '🐞',
    title: 'BUG HUNTER',
    description: 'Berhasil mendeteksi dan memperbaiki bug dalam debugging challenge.',
    category: 'mastery',
    targetProgress: 1,
    rewardXp: 130,
    rewardCoins: 30,
    rewardTitleId: 'title_bug_hunter',
  },
  {
    id: 'path_finder',
    icon: '🧭',
    title: 'PATH FINDER',
    description: 'Selesaikan rute koridor firewall tanpa menabrak rintangan.',
    category: 'puzzle',
    targetProgress: 1,
    rewardXp: 120,
    rewardCoins: 30,
  },
  {
    id: 'cyber_smart',
    icon: '🔐',
    title: 'CYBER SMART',
    description: 'Pecahkan keputusan etis dan keamanan siber di Cyber Security Room.',
    category: 'mastery',
    targetProgress: 1,
    rewardXp: 140,
    rewardCoins: 35,
    rewardTitleId: 'title_cyber_guardian',
  },
  {
    id: 'no_hint',
    icon: '💡',
    title: 'NO HINT',
    description: 'Selesaikan satu level penuh tanpa membuka hint bantuan.',
    category: 'puzzle',
    targetProgress: 1,
    rewardXp: 200,
    rewardCoins: 50,
  },
  {
    id: 'combo_master',
    icon: '🔥',
    title: 'COMBO MASTER',
    description: 'Mencapai kombo x5 secara beruntun dalam tantangan.',
    category: 'puzzle',
    targetProgress: 5,
    rewardXp: 180,
    rewardCoins: 40,
  },
  {
    id: 'story_seeker',
    icon: '📖',
    title: 'STORY SEEKER',
    description: 'Buka seluruh 5 chapter cerita utama di jurnal petualang.',
    category: 'story',
    targetProgress: 5,
    rewardXp: 250,
    rewardCoins: 60,
  },
  {
    id: 'logic_master',
    icon: '🎓',
    title: 'LOGIC MASTER',
    description: 'Selesaikan seluruh 5 gerbang level utama di Logic School.',
    category: 'mastery',
    targetProgress: 5,
    rewardXp: 300,
    rewardCoins: 80,
    rewardTitleId: 'title_logic_master',
  },
  {
    id: 'core_hero',
    icon: '🏆',
    title: 'CORE HERO',
    description: 'Tuntaskan tantangan Final Gate di Logic Core Room dan pulihkan AI.',
    category: 'story',
    targetProgress: 1,
    rewardXp: 350,
    rewardCoins: 100,
    rewardTitleId: 'title_core_legend',
  },
  // HIDDEN ACHIEVEMENTS
  {
    id: 'secret_server',
    icon: '🤫',
    title: 'SECRET OF THE SERVER',
    description: 'Temukan catatan rahasia Dr. Turing yang tersembunyi di Server Room.',
    isHidden: true,
    secretHint: 'Periksa terminal pendingin di Server Room.',
    category: 'secret',
    targetProgress: 1,
    rewardXp: 200,
    rewardCoins: 50,
  },
  {
    id: 'byte_bestie',
    icon: '🤖',
    title: "BYTE'S BEST FRIEND",
    description: 'Lakukan interaksi percakapan 3 kali dengan Robot Byte.',
    isHidden: true,
    secretHint: 'Ajak bicara maskot robotik sekolah beberapa kali.',
    category: 'secret',
    targetProgress: 3,
    rewardXp: 150,
    rewardCoins: 40,
  },
  {
    id: 'streak_pioneer',
    icon: '📅',
    title: 'STREAK PIONEER',
    description: 'Pertahankan daily streak belajar selama 3 hari berturut-turut.',
    category: 'general',
    targetProgress: 3,
    rewardXp: 180,
    rewardCoins: 50,
    rewardTitleId: 'title_streak_pioneer',
  },
];

// ==========================================
// 4. SKILL TREE (4 BRANCHES, 5 LEVELS EACH)
// ==========================================
export const SKILL_TREE_DATA: SkillNodeData[] = [
  // LOGIC BRANCH
  {
    id: 'skill_logic_1',
    branch: 'logic',
    level: 1,
    title: 'Pengenalan Pola Simbolik',
    description: 'Mengidentifikasi keteraturan bentuk geometri, warna, dan deret aritmatika sederhana.',
    requiredMastery: 15,
    icon: '🧠',
    educationalCompetency: 'Pattern Recognition',
  },
  {
    id: 'skill_logic_2',
    branch: 'logic',
    level: 2,
    title: 'Operasi Gerbang AND, OR, NOT',
    description: 'Memahami tabel kebenaran dasar dan kalkulasi logika biner.',
    requiredMastery: 35,
    icon: '⚡',
    educationalCompetency: 'Boolean Algebra',
  },
  {
    id: 'skill_logic_3',
    branch: 'logic',
    level: 3,
    title: 'Kondisional Bertingkat',
    description: 'Menganalisis kondisi nested IF-THEN-ELSE dan evaluasi multi-kriteria.',
    requiredMastery: 55,
    icon: '🔀',
    educationalCompetency: 'Multi-conditional Logic',
  },
  {
    id: 'skill_logic_4',
    branch: 'logic',
    level: 4,
    title: 'Deduksi dan Silogisme',
    description: 'Menarik kesimpulan logis dari premis implisit dan penalaran analitis.',
    requiredMastery: 75,
    icon: '⚖️',
    educationalCompetency: 'Deductive Reasoning',
  },
  {
    id: 'skill_logic_5',
    branch: 'logic',
    level: 5,
    title: 'Master Logika Formal',
    description: 'Mampu memverifikasi validitas teorema sistem komputasi secara mandiri.',
    requiredMastery: 95,
    icon: '👑',
    educationalCompetency: 'Formal Verification',
  },

  // ALGORITHM BRANCH
  {
    id: 'skill_algo_1',
    branch: 'algorithm',
    level: 1,
    title: 'Sekuensial Langkah Terarah',
    description: 'Menyusun instruksi terurut yang deterministik dari awal hingga selesai.',
    requiredMastery: 15,
    icon: '📋',
    educationalCompetency: 'Step Sequencing',
  },
  {
    id: 'skill_algo_2',
    branch: 'algorithm',
    level: 2,
    title: 'Algoritma Pemilahan (Sorting)',
    description: 'Memahami prinsip pemilahan gelembung (bubble) dan perbandingan elemen.',
    requiredMastery: 35,
    icon: '📊',
    educationalCompetency: 'Data Ordering',
  },
  {
    id: 'skill_algo_3',
    branch: 'algorithm',
    level: 3,
    title: 'Deteksi & Resolusi Bug',
    description: 'Menemukan titik inkonsistensi eksekusi dan memperbaiki variabel program.',
    requiredMastery: 55,
    icon: '🔍',
    educationalCompetency: 'Debugging Competency',
  },
  {
    id: 'skill_algo_4',
    branch: 'algorithm',
    level: 4,
    title: 'Pencarian Rute Optimal',
    description: 'Menghitung jarak terpendek (shortest path) pada grid rintangan.',
    requiredMastery: 75,
    icon: '🧭',
    educationalCompetency: 'Path Optimization',
  },
  {
    id: 'skill_algo_5',
    branch: 'algorithm',
    level: 5,
    title: 'Arsitektur Algoritmik Efisien',
    description: 'Merancang prosedur komputasi dengan efisiensi kompleksitas waktu & memori.',
    requiredMastery: 95,
    icon: '💻',
    educationalCompetency: 'Algorithmic Efficiency',
  },

  // CYBER BRANCH
  {
    id: 'skill_cyber_1',
    branch: 'cyber',
    level: 1,
    title: 'Higienitas Sandi & Kredensial',
    description: 'Memahami kriteria sandi kuat dengan kombinasi huruf, angka, dan simbol.',
    requiredMastery: 15,
    icon: '🔑',
    educationalCompetency: 'Credential Security',
  },
  {
    id: 'skill_cyber_2',
    branch: 'cyber',
    level: 2,
    title: 'Deteksi Rekayasa Sosial (Phishing)',
    description: 'Mengenali tanda bahaya link palsu, email mencurigakan, dan manipulasi data.',
    requiredMastery: 35,
    icon: '🎣',
    educationalCompetency: 'Threat Identification',
  },
  {
    id: 'skill_cyber_3',
    branch: 'cyber',
    level: 3,
    title: 'Proteksi Privasi & Enkripsi',
    description: 'Membedakan data publik vs data pribadi sensitif serta fungsi kunci kripto.',
    requiredMastery: 55,
    icon: '🛡️',
    educationalCompetency: 'Data Privacy & Encryption',
  },
  {
    id: 'skill_cyber_4',
    branch: 'cyber',
    level: 4,
    title: 'Firewall & Isolasi Jaringan',
    description: 'Memahami mekanisme penyaringan paket data dan mitigasi serangan DDoS.',
    requiredMastery: 75,
    icon: '🧱',
    educationalCompetency: 'Network Defense',
  },
  {
    id: 'skill_cyber_5',
    branch: 'cyber',
    level: 5,
    title: 'Tata Kelola Etika Digital',
    description: 'Membuat pertimbangan etis mengenai AI, akses hak cipta, dan keamanan siber publik.',
    requiredMastery: 95,
    icon: '🌐',
    educationalCompetency: 'Ethical Cyber Governance',
  },

  // PROBLEM SOLVING BRANCH
  {
    id: 'skill_prob_1',
    branch: 'problem_solving',
    level: 1,
    title: 'Dekomposisi Masalah',
    description: 'Memecah problem besar sekolah menjadi sub-tantangan mandiri yang terkelola.',
    requiredMastery: 15,
    icon: '🧩',
    educationalCompetency: 'Problem Decomposition',
  },
  {
    id: 'skill_prob_2',
    branch: 'problem_solving',
    level: 2,
    title: 'Analisis Bukti & Investigasi Clue',
    description: 'Mengorelasikan fakta lapangan dengan petunjuk terenkripsi di papan tulis.',
    requiredMastery: 35,
    icon: '🔎',
    educationalCompetency: 'Evidence Correlation',
  },
  {
    id: 'skill_prob_3',
    branch: 'problem_solving',
    level: 3,
    title: 'Abstraksi & Pemodelan Data',
    description: 'Menyaring noise informasi dan fokus pada elemen kunci solusi persoalan.',
    requiredMastery: 55,
    icon: '📐',
    educationalCompetency: 'Computational Abstraction',
  },
  {
    id: 'skill_prob_4',
    branch: 'problem_solving',
    level: 4,
    title: 'Evaluasi Keputusan Multi-Skenario',
    description: 'Menguji skenario konsekuensi sebelum mengeksekusi override darurat.',
    requiredMastery: 75,
    icon: '⚖️',
    educationalCompetency: 'Scenario Evaluation',
  },
  {
    id: 'skill_prob_5',
    branch: 'problem_solving',
    level: 5,
    title: 'Inovasi & Sintesis Sistem',
    description: 'Mengintegrasikan logika, algoritma, dan keamanan untuk menyelamatkan Logic School.',
    requiredMastery: 95,
    icon: '🌟',
    educationalCompetency: 'Systemic Synthesis',
  },
];

// ==========================================
// 5. COLLECTIBLES & LORE (8 ITEMS)
// ==========================================
export const COLLECTIBLES_DATA: CollectibleData[] = [
  {
    id: 'col_logic_fragment',
    name: 'Logic Fragment',
    icon: '🧩',
    category: 'fragment',
    description: 'Kepingan kristal heksagonal berisi urutan kode biner yang masih memancarkan cahaya neon.',
    lore: 'Ditemukan di dekat gerbang sekolah. Merupakan pecahan dari sistem memori lama Logic School sebelum AI terkunci.',
    locationHint: 'Periksa papan pengumuman di Main Gate.',
  },
  {
    id: 'col_data_chip',
    name: 'Data Chip Alpha',
    icon: '💾',
    category: 'chip',
    description: 'Kartu sirkuit terpadu berkapasitas tinggi berisi skema gerbang logika NAND dan NOR.',
    lore: 'Ditinggalkan oleh Raka di Computer Lab saat berupaya memulihkan terminal workstation.',
    locationHint: 'Bicaralah dengan Raka di Computer Lab.',
  },
  {
    id: 'col_core_key',
    name: 'Core Security Key',
    icon: '🔑',
    category: 'key',
    description: 'Kunci enkripsi berlapis 256-bit dengan ukiran simbol lambang sekolah.',
    lore: 'Kunci manual darurat yang hanya bisa diaktifkan jika seluruh 5 gerbang logika telah disinkronkan.',
    locationHint: 'Diperoleh setelah menaklukkan Level 5 (Final Gate).',
  },
  {
    id: 'col_lost_note',
    name: 'Lost Note of Dr. Turing',
    icon: '📜',
    category: 'document',
    description: 'Lembaran catatan tangan dengan sketsa arsitektur komputasi dan peringatan kode darurat.',
    lore: '"Ingatlah, AI ini tidak jahat—ia hanya terjebak dalam loop logika yang belum terselesaikan."',
    locationHint: 'Tersembunyi di dalam rak buku perpustakaan digital.',
  },
  {
    id: 'col_byte_chip',
    name: 'Byte Assistant Chip',
    icon: '🤖',
    category: 'chip',
    description: 'Modul prosesor kecerdasan buatan mikro yang selalu berkedip riang.',
    lore: 'Diberikan langsung oleh Robot Byte sebagai tanda persahabatan dan kolaborasi eksplorasi.',
    locationHint: 'Dapatkan dari interaksi bersama Robot Byte di Digital Lab.',
  },
  {
    id: 'col_encrypted_usb',
    name: 'Encrypted USB Drive',
    icon: '🖴',
    category: 'artifact',
    description: 'Drive penyimpanan tahan banting dengan segel keamanan berwarna merah terang.',
    lore: 'Menyimpan log audit keamanan jaringan saat AI The Guardian pertama kali mendeteksi anomali.',
    locationHint: 'Cari di Cyber Security Room dekat firewall console.',
  },
  {
    id: 'col_binary_compass',
    name: 'Binary Compass',
    icon: '🧭',
    category: 'artifact',
    description: 'Kompas digital yang jarumnya selalu mengarah ke kabel serat optik terpadat.',
    lore: 'Alat bantu navigasi yang digunakan teknisi jaringan sekolah untuk melacak loop tanpa henti.',
    locationHint: 'Ditemukan di Server Room dekat pendingin.',
  },
  {
    id: 'col_quantum_core',
    name: 'Quantum Core Cell',
    icon: '🔮',
    category: 'artifact',
    description: 'Sel energi komputasi kuantum dengan radiasi cahaya biru menenangkan.',
    lore: 'Jantung utama Logic School yang siap berdetak kembali setelah logika sekolah dipulihkan.',
    locationHint: 'Selesaikan seluruh quest utama bab 5.',
  },
];

// ==========================================
// 6. PLAYER TITLES
// ==========================================
export const PLAYER_TITLES: PlayerTitleData[] = [
  {
    id: 'title_beginner',
    title: 'Logic Beginner',
    description: 'Memulai perjalanan komputasi di Logic School.',
    badge: '🌱',
    requirementText: 'Selesaikan Level 1.',
  },
  {
    id: 'title_puzzle_solver',
    title: 'Puzzle Solver',
    description: 'Penyelesai teka-teki logika yang ulet dan pantang menyerah.',
    badge: '🧩',
    requirementText: 'Raih achievement PUZZLE SOLVER.',
  },
  {
    id: 'title_clue_hunter',
    title: 'Clue Hunter',
    description: 'Memiliki kejelian tajam dalam mengendus petunjuk tersembunyi.',
    badge: '🔎',
    requirementText: 'Raih achievement EXPLORER.',
  },
  {
    id: 'title_bug_hunter',
    title: 'Bug Hunter',
    description: 'Mata elang dalam mendeteksi kesalahan alur instruksi.',
    badge: '🐞',
    requirementText: 'Raih achievement BUG HUNTER.',
  },
  {
    id: 'title_cyber_guardian',
    title: 'Cyber Guardian',
    description: 'Pelindung privasi data dan pertahanan siber sekolah.',
    badge: '🛡️',
    requirementText: 'Raih achievement CYBER SMART.',
  },
  {
    id: 'title_streak_pioneer',
    title: 'Streak Pioneer',
    description: 'Konsisten belajar setiap hari dengan komitmen tinggi.',
    badge: '🔥',
    requirementText: 'Capai streak 3 hari beruntun.',
  },
  {
    id: 'title_logic_master',
    title: 'Logic Master',
    description: 'Penguasa pemikiran komputasional tingkat tinggi.',
    badge: '◆',
    requirementText: 'Raih achievement LOGIC MASTER.',
  },
  {
    id: 'title_core_legend',
    title: 'Core Legend',
    description: 'Pahlawan penyelamat Logic School yang menundukkan The Guardian.',
    badge: '👑',
    requirementText: 'Selesaikan tantangan Final Gate.',
  },
];

// ==========================================
// 7. DETERMINISTIC DAILY MISSIONS
// ==========================================
interface DailyMissionPoolItem {
  idSuffix: string;
  title: string;
  description: string;
  category: 'puzzle' | 'clue' | 'no_hint' | 'combo' | 'story';
  targetCount: number;
  rewardXp: number;
  rewardCoins: number;
}

const DAILY_MISSION_POOL: DailyMissionPoolItem[] = [
  {
    idSuffix: 'solve_3_puzzles',
    title: 'Pemecah Teka-teki Harian',
    description: 'Selesaikan 3 tantangan logika atau puzzle hari ini.',
    category: 'puzzle',
    targetCount: 3,
    rewardXp: 100,
    rewardCoins: 25,
  },
  {
    idSuffix: 'find_1_clue',
    title: 'Pencari Jejak',
    description: 'Periksa objek di ruangan dan temukan minimal 1 clue.',
    category: 'clue',
    targetCount: 1,
    rewardXp: 60,
    rewardCoins: 15,
  },
  {
    idSuffix: 'no_hint_run',
    title: 'Percaya Diri Mandiri',
    description: 'Selesaikan 1 challenge atau level tanpa menggunakan hint.',
    category: 'no_hint',
    targetCount: 1,
    rewardXp: 90,
    rewardCoins: 20,
  },
  {
    idSuffix: 'reach_combo_3',
    title: 'Fokus Beruntun',
    description: 'Capai kombo x3 dalam sesi menjawab teka-teki.',
    category: 'combo',
    targetCount: 3,
    rewardXp: 80,
    rewardCoins: 20,
  },
  {
    idSuffix: 'explore_room',
    title: 'Eksplorasi Kampus',
    description: 'Bicaralah dengan NPC atau kunjungi area baru hari ini.',
    category: 'story',
    targetCount: 1,
    rewardXp: 70,
    rewardCoins: 15,
  },
  {
    idSuffix: 'solve_debug',
    title: 'Uji Debugger',
    description: 'Selesaikan atau latih kembali 1 tantangan debugging/algoritma.',
    category: 'puzzle',
    targetCount: 1,
    rewardXp: 85,
    rewardCoins: 20,
  },
];

// Generate exactly 3 deterministic daily missions using the date string (e.g. "2026-09-12")
export function generateDeterministicDailyMissions(dateStr: string): DailyMissionData[] {
  // Simple deterministic hash
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const pool = [...DAILY_MISSION_POOL];
  const selected: DailyMissionData[] = [];

  for (let i = 0; i < 3; i++) {
    const index = (absHash + i * 7) % pool.length;
    const item = pool.splice(index, 1)[0] || DAILY_MISSION_POOL[i];
    selected.push({
      id: `daily_${dateStr}_${item.idSuffix}`,
      title: item.title,
      description: item.description,
      category: item.category,
      targetCount: item.targetCount,
      currentCount: 0,
      rewardXp: item.rewardXp,
      rewardCoins: item.rewardCoins,
      isCompleted: false,
      isClaimed: false,
    });
  }

  return selected;
}

// ==========================================
// 8. GROWTH MINDSET MOTIVATIONAL MESSAGES
// ==========================================
export const GROWTH_MINDSET_FEEDBACK = {
  correct: [
    'Bagus sekali! Kamu menemukan pola yang tepat dengan analisis yang cermat.',
    'Strategi berpikirmu semakin terarah dan sistematis.',
    'Penalaran logika yang luar biasa! Setiap langkah terbukti masuk akal.',
    'Hebat! Kamu berhasil mengurai persoalan rumit menjadi lebih sederhana.',
    'Langkah deduksimu tepat sasaran! Lanjutkan ritme positif ini.',
  ],
  incorrect: [
    'Kesalahan adalah bagian wajar dari proses belajar. Coba amati polanya sekali lagi.',
    'Strategimu sudah mengarah ke hal yang baik, tinggal sedikit penyesuaian detail.',
    'Analisis awalmu sudah menarik. Pikirkan apa yang terjadi jika kondisinya dibalik.',
    'Jangan khawatir! Otak kita bertumbuh saat berusaha memecahkan hal yang menantang.',
    'Tarik nafas sejenak, periksa petunjuk di ruangan, lalu coba lagi dengan tenang.',
  ],
};
