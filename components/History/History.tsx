'use client';

import React, { useState } from 'react';
import {
  History as HistoryIcon,
  Trash2,
  Clock,
  MessageSquare,
  BookOpen,
  AlertCircle,
  Camera,
  MessageCircle,
  GraduationCap,
  Inbox,
  type LucideIcon,
} from 'lucide-react';

interface HistoryItem {
  id: number;
  date: string;
  mode: string;
  duration: string;
  wordCount: number;
  icon: LucideIcon;
}

const DUMMY_HISTORY: HistoryItem[] = [
  { id: 1, date: '18 Maret 2026', mode: 'Kamera Real-Time', duration: '5 menit', wordCount: 15, icon: Camera },
  { id: 2, date: '17 Maret 2026', mode: 'Mode Dua Arah', duration: '12 menit', wordCount: 34, icon: MessageCircle },
  { id: 3, date: '16 Maret 2026', mode: 'Kamera Real-Time', duration: '3 menit', wordCount: 9, icon: Camera },
  { id: 4, date: '15 Maret 2026', mode: 'Mode Dua Arah', duration: '8 menit', wordCount: 22, icon: MessageCircle },
  { id: 5, date: '14 Maret 2026', mode: 'Modul Belajar', duration: '20 menit', wordCount: 50, icon: GraduationCap },
];

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>(DUMMY_HISTORY);
  const [showConfirm, setShowConfirm] = useState(false);

  const totalWords = history.reduce((sum, item) => sum + item.wordCount, 0);
  const totalSessions = history.length;

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <HistoryIcon size={22} style={{ color: 'var(--color-primary)' }} />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            Riwayat
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          Log penggunaan aplikasi BISINDO Anda.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Sesi', value: totalSessions, icon: Clock },
          { label: 'Kata Diterjemahkan', value: totalWords, icon: MessageSquare },
          { label: 'Bahasa Tersedia', value: '1', icon: BookOpen },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex flex-col items-center p-4 rounded-2xl text-center"
            style={{ backgroundColor: 'var(--color-card)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            <Icon size={18} className="mb-2" style={{ color: 'var(--color-primary)' }} />
            <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{value}</p>
            <p className="text-xs mt-0.5 leading-tight" style={{ color: 'var(--color-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* History list */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--color-card)', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}
      >
        {/* List header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <h2 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
            Log Penggunaan
          </h2>
          {history.length > 0 && (
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
            >
              <Trash2 size={13} />
              Hapus Riwayat
            </button>
          )}
        </div>

        {/* Confirm dialog */}
        {showConfirm && (
          <div
            className="flex items-start gap-3 px-5 py-4 animate-fadeIn"
            style={{ backgroundColor: '#fff7ed', borderBottom: '1px solid #fed7aa' }}
          >
            <AlertCircle size={18} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 2 }} />
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: '#92400e' }}>
                Yakin ingin menghapus semua riwayat?
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#b45309' }}>
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex gap-2 ml-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="text-xs px-3 py-1.5 rounded-lg font-medium"
                style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
              >
                Batal
              </button>
              <button
                onClick={() => { setHistory([]); setShowConfirm(false); }}
                className="text-xs px-3 py-1.5 rounded-lg font-medium"
                style={{ backgroundColor: '#dc2626', color: 'white' }}
              >
                Hapus
              </button>
            </div>
          </div>
        )}

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Inbox size={36} className="mb-3" style={{ color: 'var(--color-muted)' }} />
            <p className="font-semibold" style={{ color: 'var(--color-text)' }}>Riwayat kosong</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
              Mulai gunakan aplikasi untuk melihat log di sini
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {history.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-4 px-5 py-4 transition-all hover:bg-gray-50 animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Icon */}
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
                  style={{ backgroundColor: 'var(--color-primary-50)' }}
                >
                  <item.icon size={19} style={{ color: 'var(--color-primary)' }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                    {item.mode}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                    {item.date}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex flex-col items-end gap-1">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
                  >
                    {item.wordCount} kata
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                    {item.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
