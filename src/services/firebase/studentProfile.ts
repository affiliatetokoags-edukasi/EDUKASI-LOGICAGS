/**
 * Student Profile Firestore Service
 * Adapter kompatibilitas V0.7.2 & V0.7.3:
 * Mengarahkan ke userProfileService dengan batasan khusus role 'student'.
 */

import { userProfileService, FirestoreUserProfile } from './userProfile';

export type { FirestoreUserProfile };

export const studentProfileService = {
  createProfile: (
    uid: string,
    displayName: string,
    email: string,
    initialLevel: number = 1,
    initialXp: number = 0
  ) => userProfileService.createStudentProfile(uid, displayName, email, initialLevel, initialXp),

  getProfile: (uid: string) => userProfileService.getProfile(uid),

  recordLogin: (uid: string) => userProfileService.recordLogin(uid),

  syncStudentProgress: (uid: string, level: number, xp: number) =>
    userProfileService.syncStudentProgress(uid, level, xp),
};

