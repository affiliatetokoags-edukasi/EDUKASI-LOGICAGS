/**
 * Teacher Authentication & Session Utilities
 * Mengelola sesi autentikasi dan mekanisme keamanan lokal untuk Teacher Mode.
 */

import { teacherConfig } from '../config/teacherConfig';

const SESSION_STORAGE_KEY = 'logicEscapeTeacherSession';
const LOCKOUT_STORAGE_KEY = 'logicEscapeTeacherLockout';

export interface TeacherSession {
  authenticated: boolean;
  loginAt: number;
}

interface LockoutData {
  failedAttempts: number;
  lockedUntil: number | null; // timestamp in milliseconds
}

/**
 * Mendapatkan status session guru saat ini dari localStorage.
 */
export function getTeacherSession(): TeacherSession | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.authenticated === true) {
      return parsed as TeacherSession;
    }
    return null;
  } catch (error) {
    console.warn('Gagal membaca logicEscapeTeacherSession:', error);
    return null;
  }
}

/**
 * Mengecek apakah sesi guru saat ini aktif & terautentikasi.
 */
export function isTeacherAuthenticated(): boolean {
  const session = getTeacherSession();
  return Boolean(session && session.authenticated === true);
}

/**
 * Menyimpan sesi autentikasi guru yang valid.
 */
export function saveTeacherSession(): TeacherSession {
  const session: TeacherSession = {
    authenticated: true,
    loginAt: Date.now(),
  };
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.warn('Gagal menyimpan logicEscapeTeacherSession:', error);
  }
  return session;
}

/**
 * Menghapus sesi guru (Logout).
 */
export function clearTeacherSession(): void {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.warn('Gagal menghapus logicEscapeTeacherSession:', error);
  }
}

/**
 * Mendapatkan state lockout (percobaan salah & batas waktu penguncian).
 */
export function getTeacherLockoutState(): {
  isLocked: boolean;
  remainingSeconds: number;
  failedAttempts: number;
} {
  try {
    const raw = localStorage.getItem(LOCKOUT_STORAGE_KEY);
    if (!raw) {
      return { isLocked: false, remainingSeconds: 0, failedAttempts: 0 };
    }
    const data: LockoutData = JSON.parse(raw);
    const now = Date.now();

    if (data.lockedUntil && data.lockedUntil > now) {
      const remainingSeconds = Math.ceil((data.lockedUntil - now) / 1000);
      return {
        isLocked: true,
        remainingSeconds,
        failedAttempts: data.failedAttempts || teacherConfig.maxFailedAttempts,
      };
    }

    // Jika waktu lock sudah lewat, reset lockedUntil tapi pertahankan attempts jika belum reset
    if (data.lockedUntil && data.lockedUntil <= now) {
      return { isLocked: false, remainingSeconds: 0, failedAttempts: 0 };
    }

    return {
      isLocked: false,
      remainingSeconds: 0,
      failedAttempts: data.failedAttempts || 0,
    };
  } catch (error) {
    return { isLocked: false, remainingSeconds: 0, failedAttempts: 0 };
  }
}

/**
 * Mencatat percobaan login yang salah.
 */
export function recordFailedTeacherAttempt(): {
  isLocked: boolean;
  remainingSeconds: number;
  failedAttempts: number;
} {
  try {
    const current = getTeacherLockoutState();
    const newAttempts = current.failedAttempts + 1;
    const now = Date.now();

    if (newAttempts >= teacherConfig.maxFailedAttempts) {
      const lockedUntil = now + teacherConfig.lockoutDurationSeconds * 1000;
      const data: LockoutData = {
        failedAttempts: newAttempts,
        lockedUntil,
      };
      localStorage.setItem(LOCKOUT_STORAGE_KEY, JSON.stringify(data));
      return {
        isLocked: true,
        remainingSeconds: teacherConfig.lockoutDurationSeconds,
        failedAttempts: newAttempts,
      };
    } else {
      const data: LockoutData = {
        failedAttempts: newAttempts,
        lockedUntil: null,
      };
      localStorage.setItem(LOCKOUT_STORAGE_KEY, JSON.stringify(data));
      return {
        isLocked: false,
        remainingSeconds: 0,
        failedAttempts: newAttempts,
      };
    }
  } catch (error) {
    return { isLocked: false, remainingSeconds: 0, failedAttempts: 1 };
  }
}

/**
 * Mengosongkan data lockout ketika login berhasil.
 */
export function resetTeacherLockout(): void {
  try {
    localStorage.removeItem(LOCKOUT_STORAGE_KEY);
  } catch (error) {
    console.warn('Gagal mereset logicEscapeTeacherLockout:', error);
  }
}

export interface VerificationResult {
  success: boolean;
  error?: string;
  isLocked?: boolean;
  remainingSeconds?: number;
}

/**
 * Melakukan verifikasi password guru secara case-sensitive.
 */
export function verifyTeacherPassword(password: string): VerificationResult {
  // 1. Cek apakah sedang terkunci
  const lockout = getTeacherLockoutState();
  if (lockout.isLocked) {
    return {
      success: false,
      error: `🔒 Terlalu banyak percobaan. Coba lagi dalam ${lockout.remainingSeconds} detik.`,
      isLocked: true,
      remainingSeconds: lockout.remainingSeconds,
    };
  }

  // 2. Verifikasi kecocokan password (case-sensitive)
  if (password === teacherConfig.defaultPassword) {
    resetTeacherLockout();
    saveTeacherSession();
    return { success: true };
  }

  // 3. Password salah, catat percobaan
  const updatedLockout = recordFailedTeacherAttempt();
  if (updatedLockout.isLocked) {
    return {
      success: false,
      error: `🔒 Terlalu banyak percobaan. Coba lagi dalam ${updatedLockout.remainingSeconds} detik.`,
      isLocked: true,
      remainingSeconds: updatedLockout.remainingSeconds,
    };
  }

  return {
    success: false,
    error: '❌ Password salah. Silakan coba lagi.',
    isLocked: false,
    remainingSeconds: 0,
  };
}
