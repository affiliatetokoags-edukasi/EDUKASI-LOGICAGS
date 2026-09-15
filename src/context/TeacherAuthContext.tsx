/**
 * Teacher Authentication & Role Guard Context
 * Mengelola autentikasi guru berbasis Firebase Auth + Role Verification di Firestore users/{uid}.
 * Sesuai spesifikasi Logic Escape V0.7.3:
 * - Online: Firebase Auth + Firestore role === 'teacher' + isActive === true
 * - Local Demo: Legacy password protection (LOGICGURU2026) dengan lockout protection
 * - Tidak menyimpan password di Firestore maupun localStorage
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  authService,
  formatAuthError,
  userProfileService,
  FirestoreUserProfile,
} from '../services/firebase';
import {
  isTeacherAuthenticated as checkLegacySession,
  verifyTeacherPassword,
  clearTeacherSession,
  VerificationResult,
} from '../utils/teacherAuth';

export type RoleVerificationStatus =
  | 'IDLE'
  | 'VERIFYING_AUTH'
  | 'VERIFYING_ROLE'
  | 'GRANTED'
  | 'DENIED'
  | 'INACTIVE';

interface TeacherAuthContextType {
  firebaseUser: User | null;
  teacherProfile: FirestoreUserProfile | null;
  isAuthenticated: boolean;
  isOnlineTeacher: boolean;
  isLocalDemoTeacher: boolean;
  isLoading: boolean;
  verificationStatus: RoleVerificationStatus;
  authError: string | null;
  deniedReason: string | null;
  clearAuthError: () => void;
  loginOnline: (email: string, password: string) => Promise<void>;
  loginLocalDemo: (password: string) => VerificationResult;
  logoutTeacher: () => Promise<void>;
  resetVerificationState: () => void;
}

const TeacherAuthContext = createContext<TeacherAuthContextType | undefined>(undefined);

export const TeacherAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [teacherProfile, setTeacherProfile] = useState<FirestoreUserProfile | null>(null);
  const [isLocalDemoTeacher, setIsLocalDemoTeacher] = useState<boolean>(() => checkLegacySession());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [verificationStatus, setVerificationStatus] = useState<RoleVerificationStatus>('IDLE');
  const [authError, setAuthError] = useState<string | null>(null);
  const [deniedReason, setDeniedReason] = useState<string | null>(null);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
    setDeniedReason(null);
  }, []);

  const resetVerificationState = useCallback(() => {
    setVerificationStatus('IDLE');
    setAuthError(null);
    setDeniedReason(null);
  }, []);

  // Memverifikasi role guru dari Firestore users/{uid}
  const verifyTeacherRole = useCallback(
    async (user: User): Promise<FirestoreUserProfile | null> => {
      setVerificationStatus('VERIFYING_ROLE');
      try {
        let profile = await userProfileService.getProfile(user.uid);

        if (!profile) {
          // Jika akun guru telah dibuat di Firebase Auth Console dan belum memiliki dokumen di users/{uid},
          // lakukan inisialisasi dokumen profil guru otomatis saat login guru pertama kali
          console.log('[TeacherAuth] Menginisialisasi profil akun guru pertama kali untuk:', user.email);
          profile = await userProfileService.createTeacherProfile(
            user.uid,
            user.displayName || user.email?.split('@')[0] || 'Guru Pembina Informatika',
            user.email || ''
          );
        }

        if (profile.role !== 'teacher') {
          setVerificationStatus('DENIED');
          setDeniedReason(
            `Akses Ditolak: Akun "${profile.email}" terdaftar dengan hak akses "${profile.role || 'siswa'}", bukan guru.`
          );
          return null;
        }

        if (profile.isActive === false) {
          setVerificationStatus('INACTIVE');
          setDeniedReason('Akun guru ini tidak aktif. Hubungi administrator.');
          return null;
        }

        // Catat timestamp login
        userProfileService.recordLogin(user.uid);
        setVerificationStatus('GRANTED');
        return profile;
      } catch (error: any) {
        console.warn('[TeacherAuth] Status verifikasi role guru:', error?.message || error);
        setVerificationStatus('DENIED');
        setDeniedReason(error?.message || 'Gagal memverifikasi hak akses guru dari Firestore.');
        return null;
      }
    },
    []
  );

  // Listener perubahan status autentikasi Firebase untuk memulihkan sesi guru saat refresh
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (currentUser) => {
      setIsLoading(true);
      if (currentUser) {
        try {
          const profile = await userProfileService.getProfile(currentUser.uid);
          if (profile && profile.role === 'teacher' && profile.isActive !== false) {
            setFirebaseUser(currentUser);
            setTeacherProfile(profile);
            setVerificationStatus('GRANTED');
            setAuthError(null);
          } else if (profile && profile.role !== 'teacher') {
            // Sesi aktif adalah akun siswa, bukan guru
            setFirebaseUser(null);
            setTeacherProfile(null);
            setVerificationStatus('IDLE');
          } else {
            setFirebaseUser(null);
            setTeacherProfile(null);
            setVerificationStatus('IDLE');
          }
        } catch (err) {
          console.warn('[TeacherAuth] Sesi akun bukan akun guru:', err);
          setTeacherProfile(null);
          setVerificationStatus('IDLE');
        }
      } else {
        setFirebaseUser(null);
        setTeacherProfile(null);
        setVerificationStatus('IDLE');
      }

      // Periksa sesi lokal demo
      setIsLocalDemoTeacher(checkLegacySession());
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Login Guru Menggunakan Firebase Auth + Role Verification
  const loginOnline = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setAuthError(null);
    setDeniedReason(null);
    setVerificationStatus('VERIFYING_AUTH');

    try {
      const userCredential = await authService.signIn(email, password);
      if (!userCredential) {
        throw new Error('Gagal melakukan autentikasi dengan server Firebase.');
      }

      setFirebaseUser(userCredential);

      // Verifikasi role dari Firestore
      const verifiedProfile = await verifyTeacherRole(userCredential);

      if (!verifiedProfile) {
        // Jika gagal verifikasi role, sign out agar sesi tidak menggantung
        await authService.signOut();
        setFirebaseUser(null);
        setTeacherProfile(null);
        throw new Error(deniedReason || 'Anda tidak memiliki hak akses sebagai guru.');
      }

      setTeacherProfile(verifiedProfile);
      setVerificationStatus('GRANTED');
      // Jika login online berhasil, matikan flag local demo agar murni online
      setIsLocalDemoTeacher(false);
    } catch (error: any) {
      const message = formatAuthError(error);
      setAuthError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Login Guru Menggunakan Mode Demo Lokal (Password Legacy LOGICGURU2026)
  const loginLocalDemo = (password: string): VerificationResult => {
    setAuthError(null);
    setDeniedReason(null);
    const result = verifyTeacherPassword(password);
    if (result.success) {
      setIsLocalDemoTeacher(true);
      setVerificationStatus('GRANTED');
    } else {
      setIsLocalDemoTeacher(false);
      setAuthError(result.error || 'Password salah.');
    }
    return result;
  };

  // Logout Guru: Membersihkan sesi Firebase & sesi Local Demo
  const logoutTeacher = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (firebaseUser) {
        await authService.signOut();
      }
      clearTeacherSession();
      setFirebaseUser(null);
      setTeacherProfile(null);
      setIsLocalDemoTeacher(false);
      setVerificationStatus('IDLE');
      setAuthError(null);
      setDeniedReason(null);
    } catch (error) {
      console.error('[TeacherAuth] Gagal saat logout guru:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isOnlineTeacher = Boolean(
    firebaseUser &&
      teacherProfile &&
      teacherProfile.role === 'teacher' &&
      teacherProfile.isActive !== false &&
      verificationStatus === 'GRANTED'
  );

  const isAuthenticated = isOnlineTeacher || isLocalDemoTeacher;

  return (
    <TeacherAuthContext.Provider
      value={{
        firebaseUser,
        teacherProfile,
        isAuthenticated,
        isOnlineTeacher,
        isLocalDemoTeacher,
        isLoading,
        verificationStatus,
        authError,
        deniedReason,
        clearAuthError,
        loginOnline,
        loginLocalDemo,
        logoutTeacher,
        resetVerificationState,
      }}
    >
      {children}
    </TeacherAuthContext.Provider>
  );
};

export const useTeacherAuth = (): TeacherAuthContextType => {
  const context = useContext(TeacherAuthContext);
  if (!context) {
    throw new Error('useTeacherAuth must be used within a TeacherAuthProvider');
  }
  return context;
};
