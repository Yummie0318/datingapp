// C:\Users\Yummie03\Desktop\datingapp\src\components\LivelynessCheck.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, RefreshCw, Repeat, Upload } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

export interface LivelinessResult {
  granted: boolean;
  durationMs: number;
  startedAt: number;
  capturedImage?: string;
  source?: "camera" | "upload";
}

interface LivelynessCheckProps {
  onBack: () => void; // kept for compatibility; not used
  onComplete: (result: LivelinessResult) => void;
}

type Phase = "initializing" | "preview" | "captured" | "blocked" | "success";

// Default English texts (will be translated automatically)
const defaultTexts = {
  headerTitle: "Photo check",

  mainTitle: "Take a photo — let the AI analyze you based on it",
  mainSubtitle: "Snap one now or upload a clear photo you already have.",

  placeholderBlocked: "Enable camera or upload a photo",
  placeholderStarting: "Starting camera...",

  tipsText:
    "Good lighting, face visible, no sunglasses. AI uses this photo to personalize your matches.",

  restartLabel: "Restart",
  switchLabel: "Switch",
  uploadLabel: "Upload",

  looksGoodTitle: "Looks good?",
  looksGoodHint: "You can retake if needed.",
  retakeLabel: "Retake",
  usePhotoLabel: "Use this photo",

  takePhotoLabel: "Take photo",
  skipLabel: "Skip",
  uploadInsteadLabel: "Upload instead",
  continueLabel: "Continue",

  errorCameraBlocked: "Camera blocked or not available",
  errorImageFile: "Could not read image file",
};

export function LivelynessCheck({ onBack: _onBack, onComplete }: LivelynessCheckProps) {
  const [phase, setPhase] = useState<Phase>("initializing");
  const [err, setErr] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [usingFront, setUsingFront] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [imageSource, setImageSource] = useState<"camera" | "upload" | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // i18n
  const { texts, loading: i18nLoading } = useTranslation(defaultTexts, "livelinessCheck");
  const safeTexts =
    !texts || Object.keys(texts).length === 0 || !("headerTitle" in texts)
      ? defaultTexts
      : texts;

  useEffect(() => {
    startCamera(usingFront);
    return () => stopStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const waitForVideoReady = (v: HTMLVideoElement) =>
    new Promise<void>((resolve) => {
      const done = () => {
        if (v.readyState >= 2 && v.videoWidth > 0) resolve();
      };
      if (v.readyState >= 2 && v.videoWidth > 0) return resolve();
      const onReady = () => {
        v.play().catch(() => {});
        done();
      };
      v.onloadedmetadata = onReady;
      v.oncanplay = onReady;
    });

  const nextTick = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

  const startCamera = async (front: boolean) => {
    if (isStarting) return;
    setIsStarting(true);
    setErr(null);

    try {
      if (!navigator.mediaDevices?.getUserMedia)
        throw new Error("Media devices not available");
      if (!videoRef.current) await nextTick();
      if (!videoRef.current) throw new Error("Video element not ready");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: front ? "user" : { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;

      const v = videoRef.current!;
      (v as any).srcObject = stream;
      v.muted = true;
      v.playsInline = true;
      await v.play().catch(() => {});
      await waitForVideoReady(v);

      setStartedAt(Date.now());
      setPhase("preview");
    } catch (e) {
      console.error("getUserMedia failed:", e);
      setErr(safeTexts.errorCameraBlocked);
      setPhase("blocked");
    } finally {
      setIsStarting(false);
    }
  };

  const switchCamera = async () => {
    setUsingFront((p) => !p);
    stopStream();
    await startCamera(!usingFront);
  };

  const captureFromVideo = () => {
    const v = videoRef.current;
    if (!v) return;

    const w = v.videoWidth;
    const h = v.videoHeight;
    if (!w || !h) return;

    let canvas = canvasRef.current;
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvasRef.current = canvas;
    }
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // un-mirror front cam
    if (usingFront) {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(v, 0, 0, w, h);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(dataUrl);
    setImageSource("camera");
    setPhase("captured");
    stopStream();
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const onFileSelected: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      let canvas = canvasRef.current;
      if (!canvas) {
        canvas = document.createElement("canvas");
        canvasRef.current = canvas;
      }
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setCapturedImage(dataUrl);
      setImageSource("upload");
      setPhase("captured");
      stopStream();
    };
    img.onerror = () => setErr(safeTexts.errorImageFile);
    img.src = URL.createObjectURL(file);
  };

  const retake = async () => {
    setCapturedImage(null);
    setImageSource(null);
    await startCamera(usingFront);
  };

  const finish = (granted: boolean) => {
    onComplete({
      granted,
      durationMs: startedAt ? Date.now() - startedAt : 0,
      startedAt: startedAt ?? Date.now(),
      capturedImage: granted ? capturedImage ?? undefined : undefined,
      source: granted ? imageSource ?? undefined : undefined,
    });
  };

  const showVideo = phase === "preview";

  // ---------- HARD SKELETON: while translations are loading, show only loader ----------
  if (i18nLoading) {
    return (
      <div className="min-h-screen bg-[#F2F4F8] flex flex-col">
        {/* Header skeleton */}
        <div className="sticky top-0 bg-white/95 backdrop-blur px-4 py-3 flex items-center justify-center z-10 border-b border-gray-100">
          <div className="h-5 w-32 bg-gray-200 rounded-full animate-pulse" />
        </div>

        {/* Main content skeleton */}
        <div className="flex-1 px-4 pt-3 pb-[112px] max-w-md w-full self-center">
          {/* Title skeleton */}
          <div className="text-center mb-3 space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded-full mx-auto animate-pulse" />
            <div className="h-3 w-4/5 bg-gray-200 rounded-full mx-auto animate-pulse" />
          </div>

          {/* Card skeleton */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative bg-white rounded-3xl shadow-md p-2"
          >
            <div className="relative rounded-2xl overflow-hidden border border-gray-200">
              <div className="relative w-full aspect-[3/4] sm:aspect-[4/3] bg-gray-100 animate-pulse" />
            </div>
          </motion.div>

          {/* Tips skeleton */}
          <div className="mt-3 text-[11px] text-gray-500 text-center">
            <div className="h-3 w-5/6 bg-gray-200 rounded-full mx-auto animate-pulse" />
          </div>
        </div>

        {/* Bottom bar skeleton */}
        <div className="sticky bottom-0 inset-x-0 p-4 pt-2 bg-white/90 backdrop-blur border-t border-gray-200">
          <div className="max-w-md mx-auto flex gap-2 [padding-bottom:env(safe-area-inset-bottom)]">
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

      {/* Main content */}
      <div className="flex-1 px-4 pt-3 pb-[112px] max-w-md w-full self-center">
        {/* Title */}
        <div className="text-center mb-3">
          <div className="text-gray-900 font-medium text-base sm:text-lg">
            {safeTexts.mainTitle}
          </div>
          <div className="text-gray-500 text-xs sm:text-sm">
            {safeTexts.mainSubtitle}
          </div>
        </div>

        {/* Card */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative bg-white rounded-3xl shadow-md p-2"
        >
          <div className="relative rounded-2xl overflow-hidden border border-gray-200">
            <div className="relative w-full aspect-[3/4] sm:aspect-[4/3] bg-gray-100">
              {/* Live video */}
              <video
                ref={videoRef}
                className={`absolute inset-0 w-full h-full object-cover bg-black transition-opacity ${
                  showVideo ? "opacity-100 [transform:scaleX(-1)]" : "opacity-0"
                }`}
                autoPlay
                playsInline
                muted
              />

              {/* Placeholder */}
              {!showVideo && !capturedImage && phase !== "success" && (
                <div className="absolute inset-0 grid place-items-center text-center bg-gray-100">
                  <div className="space-y-2">
                    <Camera className="w-10 h-10 mx-auto text-[#0ea5e9]" />
                    <div className="text-gray-700 text-sm">
                      {phase === "blocked"
                        ? safeTexts.placeholderBlocked
                        : safeTexts.placeholderStarting}
                    </div>
                  </div>
                </div>
              )}

              {/* Captured preview with subtle gradient overlay for legibility */}
              {capturedImage && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tips */}
        <div className="mt-3 text-[11px] text-gray-500 text-center">
          {safeTexts.tipsText}
        </div>

        {/* Utilities */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(phase === "preview" || phase === "blocked") && (
            <button
              onClick={() => startCamera(usingFront)}
              disabled={isStarting}
              className="col-span-1 flex items-center justify-center gap-1.5 rounded-full px-3 py-2.5 bg-gray-100 text-sm disabled:opacity-60 active:scale-[0.99]"
            >
              <RefreshCw className="w-4 h-4" />
              {safeTexts.restartLabel}
            </button>
          )}

          {phase === "preview" && (
            <button
              onClick={switchCamera}
              className="col-span-1 flex items-center justify-center gap-1.5 rounded-full px-3 py-2.5 bg-gray-100 text-sm active:scale-[0.99]"
            >
              <Repeat className="w-4 h-4" />
              {safeTexts.switchLabel}
            </button>
          )}

          {(phase === "preview" || phase === "blocked") && (
            <button
              onClick={openFilePicker}
              className="col-span-1 flex items-center justify-center gap-1.5 rounded-full px-3 py-2.5 bg-gray-100 text-sm active:scale-[0.99]"
            >
              <Upload className="w-4 h-4" />
              {safeTexts.uploadLabel}
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={onFileSelected}
          />
        </div>

        {/* Captured controls */}
        {phase === "captured" && (
          <div className="mt-3">
            <div className="rounded-2xl bg-white/95 shadow-sm border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-900">
                  {safeTexts.looksGoodTitle}
                </div>
                <div className="text-xs text-gray-500">
                  {safeTexts.looksGoodHint}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={retake}
                  className="rounded-xl border border-gray-300 bg-white text-gray-800 py-3 text-sm font-medium active:scale-[0.99]"
                >
                  {safeTexts.retakeLabel}
                </button>
                <button
                  onClick={() => setPhase("success")}
                  className="rounded-xl bg-[#0ea5e9] text-white py-3 text-sm font-semibold shadow-sm active:scale-[0.99]"
                >
                  {safeTexts.usePhotoLabel}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky bottom actions */}
      <div className="sticky bottom-0 inset-x-0 p-4 pt-2 bg-white/90 backdrop-blur border-t border-gray-200">
        {phase === "preview" && (
          <div className="max-w-md mx-auto flex gap-2 [padding-bottom:env(safe-area-inset-bottom)]">
            <button
              onClick={captureFromVideo}
              className="flex-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-white py-4 rounded-2xl active:scale-[0.99]"
            >
              {safeTexts.takePhotoLabel}
            </button>
            {/* Single Skip stays here */}
            <button
              onClick={() =>
                onComplete({
                  granted: false,
                  durationMs: startedAt ? Date.now() - startedAt : 0,
                  startedAt: startedAt ?? Date.now(),
                })
              }
              className="px-4 py-4 rounded-2xl bg-gray-100 text-gray-800 active:scale-[0.99]"
            >
              {safeTexts.skipLabel}
            </button>
          </div>
        )}

        {phase === "success" && (
          <div className="max-w-md mx-auto [padding-bottom:env(safe-area-inset-bottom)]">
            <button
              onClick={() => finish(true)}
              className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-white py-4 rounded-2xl shadow-sm active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#38bdf8]"
            >
              {safeTexts.continueLabel}
            </button>
          </div>
        )}

        {phase === "blocked" && (
          <div className="max-w-md mx-auto flex gap-2 [padding-bottom:env(safe-area-inset-bottom)]">
            <button
              onClick={openFilePicker}
              className="flex-1 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-white py-4 rounded-2xl active:scale-[0.99]"
            >
              {safeTexts.uploadInsteadLabel}
            </button>
            <button
              onClick={() =>
                onComplete({
                  granted: false,
                  durationMs: startedAt ? Date.now() - startedAt : 0,
                  startedAt: startedAt ?? Date.now(),
                })
              }
              className="px-4 py-4 rounded-2xl bg-gray-100 text-gray-800 active:scale-[0.99]"
            >
              {safeTexts.skipLabel}
            </button>
          </div>
        )}
      </div>

      {/* Error */}
      {err && (
        <div className="px-4 pb-4 text-center text-sm text-red-600">{err}</div>
      )}
    </div>
  );
}
