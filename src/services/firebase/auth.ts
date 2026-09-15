/**
 * Firebase Authentication Service Wrapper
 * Menyediakan antarmuka modular: getCurrentUser, onAuthStateChanged, signIn, signOut.
 * Mendukung graceful fallback saat offline atau dalam Local Demo Mode.
 */

import {
  getAuth,
  Auth,
  User,
  onAuthStateChanged as fbOnAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
  NextOrObserver,
} from 'firebase/auth';
import { getFirebaseApp } from './app';

let cachedAuth: Auth | null = null;

export function getFirebaseAuth(): Auth | null {
  if (cachedAuth) return cachedAuth;
  const app = getFirebaseApp();
  if (!app) return null;

  try {
    cachedAuth = getAuth(app);
    return cachedAuth;
  } catch (error) {
    console.warn('[Firebase Auth Init Warning]:', error);
    return null;
  }
}

/**
 * Menerjemahkan kode error Firebase Auth ke dalam bahasa Indonesia yang ramah siswa.
 */
export function formatAuthError(error: unknown): string {
  if (!error) return 'Terjadi kesalahan sistem yang tidak diketahui.';
  const code = (error as any)?.code || (error instanceof Error ? error.message : String(error));

  if (typeof code === 'string') {
    if (code.includes('auth/email-already-in-use')) {
      return 'Email sudah terdaftar. Silakan masuk menggunakan akun tersebut.';
    }
    if (code.includes('auth/invalid-email')) {
      return 'Format email tidak valid.';
    }
    if (code.includes('auth/weak-password')) {
      return 'Password terlalu lemah. Minimal gunakan 6 karakter.';
    }
    if (code.includes('auth/user-not-found')) {
      return 'Akun dengan email ini tidak ditemukan.';
    }
    if (code.includes('auth/wrong-password')) {
      return 'Password yang Anda masukkan salah.';
    }
    if (code.includes('auth/invalid-credential')) {
      return 'Email atau password salah. Silakan periksa kembali.';
    }
    if (code.includes('auth/network-request-failed')) {
      return 'Gagal terhubung ke jaringan. Periksa koneksi internet Anda.';
    }
    if (code.includes('auth/too-many-requests')) {
      return 'Terlalu banyak percobaan gagal. Silakan tunggu beberapa saat lalu coba lagi.';
    }
    if (code.includes('permission-denied')) {
      return 'Akses ditolak oleh sistem keamanan.';
    }
  }

  return error instanceof Error ? error.message : 'Terjadi kendala saat memproses autentikasi.';
}

export const authService = {
  /**
   * Mendapatkan user Firebase saat ini jika ada.
   */
  getCurrentUser(): User | null {
    const auth = getFirebaseAuth();
    return auth ? auth.currentUser : null;
  },

  /**
   * Memasang pendengar perubahan status autentikasi.
   */
  onAuthStateChanged(observer: NextOrObserver<User | null>): () => void {
    const auth = getFirebaseAuth();
    if (!auth) {
      // Jika auth belum siap, panggil observer sekali dengan null
      if (typeof observer === 'function') {
        observer(null);
      } else if (observer && typeof observer.next === 'function') {
        observer.next(null);
      }
      return () => {};
    }
    return fbOnAuthStateChanged(auth, observer);
  },

  /**
   * Mendaftar akun baru dengan email, password, dan nama lengkap.
   */
  async signUp(email: string, password: string, displayName: string): Promise<User> {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase Auth service belum tersedia atau berjalan dalam Local Demo Mode.');
    }
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = credential.user;

    // Simpan display name pada Firebase Auth user object
    if (displayName && displayName.trim().length > 0) {
      try {
        await updateProfile(user, { displayName: displayName.trim() });
      } catch (err) {
        console.warn('[Firebase Auth] Gagal menyimpan display name ke profil Auth:', err);
      }
    }

    return user;
  },

  /**
   * Sign in dengan email dan password.
   */
  async signIn(email: string, password: string): Promise<User | null> {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase Auth service belum tersedia atau berjalan dalam Local Demo Mode.');
    }
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    return credential.user;
  },

  /**
   * Sign out dari Firebase.
   */
  async signOut(): Promise<void> {
    const auth = getFirebaseAuth();
    if (!auth) return;
    await fbSignOut(auth);
  },

  /**
   * Mengecek apakah service auth siap digunakan.
   */
  isReady(): boolean {
    return Boolean(getFirebaseAuth());
  },
};
