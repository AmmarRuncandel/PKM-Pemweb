# BISINDO - VISION

Platform prototipe penerjemah Bahasa Isyarat Indonesia (BISINDO) berbasis web.

Aplikasi ini dibangun dengan Next.js (App Router), React, Tailwind CSS v4, MediaPipe Hands, dan rule-based gesture classifier untuk deteksi isyarat secara real-time.

## Ringkasan Fitur

- Kamera Real-Time: deteksi gesture BISINDO dari kamera perangkat dan menampilkan hasil terjemahan teks secara langsung.
- Mode Dua Arah: komunikasi dalam satu layar antara sisi tunarungu (kamera) dan sisi pendengar (teks + speech-to-text browser).
- Kamus BISINDO: daftar kosakata, pencarian, filter kategori, serta detail panduan gesture per kata.
- Modul Belajar: daftar level belajar dengan progres, detail langkah, dan modal materi.
- Riwayat: tampilan log sesi (saat ini masih data dummy di client state).
- Layout responsif: sidebar desktop + bottom navigation untuk mobile.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- lucide-react (ikon)
- MediaPipe Hands (`@mediapipe/hands`, `@mediapipe/camera_utils`, `@mediapipe/drawing_utils`)

## Struktur Route (Folder app)

- `/` -> landing + ringkasan fitur
- `/camera` -> kamera real-time (`CameraView`)
- `/twoway` -> mode komunikasi dua arah (`TwoWayMode`)
- `/dictionary` -> kamus BISINDO (`Dictionary`)
- `/learn` -> modul belajar (`LearnModule`)
- `/history` -> riwayat penggunaan (`History`)

Semua route page di folder `app` bertindak sebagai wrapper ke komponen utama di folder `components`.

## Struktur Komponen Utama (Folder components)

- `Layout/AppLayout.tsx`: shell aplikasi (sidebar desktop, main content, mobile nav).
- `Layout/Sidebar.tsx`: navigasi utama desktop.
- `Layout/MobileNav.tsx`: navigasi bawah untuk mobile.
- `CameraView/CameraView.tsx`: UI kamera, kontrol start/pause/stop, output teks, TTS.
- `TwoWayMode/TwoWayMode.tsx`: panel split tunarungu vs pendengar + chat sesi.
- `Dictionary/Dictionary.tsx`: pencarian/filter kata + modal detail gesture.
- `Learn/LearnModule.tsx`: daftar level belajar dan progress tracking.
- `Learn/ModuleModal.tsx`: modal detail langkah belajar modul.
- `History/History.tsx`: ringkasan sesi dan daftar riwayat (dummy).

## Gestur yang Saat Ini Didukung

Classifier mendukung 12 label gesture (rule-based):

- Halo
- Ya
- Tidak
- Tolong
- Maaf
- Terima Kasih
- Makan
- Minum
- Rumah
- Selamat Pagi
- Selamat Malam
- Sekolah

Definisi gesture ada di `lib/bisindoGestures.ts` dan logika klasifikasi ada di `lib/gestureClassifier.ts`.

## Cara Menjalankan Proyek

1. Install dependency:

```bash
npm install
```

2. Jalankan mode development:

```bash
npm run dev
```

3. Buka browser:

```text
http://localhost:3000
```

## Script NPM

- `npm run dev`: menjalankan development server Next.js
- `npm run build`: build production
- `npm run start`: menjalankan hasil build production
- `npm run lint`: menjalankan ESLint

## Catatan Implementasi Saat Ini

- Data riwayat pada halaman `/history` masih menggunakan data dummy (`DUMMY_HISTORY`) dan belum tersimpan ke database.
- Progres modul belajar masih disimpan di state lokal browser (belum persistence).
- Speech Recognition pada mode dua arah bergantung pada dukungan browser (Chrome/Edge direkomendasikan).
- Akses kamera wajib diizinkan oleh browser agar fitur deteksi gesture berfungsi.

## Lisensi

Belum ditentukan.
