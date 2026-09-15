/**
 * Konfigurasi Terpusat Teacher Mode & Security
 * Digunakan untuk proteksi akses guru pada V0.6 (Local Demo Authentication)
 * Memudahkan migrasi ke Firebase Auth / Cloud Auth pada V0.7+
 */

export const teacherConfig = {
  defaultPassword: 'LOGICGURU2026',
  maxFailedAttempts: 5,
  lockoutDurationSeconds: 30,
};

export const TEACHER_DEFAULT_PASSWORD = teacherConfig.defaultPassword;
