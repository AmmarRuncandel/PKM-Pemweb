'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
} from 'lucide-react';

// ===================================================================
// TODO: Inject MediaPipe Holistic pose estimation here.
// Replace the dummy word simulation below with:
//   1. navigator.mediaDevices.getUserMedia() to get real camera stream
//   2. Attach the stream to a <video> element ref
//   3. Run mediapipe.Holistic() on the video frame
//   4. Pass landmarks to the LSTM model for gesture classification
//   5. Append the predicted word to translatedWords state
// ===================================================================

const DUMMY_WORDS = [
  'Halo', 'Nama', 'Saya', 'Budi', 'Senang', 'Bertemu', 'Anda',
  'Terima', 'Kasih', 'Selamat', 'Pagi', 'Apa', 'Kabar',
];

type Status = 'idle' | 'loading' | 'running' | 'paused';

export default function CameraView() {
  const [status, setStatus] = useState<Status>('idle');
  const [translatedWords, setTranslatedWords] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearInterval_ = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const startCamera = useCallback(() => {
    setStatus('loading');
    // Simulate camera initialization delay
    setTimeout(() => {
      setStatus('running');
      setWordIndex(0);

      // TODO: Replace this interval with real MediaPipe + LSTM inference loop
      intervalRef.current = setInterval(() => {
        setWordIndex((prev) => {
          const nextWord = DUMMY_WORDS[prev % DUMMY_WORDS.length];
          setTranslatedWords((words) => [...words, nextWord]);
          return prev + 1;
        });
      }, 2000);
    }, 1500);
  }, []);

  const pauseOrResume = useCallback(() => {
    if (status === 'running') {
      clearInterval_();
      setStatus('paused');
    } else if (status === 'paused') {
      setStatus('running');
      intervalRef.current = setInterval(() => {
        setWordIndex((prev) => {
          const nextWord = DUMMY_WORDS[prev % DUMMY_WORDS.length];
          setTranslatedWords((words) => [...words, nextWord]);
          return prev + 1;
        });
      }, 2000);
    }
  }, [status, clearInterval_]);

  const clearText = useCallback(() => {
    setTranslatedWords([]);
    setWordIndex(0);
  }, []);

  const stopCamera = useCallback(() => {
    clearInterval_();
    setStatus('idle');
    // TODO: Stop MediaPipe Holistic and release camera stream here
  }, [clearInterval_]);

  const playSound = useCallback(() => {
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
  }, [translatedWords]);

  useEffect(() => {
    return () => {
      clearInterval_();
      if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
    };
  }, [clearInterval_]);

  const translatedText = translatedWords.join(' ');

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
            {/* Video preview area */}
            <div
              className="flex flex-col items-center justify-center relative"
              style={{ backgroundColor: '#e8eee8', minHeight: '320px', aspectRatio: '16/9' }}
            >
              {/* Status badge */}
              {status === 'running' && (
                <div
                  className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold animate-pulse-ring"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                >
                  <Wifi size={12} />
                  LIVE
                </div>
              )}
              {status === 'paused' && (
                <div
                  className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: '#f59e0b', color: 'white' }}
                >
                  <Pause size={12} />
                  JEDA
                </div>
              )}

              {/* Loading state */}
              {status === 'loading' && (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 size={40} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
                  <p className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>
                    Mengaktifkan kamera...
                  </p>
                </div>
              )}

              {/* Idle / placeholder */}
              {(status === 'idle' || status === 'running' || status === 'paused') && (
                <div className="flex flex-col items-center gap-4 p-8 text-center">
                  {/* Dummy camera placeholder visual */}
                  <div
                    className="relative flex items-center justify-center w-28 h-28 rounded-full"
                    style={{ backgroundColor: 'rgba(35,114,39,0.12)' }}
                  >
                    {status !== 'idle' ? (
                      <Hand size={52} style={{ color: 'var(--color-primary)' }} />
                    ) : (
                      <Camera size={48} style={{ color: 'var(--color-primary)' }} />
                    )}
                    {status === 'running' && (
                      <span
                        className="absolute inset-0 rounded-full animate-ping"
                        style={{ backgroundColor: 'rgba(35,114,39,0.15)' }}
                      />
                    )}
                  </div>

                  {status === 'idle' && (
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                        Kamera Belum Aktif
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                        Klik "Mulai Kamera" untuk memulai
                      </p>
                    </div>
                  )}
                  {status === 'running' && (
                    <p className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                      Mendeteksi isyarat tangan...
                    </p>
                  )}
                  {status === 'paused' && (
                    <p className="text-sm font-medium" style={{ color: '#f59e0b' }}>
                      Penerjemahan dijeda
                    </p>
                  )}
                </div>
              )}

              {/* Word bubble animation when running */}
              {status === 'running' && translatedWords.length > 0 && (
                <div className="absolute bottom-4 right-4">
                  <div
                    key={translatedWords[translatedWords.length - 1] + translatedWords.length}
                    className="animate-fadeIn px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1.5"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                  >
                    <Sparkles size={13} />
                    {translatedWords[translatedWords.length - 1]}
                  </div>
                </div>
              )}
            </div>

            {/* Control buttons */}
            <div className="flex flex-wrap items-center gap-3 p-4" style={{ borderTop: '1px solid var(--color-border)' }}>
              {status === 'idle' ? (
                <button
                  onClick={startCamera}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 hover:scale-105"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                >
                  <Camera size={16} />
                  Mulai Kamera
                </button>
              ) : (
                <>
                  <button
                    onClick={pauseOrResume}
                    disabled={status === 'loading'}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 hover:scale-105 disabled:opacity-50"
                    style={{ backgroundColor: status === 'running' ? '#f59e0b' : 'var(--color-primary)', color: 'white' }}
                  >
                    {status === 'running' ? <Pause size={16} /> : <Play size={16} />}
                    {status === 'running' ? 'Jeda' : 'Lanjut'}
                  </button>
                  <button
                    onClick={stopCamera}
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
            style={{ backgroundColor: isSpeaking ? 'var(--color-primary-50)' : 'var(--color-primary)', color: isSpeaking ? 'var(--color-primary)' : 'white', boxShadow: isSpeaking ? 'none' : '0 4px 12px rgba(35,114,39,0.3)' }}
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
