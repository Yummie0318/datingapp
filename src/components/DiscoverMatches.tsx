// C:\Users\Yummie03\Desktop\datingapp\src\components\DiscoverMatches.tsx
"use client";

import { useState, useRef, useEffect, ImgHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { Heart, Settings, Zap, Lightbulb, MessageCircle } from "lucide-react";
import { AIQuestionsModal } from "./AIQuestionsModal";
import { useTranslation } from "../hooks/useTranslation";

/** ---- Minimal replacement for ImageWithFallback ---- **/
type ImageWithFallbackProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};
function ImageWithFallback({
  src,
  fallbackSrc = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='160'%3E%3Crect width='100%25' height='100%25' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='12' fill='%239ca3af'%3Eimage%20unavailable%3C/text%3E%3C/svg%3E",
  onError,
  ...rest
}: ImageWithFallbackProps) {
  const [source, setSource] = useState(src);
  const triedFallback = useRef(false);

  useEffect(() => {
    setSource(src);
    triedFallback.current = false;
  }, [src]);

  return (
    <img
      {...rest}
      src={source as string}
      onError={(e) => {
        if (!triedFallback.current) {
          triedFallback.current = true;
          setSource(fallbackSrc);
        }
        onError?.(e);
      }}
      alt={rest.alt}
    />
  );
}
/** --------------------------------------------------- **/

export interface Match {
  id: string;
  name: string;
  age: number;
  image: string;
  compatibility: number;
  reason: string;
  bio: string;
  interests: string[];
  languages: string[];
  location: string;
}

interface DiscoverMatchesProps {
  onViewProfile: (match: Match) => void;
  onSettings: () => void;
  onUpgrade: () => void;
  onAIQuestions: () => void; // kept as-is; we’ll call it and also open the modal
  onShowMatchHistory: () => void;
}

type DiscoverTexts = {
  headerTitle: string;
  matchHistoryAria: string;
  settingsAria: string;

  energyLabel: string;
  energyCounter: string;
  outOfEnergyTitle: string;
  outOfEnergySubtitle: string;
  upgradeNow: string;

  aiBannerTitle: string;
  aiBannerSubtitle: string;

  viewProfileCta: string;
  loadMoreCta: string;
  noMoreTitle: string;
  noMoreSubtitle: string;

  // Mock match texts (so they can be translated)
  mock1Reason: string;
  mock1Bio: string;
  mock2Reason: string;
  mock2Bio: string;
  mock3Reason: string;
  mock3Bio: string;
};

// Default English texts (will be translated automatically)
const defaultTexts: DiscoverTexts = {
  headerTitle: "Discover",
  matchHistoryAria: "Match history",
  settingsAria: "Settings",

  energyLabel: "Energy",
  energyCounter: "{current}/{max}",
  outOfEnergyTitle: "Out of energy!",
  outOfEnergySubtitle: "Wait for energy to refill or upgrade for unlimited matches",
  upgradeNow: "Upgrade Now",

  aiBannerTitle: "Help AI understand you better!",
  aiBannerSubtitle: "Answer a few quick questions",

  viewProfileCta: "View Full Profile",
  loadMoreCta: "Load More Matches",
  noMoreTitle: "That's all for today!",
  noMoreSubtitle: "Check back tomorrow for more matches",

  // Mock match texts – same content as before
  mock1Reason: "Shares your love for adventure and creativity",
  mock1Bio:
    "Creative soul who loves exploring new places and trying new foods. Always up for a spontaneous road trip!",
  mock2Reason: "Similar communication style and values",
  mock2Bio:
    "Tech enthusiast and fitness buff. Love meaningful conversations over coffee.",
  mock3Reason: "Complementary personalities and shared hobbies",
  mock3Bio:
    "Bookworm and music lover. Seeking someone who appreciates quiet evenings and deep conversations.",
};

export function DiscoverMatches({
  onViewProfile,
  onSettings,
  onUpgrade,
  onAIQuestions,
  onShowMatchHistory,
}: DiscoverMatchesProps) {
  const [energy, setEnergy] = useState<number>(3);
  const [currentMatchIndex, setCurrentMatchIndex] = useState<number>(0);
  const [viewedMatches, setViewedMatches] = useState<string[]>([]);
  const [showAI, setShowAI] = useState<boolean>(false);
  const [aiAnswers, setAiAnswers] = useState<Record<string, string>>({});

  const hasEnergy = energy > 0;

  // i18n
  const { texts, loading: i18nLoading } = useTranslation(
    defaultTexts,
    "discoverMatches"
  );
  const safeTexts: DiscoverTexts =
    !texts || Object.keys(texts).length === 0 || !("headerTitle" in texts)
      ? defaultTexts
      : (texts as DiscoverTexts);

  // MOCK MATCHES now use translated texts for reason + bio
  const MOCK_MATCHES: Match[] = [
    {
      id: "1",
      name: "Emma",
      age: 26,
      image: "https://images.unsplash.com/photo-1704054006064-2c5b922e7a1e",
      compatibility: 92,
      reason: safeTexts.mock1Reason,
      bio: safeTexts.mock1Bio,
      interests: ["Travel", "Photography", "Cooking", "Art"],
      languages: ["English", "Spanish"],
      location: "San Francisco, CA",
    },
    {
      id: "2",
      name: "Alex",
      age: 28,
      image: "https://images.unsplash.com/photo-1611695434398-4f4b330623e6",
      compatibility: 88,
      reason: safeTexts.mock2Reason,
      bio: safeTexts.mock2Bio,
      interests: ["Fitness", "Technology", "Reading", "Coffee"],
      languages: ["English", "French"],
      location: "Seattle, WA",
    },
    {
      id: "3",
      name: "Sophia",
      age: 25,
      image: "https://images.unsplash.com/photo-1672462478040-a5920e2c23d8",
      compatibility: 85,
      reason: safeTexts.mock3Reason,
      bio: safeTexts.mock3Bio,
      interests: ["Reading", "Music", "Yoga", "Writing"],
      languages: ["English", "Japanese"],
      location: "Portland, OR",
    },
  ];

  const handleViewProfile = (match: Match) => {
    if (!hasEnergy && !viewedMatches.includes(match.id)) {
      onUpgrade();
      return;
    }

    if (!viewedMatches.includes(match.id)) {
      setEnergy((prev) => Math.max(0, prev - 1));
      setViewedMatches((prev) => [...prev, match.id]);
    }

    onViewProfile(match);
  };

  const handleNextMatch = () => {
    if (currentMatchIndex < MOCK_MATCHES.length - 1) {
      setCurrentMatchIndex((prev) => prev + 1);
    }
  };

  const openAIQuestions = () => {
    onAIQuestions();
    setShowAI(true);
  };

  const handleAIAnswer = (question: string, answer: string) => {
    setAiAnswers((prev) => ({ ...prev, [question]: answer }));
  };

  const energyLabel = safeTexts.energyCounter
    .replace("{current}", String(energy))
    .replace("{max}", "5");

  // ---------- HARD SKELETON: while translations are loading, show only loader ----------
  if (i18nLoading) {
    return (
      <div className="min-h-screen bg-[#F2F4F8] flex flex-col">
        {/* Header skeleton */}
        <div className="bg-white shadow-sm p-4">
          <div className="mx-auto flex max-w-md items-center justify-between">
            <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-5 w-24 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse" />
          </div>

          {/* Energy Bar skeleton */}
          <div className="mx-auto mt-4 max-w-md">
            <div className="mb-2 flex items-center justify-between">
              <div className="h-4 w-24 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-4 w-12 rounded-full bg-gray-200 animate-pulse" />
            </div>
            <div className="h-2 rounded-full bg-gray-200 animate-pulse" />
          </div>
        </div>

        {/* AI Banner skeleton */}
        <div className="mx-4 mt-4">
          <div className="rounded-2xl border border-gray-200 bg-gray-100 p-4 animate-pulse h-20" />
        </div>

        {/* Cards skeleton */}
        <div className="flex-1 overflow-y-auto p-4 pb-24">
          <div className="mx-auto max-w-md space-y-4">
            {[0, 1].map((i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="overflow-hidden rounded-3xl bg-white shadow-lg"
              >
                <div className="relative aspect-[3/4] bg-gray-200 animate-pulse" />
                <div className="p-6 space-y-4">
                  <div className="h-16 rounded-xl bg-gray-100 animate-pulse" />
                  <div className="flex flex-wrap gap-2">
                    <div className="h-7 w-16 rounded-full bg-gray-100 animate-pulse" />
                    <div className="h-7 w-20 rounded-full bg-gray-100 animate-pulse" />
                    <div className="h-7 w-14 rounded-full bg-gray-100 animate-pulse" />
                  </div>
                  <div className="h-11 rounded-2xl bg-gray-200 animate-pulse" />
                </div>
              </motion.div>
            ))}

            <div className="h-11 rounded-2xl bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // ---------- REAL UI, only once translations are ready ----------
  return (
    <div className="min-h-screen bg-[#F2F4F8] flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <button
            onClick={onShowMatchHistory}
            className="text-[#4FC3F7]"
            aria-label={safeTexts.matchHistoryAria}
          >
            <MessageCircle className="h-6 w-6" />
          </button>
          <h2 className="text-[#4FC3F7]">{safeTexts.headerTitle}</h2>
          <button
            onClick={onSettings}
            className="text-[#4FC3F7]"
            aria-label={safeTexts.settingsAria}
          >
            <Settings className="h-6 w-6" />
          </button>
        </div>

        {/* Energy Bar */}
        <div className="mx-auto mt-4 max-w-md">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-gray-700">
              <Zap className="h-4 w-4 text-[#4FC3F7]" />
              {safeTexts.energyLabel}
            </span>
            <span className="text-sm text-gray-700">{energyLabel}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <motion.div
              initial={false}
              animate={{ width: `${(energy / 5) * 100}%` }}
              className="h-full bg-gradient-to-r from-[#4FC3F7] to-[#81D4FA]"
            />
          </div>
        </div>
      </div>

      {/* AI Understanding Banner */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mx-4 mt-4 rounded-2xl border border-[#4FC3F7]/20 bg-gradient-to-r from-[#4FC3F7]/10 to-[#81D4FA]/10 p-4"
      >
        <button onClick={openAIQuestions} className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#4FC3F7] p-2">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-900">{safeTexts.aiBannerTitle}</p>
              <p className="text-xs text-gray-500">{safeTexts.aiBannerSubtitle}</p>
            </div>
          </div>
          <div className="text-[#4FC3F7]" aria-hidden>
            →
          </div>
        </button>
      </motion.div>

      {/* Energy Warning */}
      {!hasEnergy && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mx-4 mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4"
        >
          <p className="mb-2 text-sm text-amber-800">{safeTexts.outOfEnergyTitle}</p>
          <p className="mb-3 text-xs text-amber-600">
            {safeTexts.outOfEnergySubtitle}
          </p>
          <button
            onClick={onUpgrade}
            className="w-full rounded-xl bg-amber-500 py-2 text-sm text-white"
          >
            {safeTexts.upgradeNow}
          </button>
        </motion.div>
      )}

      {/* Match Cards */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="mx-auto max-w-md space-y-4">
          {MOCK_MATCHES.slice(0, currentMatchIndex + 1).map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.08 }}
              className="overflow-hidden rounded-3xl bg-white shadow-lg"
            >
              {/* Image */}
              <div className="relative aspect-[3/4]">
                <ImageWithFallback
                  src={match.image}
                  alt={match.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Info Overlay */}
             {/* Info Overlay */}
<div className="absolute inset-x-0 bottom-0 p-6 text-white">
  <div className="mb-2 flex items-center gap-3">
    <h3 className="text-2xl">
      {match.name}, {match.age}
    </h3>
    <span className="text-sm">🇺🇸</span>
  </div>
  <p className="mb-3 text-sm text-white/90">
    {(match.bio ?? "").slice(0, 80)}...
  </p>

  {/* Compatibility Badge */}
  <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
    <Heart className="h-4 w-4 text-[#4FC3F7]" fill="#4FC3F7" />
    <span>{match.compatibility}% Match</span>
  </div>
</div>

              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="mb-4 rounded-xl bg-[#4FC3F7]/10 p-4">
                  <p className="text-sm text-[#4FC3F7]">{match.reason}</p>
                </div>

                {/* Interests */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {match.interests.slice(0, 4).map((interest) => (
                    <span
                      key={interest}
                      className="rounded-full bg-[#F2F4F8] px-3 py-1 text-sm text-gray-700"
                    >
                      {interest}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleViewProfile(match)}
                  disabled={!hasEnergy && !viewedMatches.includes(match.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4FC3F7] to-[#81D4FA] py-4 text-white transition-shadow hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <MessageCircle className="h-5 w-5" />
                  {safeTexts.viewProfileCta}
                </button>
              </div>
            </motion.div>
          ))}

          {currentMatchIndex < MOCK_MATCHES.length - 1 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleNextMatch}
              className="w-full rounded-2xl border-2 border-[#4FC3F7] py-4 text-[#4FC3F7]"
            >
              {safeTexts.loadMoreCta}
            </motion.button>
          )}

          {currentMatchIndex === MOCK_MATCHES.length - 1 && (
            <div className="py-8 text-center">
              <p className="text-gray-500">{safeTexts.noMoreTitle}</p>
              <p className="mt-2 text-sm text-gray-400">
                {safeTexts.noMoreSubtitle}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI Questions Modal */}
      {showAI && (
        <AIQuestionsModal
          onClose={() => setShowAI(false)}
          onAnswer={handleAIAnswer}
        />
      )}
    </div>
  );
}
