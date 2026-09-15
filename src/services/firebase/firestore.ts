/**
 * Cloud Firestore Service Wrapper
 * Menyediakan antarmuka modular: getDocument, setDocument, updateDocument, createDocument, deleteDocument.
 * Mengimplementasikan penanganan error berstandar Zero-Crash dan format pelaporan terstruktur.
 */

import {
  getFirestore,
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  collection,
  DocumentData,
  WithFieldValue,
  UpdateData,
} from 'firebase/firestore';
import { getFirebaseApp } from './app';
import { getFirebaseAuth } from './auth';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const auth = getFirebaseAuth();
  const currentUser = auth?.currentUser;

  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo: currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };

  console.error('[Firestore Error]:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

let cachedFirestore: Firestore | null = null;

export function getFirebaseFirestore(): Firestore | null {
  if (cachedFirestore) return cachedFirestore;
  const app = getFirebaseApp();
  if (!app) return null;

  try {
    cachedFirestore = getFirestore(app);
    return cachedFirestore;
  } catch (error) {
    console.warn('[Firestore Init Warning]:', error);
    return null;
  }
}

export const firestoreService = {
  /**
   * Mengambil sebuah dokumen berdasarkan collectionPath dan docId.
   */
  async getDocument<T = DocumentData>(collectionPath: string, docId: string): Promise<T | null> {
    const db = getFirebaseFirestore();
    const fullPath = `${collectionPath}/${docId}`;
    if (!db) {
      throw new Error(`Firestore tidak tersedia. Gagal membaca: ${fullPath}`);
    }

    try {
      const docRef = doc(db, collectionPath, docId);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) {
        return null;
      }
      return snapshot.data() as T;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, fullPath);
    }
  },

  /**
   * Menyimpan / menimpa dokumen pada collectionPath dan docId.
   */
  async setDocument<T extends WithFieldValue<DocumentData>>(
    collectionPath: string,
    docId: string,
    data: T,
    merge: boolean = true
  ): Promise<void> {
    const db = getFirebaseFirestore();
    const fullPath = `${collectionPath}/${docId}`;
    if (!db) {
      throw new Error(`Firestore tidak tersedia. Gagal menulis ke: ${fullPath}`);
    }

    try {
      const docRef = doc(db, collectionPath, docId);
      await setDoc(docRef, data, { merge });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, fullPath);
    }
  },

  /**
   * Memperbarui sebagian data dokumen yang sudah ada.
   */
  async updateDocument(
    collectionPath: string,
    docId: string,
    data: UpdateData<DocumentData>
  ): Promise<void> {
    const db = getFirebaseFirestore();
    const fullPath = `${collectionPath}/${docId}`;
    if (!db) {
      throw new Error(`Firestore tidak tersedia. Gagal memperbarui: ${fullPath}`);
    }

    try {
      const docRef = doc(db, collectionPath, docId);
      await updateDoc(docRef, data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, fullPath);
    }
  },

  /**
   * Membuat dokumen baru di dalam koleksi dengan auto-generated ID.
   */
  async createDocument<T extends WithFieldValue<DocumentData>>(
    collectionPath: string,
    data: T
  ): Promise<{ id: string }> {
    const db = getFirebaseFirestore();
    if (!db) {
      throw new Error(`Firestore tidak tersedia. Gagal membuat dokumen di: ${collectionPath}`);
    }

    try {
      const colRef = collection(db, collectionPath);
      const docRef = await addDoc(colRef, data);
      return { id: docRef.id };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, collectionPath);
    }
  },

  /**
   * Menghapus dokumen tertentu berdasarkan path dan docId.
   */
  async deleteDocument(collectionPath: string, docId: string): Promise<void> {
    const db = getFirebaseFirestore();
    const fullPath = `${collectionPath}/${docId}`;
    if (!db) {
      throw new Error(`Firestore tidak tersedia. Gagal menghapus dokumen di: ${fullPath}`);
    }

    try {
      const docRef = doc(db, collectionPath, docId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, fullPath);
    }
  },

  /**
   * Mengecek apakah Firestore instance siap.
   */
  isReady(): boolean {
    return Boolean(getFirebaseFirestore());
  },
};
