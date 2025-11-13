// C:\Users\Yummie03\Desktop\datingapp\src\components\AIAnalysisModal.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";


export type AIAnalysisTexts = {
  analyzingTitle: string;
  statusScanImage: string;
  statusFacialExpressions: string;
  statusVoiceTone: string;
  statusCombine: string;
  statusFinalize: string;
};

export interface AIAnalysisModalProps {
  /** Called once progress reaches 100% (slight delay for finish animation) */
  onComplete: () => void;
  /** Optionally control visibility. Defaults to true. */
  open?: boolean;
  /** Total duration in ms to reach 100%. Default ~2.6s (50ms * 52 ticks). */
  durationMs?: number;
  /** Localized texts passed from parent. */
  texts?: AIAnalysisTexts;
}

/** English fallback if parent doesn't pass anything */
const defaultTexts: AIAnalysisTexts = {
  analyzingTitle: "Analyzing your personality",
  statusScanImage: "✓ Scanning your image for clarity and lighting",
  statusFacialExpressions: "✓ Detecting facial expressions and mood",
  statusVoiceTone: "✓ Analyzing your voice tone and emotion",
  statusCombine: "✓ Combining photo and audio insights",
  statusFinalize: "✓ Finalizing compatibility and personality match",
};

export function AIAnalysisModal({
  onComplete,
  open = true,
  durationMs, // optional custom duration
  texts,
}: AIAnalysisModalProps) {
  const [progress, setProgress] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);

  const t = texts ?? defaultTexts;

  // If a custom duration is provided, compute the step increment to hit 100 smoothly
  const stepEveryMs = 50;
  const totalTicks = Math.max(1, Math.round((durationMs ?? 2600) / stepEveryMs));
  const step = 100 / totalTicks;

  useEffect(() => {
    if (!open) return;

    // reset whenever we (re)open
    setProgress(0);

    const id = window.setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + step);
        if (next >= 100) {
          window.clearInterval(id);
          intervalRef.current = null;
          // allow a small finish animation before completing
          window.setTimeout(onComplete, 500);
        }
        return next;
      });
    }, stepEveryMs);

    intervalRef.current = id;

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step, stepEveryMs, onComplete]);

  // Progress ring math
  const r = 58;
  const C = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, progress));
  const dash = (clamped / 100) * C;

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50"
          aria-modal="true"
          role="dialog"
          aria-labelledby="ai-analysis-title"
          aria-describedby="ai-analysis-desc"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <div className="relative z-10 flex min-h-full items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-xl"
            >
              {/* AI Orb */}
              <div className="relative mx-auto mb-6 h-32 w-32">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 30px rgba(79,195,247,0.30)",
                      "0 0 60px rgba(79,195,247,0.60)",
                      "0 0 30px rgba(79,195,247,0.30)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-[#4FC3F7] to-[#81D4FA]"
                >
                  <Sparkles className="h-12 w-12 text-white" aria-hidden />
                </motion.div>

                {/* Progress Ring */}
                <svg
                  className="absolute inset-0 -rotate-90 h-full w-full"
                  viewBox="0 0 128 128"
                  role="img"
                  aria-label={`Progress ${Math.round(progress)} percent`}
                >
                  <circle
                    cx="64"
                    cy="64"
                    r={r}
                    stroke="#F2F4F8"
                    strokeWidth="4"
                    fill="none"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r={r}
                    stroke="#4FC3F7"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: `0 ${C}` }}
                    animate={{ strokeDasharray: `${dash} ${C}` }}
                    transition={{ duration: 0.25 }}
                  />
                </svg>
              </div>

              {/* Text */}
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <h3
                  id="ai-analysis-title"
                  className="mb-1 text-lg font-semibold text-[#4FC3F7]"
                >
                  {t.analyzingTitle}
                </h3>
                <p
                  id="ai-analysis-desc"
                  className="mb-4 text-sm text-gray-600"
                >
                  {Math.round(progress)}%
                </p>
              </motion.div>

              {/* Status messages */}
              <div className="space-y-2 text-sm text-gray-500">
                {progress > 15 && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {t.statusScanImage}
                  </motion.p>
                )}
                {progress > 35 && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {t.statusFacialExpressions}
                  </motion.p>
                )}
                {progress > 55 && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {t.statusVoiceTone}
                  </motion.p>
                )}
                {progress > 75 && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {t.statusCombine}
                  </motion.p>
                )}
                {progress > 90 && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {t.statusFinalize}
                  </motion.p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
