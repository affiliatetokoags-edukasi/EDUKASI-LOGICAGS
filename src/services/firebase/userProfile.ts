/**
 * User Profile Service (Unified Student & Teacher Management)
 * Sesuai spesifikasi Logic Escape V0.7.3:
 * - Koleksi: users/{uid}
 * - Role: 'student' | 'teacher' (strictly lowercase)
 * - Teacher Profile Schema: { uid, displayName, email, role: 'teacher', classId: null, avatar: null, createdAt, updatedAt, lastLoginAt, isActive: true }
 * - Tidak pernah menyimpan password di Firestore atau localStorage
 */

import { serverTimestamp } from 'firebase/firestore';
import { firestoreService } from './firestore';

export type UserRole = 'student' | 'teacher';

export interface FirestoreUserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
  classId: string | null;
  avatar: string | null;
  level?: number;
  xp?: number;
  createdAt: any;
  updatedAt: any;
  lastLoginAt: any;
  isActive: boolean;
}

export const userProfileService = {
  /**
   * Mengambil data profil user (student atau teacher) dari users/{uid}.
   */
  async getProfile(uid: string): Promise<FirestoreUserProfile | null> {
    if (!uid) return null;
    return await firestoreService.getDocument<FirestoreUserProfile>('users', uid);
  },

  /**
   * Membuat profil siswa baru di collection users/{uid}.
   * Role otomatis dan wajib 'student'.
   */
  async createStudentProfile(
    uid: string,
    displayName: string,
    email: string,
    initialLevel: number = 1,
    initialXp: number = 0
  ): Promise<FirestoreUserProfile> {
    const profileData: FirestoreUserProfile = {
      uid,
      displayName: displayName.trim(),
      email: email.trim().toLowerCase(),
      role: 'student',
      classId: null,
      avatar: null,
      level: Math.max(1, initialLevel),
      xp: Math.max(0, initialXp),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      isActive: true,
    };

    await firestoreService.setDocument('users', uid, profileData, true);

    return {
      ...profileData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
  },

  /**
   * Helper Provisioning Akun Guru di collection users/{uid} (V0.7.3).
   * Digunakan untuk provisioning akun guru yang telah terdaftar di Firebase Auth.
   * Role strictly 'teacher'.
   */
  async createTeacherProfile(
    uid: string,
    displayName: string,
    email: string
  ): Promise<FirestoreUserProfile> {
    const profileData: FirestoreUserProfile = {
      uid,
      displayName: displayName.trim() || 'Guru Pembina Informatika',
      email: email.trim().toLowerCase(),
      role: 'teacher',
      classId: null,
      avatar: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      isActive: true,
    };

    await firestoreService.setDocument('users', uid, profileData, true);

    return {
      ...profileData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
  },

  /**
   * Memperbarui timestamp login terakhir.
   */
  async recordLogin(uid: string): Promise<void> {
    try {
      await firestoreService.updateDocument('users', uid, {
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.warn('[userProfileService] Gagal memperbarui lastLoginAt:', error);
    }
  },

  /**
   * Sinkronisasi progress siswa (level & xp).
   */
  async syncStudentProgress(uid: string, level: number, xp: number): Promise<void> {
    try {
      await firestoreService.updateDocument('users', uid, {
        level,
        xp,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.warn('[userProfileService] Gagal sinkronisasi progress:', error);
    }
  },
};
