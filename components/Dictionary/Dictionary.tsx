'use client';

import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  HandHeart,
  Frown,
  HandHelping,
  Hand,
  Sunrise,
  Moon,
  CheckCircle2,
  XCircle,
  Utensils,
  CupSoda,
  House,
  School,
  SearchX,
  type LucideIcon,
} from 'lucide-react';

interface VocabItem {
  id: number;
  word: string;
  meaning: string;
  icon: LucideIcon;
  category: string;
}

// Dummy vocabulary data – replace with API fetch in production
const VOCAB_DATA: VocabItem[] = [
  { id: 1, word: 'Terima Kasih', meaning: 'Ungkapan rasa syukur kepada orang lain', icon: HandHeart, category: 'Sopan Santun' },
  { id: 2, word: 'Maaf', meaning: 'Meminta pengampunan atas kesalahan yang diperbuat', icon: Frown, category: 'Sopan Santun' },
  { id: 3, word: 'Tolong', meaning: 'Meminta pertolongan atau bantuan dari orang lain', icon: HandHelping, category: 'Sopan Santun' },
  { id: 4, word: 'Halo', meaning: 'Sapaan atau salam kepada seseorang', icon: Hand, category: 'Salam' },
  { id: 5, word: 'Selamat Pagi', meaning: 'Salam untuk waktu pagi hari', icon: Sunrise, category: 'Salam' },
  { id: 6, word: 'Selamat Malam', meaning: 'Salam untuk waktu malam hari', icon: Moon, category: 'Salam' },
  { id: 7, word: 'Ya', meaning: 'Menyatakan persetujuan atau konfirmasi', icon: CheckCircle2, category: 'Umum' },
  { id: 8, word: 'Tidak', meaning: 'Menyatakan penolakan atau negasi', icon: XCircle, category: 'Umum' },
  { id: 9, word: 'Makan', meaning: 'Kegiatan mengonsumsi makanan', icon: Utensils, category: 'Aktivitas' },
  { id: 10, word: 'Minum', meaning: 'Kegiatan mengonsumsi minuman', icon: CupSoda, category: 'Aktivitas' },
  { id: 11, word: 'Rumah', meaning: 'Tempat tinggal atau kediaman seseorang', icon: House, category: 'Tempat' },
  { id: 12, word: 'Sekolah', meaning: 'Lembaga pendidikan formal bagi pelajar', icon: School, category: 'Tempat' },
];

const CATEGORIES = ['Semua', 'Salam', 'Sopan Santun', 'Umum', 'Aktivitas', 'Tempat'];

export default function Dictionary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  const filtered = VOCAB_DATA.filter((item) => {
    const matchSearch = item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = activeCategory === 'Semua' || item.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={22} style={{ color: 'var(--color-primary)' }} />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            Kamus BISINDO
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          Jelajahi kosakata Bahasa Isyarat Indonesia dengan panduan visual.
        </p>
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-4"
        style={{ backgroundColor: 'var(--color-card)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1.5px solid var(--color-border)' }}
      >
        <Search size={18} style={{ color: 'var(--color-muted)' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari kosakata isyarat..."
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: 'var(--color-text)' }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs px-2 py-1 rounded-lg"
            style={{ backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
          >
            Hapus
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 hover:scale-105"
            style={{
              backgroundColor: activeCategory === cat ? 'var(--color-primary)' : 'var(--color-card)',
              color: activeCategory === cat ? 'white' : 'var(--color-muted)',
              border: `1.5px solid ${activeCategory === cat ? 'var(--color-primary)' : 'var(--color-border)'}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Result count */}
      <p className="text-xs mb-4" style={{ color: 'var(--color-muted)' }}>
        Menampilkan <strong>{filtered.length}</strong> dari {VOCAB_DATA.length} kosakata
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl py-16"
          style={{ backgroundColor: 'var(--color-card)' }}
        >
          <SearchX size={36} className="mb-3" style={{ color: 'var(--color-muted)' }} />
          <p className="font-semibold" style={{ color: 'var(--color-text)' }}>Tidak ditemukan</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
            Coba kata kunci lain
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.03] hover:shadow-lg cursor-pointer"
              style={{ backgroundColor: 'var(--color-card)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              {/* Image placeholder for future sign language GIF/image */}
              <div
                className="flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-primary-50)', height: '110px' }}
              >
                <item.icon size={44} style={{ color: 'var(--color-primary)' }} />
              </div>

              <div className="p-3">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
                >
                  {item.category}
                </span>
                <h3 className="font-bold text-sm mt-2 mb-1" style={{ color: 'var(--color-text)' }}>
                  {item.word}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                  {item.meaning}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
