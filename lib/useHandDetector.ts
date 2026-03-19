'use client';

/**
 * useHandDetector
 * Custom React hook yang menangani:
 *  1. Akses kamera via getUserMedia
 *  2. Inisialisasi MediaPipe Hands
 *  3. Per-frame inference: landmark → classifyGesture
 *  4. Gambar landmark overlay di atas canvas
 *
 * Usage:
 *   const { videoRef, canvasRef, gesture, isLoading, error, start, stop, isRunning } = useHandDetector();
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import { classifyGesture, type ClassifyResult } from './gestureClassifier';

export type HandDetectorStatus = 'idle' | 'loading' | 'running' | 'paused' | 'error';

export interface UseHandDetectorResult {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  gesture: ClassifyResult | null;
  status: HandDetectorStatus;
  error: string | null;
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
}

export function useHandDetector(): UseHandDetectorResult {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handsRef = useRef<unknown>(null);
  const cameraRef = useRef<unknown>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [gesture, setGesture] = useState<ClassifyResult | null>(null);
  const [status, setStatus] = useState<HandDetectorStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    // Stop camera util
    if (cameraRef.current) {
      try {
        (cameraRef.current as { stop: () => void }).stop();
      } catch (_) { /* ignore */ }
      cameraRef.current = null;
    }
    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    // Clear video
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const stop = useCallback(() => {
    stopCamera();
    setStatus('idle');
    setGesture(null);
  }, [stopCamera]);

  const pause = useCallback(() => {
    if (cameraRef.current) {
      try {
        (cameraRef.current as { stop: () => void }).stop();
      } catch (_) { /* ignore */ }
    }
    setStatus('paused');
  }, []);

  const resume = useCallback(() => {
    if (cameraRef.current && videoRef.current) {
      try {
        (cameraRef.current as { start: () => void }).start();
        setStatus('running');
      } catch (_) { /* ignore */ }
    }
  }, []);

  const start = useCallback(async () => {
    setStatus('loading');
    setError(null);
    setGesture(null);

    try {
      // ── 1. Dynamically import MediaPipe (avoids SSR issues) ──
      const [{ Hands }, { Camera }, { drawConnectors, drawLandmarks }] = await Promise.all([
        import('@mediapipe/hands'),
        import('@mediapipe/camera_utils'),
        import('@mediapipe/drawing_utils'),
      ]);

      // ── 2. Get camera stream ──
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) throw new Error('Video element not found');
      video.srcObject = stream;
      await video.play();

      // ── 3. Init MediaPipe Hands ──
      const hands = new Hands({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.6,
      });

      // ── 4. On result: draw landmarks + classify ──
      hands.onResults((results: {
        multiHandLandmarks?: Array<Array<{ x: number; y: number; z: number }>>;
        image: CanvasImageSource;
      }) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const landmarkList = results.multiHandLandmarks[0];

          // Draw connections
          drawConnectors(ctx, landmarkList, [
            [0,1],[1,2],[2,3],[3,4],
            [0,5],[5,6],[6,7],[7,8],
            [0,9],[9,10],[10,11],[11,12],
            [0,13],[13,14],[14,15],[15,16],
            [0,17],[17,18],[18,19],[19,20],
            [5,9],[9,13],[13,17],
          ], { color: 'rgba(35,114,39,0.8)', lineWidth: 2 });

          // Draw joints
          drawLandmarks(ctx, landmarkList, {
            color: '#ffffff',
            fillColor: '#237227',
            lineWidth: 1,
            radius: 4,
          });

          // Classify
          const result = classifyGesture(landmarkList);
          setGesture(result);
        } else {
          setGesture(null);
        }

        ctx.restore();
      });

      handsRef.current = hands;

      // ── 5. Start camera loop via Camera util ──
      const camera = new Camera(video, {
        onFrame: async () => {
          await (hands as { send: (input: { image: HTMLVideoElement }) => Promise<void> }).send({ image: video });
        },
        width: 640,
        height: 480,
      });

      cameraRef.current = camera;
      camera.start();
      setStatus('running');

    } catch (err) {
      console.error('[useHandDetector]', err);
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('notallowed')) {
        setError('Izin kamera ditolak. Silakan izinkan akses kamera di browser Anda.');
      } else if (msg.toLowerCase().includes('notfound') || msg.toLowerCase().includes('devicenotfound')) {
        setError('Kamera tidak ditemukan. Pastikan kamera terpasang dengan benar.');
      } else {
        setError(`Gagal mengaktifkan kamera: ${msg}`);
      }
      setStatus('error');
      stopCamera();
    }
  }, [stopCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    canvasRef,
    gesture,
    status,
    error,
    start,
    stop,
    pause,
    resume,
  };
}
