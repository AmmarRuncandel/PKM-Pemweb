'use client';

import React from 'react';
import { X, CheckCircle, Sparkles, type LucideIcon } from 'lucide-react';

interface ModuleModalProps {
  module: {
    id: number;
    title: string;
    description: string;
    icon: LucideIcon;
    steps: string[];
  };
  onClose: () => void;
  onComplete: () => void;
}

export default function ModuleModal({ module, onClose, onComplete }: ModuleModalProps) {
  const ModuleIcon = module.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-lg rounded-3xl animate-fadeIn overflow-hidden"
        style={{ backgroundColor: 'var(--color-card)', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
        >
          <div className="flex items-center gap-3">
            <ModuleIcon size={28} />
            <div>
              <h2 className="font-bold text-base">{module.title}</h2>
              <p className="text-xs opacity-80">{module.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-xl transition-all hover:scale-110"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <X size={16} color="white" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {/* Simulated GIF / animation placeholder */}
          {/* TODO: Replace with actual BISINDO learning GIF from assets */}
          <div
            className="flex items-center justify-center rounded-2xl mb-5"
            style={{ backgroundColor: 'var(--color-primary-50)', height: '160px' }}
          >
            <div className="text-center">
              <ModuleIcon size={56} style={{ color: 'var(--color-primary)', margin: '0 auto' }} />
              <p className="text-xs mt-2" style={{ color: 'var(--color-muted)' }}>
                [Demo Animasi Isyarat]
              </p>
            </div>
          </div>

          {/* Steps */}
          <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--color-text)' }}>
            Langkah-Langkah Belajar:
          </h3>
          <ol className="space-y-2 mb-6">
            {module.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <div
                  className="flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0 mt-0.5 text-xs font-bold"
                  style={{ backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
                >
                  {i + 1}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
                  {step}
                </p>
              </li>
            ))}
          </ol>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
            >
              Tutup
            </button>
            <button
              onClick={() => { onComplete(); onClose(); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--color-primary)', color: 'white', boxShadow: '0 4px 12px rgba(35,114,39,0.3)' }}
            >
              <CheckCircle size={16} />
              <Sparkles size={14} />
              Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
