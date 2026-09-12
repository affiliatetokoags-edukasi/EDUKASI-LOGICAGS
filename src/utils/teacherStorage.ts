import { 
  StudentData, 
  ClassRoomData, 
  TeacherAlert, 
  TeacherInsightItem, 
  AssessmentRubric,
  TeacherAssignment,
  StudentInterventionItem,
  InformaticsDomainId
} from '../types';
import { 
  MOCK_STUDENTS, 
  MOCK_TEACHER_ASSIGNMENTS, 
  DEFAULT_ASSESSMENT_RUBRIC,
  AVAILABLE_CLASSES,
  QUESTION_BANK
} from '../data/teacherData';
import { LEARNING_TOPICS } from '../data/learningData';

const DEMO_STUDENTS_KEY = 'logicEscapeDemo';
const TEACHER_CONFIG_KEY = 'logicEscapeTeacher';
const TEACHER_ASSIGNMENTS_KEY = 'logicEscapeAssignments';

export interface TeacherStoredConfig {
  selectedClass: string;
  rubric: AssessmentRubric;
}

// 1. Storage helpers for Demo Students
export function getStoredStudents(): StudentData[] {
  if (typeof window === 'undefined') return MOCK_STUDENTS;
  try {
    const raw = localStorage.getItem(DEMO_STUDENTS_KEY);
    if (!raw) {
      // First time initialization
      localStorage.setItem(DEMO_STUDENTS_KEY, JSON.stringify(MOCK_STUDENTS));
      return MOCK_STUDENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : MOCK_STUDENTS;
  } catch (err) {
    console.error('Error reading demo students:', err);
    return MOCK_STUDENTS;
  }
}

export function saveStoredStudents(students: StudentData[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DEMO_STUDENTS_KEY, JSON.stringify(students));
  } catch (err) {
    console.error('Error saving demo students:', err);
  }
}

export function resetDemoStudents(): StudentData[] {
  if (typeof window === 'undefined') return MOCK_STUDENTS;
  try {
    localStorage.setItem(DEMO_STUDENTS_KEY, JSON.stringify(MOCK_STUDENTS));
    return MOCK_STUDENTS;
  } catch {
    return MOCK_STUDENTS;
  }
}

export function clearDemoStudents(): StudentData[] {
  if (typeof window === 'undefined') return [];
  try {
    localStorage.setItem(DEMO_STUDENTS_KEY, JSON.stringify([]));
    return [];
  } catch {
    return [];
  }
}

// 2. Storage helpers for Teacher Config & Assignments
export function getStoredTeacherConfig(): TeacherStoredConfig {
  const fallback: TeacherStoredConfig = {
    selectedClass: 'ALL',
    rubric: DEFAULT_ASSESSMENT_RUBRIC,
  };
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(TEACHER_CONFIG_KEY);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
}

export function saveStoredTeacherConfig(config: TeacherStoredConfig) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TEACHER_CONFIG_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving teacher config:', err);
  }
}

export function getStoredAssignments(): TeacherAssignment[] {
  if (typeof window === 'undefined') return MOCK_TEACHER_ASSIGNMENTS;
  try {
    const raw = localStorage.getItem(TEACHER_ASSIGNMENTS_KEY);
    if (!raw) {
      localStorage.setItem(TEACHER_ASSIGNMENTS_KEY, JSON.stringify(MOCK_TEACHER_ASSIGNMENTS));
      return MOCK_TEACHER_ASSIGNMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return MOCK_TEACHER_ASSIGNMENTS;
  }
}

export function saveStoredAssignments(assignments: TeacherAssignment[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TEACHER_ASSIGNMENTS_KEY, JSON.stringify(assignments));
  } catch (err) {
    console.error('Error saving assignments:', err);
  }
}

// 3. Analytics & Class Summaries Computation
export function computeClassRooms(students: StudentData[]): ClassRoomData[] {
  const classNames = ['VII A', 'VII B', 'VII C', 'VIII A', 'VIII B', 'IX A', 'IX B'];
  return classNames.map((name, index) => {
    const classStudents = students.filter((s) => s.className === name);
    const count = classStudents.length;
    if (count === 0) {
      return {
        id: `class_${index}`,
        name,
        grade: name.startsWith('VII') ? 7 : name.startsWith('VIII') ? 8 : 9,
        studentCount: 0,
        avgMastery: 0,
        avgAccuracy: 0,
        activeCount: 0,
        remedialCount: 0,
        enrichmentCount: 0,
      };
    }
    const sumMastery = classStudents.reduce((acc, s) => acc + s.mastery, 0);
    const sumAccuracy = classStudents.reduce((acc, s) => acc + s.accuracy, 0);
    const active = classStudents.filter((s) => s.lastActiveDaysAgo <= 3).length;
    const remedial = classStudents.filter((s) => s.mastery < 60 && s.status !== 'not_started').length;
    const enrichment = classStudents.filter((s) => s.mastery >= 80).length;

    return {
      id: `class_${index}`,
      name,
      grade: name.startsWith('VII') ? 7 : name.startsWith('VIII') ? 8 : 9,
      studentCount: count,
      avgMastery: Math.round(sumMastery / count),
      avgAccuracy: Math.round(sumAccuracy / count),
      activeCount: active,
      remedialCount: remedial,
      enrichmentCount: enrichment,
    };
  });
}

// 4. Rule-Based Alert Engine
export function computeTeacherAlerts(students: StudentData[], selectedClass: string = 'ALL'): TeacherAlert[] {
  const pool = selectedClass === 'ALL' ? students : students.filter((s) => s.className === selectedClass);
  const alerts: TeacherAlert[] = [];

  // Alert 1: Low Mastery (<60% & started)
  const lowMastery = pool.filter((s) => s.mastery > 0 && s.mastery < 60);
  if (lowMastery.length > 0) {
    alerts.push({
      id: 'alt_low_mastery',
      type: 'remedial',
      title: `${lowMastery.length} siswa dengan penguasaan di bawah 60%`,
      count: lowMastery.length,
      description: 'Memerlukan intervensi remedial terpandu untuk menguasai konsep dasar.',
      filterCriteria: { maxMastery: 59 },
    });
  }

  // Alert 2: Algoritma Topic Difficulty
  const algoStrugglers = pool.filter((s) => {
    const algoScore = s.topicMastery['ap-algoritma-dasar'];
    return typeof algoScore === 'number' && algoScore > 0 && algoScore < 60;
  });
  if (algoStrugglers.length > 0) {
    alerts.push({
      id: 'alt_algo_struggle',
      type: 'uncompleted_topic',
      title: `${algoStrugglers.length} siswa mengalami kesulitan pada modul Algoritma`,
      count: algoStrugglers.length,
      description: 'Konsep percabangan dan urutan langkah sekuensial membutuhkan penguatan visual.',
      filterCriteria: { topicId: 'ap-algoritma-dasar' },
    });
  }

  // Alert 3: Inactive students (inactive > 3 days)
  const inactives = pool.filter((s) => s.lastActiveDaysAgo >= 3);
  if (inactives.length > 0) {
    alerts.push({
      id: 'alt_inactive',
      type: 'inactive',
      title: `${inactives.length} siswa belum aktif dalam 3+ hari terakhir`,
      count: inactives.length,
      description: 'Beri pengingat atau pantau kendala akses gawai dan jaringan.',
      filterCriteria: { inactiveDays: 3 },
    });
  }

  return alerts;
}

// 5. Rule-Based Insights & Recommendations
export function computeTeacherInsights(students: StudentData[], selectedClass: string = 'ALL'): TeacherInsightItem[] {
  const pool = selectedClass === 'ALL' ? students : students.filter((s) => s.className === selectedClass);
  if (pool.length === 0) return [];

  const avgMastery = Math.round(pool.reduce((acc, s) => acc + s.mastery, 0) / pool.length);
  const avgAccuracy = Math.round(pool.reduce((acc, s) => acc + s.accuracy, 0) / pool.length);

  // Compute average per topic
  const topicKeys = ['bk-dekomposisi', 'sk-perangkat-keras', 'jki-jaringan-dasar', 'ap-algoritma-dasar', 'ad-analisis-data', 'dsi-keamanan-digital'];
  const topicStats = topicKeys.map((key) => {
    const valid = pool.filter((s) => typeof s.topicMastery[key] === 'number' && s.topicMastery[key] > 0);
    const avg = valid.length > 0 ? Math.round(valid.reduce((acc, s) => acc + s.topicMastery[key], 0) / valid.length) : 0;
    return { key, avg, count: valid.length };
  });

  const lowestTopic = [...topicStats].sort((a, b) => a.avg - b.avg)[0];
  const highestTopic = [...topicStats].sort((a, b) => b.avg - a.avg)[0];

  const insights: TeacherInsightItem[] = [];

  if (lowestTopic && lowestTopic.avg < 70) {
    const topicInfo = LEARNING_TOPICS.find((t) => t.id === lowestTopic.key);
    insights.push({
      id: 'ins_lowest',
      type: 'warning',
      title: `Kendala Utama: ${topicInfo?.title || lowestTopic.key}`,
      description: `Rata-rata penguasaan modul ini hanya ${lowestTopic.avg}%. Siswa paling sering keliru pada pengurutan instruksi dan kondisi Boolean.`,
      metric: `${lowestTopic.avg}% Rata-rata Penguasaan`,
      recommendedAction: `Berikan latihan terpandu (guided practice) sebelum menyelenggarakan Mastery Check untuk ${topicInfo?.title}.`,
      targetTopicId: lowestTopic.key,
    });
  }

  if (highestTopic && highestTopic.avg >= 80) {
    const topicInfo = LEARNING_TOPICS.find((t) => t.id === highestTopic.key);
    insights.push({
      id: 'ins_highest',
      type: 'positive',
      title: `Kekuatan Kelas: ${topicInfo?.title || highestTopic.key}`,
      description: `Sebagian besar siswa (${highestTopic.avg}%) telah menguasai konsep ini dengan sangat baik.`,
      metric: `${highestTopic.avg}% Penguasaan Tertinggi`,
      recommendedAction: `Pertimbangkan memberikan tantangan Pengayaan (Enrichment) tingkat lanjut untuk menjaga motivasi belajar.`,
      targetTopicId: highestTopic.key,
    });
  }

  insights.push({
    id: 'ins_summary',
    type: 'info',
    title: `Dinamika Belajar & Akurasi Kelas`,
    description: `Akurasi jawaban siswa berada pada ${avgAccuracy}% dengan tingkat penguasaan kompetensi keseluruhan ${avgMastery}%.`,
    metric: `${pool.length} Siswa Terdaftar`,
    recommendedAction: `Prioritaskan pendampingan bagi 3-5 siswa dengan tingkat akurasi di bawah 65% secara berkesinambungan.`,
  });

  return insights;
}

// 6. Action Handlers
export function assignInterventionToStudent(
  students: StudentData[],
  studentId: string,
  type: 'remedial' | 'enrichment' | 'practice',
  topicId: string,
  title: string,
  notes: string = ''
): StudentData[] {
  const topic = LEARNING_TOPICS.find((t) => t.id === topicId);
  const updated = students.map((s) => {
    if (s.id !== studentId) return s;
    const newIntervention: StudentInterventionItem = {
      id: `int_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      type,
      topicId,
      topicName: topic?.title || topicId,
      title,
      assignedAt: Date.now(),
      status: 'pending',
      notes,
    };
    return {
      ...s,
      assignedInterventions: [newIntervention, ...s.assignedInterventions],
    };
  });
  saveStoredStudents(updated);
  return updated;
}
