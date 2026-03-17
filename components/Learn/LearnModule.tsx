'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  ChevronRight,
  Trophy,
  Sigma,
  Hash,
  Hand,
  MessageCircle,
  CircleCheckBig,
  type LucideIcon,
} from 'lucide-react';
import ModuleModal from './ModuleModal';

interface Module {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  progress: number;
  totalLessons: number;
  steps: string[];
}

const INITIAL_MODULES: Module[] = [
  {
    id: 1,
    title: 'Level 1: Abjad',
    description: 'Pelajari 26 huruf alfabet dalam BISINDO',
    icon: Sigma,
    progress: 40,
    totalLessons: 26,
    steps: [
      'Mulai dengan posisi tangan netral di depan dada.',
      'Pelajari isyarat huruf A–F dengan mengikuti panduan gambar.',
      'Ulangi setiap isyarat perlahan hingga terasa natural.',
      'Coba susun nama Anda menggunakan isyarat yang telah dipelajari.',
      'Lakukan latihan di depan kamera untuk evaluasi otomatis.',
    ],
  },
  {
    id: 2,
    title: 'Level 2: Angka',
    description: 'Kuasai isyarat angka 0 sampai 100',
    icon: Hash,
    progress: 20,
    totalLessons: 15,
    steps: [
      'Pahami posisi dasar jari untuk angka 0–5.',
      'Pelajari pola kombinasi jari untuk angka 6–9.',
      'Latih isyarat angka puluhan (10, 20, 30...).',
      'Praktikkan menyebut nomor telepon menggunakan isyarat.',
      'Selesaikan kuis mini untuk mengonfirmasi pemahaman.',
    ],
  },
  {
    id: 3,
    title: 'Level 3: Salam',
    description: 'Ungkapan salam dan sapaan sehari-hari',
    icon: Hand,
    progress: 75,
    totalLessons: 10,
    steps: [
      'Mulai dengan isyarat "Halo" dan "Selamat Pagi".',
      'Pelajari cara menyapa berdasarkan waktu (pagi, siang, malam).',
      'Latih isyarat "Apa kabar?" dan respons umum.',
      'Coba percakapan simulasi dengan pasangan belajar.',
      'Evaluasi diri dengan merekam isyarat dan menontonnya kembali.',
    ],
  },
  {
    id: 4,
    title: 'Level 4: Kosakata Dasar',
    description: 'Kata-kata penting untuk komunikasi sehari-hari',
    icon: MessageCircle,
    progress: 0,
    totalLessons: 20,
    steps: [
      'Pelajari isyarat kata benda umum (rumah, air, makanan).',
      'Kuasai kata kerja dasar (makan, minum, pergi, duduk).',
      'Pelajari kata sifat sederhana (besar, kecil, cantik, bagus).',
      'Susun kalimat sederhana menggunakan kosakata yang dipelajari.',
      'Praktikkan dalam dialog mini dengan teman.',
    ],
  },
];

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 rounded-full w-full overflow-hidden" style={{ backgroundColor: 'var(--color-primary-100)' }}>
      <div
        className="h-full rounded-full progress-bar"
        style={{ width: `${value}%`, backgroundColor: 'var(--color-primary)' }}
      />
    </div>
  );
}

export default function LearnModule() {
  const [modules, setModules] = useState<Module[]>(INITIAL_MODULES);
  const [activeModule, setActiveModule] = useState<Module | null>(null);

  const handleComplete = (id: number) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, progress: Math.min(100, m.progress + 25) }
          : m
      )
    );
  };

  const completedCount = modules.filter((m) => m.progress >= 100).length;
  const overallProgress = Math.round(modules.reduce((sum, m) => sum + m.progress, 0) / modules.length);

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap size={22} style={{ color: 'var(--color-primary)' }} />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            Modul Belajar
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          Pelajari BISINDO langkah demi langkah sesuai level kemampuan Anda.
        </p>
      </div>

      {/* Overall progress card */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm opacity-80">Progres Keseluruhan</p>
            <p className="text-3xl font-bold">{overallProgress}%</p>
          </div>
          <div className="flex flex-col items-end">
            <Trophy size={28} className="opacity-80 mb-1" />
            <p className="text-xs opacity-80">{completedCount}/{modules.length} Level Selesai</p>
          </div>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}>
          <div
            className="h-full rounded-full progress-bar"
            style={{ width: `${overallProgress}%`, backgroundColor: 'white' }}
          />
        </div>
      </div>

      {/* Module list */}
      <div className="flex flex-col gap-4">
        {modules.map((module) => (
          <button
            key={module.id}
            onClick={() => setActiveModule(module)}
            className="w-full text-left rounded-2xl p-5 transition-all duration-200 hover:scale-[1.01] hover:shadow-md"
            style={{ backgroundColor: 'var(--color-card)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex items-center justify-center w-14 h-14 rounded-2xl flex-shrink-0"
                style={{ backgroundColor: 'var(--color-primary-50)' }}
              >
                <module.icon size={26} style={{ color: 'var(--color-primary)' }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                    {module.title}
                  </h3>
                  <span
                    className="text-xs font-semibold ml-2 flex-shrink-0"
                    style={{ color: module.progress >= 100 ? '#16a34a' : 'var(--color-primary)' }}
                  >
                    {module.progress >= 100 ? (
                      <span className="inline-flex items-center gap-1">
                        <CircleCheckBig size={14} />
                        Selesai
                      </span>
                    ) : (
                      `${module.progress}%`
                    )}
                  </span>
                </div>
                <p className="text-xs mb-2" style={{ color: 'var(--color-muted)' }}>
                  {module.description} · {module.totalLessons} Pelajaran
                </p>
                <ProgressBar value={module.progress} />
              </div>

              <ChevronRight
                size={18}
                className="flex-shrink-0 ml-2"
                style={{ color: 'var(--color-muted)' }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {activeModule && (
        <ModuleModal
          module={activeModule}
          onClose={() => setActiveModule(null)}
          onComplete={() => handleComplete(activeModule.id)}
        />
      )}
    </div>
  );
}
