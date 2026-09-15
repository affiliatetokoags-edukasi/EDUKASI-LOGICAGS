/**
 * Firebase Connection & Health Check Manager
 * Memvalidasi inisialisasi App, ketersediaan Auth, dan ketercapaian Firestore.
 * Memberikan fallback terpercaya ke Local Demo Mode tanpa mengganggu jalannya aplikasi.
 */

import { doc, getDocFromServer } from 'firebase/firestore';
import { getFirebaseApp, getFirebaseInitError } from './app';
import { getFirebaseAuth } from './auth';
import { getFirebaseFirestore } from './firestore';
import { isFirebaseConfigured, REQUIRED_FIREBASE_PROJECT_ID } from './config';

export type FirebaseConnectionStatus = 'CONNECTED' | 'NOT_CONNECTED' | 'ERROR';
export type DataMode = 'ONLINE' | 'LOCAL_DEMO';

export interface FirebaseHealthReport {
  status: FirebaseConnectionStatus;
  statusLabel: string;
  dataMode: DataMode;
  modeLabel: string;
  projectId: string;
  appInitialized: boolean;
  authReady: boolean;
  firestoreReady: boolean;
  message: string;
  detailedReason?: string;
  checkedAt: number;
}

let latestHealthReport: FirebaseHealthReport = {
  status: 'NOT_CONNECTED',
  statusLabel: '🔴 FIREBASE NOT CONNECTED',
  dataMode: 'LOCAL_DEMO',
  modeLabel: '💻 LOCAL DEMO',
  projectId: REQUIRED_FIREBASE_PROJECT_ID,
  appInitialized: false,
  authReady: false,
  firestoreReady: false,
  message: 'Firebase belum dikonfigurasi. LOGIC ESCAPE berjalan dalam Local Demo Mode.',
  checkedAt: Date.now(),
};

type StatusListener = (report: FirebaseHealthReport) => void;
const listeners: Set<StatusListener> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener(latestHealthReport);
    } catch (err) {
      console.error('[Firebase Status Listener Error]:', err);
    }
  });
}

/**
 * Mendapatkan laporan kesehatan koneksi Firebase terakhir secara sinkron.
 */
export function getFirebaseHealthReport(): FirebaseHealthReport {
  return latestHealthReport;
}

/**
 * Mendaftarkan observer untuk perubahan status kesehatan Firebase.
 */
export function subscribeToFirebaseStatus(callback: StatusListener): () => void {
  listeners.add(callback);
  callback(latestHealthReport);
  return () => {
    listeners.delete(callback);
  };
}

/**
 * Menjalankan Health Check lengkap terhadap Firebase (App, Auth, Firestore).
 * Memenuhi seluruh kriteria verifikasi tanpa resiko unhandled exception.
 */
export async function checkFirebaseConnection(): Promise<FirebaseHealthReport> {
  // 1. Cek konfigurasi
  if (!isFirebaseConfigured()) {
    latestHealthReport = {
      status: 'NOT_CONNECTED',
      statusLabel: '🔴 FIREBASE NOT CONNECTED',
      dataMode: 'LOCAL_DEMO',
      modeLabel: '💻 LOCAL DEMO',
      projectId: REQUIRED_FIREBASE_PROJECT_ID,
      appInitialized: false,
      authReady: false,
      firestoreReady: false,
      message: 'Firebase belum dikonfigurasi. LOGIC ESCAPE berjalan dalam Local Demo Mode.',
      checkedAt: Date.now(),
    };
    notifyListeners();
    return latestHealthReport;
  }

  // 2. Cek App
  const app = getFirebaseApp();
  const initError = getFirebaseInitError();
  if (!app) {
    latestHealthReport = {
      status: 'ERROR',
      statusLabel: '🟡 FIREBASE ERROR',
      dataMode: 'LOCAL_DEMO',
      modeLabel: '💻 LOCAL DEMO',
      projectId: REQUIRED_FIREBASE_PROJECT_ID,
      appInitialized: false,
      authReady: false,
      firestoreReady: false,
      message: initError || 'Gagal menginisialisasi Firebase App. Menggunakan Local Demo Mode.',
      checkedAt: Date.now(),
    };
    notifyListeners();
    return latestHealthReport;
  }

  // 3. Cek Auth service
  const auth = getFirebaseAuth();
  const authReady = Boolean(auth);

  // 4. Cek Firestore service
  const db = getFirebaseFirestore();
  if (!db) {
    latestHealthReport = {
      status: 'ERROR',
      statusLabel: '🟡 FIREBASE ERROR',
      dataMode: 'LOCAL_DEMO',
      modeLabel: '💻 LOCAL DEMO',
      projectId: REQUIRED_FIREBASE_PROJECT_ID,
      appInitialized: true,
      authReady,
      firestoreReady: false,
      message: 'Cloud Firestore service tidak dapat diinisialisasi. Menggunakan Local Demo Mode.',
      checkedAt: Date.now(),
    };
    notifyListeners();
    return latestHealthReport;
  }

  // 5. Uji ketercapaian server Firestore secara live (dengan timeout proteksi)
  try {
    const testDocRef = doc(db, '_connection_test_', 'health');
    
    // Gunakan race dengan timeout 4000ms agar UI tidak freeze jika offline
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT: Waktu tunggu koneksi Firebase habis')), 4000)
    );

    await Promise.race([
      getDocFromServer(testDocRef),
      timeoutPromise,
    ]);

    // Berhasil mencapai Firestore server
    latestHealthReport = {
      status: 'CONNECTED',
      statusLabel: '🟢 FIREBASE CONNECTED',
      dataMode: 'ONLINE',
      modeLabel: '☁ ONLINE',
      projectId: REQUIRED_FIREBASE_PROJECT_ID,
      appInitialized: true,
      authReady,
      firestoreReady: true,
      message: 'Firebase terhubung dengan baik. Mode Online aktif.',
      checkedAt: Date.now(),
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);

    // Kasus 1: Permission Denied -> Firestore server terhubung dan merespons, rules aktif!
    if (errMessage.includes('permission-denied') || errMessage.includes('Missing or insufficient permissions')) {
      latestHealthReport = {
        status: 'CONNECTED',
        statusLabel: '🟢 FIREBASE CONNECTED',
        dataMode: 'ONLINE',
        modeLabel: '☁ ONLINE',
        projectId: REQUIRED_FIREBASE_PROJECT_ID,
        appInitialized: true,
        authReady,
        firestoreReady: true,
        message: 'Firebase terhubung tetapi akses database dibatasi oleh aturan keamanan.',
        detailedReason: 'permission-denied (Firestore Server Reachable)',
        checkedAt: Date.now(),
      };
    } 
    // Kasus 2: Offline / Network / Timeout
    else if (
      errMessage.includes('offline') || 
      errMessage.includes('TIMEOUT') || 
      errMessage.includes('Failed to fetch') ||
      errMessage.includes('network')
    ) {
      latestHealthReport = {
        status: 'NOT_CONNECTED',
        statusLabel: '🔴 FIREBASE NOT CONNECTED',
        dataMode: 'LOCAL_DEMO',
        modeLabel: '💻 LOCAL DEMO',
        projectId: REQUIRED_FIREBASE_PROJECT_ID,
        appInitialized: true,
        authReady,
        firestoreReady: false,
        message: 'Tidak dapat terhubung ke Firebase. Menggunakan Local Demo Mode.',
        detailedReason: 'Koneksi jaringan offline atau timeout.',
        checkedAt: Date.now(),
      };
    }
    // Kasus 3: Kunci API tidak valid / Project error
    else if (errMessage.includes('api-key') || errMessage.includes('invalid') || errMessage.includes('project')) {
      latestHealthReport = {
        status: 'ERROR',
        statusLabel: '🟡 FIREBASE ERROR',
        dataMode: 'LOCAL_DEMO',
        modeLabel: '💻 LOCAL DEMO',
        projectId: REQUIRED_FIREBASE_PROJECT_ID,
        appInitialized: true,
        authReady,
        firestoreReady: false,
        message: 'Konfigurasi Firebase belum valid atau API Key salah. Menggunakan Local Demo Mode.',
        detailedReason: errMessage,
        checkedAt: Date.now(),
      };
    }
    // Kasus umum lainnya: fallback ke safe demo mode
    else {
      latestHealthReport = {
        status: 'ERROR',
        statusLabel: '🟡 FIREBASE ERROR',
        dataMode: 'LOCAL_DEMO',
        modeLabel: '💻 LOCAL DEMO',
        projectId: REQUIRED_FIREBASE_PROJECT_ID,
        appInitialized: true,
        authReady,
        firestoreReady: false,
        message: 'Tidak dapat terhubung ke Firebase. Menggunakan Local Demo Mode.',
        detailedReason: errMessage,
        checkedAt: Date.now(),
      };
    }
  }

  notifyListeners();
  return latestHealthReport;
}
