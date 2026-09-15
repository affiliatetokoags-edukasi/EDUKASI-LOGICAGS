/**
 * Firebase Configuration for LOGIC ESCAPE
 * Project ID Wajib: agslogic
 * Konfigurasi dimuat dari Vite environment variables (VITE_FIREBASE_*)
 * Mengutamakan Zero-Crash fallback ke Local Demo Mode jika config belum disediakan.
 */

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Project ID wajib selalu agslogic sesuai spesifikasi arsitektur
export const REQUIRED_FIREBASE_PROJECT_ID = 'agslogic';

export const firebaseConfig: FirebaseClientConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${REQUIRED_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || REQUIRED_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${REQUIRED_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

/**
 * Mengecek apakah konfigurasi kredensial minimal Firebase Web App telah tersedia.
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey.trim().length > 0 &&
    firebaseConfig.projectId === REQUIRED_FIREBASE_PROJECT_ID &&
    firebaseConfig.appId &&
    firebaseConfig.appId.trim().length > 0
  );
}
