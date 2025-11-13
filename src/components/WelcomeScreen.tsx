// C:\Users\Yummie03\Desktop\datingapp\src\components\WelcomeScreen.tsx
"use client";

import { Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "../hooks/useTranslation";

const defaultTexts = {
  headline: "Find your match. Sync your soul.",
  subtext: "AI-powered compatibility for real connection.",
  cta: "Get Started",
  footer: "Powered by AI · Privacy First",
};

export default function WelcomeScreen() {
  const router = useRouter();

  const { texts, loading } = useTranslation(defaultTexts, "welcomeScreen");

  // Defensive fallback
  const safeTexts =
    !texts || Object.keys(texts).length === 0 || !("headline" in texts)
      ? defaultTexts
      : texts;

  const handleGetStarted = () => router.push("/signup");

  if (loading) {
    // PRO LEVEL PURE SKELETON (no text at all)
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#4FC3F7] to-[#81D4FA] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center text-center w-full max-w-md"
        >
          {/* Icon bubble */}
          <div className="relative mb-8 inline-block">
            <motion.div
              initial={{ scale: 0.85, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/90 p-8 rounded-full relative shadow-lg animate-pulse"
            >
              <Heart className="w-16 h-16 text-[#4FC3F7]" />
              <Sparkles className="w-6 h-6 text-[#4FC3F7] absolute -top-1 -right-1" />
            </motion.div>
          </div>

          {/* Skeleton blocks */}
          <div className="w-full max-w-sm space-y-3">
            <div className="h-6 rounded-full bg-white/40 animate-pulse" />
            <div className="h-4 rounded-full bg-white/30 w-5/6 mx-auto animate-pulse" />
            <div className="h-4 rounded-full bg-white/20 w-3/4 mx-auto animate-pulse" />
            <div className="mt-8 h-12 rounded-2xl bg-white/60 w-40 mx-auto animate-pulse" />
            <div className="mt-10 h-3 rounded-full bg-white/25 w-1/2 mx-auto animate-pulse" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4FC3F7] to-[#81D4FA] flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="relative mb-8 inline-block">
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(79, 195, 247, 0.5)",
                "0 0 40px rgba(79, 195, 247, 0.8)",
                "0 0 20px rgba(79, 195, 247, 0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-white p-8 rounded-full relative"
          >
            <Heart className="w-16 h-16 text-[#4FC3F7]" fill="#4FC3F7" />
            <Sparkles className="w-6 h-6 text-[#4FC3F7] absolute -top-1 -right-1" />
          </motion.div>
        </div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white mb-3 text-3xl font-semibold"
        >
          {safeTexts.headline}
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/90 mb-12 max-w-sm mx-auto"
        >
          {safeTexts.subtext}
        </motion.p>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGetStarted}
          className="bg-white text-[#4FC3F7] px-12 py-4 rounded-2xl shadow-lg font-medium"
        >
          {safeTexts.cta}
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-white/70 text-sm mt-16"
        >
          {safeTexts.footer}
        </motion.p>
      </motion.div>
    </div>
  );
}
