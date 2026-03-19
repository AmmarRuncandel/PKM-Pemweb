'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera,
  Send,
  Mic,
  MicOff,
  MessageSquareMore,
  Pause,
  Trash2,
  User,
  Ear,
  Hand,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useHandDetector } from '@/lib/useHandDetector';

// ─────────────────────────────────────────────────────
// TwoWayMode – Komunikasi Dua Arah
// Sisi Tunarungu: kamera nyata + MediaPipe + classifier
// Sisi Pendengar: ketik teks + Web Speech Recognition
// ─────────────────────────────────────────────────────

interface ChatMessage {
  id: number;
  sender: 'tunarungu' | 'dengar';
  text: string;
  time: string;
}

function getTimeNow() {
  return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export default function TwoWayMode() {
  const { videoRef, canvasRef, gesture, status, error, start, stop, pause, resume } = useHandDetector();

  const [detectedWords, setDetectedWords] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isMicActive, setIsMicActive] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);

  // Gesture stabilization
  const lastGestureRef = useRef<string | null>(null);
  const gestureCountRef = useRef(0);
  const STABLE_FRAMES = 14;

  useEffect(() => {
    if (!gesture) {
      lastGestureRef.current = null;
      gestureCountRef.current = 0;
      return;
    }
    if (gesture.label === lastGestureRef.current) {
      gestureCountRef.current += 1;
      if (gestureCountRef.current === STABLE_FRAMES) {
        setDetectedWords((prev) => [...prev, gesture.label]);
      }
    } else {
      lastGestureRef.current = gesture.label;
      gestureCountRef.current = 1;
    }
  }, [gesture]);

  // Auto-send detected words to chat after 6 words
  useEffect(() => {
    if (detectedWords.length > 0 && detectedWords.length % 6 === 0) {
      const text = detectedWords.slice(-6).join(' ');
      idCounter.current += 1;
      setChatHistory((prev) => [
        ...prev,
        { id: idCounter.current, sender: 'tunarungu', text, time: getTimeNow() },
      ]);
    }
  }, [detectedWords]);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Check Speech API support
  useEffect(() => {
    const supported = typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    setSpeechSupported(supported);
  }, []);

  const sendTextMessage = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;
    idCounter.current += 1;
    setChatHistory((prev) => [
      ...prev,
      { id: idCounter.current, sender: 'dengar', text, time: getTimeNow() },
    ]);
    setInputText('');
  }, [inputText]);

  // Web Speech Recognition untuk sisi pendengar
  const startMic = useCallback(() => {
    if (typeof window === 'undefined') return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionCtor: any =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setSpeechSupported(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition: any = new SpeechRecognitionCtor();
    recognition.lang = 'id-ID';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsMicActive(true);
    recognition.start();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript: string = event.results[0][0].transcript;
      idCounter.current += 1;
      setChatHistory((prev) => [
        ...prev,
        { id: idCounter.current, sender: 'dengar', text: transcript, time: getTimeNow() },
      ]);
      setIsMicActive(false);
    };

    recognition.onerror = () => setIsMicActive(false);
    recognition.onend = () => setIsMicActive(false);
  }, []);

  const isRunning = status === 'running';
  const detectedText = detectedWords.join(' ');

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquareMore size={22} style={{ color: 'var(--color-primary)' }} />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            Mode Dua Arah
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          Komunikasi inklusif antara pengguna tunarungu dan pendengar dalam satu layar.
        </p>
      </div>

      {/* Split panels */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">

        {/* ── Left: Tunarungu panel (kamera) ── */}
        <div
          className="lg:col-span-3 rounded-2xl overflow-hidden"
          style={{ backgroundColor: 'var(--color-card)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
        >
          <div
            className="flex items-center gap-2 px-5 py-3"
            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
          >
            <User size={16} />
            <span className="font-semibold text-sm">Sisi Tunarungu</span>
            <span className="text-xs opacity-75 ml-auto">Deteksi Isyarat</span>
          </div>

          {/* Camera preview with landmark overlay */}
          <div
            className="relative flex items-center justify-center w-full"
            style={{ backgroundColor: '#0f1a0f', minHeight: '280px', aspectRatio: '16/9' }}
          >
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ display: isRunning || status === 'paused' ? 'block' : 'none' }}
              muted
              playsInline
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ display: isRunning || status === 'paused' ? 'block' : 'none', pointerEvents: 'none' }}
            />

            {/* Gesture label overlay */}
            {isRunning && gesture && (
              <div className="absolute bottom-2 left-2 z-10">
                <div
                  key={gesture.label}
                  className="animate-fadeIn px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1"
                  style={{ backgroundColor: 'rgba(35,114,39,0.9)', color: 'white' }}
                >
                  <Sparkles size={11} />
                  {gesture.label}
                </div>
              </div>
            )}

            {/* Idle / loading / error state */}
            {(status === 'idle' || status === 'loading' || status === 'error') && (
              <div className="flex flex-col items-center gap-3 p-4 text-center">
                {status === 'loading' ? (
                  <>
                    <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
                    <p className="text-xs" style={{ color: '#6b8a6b' }}>Memuat kamera...</p>
                  </>
                ) : status === 'error' ? (
                  <>
                    <AlertCircle size={32} style={{ color: '#ef4444' }} />
                    <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>
                  </>
                ) : (
                  <>
                    <div
                      className="relative flex items-center justify-center w-16 h-16 rounded-full"
                      style={{ backgroundColor: 'rgba(35,114,39,0.15)' }}
                    >
                      {isRunning ? (
                        <Hand size={30} style={{ color: 'var(--color-primary)' }} />
                      ) : (
                        <Camera size={28} style={{ color: 'var(--color-primary)' }} />
                      )}
                    </div>
                    {!isRunning && (
                      <p className="text-xs" style={{ color: '#6b8a6b' }}>
                        Kamera belum aktif
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Detected text area */}
          <div className="p-4">
            <div
              className="rounded-xl p-3 min-h-[64px] mb-3"
              style={{ backgroundColor: 'var(--color-primary-50)' }}
            >
              <p className="text-lg font-bold leading-snug" style={{ color: 'var(--color-text)' }}>
                {detectedText || (
                  <span style={{ color: 'var(--color-muted)', fontWeight: 400, fontSize: '0.875rem' }}>
                    Isyarat tangan akan terdeteksi di sini...
                  </span>
                )}
                {isRunning && <span className="animate-blink ml-0.5" style={{ color: 'var(--color-primary)' }}>|</span>}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={status === 'running' ? pause : status === 'paused' ? resume : start}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                style={{
                  backgroundColor: isRunning ? '#fee2e2' : 'var(--color-primary)',
                  color: isRunning ? '#dc2626' : 'white',
                }}
              >
                {status === 'loading' ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : isRunning ? (
                  <Pause size={16} />
                ) : (
                  <Camera size={16} />
                )}
                {status === 'loading' ? 'Memuat...' : isRunning ? 'Hentikan' : status === 'paused' ? 'Lanjut' : 'Mulai Kamera'}
              </button>
              <button
                onClick={() => { stop(); setDetectedWords([]); }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all hover:scale-105"
                style={{ backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary)' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Dengar panel ── */}
        <div
          className="lg:col-span-2 rounded-2xl overflow-hidden flex flex-col"
          style={{ backgroundColor: 'var(--color-card)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
        >
          <div
            className="flex items-center gap-2 px-5 py-4"
            style={{ backgroundColor: '#1d6e9f', color: 'white' }}
          >
            <Ear size={16} />
            <span className="font-semibold text-sm">Sisi Pendengar</span>
            <span className="text-xs opacity-75 ml-auto">Teks & Suara</span>
          </div>

          <div className="p-4 flex flex-col gap-3 flex-1">
            {/* Display for latest dengar message */}
            <div
              className="rounded-xl px-4 py-3 min-h-[84px] flex items-start"
              style={{ backgroundColor: '#eff6fc' }}
            >
              {chatHistory.filter((m) => m.sender === 'dengar').length > 0 ? (
                <div className="animate-fadeIn w-full">
                  <p
                    className="text-2xl font-bold leading-snug"
                    style={{ color: '#1d6e9f', wordBreak: 'break-word' }}
                  >
                    {chatHistory.filter((m) => m.sender === 'dengar').at(-1)?.text}
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                    Pesan terakhir dari pendengar
                  </p>
                </div>
              ) : (
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  Teks dari pendengar akan tampil besar di sini agar mudah dibaca
                </p>
              )}
            </div>

            {/* Input form */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendTextMessage()}
                placeholder="Ketik pesan di sini..."
                className="flex-1 px-1 pb-2 pt-1 text-sm outline-none border-b transition-all focus:border-b-2"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text)',
                }}
              />
              <button
                onClick={sendTextMessage}
                className="flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:scale-105"
                style={{ backgroundColor: '#1d6e9f', color: 'white' }}
              >
                <Send size={16} />
              </button>
              <button
                onClick={startMic}
                disabled={isMicActive || !speechSupported}
                title={!speechSupported ? 'Browser tidak mendukung Speech Recognition' : 'Bicara (Speech to Text)'}
                className="flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: isMicActive ? '#fee2e2' : '#e0f0fa', color: isMicActive ? '#dc2626' : '#1d6e9f' }}
              >
                {isMicActive ? <MicOff size={16} className="animate-pulse" /> : <Mic size={16} />}
              </button>
            </div>
            {!speechSupported && (
              <p className="text-xs mt-2" style={{ color: '#f59e0b' }}>
                ⚠ Browser tidak mendukung Speech Recognition. Gunakan Chrome/Edge.
              </p>
            )}
            {isMicActive && (
              <p className="text-xs mt-2 animate-pulse" style={{ color: '#1d6e9f' }}>
                🎤 Sedang mendengarkan... bicara sekarang
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Chat history */}
      {chatHistory.length > 0 && (
        <div
          className="rounded-2xl p-5"
          style={{ backgroundColor: 'var(--color-card)', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
              Riwayat Percakapan Sesi Ini
            </h2>
            <button
              onClick={() => setChatHistory([])}
              className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
            >
              Hapus
            </button>
          </div>

          <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'dengar' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div
                  className="max-w-xs px-4 py-2.5 rounded-2xl"
                  style={{
                    backgroundColor: msg.sender === 'tunarungu' ? 'var(--color-primary-50)' : '#eff6fc',
                    borderBottomLeftRadius: msg.sender === 'tunarungu' ? '4px' : undefined,
                    borderBottomRightRadius: msg.sender === 'dengar' ? '4px' : undefined,
                  }}
                >
                  <p
                    className="text-xs font-semibold mb-0.5"
                    style={{ color: msg.sender === 'tunarungu' ? 'var(--color-primary)' : '#1d6e9f' }}
                  >
                    <span className="inline-flex items-center gap-1">
                      {msg.sender === 'tunarungu' ? <Hand size={12} /> : <Ear size={12} />}
                      {msg.sender === 'tunarungu' ? 'Tunarungu' : 'Pendengar'}
                    </span>
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-text)' }}>{msg.text}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>{msg.time}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>
      )}
    </div>
  );
}
