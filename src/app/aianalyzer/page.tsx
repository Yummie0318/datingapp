"use client";

import { Suspense } from "react";
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
  // Wrap client logic inside a suspense boundary
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AIAnalyzerInner />
    </Suspense>
  );
}

// Separate the logic into its own client sub-component
function AIAnalyzerInner() {
  const router = useRouter();
  const params = useSearchParams();

  const redirectTo = params.get("redirectTo") || "/discover";
  const durationMs = (() => {
    const raw = params.get("durationMs");
    const n = raw ? Number(raw) : NaN;
    return Number.isFinite(n) && n > 0 ? n : undefined;
  })();

  const { texts, loading: i18nLoading } = useTranslation(
    defaultTexts,
    "aiAnalysisModal"
  );

  const safeTexts: AIAnalysisTexts =
    texts && "analyzingTitle" in texts ? (texts as AIAnalysisTexts) : defaultTexts;

  if (i18nLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <main className="min-h-screen bg-[#F2F4F8]">
      <AIAnalysisModal
        open
        durationMs={durationMs}
        texts={safeTexts}
        onComplete={() => router.replace(redirectTo)}
      />
    </main>
  );
}

// Simple skeleton loader while translations are loading or suspense is pending
function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-[#F2F4F8] flex items-center justify-center">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
        <div className="mx-auto mb-6 h-32 w-32 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-5 w-40 bg-gray-200 rounded-full mx-auto mb-3 animate-pulse" />
        <div className="h-4 w-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 w-56 bg-gray-200 rounded-full mx-auto animate-pulse" />
          <div className="h-3 w-48 bg-gray-200 rounded-full mx-auto animate-pulse" />
          <div className="h-3 w-52 bg-gray-200 rounded-full mx-auto animate-pulse" />
        </div>
      </div>
    </main>
  );
}
