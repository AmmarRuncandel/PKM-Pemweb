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
  X,
  CheckCircle,
  type LucideIcon,
} from 'lucide-react';
import { BISINDO_GESTURES } from '@/lib/bisindoGestures';

interface VocabItem {
  id: number;
  word: string;
  meaning: string;
  icon: LucideIcon;
  category: string;
}

const VOCAB_DATA: VocabItem[] = [
  { id: 1,  word: 'Terima Kasih', meaning: 'Ungkapan rasa syukur kepada orang lain',       icon: HandHeart,    category: 'Sopan Santun' },
  { id: 2,  word: 'Maaf',         meaning: 'Meminta pengampunan atas kesalahan',             icon: Frown,        category: 'Sopan Santun' },
  { id: 3,  word: 'Tolong',       meaning: 'Meminta pertolongan atau bantuan',               icon: HandHelping,  category: 'Sopan Santun' },
  { id: 4,  word: 'Halo',         meaning: 'Sapaan atau salam kepada seseorang',             icon: Hand,         category: 'Salam' },
  { id: 5,  word: 'Selamat Pagi', meaning: 'Salam untuk waktu pagi hari',                   icon: Sunrise,      category: 'Salam' },
  { id: 6,  word: 'Selamat Malam',meaning: 'Salam untuk waktu malam hari',                  icon: Moon,         category: 'Salam' },
  { id: 7,  word: 'Ya',           meaning: 'Menyatakan persetujuan atau konfirmasi',         icon: CheckCircle2, category: 'Umum' },
  { id: 8,  word: 'Tidak',        meaning: 'Menyatakan penolakan atau negasi',               icon: XCircle,      category: 'Umum' },
  { id: 9,  word: 'Makan',        meaning: 'Kegiatan mengonsumsi makanan',                   icon: Utensils,     category: 'Aktivitas' },
  { id: 10, word: 'Minum',        meaning: 'Kegiatan mengonsumsi minuman',                   icon: CupSoda,      category: 'Aktivitas' },
  { id: 11, word: 'Rumah',        meaning: 'Tempat tinggal atau kediaman seseorang',         icon: House,        category: 'Tempat' },
  { id: 12, word: 'Sekolah',      meaning: 'Lembaga pendidikan formal bagi pelajar',        icon: School,       category: 'Tempat' },
];

const CATEGORIES = ['Semua', 'Salam', 'Sopan Santun', 'Umum', 'Aktivitas', 'Tempat'];

// Map word → gesture rule dari bisindoGestures
const gestureMap = Object.fromEntries(
  BISINDO_GESTURES.map((g) => [g.label, g])
);

// Finger display helper
function FingerDisplay({ label, extended }: { label: string; extended: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
        style={{
          backgroundColor: extended ? 'var(--color-primary)' : '#e5e7eb',
          color: extended ? 'white' : '#9ca3af',
        }}
      >
        {extended ? '↑' : '✕'}
      </div>
      <span className="text-xs" style={{ color: 'var(--color-muted)', fontSize: '0.65rem' }}>
        {label}
      </span>
    </div>
  );
}

export default function Dictionary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [selectedItem, setSelectedItem] = useState<VocabItem | null>(null);

  const filtered = VOCAB_DATA.filter((item) => {
    const matchSearch =
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = activeCategory === 'Semua' || item.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const selectedGesture = selectedItem ? gestureMap[selectedItem.word] : null;

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
          Klik kata untuk melihat panduan cara membentuk isyarat tangan.
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
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>Coba kata kunci lain</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => {
            const hasGesture = !!gestureMap[item.word];
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.03] hover:shadow-lg cursor-pointer relative"
                style={{ backgroundColor: 'var(--color-card)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              >
                {/* Detectable badge */}
                {hasGesture && (
                  <div className="absolute top-2 right-2 z-10">
                    <div
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: 'var(--color-primary)', fontSize: '0.6rem', fontWeight: 700 }}
                    >
                      <CheckCircle size={9} />
                      Dapat Dideteksi
                    </div>
                  </div>
                )}

                {/* Icon area */}
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
                  <p className="text-xs mt-2 font-medium" style={{ color: 'var(--color-primary)' }}>
                    Klik untuk panduan →
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Gesture Detail Modal ── */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl overflow-hidden animate-fadeIn"
            style={{ backgroundColor: 'var(--color-card)', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <selectedItem.icon size={22} color="white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg leading-none">{selectedItem.word}</h2>
                  <p className="text-xs opacity-80 mt-0.5">{selectedItem.category}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5">
              {/* Meaning */}
              <p className="text-sm mb-4" style={{ color: 'var(--color-muted)' }}>
                {selectedItem.meaning}
              </p>

              {selectedGesture ? (
                <>
                  {/* Detectable badge */}
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-xl mb-4"
                    style={{ backgroundColor: 'var(--color-primary-50)' }}
                  >
                    <CheckCircle size={16} style={{ color: 'var(--color-primary)' }} />
                    <span className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                      Gesture ini dapat dideteksi oleh kamera BISINDO
                    </span>
                  </div>

                  {/* Finger state visualization */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                      Posisi Jari:
                    </p>
                    <div className="flex justify-around px-2">
                      {['Jempol', 'Telunjuk', 'Tengah', 'Manis', 'Kelingking'].map((name, i) => {
                        const val = selectedGesture.fingers[i];
                        const extended = val === true || val === 'any';
                        return <FingerDisplay key={name} label={name} extended={extended} />;
                      })}
                    </div>
                    <div className="flex gap-4 mt-3 justify-center text-xs" style={{ color: 'var(--color-muted)' }}>
                      <span>↑ = Terentang</span>
                      <span>✕ = Digenggam</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div
                    className="rounded-xl p-3 mb-4"
                    style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                  >
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                      Deskripsi Gerakan:
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                      {selectedGesture.description}
                    </p>
                  </div>

                  {/* How-to steps */}
                  <div>
                    <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                      Langkah-langkah:
                    </p>
                    <ol className="flex flex-col gap-2">
                      {selectedGesture.howTo.map((step, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span
                            className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                          >
                            {i + 1}
                          </span>
                          <span className="text-sm" style={{ color: 'var(--color-muted)' }}>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </>
              ) : (
                <div
                  className="flex flex-col items-center gap-2 py-6 rounded-xl"
                  style={{ backgroundColor: 'var(--color-bg)' }}
                >
                  <Hand size={32} style={{ color: 'var(--color-muted)' }} />
                  <p className="text-sm text-center" style={{ color: 'var(--color-muted)' }}>
                    Panduan gestur untuk kata ini belum tersedia.<br />
                    Akan ditambahkan pada versi berikutnya.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
