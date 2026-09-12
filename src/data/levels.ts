import { LevelData } from '../types';

export const LEVELS_DATA: LevelData[] = [
  {
    id: 1,
    title: "LEVEL 1 — GERBANG LAB KOMPUTER",
    subtitle: "Eksplorasi & Pattern Puzzle",
    iconName: "Puzzle",
    type: "pattern",
    difficulty: "Mudah",
    xpReward: 100,
    scoreReward: 100,
    bonusReward: 50,
    coinReward: 20,
    description: "Selidiki ruangan, temukan catatan teknisi, dan pecahkan kode pola pada panel pintu lab.",
    mission: {
      brief: "Pintu Laboratorium Komputer terkunci rapat oleh panel digital darurat setelah jam sekolah usai.",
      objective: "Temukan petunjuk di sekitar ruangan dan pecahkan kode pola angka pada keypad panel pintu.",
      lore: "Protokol keamanan sekolah mengunci semua ruangan. Satu-satunya cara membuka gerbang adalah membuktikan pemahaman pola logika.",
      interactiveObjects: [
        {
          id: "obj-1-note",
          name: "Catatan Teknisi",
          icon: "note",
          title: "📄 Memo Teknisi Lab",
          description: "Sebuah catatan tertinggal di atas meja instruktur.",
          foundClue: "💡 Clue: 'Sistem pengunci menggunakan deret penambahan konstan (+2). Amati selisih setiap angka secara teliti.'"
        },
        {
          id: "obj-1-door",
          name: "Panel Kunci Pintu",
          icon: "lock",
          title: "🔐 Panel Kunci Digital",
          description: "Keypad elektronik pada pintu laboratorium meminta masukan angka terakhir dari deret bilangan."
        },
        {
          id: "obj-1-computer",
          name: "Terminal Monitor",
          icon: "computer",
          title: "💻 Terminal Diagnostik",
          description: "Monitor menampilkan log sistem: 'Urutan sinyal listrik deret aritmatika terdeteksi stabil.'"
        }
      ]
    },
    challenges: [
      {
        id: "c1-p1",
        type: "pattern",
        title: "Pola Deret Aritmatika",
        instruction: "Amati deret angka berikut dan tentukan angka yang tepat untuk membuka panel pintu:",
        detail: "2 → 4 → 6 → 8 → ?",
        patternSequence: ["2", "4", "6", "8", "?"],
        patternTargetIndex: 4,
        options: [
          { id: "A", label: "A", text: "9" },
          { id: "B", label: "B", text: "10" },
          { id: "C", label: "C", text: "11" },
          { id: "D", label: "D", text: "12" },
        ],
        correctAnswer: "B",
        hints: [
          "Hint 1: Perhatikan selisih dari 2 ke 4, 4 ke 6, dan 6 ke 8.",
          "Hint 2: Setiap bilangan bertambah sebanyak 2 angka secara konstan (+2).",
          "Hint 3: Hitung 8 + 2 untuk menentukan jawaban yang tepat (10)."
        ],
        explanation: "Setiap suku dalam deret bertambah 2 (+2). Maka angka setelah 8 adalah 8 + 2 = 10.",
        xpReward: 100,
        coinReward: 20,
      }
    ],
    // Legacy support
    question: {
      id: "q1",
      title: "Pola Deret Aritmatika",
      type: "multiple_choice",
      prompt: "2 → 4 → 6 → 8 → ?",
      detail: "Perhatikan hubungan nilai antara angka-angka yang berurutan pada deret di atas.",
      options: [
        { id: "A", label: "A", text: "9" },
        { id: "B", label: "B", text: "10" },
        { id: "C", label: "C", text: "11" },
        { id: "D", label: "D", text: "12" },
      ],
      correctAnswer: "B",
      explanation: "Setiap angka bertambah 2 secara konstan (+2). Maka angka setelah 8 adalah 8 + 2 = 10.",
      hint: "Perhatikan selisih antara 2 ke 4, 4 ke 6, dan 6 ke 8. Berapakah penambahannya?"
    }
  },
  {
    id: 2,
    title: "LEVEL 2 — RUANG SERVER & AKSES",
    subtitle: "Cyber Decision & Keamanan Siber",
    iconName: "Brain",
    type: "logic",
    difficulty: "Mudah - Sedang",
    xpReward: 100,
    scoreReward: 100,
    bonusReward: 50,
    coinReward: 20,
    description: "Tangani insiden keamanan digital dan ambil keputusan perlindungan data pribadi yang tepat.",
    mission: {
      brief: "Sistem alarm keamanan server berbunyi setelah menerima pesan mencurigakan dari luar jaringan.",
      objective: "Analisis peringatan pada konsol server dan buat keputusan digital yang aman dari ancaman phishing.",
      lore: "Pelaku kejahatan siber sering menggunakan rekayasa sosial untuk menipu pengguna agar menyerahkan password rahasia.",
      interactiveObjects: [
        {
          id: "obj-2-computer",
          name: "Konsol Server",
          icon: "computer",
          title: "💻 Konsol Firewall Server",
          description: "Layar monitor mendeteksi adanya transmisi pesan rekayasa sosial (Social Engineering)."
        },
        {
          id: "obj-2-note",
          name: "Panduan Etika Siber",
          icon: "note",
          title: "📄 SOP Keamanan Data Sekolah",
          description: "Buku panduan siber resmi sekolah tersimpan di samping meja teknisi.",
          foundClue: "💡 Clue: 'Pihak sekolah atau layanan resmi TIDAK PERNAH meminta kata sandi akunmu melalui pesan instan.'"
        },
        {
          id: "obj-2-clue",
          name: "Log Pemindai Phishing",
          icon: "clue",
          title: "🔎 Indikator Tautan Palsu",
          description: "Scanner mendeteksi alamat website palsu yang meniru formulir login sekolah."
        }
      ]
    },
    challenges: [
      {
        id: "c2-d1",
        type: "decision",
        title: "Tantangan Keputusan: Ancaman Phishing",
        instruction: "Kamu menerima pesan bertuliskan: 'Selamat! Kamu memenangkan hadiah laptop sekolah. Klik tautan berikut dan masukkan username serta password akunmu untuk klaim.' Apa tindakan terbaikmu?",
        options: [
          { 
            id: "A", 
            label: "A", 
            text: "Abaikan tautan dan laporkan pesan tersebut sebagai upaya phishing", 
            icon: "ShieldCheck",
            detail: "Melindungi kerahasiaan kredensial dan membantu sistem menandai pelaku ancaman."
          },
          { 
            id: "B", 
            label: "B", 
            text: "Klik link dan segera masukkan password akunmu", 
            icon: "AlertTriangle",
            detail: "Berisiko tinggi akun diretas dan data pribadimu dicuri."
          },
          { 
            id: "C", 
            label: "C", 
            text: "Teruskan pesan ke semua teman sekelas agar ikut dapat hadiah", 
            icon: "Share2",
            detail: "Menyebarkan tautan berbahaya ke orang lain."
          },
          { 
            id: "D", 
            label: "D", 
            text: "Kirim pesan balasan meminta hadiah dikirim langsung tanpa klik", 
            icon: "MessageSquare",
            detail: "Memberi sinyal kepada penipu bahwa nomor/kontakmu aktif."
          },
        ],
        correctAnswer: "A",
        hints: [
          "Hint 1: Waspadai pesan dengan iming-iming hadiah mendesak yang meminta kata sandi.",
          "Hint 2: Memberikan password di situs tidak resmi adalah jebakan phishing klasik.",
          "Hint 3: Pilihan yang paling tepat dan beretika adalah mengabaikan serta melaporkannya (A)."
        ],
        explanation: "Keputusan tepat! Pesan tersebut adalah Phishing. Jangan pernah membagikan password akunmu kepada siapa pun atau mengklik tautan yang tidak jelas keasliannya.",
        xpReward: 100,
        coinReward: 20,
      }
    ],
    // Legacy support
    question: {
      id: "q2",
      title: "Izin Masuk Laboratorium",
      type: "multiple_choice",
      prompt: "Kamu menerima pesan mencurigakan berisi tautan hadiah yang meminta kata sandi akun sekolah.\n\nApa tindakan logis & aman yang harus kamu ambil?",
      detail: "Gunakan penalaran etika dan keamanan digital.",
      options: [
        { id: "A", label: "A", text: "Abaikan tautan dan laporkan sebagai pesan phishing yang berbahaya" },
        { id: "B", label: "B", text: "Klik tautan dan langsung masukkan kata sandi akun" },
        { id: "C", label: "C", text: "Teruskan pesan tersebut ke seluruh teman sekelas" },
        { id: "D", label: "D", text: "Kirim kata sandi akun lain milik saudara" },
      ],
      correctAnswer: "A",
      explanation: "Benar! Menjaga kerahasiaan kredensial akun dan menolak tautan mencurigakan adalah prinsip dasar keamanan siber.",
      hint: "Apakah aman memberikan informasi rahasia ke website yang tidak dikenal?"
    }
  },
  {
    id: 3,
    title: "LEVEL 3 — RUANG ROBOTIKA & SISTEM",
    subtitle: "Urutan Algoritma & Debugging",
    iconName: "ListOrdered",
    type: "ordering",
    difficulty: "Sedang",
    xpReward: 150,
    scoreReward: 150,
    bonusReward: 50,
    coinReward: 30,
    description: "Susun langkah sekuensial aktivasi sistem robot dan temukan satu instruksi yang salah (bug).",
    mission: {
      brief: "Robot pemandu koridor sekolah mengalami gangguan memori urutan dan terdapat instruksi bug pada modul geraknya.",
      objective: "Susun langkah algoritma penyalaan sistem dengan benar, lalu temukan langkah yang menjadi bug.",
      lore: "Algoritma harus runtut, tidak ambigu, dan logis dari awal hingga akhir agar komputer dapat bekerja normal.",
      interactiveObjects: [
        {
          id: "obj-3-box",
          name: "Kotak Toolkit Robot",
          icon: "box",
          title: "📦 Kotak Perkakas Robotika",
          description: "Berisi kartu modul instruksi dan buku sirkuit daya."
        },
        {
          id: "obj-3-note",
          name: "Manual Booting",
          icon: "note",
          title: "📄 Lembar Instruksi Guru",
          description: "Catatan prosedur pengoperasian komputer dan robotika dasar.",
          foundClue: "💡 Clue: 'Aliran daya (power) harus masuk sebelum sistem operasi bisa booting, setelah itu baru otentikasi akun pengguna.'"
        },
        {
          id: "obj-3-computer",
          name: "Konsol Editor Kode",
          icon: "computer",
          title: "💻 Konsol Debugger",
          description: "Menampilkan 5 baris kode navigasi robot yang memiliki satu baris instruksi cacat (bug)."
        }
      ]
    },
    challenges: [
      {
        id: "c3-o1",
        type: "order",
        title: "Tantangan 1: Urutan Algoritma Menyalakan Komputer",
        instruction: "Susun tahapan menyalakan komputer dari kondisi mati hingga siap digunakan secara runtut:",
        orderItems: [
          { id: "step-1", text: "Tekan tombol power untuk menyalurkan daya" },
          { id: "step-2", text: "Tunggu sistem melakukan proses booting" },
          { id: "step-3", text: "Login dan masukkan otentikasi akun pengguna" },
          { id: "step-4", text: "Komputer siap digunakan untuk beraktivitas" },
        ],
        correctOrder: ["step-1", "step-2", "step-3", "step-4"],
        hints: [
          "Hint 1: Komputer harus mendapatkan energi listrik terlebih dahulu sebelum layar dapat hidup.",
          "Hint 2: Sistem operasi dimuat (booting) sebelum pengguna dapat memasukkan kata sandi akun.",
          "Hint 3: Urutannya: Tekan Power → Booting Sistem → Login Akun → Siap Digunakan."
        ],
        explanation: "Langkah terurut: Daya Aktif (Power) → Pemuatan OS (Booting) → Masuk Akun (Login) → Siap Digunakan.",
        xpReward: 80,
        coinReward: 15,
      },
      {
        id: "c3-d1",
        type: "debug",
        title: "Tantangan 2: Temukan Bug pada Algoritma Navigasi Robot",
        instruction: "Robot harus berjalan menuju pintu keluar koridor. Pilih satu langkah yang merupakan KESALAHAN (BUG):",
        debugSteps: [
          { id: 1, code: "1. MAJU 2 METER KE PERSIMPANGAN", description: "Robot bergerak maju ke depan lorong", isBug: false },
          { id: 2, code: "2. PERIKSA SENSOR JARAK", description: "Sensor memastikan lintasan depan aman", isBug: false },
          { id: 3, code: "3. MATIKAN DAYA SEGERA", description: "Memutus daya di tengah perjalanan (KESALAHAN/BUG!)", isBug: true },
          { id: 4, code: "4. BELOK KANAN MENGHADAP PINTU", description: "Robot berputar 90 derajat menuju pintu", isBug: false },
          { id: 5, code: "5. MAJU MENUJU PINTU KELUAR", description: "Robot melangkah masuk ke pintu tujuan", isBug: false },
        ],
        bugStepId: 3,
        bugExplanation: "Langkah nomor 3 (MATIKAN DAYA SEGERA) menghentikan robot sebelum mencapai tujuannya. Langkah ini harus dihapus agar robot sampai ke pintu.",
        hints: [
          "Hint 1: Perhatikan instruksi yang berlawanan dengan tujuan robot mencapai pintu keluar.",
          "Hint 2: Apakah robot bisa belok dan jalan jika daya dimatikan di tengah jalan?",
          "Hint 3: Pilih Langkah 3 karena perintah mematikan daya menghentikan seluruh sistem robot."
        ],
        explanation: "BUG FOUND! Langkah 3 membuat robot mati sebelum menyelesaikan misinya. Debugging membantu kita memperbaiki kesalahan alur logika program.",
        xpReward: 70,
        coinReward: 15,
      }
    ],
    // Legacy support
    question: {
      id: "q3",
      title: "Menyalakan Komputer",
      type: "ordering",
      prompt: "Susun langkah yang benar untuk menyalakan komputer dari kondisi mati hingga siap digunakan:",
      orderItems: [
        { id: "step-1", text: "Tekan tombol power" },
        { id: "step-2", text: "Tunggu sistem melakukan booting" },
        { id: "step-3", text: "Login ke akun pengguna" },
        { id: "step-4", text: "Komputer siap digunakan" },
      ],
      correctOrder: ["step-1", "step-2", "step-3", "step-4"],
      explanation: "Urutan logis menyalakan komputer: Nyalakan daya (power) → Tunggu sistem memuat OS (booting) → Masuk ke akun (login) → Komputer siap digunakan.",
      hint: "Langkah apa yang mutlak harus dilakukan pertama kali agar perangkat keras mendapatkan daya?"
    }
  },
  {
    id: 4,
    title: "LEVEL 4 — JALUR FIREWALL JARINGAN",
    subtitle: "Path Finder & Solusi Pemecahan Masalah",
    iconName: "Lightbulb",
    type: "scenario",
    difficulty: "Sedang - Sulit",
    xpReward: 120,
    scoreReward: 120,
    bonusReward: 50,
    coinReward: 30,
    description: "Pandu paket data melewati koridor jaringan aman dan hindari firewall merah hingga tiba di gerbang EXIT.",
    mission: {
      brief: "Jalur komunikasi terblokir oleh serangkaian firewall pertahanan aktif setelah insiden sekolah.",
      objective: "Bawa paket data dari titik awal menuju gerbang keluar (EXIT) dengan rute yang tidak terhalang firewall.",
      lore: "Dalam jaringan komputer, paket data harus diarahkan (routing) melewati rute terbaik tanpa melewati node yang bermasalah.",
      interactiveObjects: [
        {
          id: "obj-4-map",
          name: "Peta Topologi",
          icon: "map",
          title: "🗺 Topologi Jaringan Sekolah",
          description: "Menampilkan bagan matriks 5x5 grid jaringan koridor lantai 2.",
          foundClue: "💡 Clue: 'Kotak merah adalah firewall aktif yang memblokir transmisi. Cari koridor hijau terbuka ke arah kanan lalu turun.'"
        },
        {
          id: "obj-4-computer",
          name: "Router Jaringan",
          icon: "computer",
          title: "💻 Router Gateway",
          description: "Menunjukkan port transmisi paket data dalam keadaan siap navigasi."
        },
        {
          id: "obj-4-clue",
          name: "Indikator Gerbang",
          icon: "clue",
          title: "🔎 Indikator Sinyal EXIT",
          description: "Pintu gerbang keluar berada di sudut kanan bawah (posisi 5, 5)."
        }
      ]
    },
    challenges: [
      {
        id: "c4-p1",
        type: "pathfinder",
        title: "Misi Navigasi Paket Data (Path Finder)",
        instruction: "Bawa paket data (🚀) dari START ke EXIT (🚪). Gunakan tombol panah pada layar atau panah keyboard desktop. Hindari kotak merah firewall!",
        gridSize: { rows: 5, cols: 5 },
        startPos: { x: 0, y: 0 },
        exitPos: { x: 4, y: 4 },
        walls: [
          { x: 2, y: 0 },
          { x: 0, y: 1 }, { x: 2, y: 1 }, { x: 4, y: 1 },
          { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }
        ],
        optimalSteps: 8,
        hints: [
          "Hint 1: Dari titik START, bergeraklah ke kanan (menuju kolom 1) untuk menghindari firewall.",
          "Hint 2: Turun ke baris ke-2 (tengah) yang memiliki jalur lurus membentang horizontal.",
          "Hint 3: Setelah mencapai kolom paling kanan (kolom 4), turun lurus ke bawah menuju pintu EXIT."
        ],
        explanation: "Luar biasa! Paket data berhasil diarahkan melewati rute optimal tanpa terbentur rintangan firewall keamanan.",
        xpReward: 120,
        coinReward: 30,
      }
    ],
    // Legacy support
    question: {
      id: "q4",
      title: "Pengiriman Berkas Besar",
      type: "multiple_choice",
      prompt: "Rina ingin mengirim tugas kepada gurunya. File tugas berukuran besar dan tidak dapat dikirim melalui aplikasi pesan singkat.\n\nApa solusi yang paling tepat?",
      detail: "Pilih opsi yang aman, etis, dan memecahkan kendala ukuran berkas.",
      options: [
        { id: "A", label: "A", text: "Menghapus file agar tidak perlu dikirim" },
        { id: "B", label: "B", text: "Mengirim password akun kepada guru" },
        { id: "C", label: "C", text: "Menggunakan penyimpanan cloud dan membagikan link" },
        { id: "D", label: "D", text: "Mengirim file ke orang yang tidak dikenal" },
      ],
      correctAnswer: "C",
      explanation: "Benar. Penyimpanan cloud (seperti Google Drive / OneDrive) dapat digunakan untuk berbagi file besar dengan aman dan praktis melalui tautan akses.",
      hint: "Teknologi apa yang dirancang untuk menyimpan dan membagikan data berukuran besar melalui internet?"
    }
  },
  {
    id: 5,
    title: "LEVEL 5 — GERBANG UTAMA (FINAL ESCAPE)",
    subtitle: "Ujian Integrasi Logika Multi-Tantangan",
    iconName: "DoorOpen",
    type: "final_gate",
    difficulty: "Sulit",
    xpReward: 250,
    scoreReward: 250,
    bonusReward: 200,
    coinReward: 50,
    description: "Selesaikan 4 tantangan logika bertahap (Pola, Memory Match Informatika, Path Finder, dan Keputusan Akhir) untuk membuka gerbang utama sekolah!",
    mission: {
      brief: "Gerbang utama sekolah terkunci dengan protokol 4 lapis enkripsi logika.",
      objective: "Buka keempat mekanisme kunci secara berurutan untuk menyelesaikan misi petualangan LOGIC ESCAPE!",
      lore: "Hanya siswa yang mampu memadukan pola pikir komputasional: dekomposisi, pengenalan pola, abstraksi, dan algoritma yang dapat menaklukkan gerbang ini.",
      interactiveObjects: [
        {
          id: "obj-5-door",
          name: "Gerbang Utama Sekolah",
          icon: "lock",
          title: "🔐 Gerbang Baja Otomatis",
          description: "Dilengkapi 4 lampu indikator status kunci yang harus berwarna hijau semua."
        },
        {
          id: "obj-5-computer",
          name: "Mainframe Logika",
          icon: "computer",
          title: "💻 Konsol Utama Sekolah",
          description: "Menampilkan 4 tahap verifikasi protokol keamanan terpusat."
        },
        {
          id: "obj-5-note",
          name: "Pesan Kepala Sekolah",
          icon: "note",
          title: "📄 Pesan Pintu Keluar",
          description: "Sebuah surat apresiasi bagi siswa yang berhasil sampai di gerbang utama.",
          foundClue: "💡 Clue: 'Ingat kembali semua konsep dasar: rasio geometri, pasangan konsep informatika, rute navigasi yang aman, serta etika backup data.'"
        }
      ]
    },
    challenges: [
      {
        id: "c5-phase1",
        type: "pattern",
        title: "Kunci 1: Pola Deret Geometri",
        instruction: "Amati rasio pengali pada deret angka berikut:\n3 → 6 → 12 → 24 → ?",
        detail: "Tentukan angka selanjutnya untuk membuka gembok pertama:",
        patternSequence: ["3", "6", "12", "24", "?"],
        patternTargetIndex: 4,
        options: [
          { id: "A", label: "A", text: "30" },
          { id: "B", label: "B", text: "36" },
          { id: "C", label: "C", text: "48" },
          { id: "D", label: "D", text: "52" },
        ],
        correctAnswer: "C",
        hints: [
          "Hint 1: Bandingkan rasio perkalian: 3 ke 6 adalah dikali 2 (×2).",
          "Hint 2: Periksa: 6 × 2 = 12, dan 12 × 2 = 24.",
          "Hint 3: Kalikan 24 dengan 2 untuk mendapatkan jawaban akhir (48)."
        ],
        explanation: "Deret geometri dengan pengali 2 konstan: 3×2=6, 6×2=12, 12×2=24, dan 24×2 = 48.",
        xpReward: 60,
        coinReward: 10,
      },
      {
        id: "c5-phase2",
        type: "memory",
        title: "Kunci 2: Memory Match Konsep Informatika",
        instruction: "Buka dan pasangkan kartu-kartu konsep informatika di bawah ini yang memiliki arti atau pasangan yang tepat:",
        memoryPairs: [
          { id: "p1", term: "ALGORITMA", definition: "LANGKAH TERURUT" },
          { id: "p2", term: "PASSWORD", definition: "KEAMANAN AKUN" },
          { id: "p3", term: "FIREWALL", definition: "FILTER JARINGAN" },
        ],
        hints: [
          "Hint 1: Algoritma adalah urutan instruksi penyelesaian masalah.",
          "Hint 2: Password berfungsi melindungi kerahasiaan akun pengguna.",
          "Hint 3: Firewall adalah sistem keamanan penyaring lalu lintas jaringan."
        ],
        explanation: "Hebat! Kamu berhasil mencocokkan ketiga pilar konsep informatika dengan sempurna.",
        xpReward: 60,
        coinReward: 15,
      },
      {
        id: "c5-phase3",
        type: "pathfinder",
        title: "Kunci 3: Navigasi Bypass Gerbang Akhir",
        instruction: "Bawa kuncimu (🚀) menuju panel bypass gerbang (🚪) melewati sensor keamanan:",
        gridSize: { rows: 5, cols: 5 },
        startPos: { x: 0, y: 2 },
        exitPos: { x: 4, y: 2 },
        walls: [
          { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 },
          { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 },
        ],
        optimalSteps: 6,
        hints: [
          "Hint 1: Dinding sensor berada di kolom 1 dan 3 pada bagian tengah.",
          "Hint 2: Lewatilah baris paling atas (y=0) atau baris paling bawah (y=4) yang bebas hambatan.",
          "Hint 3: Naik ke atas (y=0), geser ke kanan melewati rintangan, lalu turun kembali ke pintu (y=2)."
        ],
        explanation: "Sistem bypass gerbang berhasil diaktifkan dengan rute manuver yang akurat!",
        xpReward: 60,
        coinReward: 10,
      },
      {
        id: "c5-phase4",
        type: "decision",
        title: "Kunci 4: Keputusan Akhir Integritas Data",
        instruction: "Sebelum gerbang terbuka, sistem menanyakan verifikasi terakhir: File tugas penting sekolah tersimpan hanya di satu komputer laboratorium tanpa salinan. Apa langkah pencegahan terbaik terhadap risiko kehilangan data?",
        options: [
          { 
            id: "A", 
            label: "A", 
            text: "Melakukan pencadangan (backup) rutin ke cloud storage atau media penyimpanan terpisah", 
            icon: "ShieldCheck",
            detail: "Standar terbaik keamanan data untuk pemulihan instan saat hardware rusak."
          },
          { 
            id: "B", 
            label: "B", 
            text: "Menghapus semua file lama agar kapasitas disk selalu kosong", 
            icon: "Trash2",
            detail: "Justru menghilangkan data berharga secara permanen."
          },
          { 
            id: "C", 
            label: "C", 
            text: "Mengabaikannya karena komputer sekolah tidak mungkin rusak", 
            icon: "HelpCircle",
            detail: "Asumsi berisiko tinggi tanpa mitigasi bencana data."
          },
          { 
            id: "D", 
            label: "D", 
            text: "Mengganti nama file setiap hari tanpa membuat salinan cadangan", 
            icon: "FileText",
            detail: "Tidak melindungi data jika harddisk mengalami kerusakan fisik."
          },
        ],
        correctAnswer: "A",
        hints: [
          "Hint 1: Pikirkan apa yang terjadi jika harddisk komputer tersebut tiba-tiba rusak.",
          "Hint 2: Solusi terbaik adalah memiliki salinan cadangan (backup) di tempat lain.",
          "Hint 3: Pilihan A adalah prinsip utama keamanan dan integritas data digital."
        ],
        explanation: "Tepat sekali! Backup rutin adalah pilar utama manajemen data agar informasi tidak hilang saat terjadi gangguan sistem atau perangkat keras.",
        xpReward: 70,
        coinReward: 15,
      }
    ],
    // Legacy support
    question: {
      id: "q5-gate",
      title: "Final Gate Keypad",
      type: "multiple_choice",
      prompt: "Final Gate Challenge",
      explanation: "Ketiga gerbang pengunci berhasil dipecahkan!",
    },
    miniChallenges: [
      {
        id: "m1",
        title: "Tantangan 1: Pola Geometri",
        type: "multiple_choice",
        prompt: "Perhatikan pola bilangan pengali berikut:\n3 → 6 → 12 → 24 → ?",
        detail: "Temukan bilangan berikutnya untuk membuka gembok pertama.",
        options: [
          { id: "A", label: "A", text: "30" },
          { id: "B", label: "B", text: "36" },
          { id: "C", label: "C", text: "48" },
          { id: "D", label: "D", text: "52" },
        ],
        correctAnswer: "C",
        explanation: "Setiap bilangan dikalikan 2 (rasio geometri ×2): 3×2=6, 6×2=12, 12×2=24, maka 24×2 = 48.",
        hint: "Bandingkan rasio atau perkalian antara 3 ke 6 dan 6 ke 12."
      },
      {
        id: "m2",
        title: "Tantangan 2: Logika Kondisional",
        type: "multiple_choice",
        prompt: "Aturan Sistem Gerbang:\n• Jika hari ini hujan, maka lapangan sekolah basah.\n• Hari ini lapangan sekolah TIDAK basah.\n\nKesimpulan logis apa yang pasti benar?",
        detail: "Gunakan aturan penarikan kesimpulan Modus Tollens.",
        options: [
          { id: "A", label: "A", text: "Hari ini tidak hujan" },
          { id: "B", label: "B", text: "Hari ini pasti mendung" },
          { id: "C", label: "C", text: "Semua siswa sedang belajar di kelas" },
          { id: "D", label: "D", text: "Lapangan dipayungi tenda" },
        ],
        correctAnswer: "A",
        explanation: "Berdasarkan Modus Tollens: Jika P → Q bernilai benar, dan ~Q (tidak Q) terjadi, maka kesimpulannya adalah ~P (Hari ini tidak hujan).",
        hint: "Jika hujan pasti membuat lapangan basah, dan faktanya tidak basah, apa artinya status hujan hari ini?"
      },
      {
        id: "m3",
        title: "Tantangan 3: Urutan Prosedur Darurat",
        type: "ordering",
        prompt: "Susun langkah logis dan aman untuk mematikan komputer dengan benar (Safe Shutdown):",
        orderItems: [
          { id: "s-1", text: "Simpan semua file pekerjaan yang sedang dibuka" },
          { id: "s-2", text: "Tutup seluruh jendela aplikasi yang aktif" },
          { id: "s-3", text: "Klik tombol Start lalu pilih menu Shut Down" },
          { id: "s-4", text: "Tunggu lampu indikator CPU/layar mati sepenuhnya" },
        ],
        correctOrder: ["s-1", "s-2", "s-3", "s-4"],
        explanation: "Urutan aman: Simpan data agar tidak hilang → Tutup aplikasi → Jalankan perintah Shut Down sistem → Pastikan daya mati sempurna sebelum mematikan stopkontak.",
        hint: "Sebelum mematikan sistem operasi, pastikan data yang kamu ketik tidak hilang."
      }
    ]
  }
];
