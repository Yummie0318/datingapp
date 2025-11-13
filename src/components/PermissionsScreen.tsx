// C:\Users\Yummie03\Desktop\datingapp\src\components\PermissionsScreen.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, MapPin, Brain, Settings } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

export interface PermissionsData {
  camera: boolean;
  location: boolean;
  behaviorAnalysis: boolean;
}

interface PermissionsScreenProps {
  onBack: () => void;
  onContinue: (permissions: PermissionsData) => void;
}

type PermState = "granted" | "denied" | "prompt" | "unsupported";
type ExtendedPermissionName = PermissionName | "camera" | "microphone";

const LS_KEY = "permissions.v1";

// Default English texts (will be translated automatically)
const defaultTexts = {
  headline: "Let's personalize your experience.",
  subtext: "We need a few permissions to find your perfect match.",

  cameraTitle: "Camera & Microphone",
  cameraDesc: "For profile photos and voice samples",
  locationTitle: "Location",
  locationDesc: "To find matches near you",
  behaviorTitle: "Behavior Analysis",
  behaviorDesc: "AI learns your preferences for better matches",

  statusGranted: "granted",
  statusDenied: "denied",
  statusPrompt: "prompt",

  consentLabel: "I give AI permission to analyze and personalize my experience.",
  customizeShow: "Customize Permissions",
  customizeHide: "Hide Permissions",
  continue: "Continue",
  requesting: "Requesting…",
  revokeNotice: "You can revoke permissions anytime in your browser settings.",

  customizeTitle: "Customize Permissions",
  customizeClose: "Close",
  cameraLabelShort: "Camera & Mic",
  locationLabelShort: "Location",
  behaviorLabelShort: "Behavior Analysis",
  saveChanges: "Save Changes",

  blockedMsg:
    "Some permissions were blocked by the browser. You can enable them in your browser settings at any time.",
};

export function PermissionsScreen({ onBack, onContinue }: PermissionsScreenProps) {
  const [permissions, setPermissions] = useState<PermissionsData>({
    camera: true,
    location: true,
    behaviorAnalysis: true,
  });

  const [permStatus, setPermStatus] = useState<{
    camera: PermState;
    microphone: PermState;
    location: PermState;
  }>({
    camera: "prompt",
    microphone: "prompt",
    location: "prompt",
  });

  const [accepted, setAccepted] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [loading, setLoading] = useState(false); // permission request loading
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // 🔠 Translations for this screen
  const { texts, loading: i18nLoading } = useTranslation(defaultTexts, "permissionsScreen");

  const safeTexts =
    !texts || Object.keys(texts).length === 0 || !("headline" in texts)
      ? defaultTexts
      : texts;

  // Load saved decision + probe browser permission states
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as PermissionsData;
        setPermissions((prev) => ({ ...prev, ...saved }));
      }
    } catch {
      // ignore
    }

    const query = async () => {
      const navAny: any =
        typeof navigator !== "undefined" ? (navigator as any) : undefined;
      const canQuery = !!navAny?.permissions?.query;

      if (!canQuery) {
        setPermStatus({
          camera: "unsupported",
          microphone: "unsupported",
          location: "unsupported",
        });
        return;
      }

      const ask = async (name: ExtendedPermissionName): Promise<PermState> => {
        try {
          const status = await navAny.permissions.query({ name } as any);
          return (status?.state ?? "prompt") as PermState;
        } catch {
          return "unsupported";
        }
      };

      const [geo, cam, mic] = await Promise.all([
        ask("geolocation"),
        ask("camera"),
        ask("microphone"),
      ]);

      setPermStatus({ camera: cam, microphone: mic, location: geo });
    };

    query();
  }, []);

  // Request location permission
  const requestLocation = async (): Promise<boolean> => {
    if (!permissions.location) return false;
    if (typeof navigator === "undefined" || !navigator.geolocation) return false;

    const ok = await new Promise<boolean>((resolve) => {
      try {
        navigator.geolocation.getCurrentPosition(
          () => resolve(true),
          () => resolve(false),
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } catch {
        resolve(false);
      }
    });
    return ok;
  };

  // Request camera/mic
  const requestCameraMic = async (): Promise<boolean> => {
    if (!permissions.camera) return false;
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia)
      return false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      stream.getTracks().forEach((t) => t.stop());
      return true;
    } catch {
      return false;
    }
  };

  const persistAndContinue = (data: PermissionsData) => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch {}
    onContinue(data);
  };

  const handleContinue = async () => {
    setErrMsg(null);
    if (!accepted) return;

    setLoading(true);

    const results: PermissionsData = { ...permissions };
    const locOk = await requestLocation();
    results.location = permissions.location ? locOk : false;

    const camOk = await requestCameraMic();
    results.camera = permissions.camera ? camOk : false;

    results.behaviorAnalysis = !!permissions.behaviorAnalysis;

    setLoading(false);

    if ((permissions.location && !locOk) || (permissions.camera && !camOk)) {
      setErrMsg(safeTexts.blockedMsg);
    }

    persistAndContinue(results);
  };

  // 🔹 PRO-LEVEL SKELETON LOADER (for translations)
  if (i18nLoading) {
    return (
      <div className="min-h-screen bg-[#F2F4F8] flex flex-col p-6">
        {/* Back button skeleton */}
        <div className="self-start mb-6">
          <div className="h-6 w-6 rounded-full bg-[#d0e6f2] animate-pulse" />
        </div>

        <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
          {/* Header skeleton */}
          <div className="text-center mb-8">
            <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto mb-3 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse" />
          </div>

          {/* Permission cards skeleton */}
          <div className="space-y-4 mb-6">
            <div className="bg-white p-5 rounded-2xl shadow-md animate-pulse h-20" />
            <div className="bg-white p-5 rounded-2xl shadow-md animate-pulse h-20" />
            <div className="bg-white p-5 rounded-2xl shadow-md animate-pulse h-20" />
          </div>

          {/* Consent + button skeleton */}
          <div className="bg-white p-5 rounded-2xl shadow-md mb-6 animate-pulse h-24" />

          <div className="space-y-3">
            <div className="h-12 bg-gradient-to-r from-[#c2e7f9] to-[#b0ddf5] rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const cameraStatusLabel =
    permStatus.camera === "granted" || permStatus.microphone === "granted"
      ? safeTexts.statusGranted
      : permStatus.camera === "denied" || permStatus.microphone === "denied"
      ? safeTexts.statusDenied
      : safeTexts.statusPrompt;

  return (
    <div className="min-h-screen bg-[#F2F4F8] flex flex-col p-6">
      <button onClick={onBack} className="self-start mb-6 text-[#4FC3F7]">
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h2 className="text-[#4FC3F7] mb-2">{safeTexts.headline}</h2>
          <p className="text-gray-600">{safeTexts.subtext}</p>
        </motion.div>

        {/* Permission Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 mb-6"
        >
          {/* Camera */}
          <div className="bg-white p-5 rounded-2xl shadow-md">
            <div className="flex items-start gap-4">
              <div className="bg-[#4FC3F7]/10 p-3 rounded-xl">
                <Camera className="w-6 h-6 text-[#4FC3F7]" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">{safeTexts.cameraTitle}</h3>
                <p className="text-gray-500 text-sm">
                  {safeTexts.cameraDesc}
                  {permStatus.camera !== "unsupported" && (
                    <span className="ml-1 text-xs text-gray-400">
                      ({cameraStatusLabel})
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white p-5 rounded-2xl shadow-md">
            <div className="flex items-start gap-4">
              <div className="bg-[#4FC3F7]/10 p-3 rounded-xl">
                <MapPin className="w-6 h-6 text-[#4FC3F7]" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">{safeTexts.locationTitle}</h3>
                <p className="text-gray-500 text-sm">
                  {safeTexts.locationDesc}
                  {permStatus.location !== "unsupported" && (
                    <span className="ml-1 text-xs text-gray-400">
                      ({permStatus.location})
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Behavior Analysis */}
          <div className="bg-white p-5 rounded-2xl shadow-md">
            <div className="flex items-start gap-4">
              <div className="bg-[#4FC3F7]/10 p-3 rounded-xl">
                <Brain className="w-6 h-6 text-[#4FC3F7]" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">{safeTexts.behaviorTitle}</h3>
                <p className="text-gray-500 text-sm">{safeTexts.behaviorDesc}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Consent + single Customize button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-5 rounded-2xl shadow-md mb-6"
        >
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="w-5 h-5 mt-0.5 accent-[#4FC3F7]"
            />
            <span className="text-gray-700 text-sm">
              {safeTexts.consentLabel}
            </span>
          </label>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowCustomize(!showCustomize)}
              className="inline-flex items-center gap-2 text-[#4FC3F7] text-sm font-medium"
            >
              <Settings className="w-5 h-5" />
              {showCustomize ? safeTexts.customizeHide : safeTexts.customizeShow}
            </button>
          </div>
        </motion.div>

        {errMsg && (
          <p className="text-center text-sm text-red-500 mb-2">{errMsg}</p>
        )}

        {/* Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <button
            onClick={handleContinue}
            disabled={!accepted || loading}
            className="w-full bg-gradient-to-r from-[#4FC3F7] to-[#81D4FA] text-white py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
          >
            {loading ? safeTexts.requesting : safeTexts.continue}
          </button>
        </motion.div>

        <p className="text-gray-500 text-sm text-center mt-6">
          {safeTexts.revokeNotice}
        </p>
      </div>

      {/* Slide-over customization (the only place to toggle) */}
      {showCustomize && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          className="fixed inset-0 bg-white z-50 p-6 overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#4FC3F7]">{safeTexts.customizeTitle}</h3>
            <button
              onClick={() => setShowCustomize(false)}
              className="text-gray-400"
            >
              {safeTexts.customizeClose}
            </button>
          </div>

          <div className="space-y-4">
            {[
              {
                key: "camera",
                label: safeTexts.cameraLabelShort,
                icon: <Camera className="w-5 h-5 text-[#4FC3F7]" />,
              },
              {
                key: "location",
                label: safeTexts.locationLabelShort,
                icon: <MapPin className="w-5 h-5 text-[#4FC3F7]" />,
              },
              {
                key: "behaviorAnalysis",
                label: safeTexts.behaviorLabelShort,
                icon: <Brain className="w-5 h-5 text-[#4FC3F7]" />,
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 bg-[#F2F4F8] rounded-xl"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-gray-700">{item.label}</span>
                </div>
                <input
                  type="checkbox"
                  checked={permissions[item.key as keyof PermissionsData]}
                  onChange={(e) =>
                    setPermissions({
                      ...permissions,
                      [item.key]: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-[#4FC3F7]"
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowCustomize(false)}
            className="w-full bg-gradient-to-r from-[#4FC3F7] to-[#81D4FA] text-white py-4 rounded-2xl mt-6"
          >
            {safeTexts.saveChanges}
          </button>
        </motion.div>
      )}
    </div>
  );
}
