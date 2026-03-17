'use client';

import React from 'react';
import Link from 'next/link';
import {
  Camera,
  MessageSquareMore,
  BookOpen,
  GraduationCap,
  History,
  ArrowRight,
  HandMetal,
  Users,
  TrendingUp,
} from 'lucide-react';

const features = [
  {
    icon: Camera,
    title: 'Kamera Real-Time',
    desc: 'Terjemahkan isyarat BISINDO secara langsung menggunakan kamera perangkat Anda.',
    href: '/camera',
    color: '#237227',
    bg: '#f0f7f0',
  },
  {
    icon: MessageSquareMore,
    title: 'Mode Dua Arah',
    desc: 'Komunikasi inklusif antara pengguna tunarungu dan pendengar dalam satu layar.',
    href: '/twoway',
    color: '#1d6e9f',
    bg: '#eff6fc',
  },
  {
    icon: BookOpen,
    title: 'Kamus BISINDO',
    desc: 'Jelajahi ratusan kosakata isyarat dengan gambar dan panduan penggunaan.',
    href: '/dictionary',
    color: '#9b5a1a',
    bg: '#fdf5ec',
  },
  {
    icon: GraduationCap,
    title: 'Modul Belajar',
    desc: 'Pelajari BISINDO langkah demi langkah dengan kurikulum terstruktur.',
    href: '/learn',
    color: '#7c3abb',
    bg: '#f5f0fc',
  },
];

const stats = [
  { icon: Users, label: 'Pengguna Aktif', value: '2.400+' },
  { icon: HandMetal, label: 'Kosakata Tersedia', value: '500+' },
  { icon: TrendingUp, label: 'Sesi Diterjemahkan', value: '12.000+' },
];

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto animate-fadeIn">
      {/* Hero section */}
      <div
        className="rounded-2xl p-8 md:p-12 mb-8 relative overflow-hidden"
        style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10"
          style={{ backgroundColor: 'white' }}
        />
        <div
          className="absolute -bottom-8 -right-4 w-32 h-32 rounded-full opacity-10"
          style={{ backgroundColor: 'white' }}
        />

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <HandMetal size={24} color="white" />
          </div>
          <span className="text-sm font-medium opacity-80 uppercase tracking-wider">
            SIBI-VISION
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
          Jembatan Komunikasi<br />Tanpa Batas 🤝
        </h1>
        <p className="text-base md:text-lg opacity-85 max-w-xl leading-relaxed mb-6">
          Platform penerjemah Bahasa Isyarat Indonesia (BISINDO) real-time yang inklusif,
          ramah pengguna, dan dirancang untuk semua kalangan.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/camera"
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-150 hover:scale-105"
            style={{ backgroundColor: 'white', color: 'var(--color-primary)' }}
          >
            <Camera size={18} />
            Mulai Menerjemahkan
          </Link>
          <Link
            href="/learn"
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-all duration-150 hover:bg-white/10"
            style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}
          >
            <GraduationCap size={18} />
            Mulai Belajar
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center p-4 rounded-2xl text-center"
            style={{ backgroundColor: 'var(--color-card)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            <Icon size={20} className="mb-2" style={{ color: 'var(--color-primary)' }} />
            <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
        Fitur Utama
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map(({ icon: Icon, title, desc, href, color, bg }) => (
          <Link
            key={href}
            href={href}
            className="flex items-start gap-4 p-5 rounded-2xl transition-all duration-200 hover:scale-[1.01] hover:shadow-md group"
            style={{ backgroundColor: 'var(--color-card)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            <div
              className="flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0"
              style={{ backgroundColor: bg }}
            >
              <Icon size={22} style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text)' }}>
                {title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                {desc}
              </p>
            </div>
            <ArrowRight
              size={18}
              className="flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ color: 'var(--color-primary)' }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
