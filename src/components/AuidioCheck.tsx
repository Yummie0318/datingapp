// C:\Users\Yummie03\Desktop\datingapp\src\components\AuidioCheck.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic, StopCircle, Play, Pause, RefreshCw } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

export interface AudioSampleResult {
  granted: boolean;
  durationMs: number;
  blobUrl: string | null;
  mimeType: string | null;
}

interface AudioCheckProps {
  onBack: () => void; // kept for compatibility; not used
  onComplete: (result: AudioSampleResult) => void;
  maxSeconds?: number; // default 600 (10 mins)
  minSeconds?: number; // default 2
}

type Phase = "init" | "ready" | "recording" | "review" | "blocked";

// Default English texts (will be translated automatically)
const defaultTexts = {
  headerTitle: "Tone check",
  mainTitle: "Record your tone — we’ll let the AI analyze it",
  mainSubtitle: "Take a short sample to continue",

  statusRecording: "Recording",
  statusPreview: "Preview",
  statusReady: "Ready",

  timerMinLabel: "min",
  timerMaxLabel: "max",

  primaryRecord: "Start recording",
  primaryStop: "Stop recording",

  waveTip:
    "Speak naturally for at least {seconds}s. Avoid loud background noise for best results.",

  blockedMessage:
    "Microphone permission is blocked. Enable it in your browser settings and tap “Enable mic”.",

  btnEnableMic: "Enable mic",
  btnRestartMic: "Restart mic",
  btnSkip: "Skip",
  btnRerecord: "Re-record",
  btnContinue: "Continue",

  reviewTitle: "Listen back",
  reviewHint: "You can re-record if needed.",

  errorMicBlocked: "Microphone permission is blocked or unavailable.",

  // ---- AI Analysis Modal texts (for translation, passed to modal from parent) ----
  aiAnalyzingTitle: "Analyzing your personality",
  aiStatusScanImage: "✓ Scanning your image for clarity and lighting",
  aiStatusFacialExpressions: "✓ Detecting facial expressions and mood",
  aiStatusVoiceTone: "✓ Analyzing your voice tone and emotion",
  aiStatusCombine: "✓ Combining photo and audio insights",
  aiStatusFinalize: "✓ Finalizing compatibility and personality match",
};

export function AuidioCheck({
  onBack: _onBack,
  onComplete,
  maxSeconds = 600,
  minSeconds = 2,
}: AudioCheckProps) {
  const [phase, setPhase] = useState<Phase>("init");
  const [err, setErr] = useState<string | null>(null);

  const [granted, setGranted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const [elapsed, setElapsed] = useState(0);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);

  const [playMs, setPlayMs] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [durationMs, setDurationMs] = useState(0);

  const streamRef = useRef<MediaStream | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const rafRecRef = useRef<number | null>(null);
  const rafPlayRef = useRef<number | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [bars, setBars] = useState<number[]>(new Array(24).fill(0));

  // i18n
  const { texts, loading: i18nLoading } = useTranslation(
    defaultTexts,
    "audioCheck"
  );
  const safeTexts =
    !texts || Object.keys(texts).length === 0 || !("headerTitle" in texts)
      ? defaultTexts
      : texts;

  // ---- helpers to fully stop everything ----
  const stopStreamTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const stopRecordingSync = () => {
    try {
      if (recRef.current && recRef.current.state !== "inactive") {
        recRef.current.stop();
      }
    } catch {}
  };

  const stopRecordingAsync = (): Promise<void> =>
    new Promise((resolve) => {
      if (!recRef.current || recRef.current.state === "inactive") return resolve();
      const rec = recRef.current;
      const onStop = () => {
        rec.removeEventListener("stop", onStop);
        resolve();
      };
      rec.addEventListener("stop", onStop);
      try {
        rec.stop();
      } catch {
        rec.removeEventListener("stop", onStop);
        resolve();
      }
    });

  const fullCleanup = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (rafRecRef.current) cancelAnimationFrame(rafRecRef.current);
    if (rafPlayRef.current) cancelAnimationFrame(rafPlayRef.current);
    try {
      await audioCtxRef.current?.close();
    } catch {}
    stopRecordingSync();
    stopStreamTracks();
  };

  useEffect(() => {
    requestMic();

    // stop if tab hidden / navigating away
    const onHide = () => {
      stopRecordingSync();
      stopStreamTracks();
    };
    const onUnload = () => {
      stopRecordingSync();
      stopStreamTracks();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onUnload);
    window.addEventListener("beforeunload", onUnload);

    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onUnload);
      window.removeEventListener("beforeunload", onUnload);
      fullCleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestMic = async () => {
    if (isStarting) return;
    setIsStarting(true);
    setErr(null);

    try {
      if (!navigator.mediaDevices?.getUserMedia)
        throw new Error("Media devices not available");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setGranted(true);
      setPhase("ready");

      const ACtx = (window.AudioContext ||
        (window as any).webkitAudioContext) as typeof AudioContext;
      audioCtxRef.current = new ACtx();
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      sourceRef.current = audioCtxRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      tickWaveform();
    } catch (e) {
      console.error("getUserMedia audio failed:", e);
      setGranted(false);
      setErr(safeTexts.errorMicBlocked);
      setPhase("blocked");
    } finally {
      setIsStarting(false);
    }
  };

  // live waveform
  const tickWaveform = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const freq = new Uint8Array(analyser.frequencyBinCount);

    const loop = () => {
      analyser.getByteFrequencyData(freq);
      const slice = Math.floor(freq.length / 24);
      const next = new Array(24).fill(0).map((_, i) => {
        let max = 0;
        for (let j = i * slice; j < (i + 1) * slice; j++)
          max = Math.max(max, freq[j] || 0);
        return max / 255;
      });
      setBars(next);
      rafRecRef.current = requestAnimationFrame(loop);
    };
    loop();
  };

  const startRecording = async () => {
    if (!streamRef.current) return;
    try {
      await audioCtxRef.current?.resume();
    } catch {}

    setElapsed(0);
    setBlobUrl(null);
    setPlayMs(0);
    setDurationMs(0);
    chunksRef.current = [];

    const mime =
      MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")
        ? "audio/ogg;codecs=opus"
        : "audio/webm";

    const rec = new MediaRecorder(streamRef.current, { mimeType: mime });
    setMimeType(mime);
    recRef.current = rec;

    rec.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };
    rec.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mime });
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
      setPhase("review");
      if (timerRef.current) clearInterval(timerRef.current);
    };

    rec.start(20);
    setPhase("recording");

    const start = Date.now();
    timerRef.current = setInterval(() => {
      const ms = Date.now() - start;
      setElapsed(ms);
      if (ms >= maxSeconds * 1000) stopRecordingSync();
    }, 150);
  };

  const redo = () => {
    setBlobUrl(null);
    setElapsed(0);
    setPlayMs(0);
    setIsPlaying(false);
    setDurationMs(0);
    setPhase("ready");
  };

  const onLoadedMeta = () => {
    if (!audioElRef.current) return;
    setDurationMs(Math.floor((audioElRef.current.duration || 0) * 1000));
  };

  const togglePlay = () => {
    const el = audioElRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {});
      setIsPlaying(true);
      playTicker();
    } else {
      el.pause();
      setIsPlaying(false);
      if (rafPlayRef.current) cancelAnimationFrame(rafPlayRef.current);
    }
  };

  const playTicker = () => {
    const el = audioElRef.current;
    if (!el) return;
    const loop = () => {
      setPlayMs(Math.floor(el.currentTime * 1000));
      if (!el.paused) rafPlayRef.current = requestAnimationFrame(loop);
    };
    loop();
  };

  const canContinue = elapsed >= minSeconds * 1000;
  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const recProgress = Math.min(1, elapsed / (maxSeconds * 1000));
  const playProgress = durationMs ? Math.min(1, playMs / durationMs) : 0;

  // ---- unified submit paths that ALWAYS stop recording & mic first ----
  const finishAndSubmit = async (grantedValue: boolean) => {
    await stopRecordingAsync();
    stopStreamTracks();

    onComplete({
      granted: grantedValue,
      durationMs: elapsed,
      blobUrl: grantedValue ? blobUrl : null,
      mimeType: grantedValue ? mimeType : null,
    });
  };

  const doSkip = () => finishAndSubmit(false);
  const doContinue = () => finishAndSubmit(true);

  const statusLabel =
    phase === "recording"
      ? safeTexts.statusRecording
      : phase === "review"
      ? safeTexts.statusPreview
      : phase === "ready"
      ? safeTexts.statusReady
      : "";

  const waveTipText = safeTexts.waveTip.replace(
    "{seconds}",
    String(minSeconds)
  );

  // ---------- HARD SKELETON: while translations are loading, show only loader ----------
  if (i18nLoading) {
    return (
      <div className="min-h-screen bg-[#F2F4F8] flex flex-col">
        {/* Header skeleton */}
        <div className="sticky top-0 bg-white/95 backdrop-blur px-4 py-3 flex items-center justify-center z-10 border-b border-gray-100">
          <div className="h-5 w-32 bg-gray-200 rounded-full animate-pulse" />
        </div>

        {/* Centered content skeleton */}
        <div className="flex-1 grid place-items-center px-4 pb-[112px]">
          <div className="w-full max-w-md">
            {/* Title skeleton */}
            <div className="text-center mb-3 space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 rounded-full mx-auto animate-pulse" />
              <div className="h-3 w-2/3 bg-gray-200 rounded-full mx-auto animate-pulse" />
            </div>

            {/* Card skeleton */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-3xl shadow-md p-4 space-y-4"
            >
              {/* Fake waveform */}
              <div className="w-full h-16 rounded-2xl bg-gray-100 animate-pulse" />

              {/* Timer row skeleton */}
              <div className="flex items-center justify-between text-xs text-gray-600 mt-2">
                <span className="inline-block h-3 w-16 bg-gray-200 rounded-full animate-pulse" />
                <span className="inline-block h-3 w-24 bg-gray-200 rounded-full animate-pulse" />
              </div>

              {/* Big circle skeleton */}
              <div className="mt-4 flex items-center justify-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-200 animate-pulse" />
              </div>

              {/* Lower hint skeleton */}
              <div className="mt-3 flex justify-center">
                <div className="h-3 w-3/4 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </motion.div>

            {/* Utility row skeleton */}
            <div className="mt-3 flex items-center justify-center">
              <div className="h-8 w-28 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Bottom bar skeleton */}
        <div
          className="sticky bottom-0 inset-x-0 p-4 pt-2 bg-white/95 backdrop-blur border-t border-gray-200"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <div className="max-w-md mx-auto">
            <div className="h-11 w-full bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // ---------- REAL UI, only once translations are ready ----------
  return (
    <div className="min-h-screen bg-[#F2F4F8] flex flex-col">
      {/* Header centered */}
      <div className="sticky top-0 bg-white/95 backdrop-blur px-4 py-3 flex items-center justify-center z-10 border-b border-gray-100">
        <h2 className="text-[#0ea5e9] font-semibold tracking-wide">
          {safeTexts.headerTitle}
        </h2>
      </div>

      {/* Centered content */}
      <div className="flex-1 grid place-items-center px-4 pb-[112px]">
        <div className="w-full max-w-md">
          <div className="text-center mb-3">
            <div className="text-gray-900 font-medium">
              {safeTexts.mainTitle}
            </div>
            <div className="text-gray-500 text-xs">
              {safeTexts.mainSubtitle}
            </div>
          </div>

          {/* Card */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-3xl shadow-md p-4"
          >
            {/* Waveform */}
            <div className="w-full h-16 rounded-2xl bg-[#F7FAFC] flex items-end justify-between p-2 overflow-hidden">
              {bars.map((b, i) => (
                <div
                  key={i}
                  className="w-[3.5%] max-w-[12px] rounded-t-md"
                  style={{
                    height: `${Math.max(8, b * 64)}px`,
                    background: "linear-gradient(180deg,#38bdf8,#0ea5e9)",
                    opacity: 0.93,
                  }}
                />
              ))}
            </div>

            {/* Timer row */}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
              <span className="uppercase tracking-wide">{statusLabel}</span>
              <span className="tabular-nums">
                {formatTime(elapsed)} • {safeTexts.timerMinLabel}{" "}
                {formatTime(minSeconds * 1000)} • {safeTexts.timerMaxLabel}{" "}
                {formatTime(maxSeconds * 1000)}
              </span>
            </div>

            {/* Big Mic Button */}
            <div className="mt-4 flex items-center justify-center">
              {phase !== "recording" ? (
                <button
                  onClick={phase === "review" ? redo : startRecording}
                  className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-white grid place-items-center shadow-lg active:scale-95"
                >
                  {phase !== "review" && (
                    <span className="absolute inset-0 rounded-full animate-ping opacity-25 bg-[#38bdf8]" />
                  )}
                  {phase === "review" ? (
                    <RefreshCw className="w-8 h-8 relative z-10" />
                  ) : (
                    <Mic className="w-9 h-9 relative z-10" />
                  )}
                </button>
              ) : (
                <button
                  onClick={stopRecordingSync}
                  className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-red-500 text-white grid place-items-center shadow-lg active:scale-95"
                >
                  {/* circular progress */}
                  <svg
                    className="absolute -rotate-90 w-full h-full"
                    viewBox="0 0 120 120"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="56"
                      stroke="rgba(255,255,255,0.35)"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="56"
                      stroke="#fff"
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={`${
                        Math.max(1, 2 * Math.PI * 56 * recProgress)
                      }, 1000`}
                    />
                  </svg>
                  <StopCircle className="w-10 h-10 relative z-10" />
                </button>
              )}
            </div>

            {/* Review controls */}
            {phase === "review" && blobUrl && (
              <div className="mt-5">
                <audio
                  ref={audioElRef}
                  src={blobUrl}
                  onLoadedMetadata={onLoadedMeta}
                  onEnded={() => {
                    setIsPlaying(false);
                    setPlayMs(durationMs);
                  }}
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full bg-gray-900 text-white grid place-items-center active:scale-95"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]"
                        style={{ width: `${playProgress * 100}%` }}
                      />
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500 tabular-nums">
                      <span>{formatTime(playMs)}</span>
                      <span>{formatTime(durationMs)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-gray-500 text-center">
                  {safeTexts.reviewHint}
                </div>
              </div>
            )}

            {/* Blocked message */}
            {phase === "blocked" && (
              <div className="mt-4 text-sm text-red-600 text-center">
                {safeTexts.blockedMessage}
              </div>
            )}
          </motion.div>

          {/* Utility button row */}
          <div className="mt-3 flex items-center justify-center gap-2">
            {(phase === "ready" || phase === "blocked") && (
              <button
                onClick={requestMic}
                disabled={isStarting}
                className="flex items-center gap-1.5 rounded-full px-3 py-2 bg-gray-100 text-sm disabled:opacity-60 active:scale-[0.99]"
              >
                <RefreshCw className="w-4 h-4" />
                {phase === "blocked"
                  ? safeTexts.btnEnableMic
                  : safeTexts.btnRestartMic}
              </button>
            )}
          </div>

          {/* Tiny tips */}
          <div className="mt-2 text-[11px] text-gray-500 text-center leading-relaxed">
            {waveTipText}
          </div>
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div
        className="sticky bottom-0 inset-x-0 p-4 pt-2 bg-white/95 backdrop-blur border-t border-gray-200"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        {phase === "review" ? (
          <div className="max-w-md mx-auto flex gap-2">
            <button
              onClick={redo}
              className="flex-1 rounded-2xl border border-gray-300 bg-white text-gray-800 py-4 text-sm font-medium active:scale-[0.99]"
            >
              {safeTexts.btnRerecord}
            </button>
            <button
              onClick={doContinue}
              disabled={!blobUrl || !canContinue}
              className="flex-1 rounded-2xl bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-white py-4 text-sm font-semibold shadow-sm disabled:opacity-60 active:scale-[0.99]"
            >
              {safeTexts.btnContinue}
            </button>
          </div>
        ) : phase === "blocked" ? (
          <div className="max-w-md mx-auto flex gap-2">
            <button
              onClick={requestMic}
              className="flex-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-white py-4 rounded-2xl shadow-sm active:scale-[0.99]"
            >
              {safeTexts.btnEnableMic}
            </button>
            <button
              onClick={doSkip}
              className="px-4 py-4 rounded-2xl bg-gray-100 text-gray-800 active:scale-[0.99]"
            >
              {safeTexts.btnSkip}
            </button>
          </div>
        ) : (
          <div className="max-w-md mx-auto flex gap-2">
            <button
              onClick={phase === "recording" ? stopRecordingSync : startRecording}
              className="flex-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-white py-4 rounded-2xl shadow-sm active:scale-[0.99]"
            >
              {phase === "recording"
                ? safeTexts.primaryStop
                : safeTexts.primaryRecord}
            </button>
            <button
              onClick={doSkip}
              className="px-4 py-4 rounded-2xl bg-gray-100 text-gray-800 active:scale-[0.99]"
            >
              {safeTexts.btnSkip}
            </button>
          </div>
        )}
      </div>

      {err && (
        <div className="px-4 pb-4 text-center text-sm text-red-600">{err}</div>
      )}
    </div>
  );
}
