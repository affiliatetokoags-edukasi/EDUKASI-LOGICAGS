/**
 * Student Authentication Context
 * Mengelola state otentikasi Firebase dan Profil Siswa Firestore untuk Logic Escape V0.7.2.
 * - Firebase Auth sebagai sumber kebenaran sesi
 * - Profil siswa Firestore di users/{uid}
 * - Zero-Crash fallback ke mode Guest / Local Demo saat tidak ada sesi
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  authService,
  formatAuthError,
  studentProfileService,
  FirestoreUserProfile,
} from '../services/firebase';

interface StudentAuthContextType {
  user: User | null;
  profile: FirestoreUserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOnlineAccount: boolean;
  role: 'student' | 'guest';
  authError: string | null;
  clearAuthError: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (displayName: string, email: string, password: string, currentLevel?: number, currentXp?: number) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(undefined);

export const StudentAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<FirestoreUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  // Memuat profil Firestore untuk user tertentu
  const loadProfile = useCallback(async (firebaseUser: User): Promise<FirestoreUserProfile | null> => {
    try {
      const userProfile = await studentProfileService.getProfile(firebaseUser.uid);

      if (!userProfile) {
        // Jangan auto-create profil student untuk setiap user login Firebase Auth!
        // Akun guru yang baru dibuat atau user tanpa profil tidak boleh diubah otomatis menjadi student.
        return null;
      }

      // Validasi ketat role akun & status aktif
      if (userProfile.role !== 'student') {
        // Jika akun bukan siswa (misal guru), jangan paksa signOut global, kembalikan null untuk konteks siswa
        return null;
      }

      if (userProfile.isActive === false) {
        throw new Error('Akun siswa ini telah dinonaktifkan. Hubungi pengajar Anda.');
      }

      // Rekam timestamp login terakhir
      studentProfileService.recordLogin(firebaseUser.uid);
      return userProfile;
    } catch (error) {
      console.warn('[StudentAuth] Info pemuatan profil siswa:', error);
      return null;
    }
  }, []);

  // Listener perubahan status autentikasi Firebase
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        try {
          const userProfile = await loadProfile(firebaseUser);
          if (userProfile && userProfile.role === 'student') {
            setUser(firebaseUser);
            setProfile(userProfile);
            setAuthError(null);
          } else {
            // Bukan akun siswa (misalnya sesi guru aktif)
            setUser(null);
            setProfile(null);
          }
        } catch (err: any) {
          console.warn('[StudentAuth] Info sesi akun:', err?.message || err);
          setUser(null);
          setProfile(null);
          setAuthError(err?.message || null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [loadProfile]);

  // Login siswa dengan Email & Password
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const loggedUser = await authService.signIn(email, password);
      if (!loggedUser) {
        throw new Error('Gagal melakukan autentikasi dengan Firebase.');
      }

      const userProfile = await loadProfile(loggedUser);
      if (!userProfile || userProfile.role !== 'student') {
        await authService.signOut();
        throw new Error('Akun ini terdaftar sebagai guru atau tidak memiliki akses siswa. Gunakan portal Teacher Access.');
      }

      setUser(loggedUser);
      setProfile(userProfile);
    } catch (error: any) {
      const friendlyMsg = formatAuthError(error);
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    } finally {
      setIsLoading(false);
    }
  };


  // Register siswa baru (Role otomatis = 'student')
  const register = async (
    displayName: string,
    email: string,
    password: string,
    currentLevel?: number,
    currentXp?: number
  ): Promise<void> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const newUser = await authService.signUp(email, password, displayName);
      setUser(newUser);

      // Buat dokumen users/{uid} di Firestore
      const userProfile = await studentProfileService.createProfile(
        newUser.uid,
        displayName,
        email,
        currentLevel || 1,
        currentXp || 0
      );

      setProfile(userProfile);
    } catch (error: any) {
      const friendlyMsg = formatAuthError(error);
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout siswa (mengakhiri sesi tanpa menghapus progress game lokal)
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setProfile(null);
      setAuthError(null);
    } catch (error: any) {
      console.error('[StudentAuth] Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Memuat ulang profil dari Firestore
  const refreshProfile = async (): Promise<void> => {
    if (!user) return;
    try {
      const fresh = await studentProfileService.getProfile(user.uid);
      if (fresh) setProfile(fresh);
    } catch (error) {
      console.warn('[StudentAuth] Gagal menyegarkan profil:', error);
    }
  };

  const isAuthenticated = Boolean(user && profile && profile.role === 'student');
  const role: 'student' | 'guest' = isAuthenticated ? 'student' : 'guest';
  const isOnlineAccount = isAuthenticated;

  return (
    <StudentAuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated,
        isLoading,
        isOnlineAccount,
        role,
        authError,
        clearAuthError,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </StudentAuthContext.Provider>
  );
};

export const useStudentAuth = (): StudentAuthContextType => {
  const context = useContext(StudentAuthContext);
  if (!context) {
    throw new Error('useStudentAuth must be used within a StudentAuthProvider');
  }
  return context;
};
