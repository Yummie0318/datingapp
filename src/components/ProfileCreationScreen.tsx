// C:\Users\Yummie03\Desktop\datingapp\src\components\ProfileCreationScreen.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

interface ProfileCreationScreenProps {
  onBack: () => void; // kept for compatibility (not used)
  onContinue: (profile: ProfileData) => void;
}

export interface ProfileData {
  lookingFor: string;
  region: string;
  regionPart?: string;
}

// Default English texts (will be translated automatically)
const defaultTexts = {
  headerTitle: "Create Your Profile",

  aiQuestionTitle: "AI Personality Question",
  aiQuestionLabel: "What do you look for in a person? Describe it in your own words.",
  aiQuestionPlaceholder:
    "e.g., kind, curious, loves learning; enjoys weekend hikes and deep talks",
  aiQuestionHelper: "Keep it short and natural.",
  wordUnit: "words",

  regionSectionTitle: "Where should we look?",
  regionLabel: "Region *",
  regionPlaceholder: "Select your region",
  regionPartLabel: "Part of region",
  regionPartPlaceholder: "e.g., Berlin area",

  regionNA: "North America",
  regionSA: "South America",
  regionEU: "Europe",
  regionAS: "Asia",
  regionAF: "Africa",
  regionOC: "Oceania",

  submitLabel: "Save & Analyze",

  errorLookingRequired: "Please describe what you're looking for.",
  errorRegionRequired: "Select a region.",
  errorLookingTooLong: "Keep it to {max} words max.",
};

export function ProfileCreationScreen({
  onBack: _onBack,
  onContinue,
}: ProfileCreationScreenProps) {
  const [lookingFor, setLookingFor] = useState("");
  const [region, setRegion] = useState("");
  const [regionPart, setRegionPart] = useState("");
  const [errors, setErrors] = useState<{ lookingFor?: string; region?: string }>({});

  const maxWords = 40;
  const maxRegionPartChars = 120;

  const { texts, loading: i18nLoading } = useTranslation(defaultTexts, "profileCreation");
  const safeTexts =
    !texts || Object.keys(texts).length === 0 || !("headerTitle" in texts)
      ? defaultTexts
      : texts;

  const wordCount = (txt: string) => (txt.trim() ? txt.trim().split(/\s+/).length : 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: typeof errors = {};

    if (!lookingFor.trim()) {
      nextErrors.lookingFor = safeTexts.errorLookingRequired;
    } else if (wordCount(lookingFor) > maxWords) {
      nextErrors.lookingFor = safeTexts.errorLookingTooLong.replace(
        "{max}",
        String(maxWords)
      );
    }

    if (!region) nextErrors.region = safeTexts.errorRegionRequired;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onContinue({
      lookingFor: lookingFor.trim(),
      region,
      regionPart: regionPart.trim() || undefined,
    });
  };

  // 🔹 PRO-LEVEL SKELETON LOADER (for translations)
  if (i18nLoading) {
    return (
      <div className="min-h-screen bg-[#F2F4F8] flex flex-col">
        {/* Header skeleton */}
        <div className="sticky top-0 bg-white shadow-sm p-4 flex items-center justify-center z-10">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="flex-1 p-6 pb-28 max-w-md mx-auto w-full space-y-4">
          {/* AI card skeleton */}
          <div className="bg-white p-6 rounded-2xl shadow-md animate-pulse h-40" />
          {/* Region card skeleton */}
          <div className="bg-white p-6 rounded-2xl shadow-md animate-pulse h-44" />
        </div>

        {/* Fixed bottom button skeleton */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
          <div className="w-full max-w-md mx-auto h-12 bg-gradient-to-r from-[#c2e7f9] to-[#b0ddf5] rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F4F8] flex flex-col">
      {/* Header without back button */}
      <div className="sticky top-0 bg-white shadow-sm p-4 flex items-center justify-center z-10">
        <h2 className="text-[#4FC3F7]">{safeTexts.headerTitle}</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex-1 p-6 pb-28 max-w-md mx-auto w-full"
      >
        {/* AI Personality Question */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white p-6 rounded-2xl shadow-md mb-4"
        >
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <span className="bg-gradient-to-r from-[#4FC3F7] to-[#81D4FA] w-2 h-2 rounded-full"></span>
            {safeTexts.aiQuestionTitle}
          </h3>

          <label className="block text-gray-700 text-sm mb-2">
            {safeTexts.aiQuestionLabel}
          </label>
          <textarea
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value)}
            rows={4}
            className={`w-full px-4 py-3 bg-[#F2F4F8] rounded-xl outline-none focus:ring-2 focus:ring-[#4FC3F7] resize-none text-sm ${
              errors.lookingFor ? "ring-2 ring-red-400" : ""
            }`}
            placeholder={safeTexts.aiQuestionPlaceholder}
          />
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-gray-500">{safeTexts.aiQuestionHelper}</span>
            <span
              className={`${
                wordCount(lookingFor) > maxWords ? "text-red-500" : "text-gray-400"
              }`}
            >
              {wordCount(lookingFor)}/{maxWords} {safeTexts.wordUnit}
            </span>
          </div>
          {errors.lookingFor && (
            <p className="text-red-500 text-xs mt-1">{errors.lookingFor}</p>
          )}
        </motion.div>

        {/* Where should we look? */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white p-6 rounded-2xl shadow-md mb-4"
        >
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <span className="bg-gradient-to-r from-[#4FC3F7] to-[#81D4FA] w-2 h-2 rounded-full"></span>
            {safeTexts.regionSectionTitle}
          </h3>

          {/* Region */}
          <label className="block text-gray-700 text-sm mb-2">
            {safeTexts.regionLabel}
          </label>
          <div className="relative mb-3">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 bg-[#F2F4F8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4FC3F7] appearance-none ${
                errors.region ? "ring-2 ring-red-400" : ""
              }`}
              required
            >
              <option value="">{safeTexts.regionPlaceholder}</option>
              <option value="na">{safeTexts.regionNA}</option>
              <option value="sa">{safeTexts.regionSA}</option>
              <option value="eu">{safeTexts.regionEU}</option>
              <option value="as">{safeTexts.regionAS}</option>
              <option value="af">{safeTexts.regionAF}</option>
              <option value="oc">{safeTexts.regionOC}</option>
            </select>
          </div>
          {errors.region && (
            <p className="text-red-500 text-xs mb-2">{errors.region}</p>
          )}

          {/* Part of region */}
          <label className="block text-gray-700 text-sm mb-2">
            {safeTexts.regionPartLabel}
          </label>
          <input
            type="text"
            value={regionPart}
            onChange={(e) =>
              setRegionPart(e.target.value.slice(0, maxRegionPartChars))
            }
            className="w-full px-4 py-3 bg-[#F2F4F8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4FC3F7]"
            placeholder={safeTexts.regionPartPlaceholder}
          />
        </motion.div>

        {/* Submit */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
          <button
            type="submit"
            className="w-full max-w-md mx-auto block bg-gradient-to-r from-[#4FC3F7] to-[#81D4FA] text-white py-4 rounded-2xl hover:shadow-lg transition-shadow"
          >
            {safeTexts.submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
