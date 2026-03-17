'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera,
  Send,
  Mic,
  MessageSquareMore,
  Pause,
  Trash2,
  User,
  Ear,
  Hand,
  Sparkles,
  ArrowUp,
} from 'lucide-react';

// ===================================================================
// TODO: Left panel (Sisi Tunarungu):
//   Replace setInterval simulation with real MediaPipe + LSTM pipeline.
//   Right panel (Sisi Dengar):
//   Replace mic button simulation with Web Speech API SpeechRecognition.
// ===================================================================

const DUMMY_WORDS = [
  'Halo', 'Saya', 'Butuh', 'Bantuan', 'Terima', 'Kasih', 'Tolong', 'Maaf',
  'Selamat', 'Pagi', 'Nama', 'Saya', 'Budi',
];

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
  const [isRunning, setIsRunning] = useState(false);
  const [detectedWords, setDetectedWords] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isMicActive, setIsMicActive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);

  const clearInterval_ = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const toggleCamera = useCallback(() => {
    if (isRunning) {
      clearInterval_();
      setIsRunning(false);
    } else {
      setIsRunning(true);
      // TODO: Start MediaPipe here
      intervalRef.current = setInterval(() => {
        setWordIndex((prev) => {
          const word = DUMMY_WORDS[prev % DUMMY_WORDS.length];
          setDetectedWords((ws) => [...ws, word]);
          return prev + 1;
        });
      }, 2500);
    }
  }, [isRunning, clearInterval_]);

  // Auto-send detected speech to chat after 6 words
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

  const simulateMic = useCallback(() => {
    setIsMicActive(true);
    // TODO: Replace with web SpeechRecognition API
    setTimeout(() => {
      const phrases = ['Baik, saya mengerti.', 'Tolong ulangi sekali lagi.', 'Mari kita duduk di sana.', 'Terima kasih banyak!'];
      const phrase = phrases[Math.floor(Math.random() * phrases.length)];
      idCounter.current += 1;
      setChatHistory((prev) => [
        ...prev,
        { id: idCounter.current, sender: 'dengar', text: phrase, time: getTimeNow() },
      ]);
      setIsMicActive(false);
    }, 2000);
  }, []);

  useEffect(() => {
    return () => clearInterval_();
  }, [clearInterval_]);

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Left: Tunarungu panel */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: 'var(--color-card)', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}
        >
          <div
            className="flex items-center gap-2 px-5 py-3"
            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
          >
            <User size={16} />
            <span className="font-semibold text-sm">Sisi Tunarungu</span>
            <span className="text-xs opacity-75 ml-auto">Deteksi Isyarat</span>
          </div>

          {/* Camera preview */}
          <div
            className="flex flex-col items-center justify-center"
            style={{ backgroundColor: '#e8eee8', minHeight: '200px' }}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className="relative flex items-center justify-center w-20 h-20 rounded-full"
                style={{ backgroundColor: 'rgba(35,114,39,0.15)' }}
              >
                {isRunning ? (
                  <Hand size={38} style={{ color: 'var(--color-primary)' }} />
                ) : (
                  <Camera size={34} style={{ color: 'var(--color-primary)' }} />
                )}
                {isRunning && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{ backgroundColor: 'rgba(35,114,39,0.15)' }}
                  />
                )}
              </div>
              {detectedWords.length > 0 && (
                <div
                  key={detectedWords.length}
                  className="animate-fadeIn px-4 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1.5"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                >
                  <Sparkles size={13} />
                  {detectedWords[detectedWords.length - 1]}
                </div>
              )}
            </div>
          </div>

          {/* Detected text area */}
          <div className="p-4">
            <div
              className="rounded-xl p-3 min-h-[72px] mb-3"
              style={{ backgroundColor: 'var(--color-primary-50)' }}
            >
              <p className="text-lg font-bold leading-snug" style={{ color: 'var(--color-text)' }}>
                {detectedText || <span style={{ color: 'var(--color-muted)', fontWeight: 400, fontSize: '0.875rem' }}>Isyarat tangan akan terdeteksi di sini...</span>}
                {isRunning && <span className="animate-blink ml-0.5" style={{ color: 'var(--color-primary)' }}>|</span>}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={toggleCamera}
                className="flex items-center gap-2 px-4 py-2, rounded-xl font-semibold text-sm transition-all hover:scale-105"
                style={{ backgroundColor: isRunning ? '#fee2e2' : 'var(--color-primary)', color: isRunning ? '#dc2626' : 'white', padding: '0.5rem 1rem' }}
              >
                {isRunning ? <Pause size={16} /> : <Camera size={16} />}
                {isRunning ? 'Hentikan' : 'Mulai Kamera'}
              </button>
              <button
                onClick={() => setDetectedWords([])}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all hover:scale-105"
                style={{ backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary)', padding: '0.5rem 0.75rem' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Dengar panel */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: 'var(--color-card)', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}
        >
          <div
            className="flex items-center gap-2 px-5 py-3"
            style={{ backgroundColor: '#1d6e9f', color: 'white' }}
          >
            <Ear size={16} />
            <span className="font-semibold text-sm">Sisi Pendengar</span>
            <span className="text-xs opacity-75 ml-auto">Teks & Suara</span>
          </div>

          {/* Large display for recent message */}
          <div
            className="flex items-center justify-center p-6"
            style={{ backgroundColor: '#eff6fc', minHeight: '200px' }}
          >
            {chatHistory.filter((m) => m.sender === 'dengar').length > 0 ? (
              <div className="text-center animate-fadeIn">
                <p
                  className="text-3xl font-bold leading-tight"
                  style={{ color: '#1d6e9f', wordBreak: 'break-word' }}
                >
                  {chatHistory.filter((m) => m.sender === 'dengar').at(-1)?.text}
                </p>
                <p className="text-xs mt-2" style={{ color: '#6B7280' }}>
                  Pesan terakhir dari pendengar
                </p>
              </div>
            ) : (
              <p className="text-sm text-center" style={{ color: '#6B7280' }}>
                Teks dari pendengar akan tampil besar di sini agar mudah dibaca
              </p>
            )}
          </div>

          {/* Input form */}
          <div className="p-4">
            <div
              className="rounded-xl p-3 min-h-[72px] mb-3 flex items-center justify-center"
              style={{ backgroundColor: '#eff6fc' }}
            >
              <p className="text-sm flex items-center gap-1.5" style={{ color: '#6B7280' }}>
                Tampilan pesan besar di atas
                <ArrowUp size={14} />
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendTextMessage()}
                placeholder="Ketik pesan di sini..."
                className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none border transition-all"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-bg)',
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
                onClick={simulateMic}
                disabled={isMicActive}
                className="flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:scale-105 disabled:opacity-50"
                style={{ backgroundColor: isMicActive ? '#fee2e2' : '#e0f0fa', color: isMicActive ? '#dc2626' : '#1d6e9f' }}
              >
                <Mic size={16} className={isMicActive ? 'animate-pulse' : ''} />
              </button>
            </div>
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
