"use client";

import { useState, ImgHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Globe, Heart, MessageCircle, Sparkles } from "lucide-react";
import type { Match } from "./DiscoverMatches";

/** Minimal ImageWithFallback (no external dependency) */
type ImageWithFallbackProps = ImgHTMLAttributes<HTMLImageElement> & { fallbackSrc?: string };
function ImageWithFallback({ src, fallbackSrc, ...rest }: ImageWithFallbackProps) {
  const [errored, setErrored] = useState(false);
  return (
    <img
      {...rest}
      src={
        !errored
          ? (src as string)
          : fallbackSrc ??
            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400'><rect width='100%' height='100%' fill='%23e5e7eb'/></svg>"
      }
      onError={() => setErrored(true)}
    />
  );
}

interface ProfileDetailsProps {
  match: Match;
  onBack: () => void;
  onStartChat: () => void;
}

export function ProfileDetails({ match, onBack, onStartChat }: ProfileDetailsProps) {
  return (
    <div className="min-h-screen bg-[#F2F4F8]">
      {/* Header Image */}
      <div className="relative">
        <ImageWithFallback src={match.image} alt={match.name} className="w-full h-96 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white"
          aria-label="Back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Name & Age */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-semibold">
              {match.name}, {match.age}
            </h2>
            <span className="text-xl">🇺🇸</span>
          </div>
          <div className="flex items-center gap-2 text-white/90 text-sm">
            <MapPin className="w-4 h-4" />
            {match.location}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-md mx-auto pb-32">
        {/* Compatibility Score */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-[#4FC3F7] to-[#81D4FA] p-6 rounded-3xl text-white text-center mb-4 -mt-8 relative z-10 shadow-lg"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-6 h-6" fill="white" />
            <span className="text-3xl">{match.compatibility}%</span>
          </div>
          <p className="text-white/90 text-sm">Compatibility Match</p>
        </motion.div>

        {/* AI Suggestion */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[#4FC3F7]/10 border border-[#4FC3F7]/20 p-4 rounded-2xl mb-6"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#4FC3F7] mt-0.5" />
            <div>
              <p className="text-[#4FC3F7] text-sm mb-1">AI Suggestion</p>
              <p className="text-gray-700 text-sm">
                “Ask about their favorite travel destination or share a recent adventure!”
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-md mb-4"
        >
          <h3 className="text-gray-900 mb-3">About</h3>
          <p className="text-gray-700">{match.bio}</p>
        </motion.div>

        {/* Reason */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl shadow-md mb-4"
        >
          <h3 className="text-gray-900 mb-3">Why You Match</h3>
          <p className="text-gray-700">{match.reason}</p>
        </motion.div>

        {/* Interests */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-2xl shadow-md mb-4"
        >
          <h3 className="text-gray-900 mb-3">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {match.interests.map((interest) => (
              <span
                key={interest}
                className="bg-[#4FC3F7]/10 text-[#4FC3F7] px-4 py-2 rounded-full text-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Languages */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-2xl shadow-md"
        >
          <h3 className="text-gray-900 mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#4FC3F7]" />
            Languages
          </h3>
          <div className="flex flex-wrap gap-2">
            {match.languages.map((language) => (
              <span key={language} className="bg-[#F2F4F8] text-gray-700 px-4 py-2 rounded-full text-sm">
                {language}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
        <button
          onClick={onStartChat}
          className="w-full max-w-md mx-auto block bg-gradient-to-r from-[#4FC3F7] to-[#81D4FA] text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
        >
          <MessageCircle className="w-5 h-5" />
          Start Chat
        </button>
      </div>
    </div>
  );
}
