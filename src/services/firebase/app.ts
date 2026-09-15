/**
 * Firebase App Initialization Singleton
 * Menjamin Firebase App hanya diinisialisasi SATU KALI untuk mencegah error
 * "Firebase app already exists" atau overhead rerender React.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { firebaseConfig, isFirebaseConfigured, REQUIRED_FIREBASE_PROJECT_ID } from './config';

let cachedFirebaseApp: FirebaseApp | null = null;
let initError: string | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (cachedFirebaseApp) {
    return cachedFirebaseApp;
  }

  // Cek apakah sudah ada instance yang terdaftar di SDK
  const existingApps = getApps();
  if (existingApps.length > 0) {
    cachedFirebaseApp = getApp();
    return cachedFirebaseApp;
  }

  // Jika konfigurasi belum lengkap, jangan paksa inisialisasi agar tidak melempar uncaught exception
  if (!isFirebaseConfigured()) {
    return null;
  }

  try {
    // Validasi pencegahan mismatch projectId
    if (firebaseConfig.projectId !== REQUIRED_FIREBASE_PROJECT_ID) {
      console.warn(`[Firebase] Project ID wajib adalah '${REQUIRED_FIREBASE_PROJECT_ID}', terdeteksi: '${firebaseConfig.projectId}'. Mengoreksi...`);
      firebaseConfig.projectId = REQUIRED_FIREBASE_PROJECT_ID;
    }

    cachedFirebaseApp = initializeApp(firebaseConfig);
    initError = null;
    return cachedFirebaseApp;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[Firebase Init Error]:', message);
    initError = message;
    return null;
  }
}

export function getFirebaseInitError(): string | null {
  return initError;
}
