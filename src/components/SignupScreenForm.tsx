// C:\Users\Users\Yummie03\Desktop\datingapp\src\components\SignupScreenForm.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, MapPin } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

// Default English texts (will be translated automatically)
const defaultTexts = {
  chooseHow: "How would you like to start?",
  anonymousOption: "Explore anonymously",
  fullOption: "Create an account",
  exploreLaterNote: "You can create an account later to save progress and boost trust.",

  username: "Username *",
  email: "Email *",
  password: "Password *",
  region: "Region *",

  // placeholders (also translated)
  usernamePlaceholder: "your username",
  emailPlaceholder: "you@email.com",
  passwordPlaceholder: "••••••••",

  selectRegion: "Select your region",
  northAmerica: "North America",
  southAmerica: "South America",
  europe: "Europe",
  asia: "Asia",
  africa: "Africa",
  oceania: "Oceania",

  continue: "Continue",
  processing: "Processing...",
};

export interface SignupData {
  username?: string;
  email?: string;
  password?: string;
  region?: string;
  signupType: "anonymous" | "full";
}

interface SignupScreenFormProps {
  onBack: () => void;
  onContinue: (data: SignupData) => void;
}

export function SignupScreenForm({ onBack, onContinue }: SignupScreenFormProps) {
  const [signupType, setSignupType] = useState<"anonymous" | "full" | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // IMPORTANT: give this screen its own namespace
  const { texts, loading } = useTranslation(defaultTexts, "signupScreen");

  // Defensive: if translations somehow come back with wrong shape, fallback to defaultTexts
  const safeTexts =
    !texts || Object.keys(texts).length === 0 || !("chooseHow" in texts)
      ? (() => {
          console.warn(
            "[SignupScreenForm] Missing or mismatched translations, falling back to defaultTexts. Received:",
            texts
          );
          return defaultTexts;
        })()
      : texts;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setSubmitting(true);

      if (signupType === "anonymous") {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ signupType: "anonymous" }),
        });

        if (!res.ok) throw new Error("Failed to create anonymous user.");
        await res.json();
        onContinue({ signupType: "anonymous" });
        return;
      }

      if (signupType === "full") {
        if (!username || !email || !password || !region) return;

        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ signupType: "full", username, email, password, region }),
        });

        if (!res.ok) throw new Error("Failed to sign up.");
        await res.json();
        onContinue({ signupType: "full", username, email, password, region });
        return;
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error.");
    } finally {
      setSubmitting(false);
    }
  };

  // 🔹 PRO-LEVEL SKELETON LOADER (no text, just shimmering UI)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F4F8] flex flex-col p-6">
        {/* Back button skeleton */}
        <div className="self-start mb-6">
          <div className="h-6 w-6 rounded-full bg-[#d0e6f2] animate-pulse" />
        </div>

        <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-md space-y-4 animate-pulse"
          >
            {/* Title skeleton */}
            <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto mb-4" />

            {/* Option cards skeleton */}
            <div className="space-y-4">
              <div className="h-16 bg-gray-100 rounded-2xl" />
              <div className="h-16 bg-gray-100 rounded-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Step 1: Choose signup type
  if (!signupType) {
    return (
      <div className="min-h-screen bg-[#F2F4F8] flex flex-col p-6">
        <button onClick={onBack} className="self-start mb-6 text-[#4FC3F7]">
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-8"
          >
            <h2 className="text-[#4FC3F7] mb-2">{safeTexts.chooseHow}</h2>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSignupType("anonymous")}
            className="bg-white p-6 rounded-2xl shadow-md mb-4 text-left hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-[#4FC3F7]/10 p-3 rounded-xl">
                <User className="w-6 h-6 text-[#4FC3F7]" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">{safeTexts.anonymousOption}</h3>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSignupType("full")}
            className="bg-white p-6 rounded-2xl shadow-md text-left hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-[#4FC3F7] to-[#81D4FA] p-3 rounded-xl">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">{safeTexts.fullOption}</h3>
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    );
  }

  // Step 2: Full signup form
  return (
    <div className="min-h-screen bg-[#F2F4F8] flex flex-col p-6">
      <button onClick={() => setSignupType(null)} className="self-start mb-6 text-[#4FC3F7]">
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-md space-y-4"
        >
          {signupType === "full" ? (
            <>
              {/* Username */}
              <div className="relative">
                <label className="block text-gray-700 mb-2 text-sm">{safeTexts.username}</label>
                <User className="absolute left-3 top-[46px] w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#F2F4F8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4FC3F7]"
                  placeholder={safeTexts.usernamePlaceholder}
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <label className="block text-gray-700 mb-2 text-sm">{safeTexts.email}</label>
                <Mail className="absolute left-3 top-[46px] w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#F2F4F8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4FC3F7]"
                  placeholder={safeTexts.emailPlaceholder}
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-gray-700 mb-2 text-sm">{safeTexts.password}</label>
                <Lock className="absolute left-3 top-[46px] w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-[#F2F4F8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4FC3F7]"
                  placeholder={safeTexts.passwordPlaceholder}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[46px] text-gray-400 hover:text-[#4FC3F7]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Region */}
              <div className="relative">
                <label className="block text-gray-700 mb-2 text-sm">{safeTexts.region}</label>
                <MapPin className="absolute left-3 top-[46px] w-5 h-5 text-gray-400" />
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#F2F4F8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4FC3F7]"
                  required
                >
                  <option value="">{safeTexts.selectRegion}</option>
                  <option value="na">{safeTexts.northAmerica}</option>
                  <option value="sa">{safeTexts.southAmerica}</option>
                  <option value="eu">{safeTexts.europe}</option>
                  <option value="as">{safeTexts.asia}</option>
                  <option value="af">{safeTexts.africa}</option>
                  <option value="oc">{safeTexts.oceania}</option>
                </select>
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-600">{safeTexts.exploreLaterNote}</div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-[#4FC3F7] to-[#81D4FA] text-white py-4 rounded-2xl mt-6 hover:shadow-lg transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? safeTexts.processing : safeTexts.continue}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
