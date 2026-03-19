/**
 * BISINDO Gesture Definitions
 * Setiap gestur memiliki pola jari UNIK — tidak ada dua gestur
 * yang berbagi pola [jempol, telunjuk, tengah, manis, kelingking] yang sama.
 *
 * Peta pola (T=terentang, F=digenggam):
 *  Halo          : T T T T T  – semua terbuka
 *  Ya            : (jempol ke atas) F F F F  – jempol tegak, lain terlipat
 *  Tidak         : F T F F F  – hanya telunjuk
 *  Tolong        : F T T F F  – telunjuk + tengah (V)
 *  Maaf          : F F F F F  – kepalan penuh
 *  Terima Kasih  : T T T T F  – 4 jari + jempol, kelingking digenggam
 *  Makan         : F T T T F  – 3 jari tengah (tanpa jempol & kelingking)
 *  Minum         : F F F F T  – hanya kelingking
 *  Rumah         : T F F F T  – jempol + kelingking (shaka)
 *  Selamat Pagi  : T T F F F  – jempol + telunjuk saja (bentuk L)
 *  Selamat Malam : F F T T F  – jari tengah + manis saja
 *  Sekolah       : F F F T T  – jari manis + kelingking saja
 */

export interface GestureRule {
  label: string;
  /** Status jari yang diharapkan: [jempol, telunjuk, tengah, manis, kelingking] */
  fingers: (boolean | 'any')[];
  /** Apakah ibu jari harus mengarah TEGAK ke atas (khusus untuk "Ya") */
  thumbStrictlyUp?: boolean;
  /** Panduan tangan untuk pengguna di Dictionary */
  description: string;
  /** Langkah-langkah cara mempraktikkan */
  howTo: string[];
}

export const BISINDO_GESTURES: GestureRule[] = [
  {
    label: 'Halo',
    fingers: [true, true, true, true, true],
    description: 'Buka kelima jari lebar-lebar, telapak tangan menghadap ke depan seperti melambai.',
    howTo: [
      'Buka semua jari selebar mungkin (jempol + telunjuk + tengah + manis + kelingking)',
      'Telapak tangan menghadap kamera',
      'Tahan posisi selama ±1 detik',
    ],
  },
  {
    label: 'Ya',
    fingers: [true, false, false, false, false],
    thumbStrictlyUp: true,
    description: 'Kepalkan 4 jari, lalu acungkan ibu jari TEGAK lurus ke atas (👍). Berbeda dari Selamat Pagi karena ibu jari harus mengarah vertikal ke atas.',
    howTo: [
      'Kepalkan: telunjuk, jari tengah, manis, dan kelingking',
      'Acungkan HANYA ibu jari tegak lurus ke atas (arah jam 12)',
      'Pastikan ibu jari benar-benar vertikal, bukan miring ke samping',
    ],
  },
  {
    label: 'Tidak',
    fingers: [false, true, false, false, false],
    description: 'Acungkan hanya jari telunjuk ke atas, semua jari lain digenggam (termasuk ibu jari).',
    howTo: [
      'Genggam ibu jari, jari tengah, manis, dan kelingking',
      'Angkat HANYA jari telunjuk tegak lurus ke atas ☝️',
      'Posisi seperti angka "1"',
    ],
  },
  {
    label: 'Tolong',
    fingers: [false, true, true, false, false],
    description: 'Angkat telunjuk dan jari tengah berdampingan (simbol V/peace ✌️), tiga jari lain digenggam.',
    howTo: [
      'Genggam ibu jari, jari manis, dan kelingking',
      'Angkat telunjuk dan jari tengah berdampingan (rapat atau meregang)',
      'Telapak menghadap ke depan — seperti simbol tanda damai',
    ],
  },
  {
    label: 'Maaf',
    fingers: [false, false, false, false, false],
    description: 'Kepalkan SELURUH tangan rapat-rapat — semua jari termasuk ibu jari dilipat ke dalam.',
    howTo: [
      'Lipat semua jari ke dalam termasuk ibu jari (kepalan penuh)',
      'Tidak ada satu pun jari yang terangkat',
      'Letakkan kepalan di depan dada atau dekat wajah',
    ],
  },
  {
    label: 'Terima Kasih',
    fingers: [true, true, true, true, false],
    description: 'Buka ibu jari + telunjuk + tengah + manis (4 jari), HANYA kelingking yang digenggam.',
    howTo: [
      'Tekuk HANYA kelingking ke dalam (jari paling kecil)',
      'Buka dan rentangkan ibu jari, telunjuk, jari tengah, dan jari manis',
      'Telapak tangan menghadap ke depan atau ke atas',
    ],
  },
  {
    label: 'Makan',
    fingers: [false, true, true, true, false],
    description: 'Angkat tiga jari tengah (telunjuk + tengah + manis) sedangkan ibu jari dan kelingking KEDUANYA digenggam.',
    howTo: [
      'Genggam ibu jari DAN kelingking ke dalam',
      'Angkat telunjuk, jari tengah, dan jari manis',
      'Arahkan ujung tiga jari tersebut ke mulut',
    ],
  },
  {
    label: 'Minum',
    fingers: [false, false, false, false, true],
    description: 'Angkat HANYA kelingking (jari paling kecil), semua jari lainnya termasuk ibu jari digenggam.',
    howTo: [
      'Genggam ibu jari, telunjuk, jari tengah, dan manis',
      'Angkat HANYA kelingking tegak lurus ke atas 🤙 (tanpa ibu jari)',
      'Arahkan ke mulut seperti gerakan minum',
    ],
  },
  {
    label: 'Rumah',
    fingers: [true, false, false, false, true],
    description: 'Buka ibu jari dan kelingking sekaligus — simbol "shaka" 🤙 atau telepon. Tiga jari tengah digenggam.',
    howTo: [
      'Tekuk telunjuk, jari tengah, dan jari manis ke dalam',
      'Buka ibu jari ke samping dan kelingking ke atas sekaligus',
      'Seperti gerakan "hang loose" atau simbol telepon',
    ],
  },
  {
    label: 'Selamat Pagi',
    fingers: [true, true, false, false, false],
    description: 'Buka HANYA ibu jari dan telunjuk (bentuk huruf L atau pistol 🔫). Tiga jari lainnya digenggam. Berbeda dari "Ya" karena ibu jari miring ke samping, bukan tegak ke atas.',
    howTo: [
      'Genggam jari tengah, manis, dan kelingking ke dalam',
      'Buka ibu jari ke samping (horizontal)',
      'Buka telunjuk ke atas — tangan membentuk huruf L',
      'Ibu jari TIDAK mengarah ke atas, melainkan ke samping',
    ],
  },
  {
    label: 'Selamat Malam',
    fingers: [false, false, true, true, false],
    description: 'Angkat HANYA jari tengah dan jari manis berdampingan. Ibu jari, telunjuk, dan kelingking digenggam.',
    howTo: [
      'Genggam ibu jari, telunjuk, dan kelingking ke dalam',
      'Angkat jari tengah dan jari manis berdampingan',
      'Posisi seperti dua jari di tengah — berbeda dari Tolong yang menggunakan telunjuk+tengah',
    ],
  },
  {
    label: 'Sekolah',
    fingers: [false, false, false, true, true],
    description: 'Angkat HANYA jari manis dan kelingking berdampingan. Ibu jari, telunjuk, dan jari tengah digenggam.',
    howTo: [
      'Genggam ibu jari, telunjuk, dan jari tengah ke dalam',
      'Angkat jari manis dan kelingking berdampingan',
      'Posisi di bagian luar/kanan tangan — berbeda dari Selamat Malam yang menggunakan jari tengah+manis',
    ],
  },
];
