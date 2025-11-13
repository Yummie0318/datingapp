// C:\Users\Yummie03\Desktop\datingapp\src\components\MatchHistoryScreen.tsx
"use client";

import { useMemo, useState, ImgHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, MessageCircle } from "lucide-react";
import type { Match } from "./DiscoverMatches";
import { useTranslation } from "../hooks/useTranslation";

/** Minimal replacement for ImageWithFallback */
type ImageWithFallbackProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};
function ImageWithFallback({ src, fallbackSrc, ...rest }: ImageWithFallbackProps) {
  const [err, setErr] = useState(false);
  return (
    <img
      {...rest}
      src={
        !err
          ? (src as string)
          : fallbackSrc ??
            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='100%' height='100%' fill='%23e5e7eb'/></svg>"
      }
      onError={() => setErr(true)}
    />
  );
}

interface MatchHistoryScreenProps {
  matches: Match[];
  onBack: () => void;
  onSelectMatch: (match: Match) => void;
}

type MatchHistoryTexts = {
  headerTitle: string;
  searchPlaceholder: string;
  statusActiveNow: string;
  emptyTitle: string;
  emptySubtitle: string;
};

const defaultTexts: MatchHistoryTexts = {
  headerTitle: "Match history",
  searchPlaceholder: "Search matches...",
  statusActiveNow: "Active now",
  emptyTitle: "No matches found",
  emptySubtitle: "Try a different search term.",
};

export function MatchHistoryScreen({
  matches,
  onBack,
  onSelectMatch,
}: MatchHistoryScreenProps) {
  const [query, setQuery] = useState("");

  // i18n
  const { texts, loading: i18nLoading } = useTranslation(
    defaultTexts,
    "matchHistoryScreen"
  );
  const safeTexts: MatchHistoryTexts =
    !texts || Object.keys(texts).length === 0 || !("headerTitle" in texts)
      ? defaultTexts
      : (texts as MatchHistoryTexts);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return matches;
    return matches.filter((m) => {
      const hay = [
        m.name,
        String(m.age),
        m.bio,
        m.location,
        ...(m.interests ?? []),
        ...(m.languages ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [matches, query]);

  // ---------- HARD SKELETON WHILE TRANSLATIONS LOAD ----------
  if (i18nLoading) {
    return (
      <div className="min-h-screen bg-[#F2F4F8] flex flex-col">
        {/* Header skeleton */}
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center gap-4 max-w-md mx-auto mb-4">
            <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-5 w-32 bg-gray-200 rounded-full animate-pulse" />
          </div>

          {/* Search skeleton */}
          <div className="max-w-md mx-auto">
            <div className="h-11 w-full bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        </div>

        {/* List skeleton */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-md mx-auto space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-full bg-white p-4 rounded-2xl shadow-md flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-3 w-40 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-3 w-24 bg-gray-200 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---------- REAL UI ----------
  return (
    <div className="min-h-screen bg-[#F2F4F8] flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center gap-4 max-w-md mx-auto mb-4">
          <button onClick={onBack} className="text-[#4FC3F7]" aria-label="Back">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-[#4FC3F7]">{safeTexts.headerTitle}</h2>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={safeTexts.searchPlaceholder}
            className="w-full pl-12 pr-4 py-3 bg-[#F2F4F8] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4FC3F7]"
          />
        </div>
      </div>

      {/* Match List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-md mx-auto space-y-3">
          {filtered.map((match, index) => (
            <motion.button
              key={match.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectMatch(match)}
              className="w-full bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition-shadow text-left"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  <ImageWithFallback
                    src={match.image}
                    alt={match.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <span
                    className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"
                    aria-label="Online"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-gray-900 truncate">
                      {match.name}, {match.age}
                    </h3>
                    <span className="text-[#4FC3F7] text-xs">
                      {match.compatibility}%
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm truncate mb-1">
                    {match.bio}
                  </p>
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <MessageCircle className="w-3 h-3" />
                    <span>{safeTexts.statusActiveNow}</span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">{safeTexts.emptyTitle}</p>
              <p className="text-gray-400 text-sm mt-2">
                {safeTexts.emptySubtitle}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
