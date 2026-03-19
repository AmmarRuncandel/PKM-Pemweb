'use client';

import React, { useEffect, useRef } from 'react';
import {
  Camera,
  CameraOff,
  Pause,
  Play,
  Trash2,
  Volume2,
  Loader2,
  Wifi,
  Hand,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useHandDetector } from '@/lib/useHandDetector';

// ───────────────────────────────────────────────
// CameraView – Deteksi Isyarat Real-Time
// Menggunakan MediaPipe Hands + rule-based classifier
// ───────────────────────────────────────────────

export default function CameraView() {
  const { videoRef, canvasRef, gesture, status, error, start, stop, pause, resume } = useHandDetector();

  // Accumulated translated words from gestures
  const translatedWordsRef = useRef<string[]>([]);
  const [translatedWords, setTranslatedWords] = React.useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  // Debounce: hanya tambah kata baru jika berbeda dari kata sebelumnya
  // dan gestur sudah terdeteksi cukup lama (stabilize)
  const lastGestureRef = useRef<string | null>(null);
  const gestureCountRef = useRef(0);
  const GESTURE_STABLE_FRAMES = 12; // ~0.4 detik pada 30fps

  useEffect(() => {
    if (!gesture) {
      lastGestureRef.current = null;
      gestureCountRef.current = 0;
      return;
    }

    if (gesture.label === lastGestureRef.current) {
      gestureCountRef.current += 1;
      if (gestureCountRef.current === GESTURE_STABLE_FRAMES) {
        // Kata stabil — tambahkan ke hasil terjemahan
        translatedWordsRef.current = [...translatedWordsRef.current, gesture.label];
        setTranslatedWords([...translatedWordsRef.current]);
      }
    } else {
      lastGestureRef.current = gesture.label;
      gestureCountRef.current = 1;
    }
  }, [gesture]);

  const clearText = () => {
    translatedWordsRef.current = [];
    setTranslatedWords([]);
  };

  const playSound = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const text = translatedWords.join(' ');
    if (!text) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'id-ID';
    utter.rate = 0.85;
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const translatedText = translatedWords.join(' ');
  const isActive = status === 'running' || status === 'paused';

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Camera size={22} style={{ color: 'var(--color-primary)' }} />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            Kamera Real-Time
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          Posisikan tangan Anda di depan kamera untuk memulai penerjemahan BISINDO.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Camera feed */}
        <div className="lg:col-span-3">
          <div
            className="rounded-2xl overflow-hidden relative"
            style={{ backgroundColor: 'var(--color-card)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
          >
            {/* Video + Canvas overlay area */}
            <div
              className="relative flex items-center justify-center w-full"
              style={{ backgroundColor: '#0f1a0f', minHeight: '280px', aspectRatio: '16/9' }}
            >
              {/* Live video */}
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ display: status === 'running' || status === 'paused' ? 'block' : 'none' }}
                muted
                playsInline
              />

              {/* Landmark canvas overlay */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ display: status === 'running' || status === 'paused' ? 'block' : 'none', pointerEvents: 'none' }}
              />

              {/* Status badge */}
              {status === 'running' && (
                <div
                  className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold animate-pulse-ring z-10"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                >
                  <Wifi size={12} />
                  LIVE
                </div>
              )}
              {status === 'paused' && (
                <div
                  className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold z-10"
                  style={{ backgroundColor: '#f59e0b', color: 'white' }}
                >
                  <Pause size={12} />
                  JEDA
                </div>
              )}

              {/* Gesture label bubble saat terdeteksi */}
              {status === 'running' && gesture && (
                <div className="absolute bottom-3 left-3 z-10">
                  <div
                    key={gesture.label}
                    className="animate-fadeIn px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1.5"
                    style={{ backgroundColor: 'rgba(35,114,39,0.92)', color: 'white', backdropFilter: 'blur(4px)' }}
                  >
                    <Sparkles size={13} />
                    {gesture.label}
                  </div>
                </div>
              )}

              {/* Placeholder saat idle atau loading */}
              {(status === 'idle' || status === 'loading' || status === 'error') && (
                <div className="flex flex-col items-center gap-4 px-4 py-6 text-center w-full">
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={40} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
                      <p className="text-sm font-medium" style={{ color: '#a0b8a0' }}>
                        Mengaktifkan kamera & MediaPipe...
                      </p>
                      <p className="text-xs" style={{ color: '#6b8a6b' }}>
                        Pastikan browser diizinkan mengakses kamera
                      </p>
                    </>
                  ) : status === 'error' ? (
                    <>
                      <AlertCircle size={40} style={{ color: '#ef4444' }} />
                      <p className="text-sm font-semibold" style={{ color: '#ef4444' }}>
                        {error || 'Gagal mengakses kamera'}
                      </p>
                    </>
                  ) : (
                    <>
                      <div
                        className="relative flex items-center justify-center w-24 h-24 rounded-full"
                        style={{ backgroundColor: 'rgba(35,114,39,0.12)' }}
                      >
                        <Camera size={44} style={{ color: 'var(--color-primary)' }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: '#a0b8a0' }}>
                          Kamera Belum Aktif
                        </p>
                        <p className="text-xs mt-1" style={{ color: '#6b8a6b' }}>
                          Klik &ldquo;Mulai Kamera&rdquo; untuk memulai
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* No hand detected badge */}
              {status === 'running' && !gesture && (
                <div className="absolute bottom-3 right-3 z-10">
                  <div
                    className="px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#ccc', backdropFilter: 'blur(4px)' }}
                  >
                    <Hand size={12} />
                    Tunjukkan tangan ke kamera
                  </div>
                </div>
              )}
            </div>

            {/* Control buttons */}
            <div className="flex flex-wrap items-center gap-3 p-4" style={{ borderTop: '1px solid var(--color-border)' }}>
              {status === 'idle' || status === 'error' ? (
                <button
                  onClick={start}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 hover:scale-105"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                >
                  <Camera size={16} />
                  Mulai Kamera
                </button>
              ) : status === 'loading' ? (
                <button
                  disabled
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm opacity-60 cursor-not-allowed"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                >
                  <Loader2 size={16} className="animate-spin" />
                  Memuat...
                </button>
              ) : (
                <>
                  <button
                    onClick={status === 'running' ? pause : resume}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 hover:scale-105"
                    style={{ backgroundColor: status === 'running' ? '#f59e0b' : 'var(--color-primary)', color: 'white' }}
                  >
                    {status === 'running' ? <Pause size={16} /> : <Play size={16} />}
                    {status === 'running' ? 'Jeda' : 'Lanjut'}
                  </button>
                  <button
                    onClick={stop}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 hover:scale-105"
                    style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
                  >
                    <CameraOff size={16} />
                    Stop
                  </button>
                </>
              )}
              <button
                onClick={clearText}
                disabled={translatedWords.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed ml-auto"
                style={{ backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
              >
                <Trash2 size={16} />
                Bersihkan
              </button>
            </div>
          </div>
        </div>

        {/* Translation output */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div
            className="flex-1 rounded-2xl p-5 flex flex-col"
            style={{ backgroundColor: 'var(--color-card)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', minHeight: '240px' }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--color-muted)' }}>
                Hasil Terjemahan
              </h2>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
              >
                {translatedWords.length} kata
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center">
              {translatedText ? (
                <p
                  className="text-4xl font-bold text-center leading-tight animate-fadeIn"
                  style={{ color: 'var(--color-text)', wordBreak: 'break-word' }}
                >
                  {translatedText}
                  {status === 'running' && (
                    <span className="animate-blink ml-1" style={{ color: 'var(--color-primary)' }}>|</span>
                  )}
                </p>
              ) : (
                <p className="text-sm text-center" style={{ color: 'var(--color-muted)' }}>
                  Teks terjemahan akan muncul di sini...
                </p>
              )}
            </div>
          </div>

          {/* TTS button */}
          <button
            onClick={playSound}
            disabled={!translatedText || isSpeaking}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-semibold text-sm transition-all duration-150 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: isSpeaking ? 'var(--color-primary-50)' : 'var(--color-primary)',
              color: isSpeaking ? 'var(--color-primary)' : 'white',
              boxShadow: isSpeaking ? 'none' : '0 4px 12px rgba(35,114,39,0.3)',
            }}
          >
            <Volume2 size={18} className={isSpeaking ? 'animate-pulse' : ''} />
            {isSpeaking ? 'Sedang Diputar...' : 'Putar Suara (TTS)'}
          </button>

          {/* Word history chips */}
          {translatedWords.length > 0 && (
            <div
              className="rounded-2xl p-4"
              style={{ backgroundColor: 'var(--color-card)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-muted)' }}>
                Kata terdeteksi:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {translatedWords.map((word, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-lg text-xs font-medium"
                    style={{ backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
