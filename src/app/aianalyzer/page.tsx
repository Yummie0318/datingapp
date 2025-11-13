"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AIAnalysisModal, AIAnalysisTexts } from "@/components/AIAnalysisModal";
import { useTranslation } from "@/hooks/useTranslation";

const defaultTexts: AIAnalysisTexts = {
  analyzingTitle: "Analyzing your personality",
  statusScanImage: "✓ Scanning your image for clarity and lighting",
  statusFacialExpressions: "✓ Detecting facial expressions and mood",
  statusVoiceTone: "✓ Analyzing your voice tone and emotion",
  statusCombine: "✓ Combining photo and audio insights",
  statusFinalize: "✓ Finalizing compatibility and personality match",
};

export default function AIAnalyzerPage() {
  const router = useRouter();
  const params = useSearchParams();

  // Optional query controls
  const redirectTo = params.get("redirectTo") || "/discover";
  const durationMs = (() => {
    const raw = params.get("durationMs");
    const n = raw ? Number(raw) : NaN;
    return Number.isFinite(n) && n > 0 ? n : undefined; // falls back to modal default
  })();

  // i18n for the modal texts
  const { texts, loading: i18nLoading } = useTranslation(
    defaultTexts,
    "aiAnalysisModal"
  );

  const safeTexts: AIAnalysisTexts =
    texts && "analyzingTitle" in texts ? (texts as AIAnalysisTexts) : defaultTexts;

  // While translations are loading: hard skeleton screen, nothing clickable
  if (i18nLoading) {
    return (
      <main className="min-h-screen bg-[#F2F4F8] flex items-center justify-center">
        <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
          {/* Orb skeleton */}
          <div className="mx-auto mb-6 h-32 w-32 rounded-full bg-gray-200 animate-pulse" />

          {/* Title skeleton */}
          <div className="h-5 w-40 bg-gray-200 rounded-full mx-auto mb-3 animate-pulse" />

          {/* Percentage skeleton */}
          <div className="h-4 w-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse" />

          {/* Status lines skeleton */}
          <div className="space-y-2">
            <div className="h-3 w-56 bg-gray-200 rounded-full mx-auto animate-pulse" />
            <div className="h-3 w-48 bg-gray-200 rounded-full mx-auto animate-pulse" />
            <div className="h-3 w-52 bg-gray-200 rounded-full mx-auto animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  // Once translated texts are ready: show the real modal
  return (
    <main className="min-h-screen bg-[#F2F4F8]">
      {/* Fire the modal immediately; when done, navigate */}
      <AIAnalysisModal
        open
        durationMs={durationMs}
        texts={safeTexts}
        onComplete={() => router.replace(redirectTo)}
      />
    </main>
  );
}
