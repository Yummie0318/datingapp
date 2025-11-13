// C:\Users\Yummie03\Desktop\datingapp\src\components\SettingsScreen.tsx
"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Trash2,
  Shield,
  Zap,
  ChevronRight,
  Bell,
  Globe,
  Eye,
} from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

export interface SettingsScreenProps {
  onBack: () => void;
  onUpgrade: () => void;
}

// Default English texts (will be translated automatically)
const defaultTexts = {
  headerTitle: "Settings",

  // Sections
  accountSectionTitle: "Account",
  dataSectionTitle: "Data & Privacy",
  premiumSectionTitle: "Premium",

  // Account rows
  notificationsLabel: "Notifications",
  languageLabel: "Language",
  privacyLabel: "Privacy",

  // Data rows
  exportDataLabel: "Export Compatibility Report",
  exportDataSubtitle: "Download as PDF/Text",
  deleteDataLabel: "Delete My Data",
  deleteDataSubtitle: "Permanently remove all data",
  privacyPermLabel: "Privacy & Permissions",
  privacyPermSubtitle: "Manage app permissions",

  // Premium
  premiumTitle: "Upgrade to Deep AI Research",
  premiumSubtitle: "Unlock unlimited energy and advanced AI matching",
  premiumCta: "Learn More",

  // Footer
  footerVersion: "SoulSyncAI v1.0",
  footerTagline: "Privacy First. Data Secure.",

  // Dialogs / Alerts
  alertExport: "Your compatibility report will be downloaded as PDF",
  confirmDelete:
    "Are you sure you want to delete all your data? This action cannot be undone.",
  alertDeleted: "Your data has been deleted",
};

export function SettingsScreen({ onBack, onUpgrade }: SettingsScreenProps) {
  // i18n
  const { texts, loading: i18nLoading } = useTranslation(
    defaultTexts,
    "settingsScreen"
  );
  const safeTexts =
    !texts || Object.keys(texts).length === 0 || !("headerTitle" in texts)
      ? defaultTexts
      : (texts as typeof defaultTexts);

  const handleExportData = () => {
    alert(safeTexts.alertExport);
  };

  const handleDeleteData = () => {
    if (confirm(safeTexts.confirmDelete)) {
      alert(safeTexts.alertDeleted);
    }
  };

  // ---------- HARD SKELETON WHILE LOADING TRANSLATIONS ----------
  if (i18nLoading) {
    return (
      <div className="min-h-screen bg-[#F2F4F8] flex flex-col">
        {/* Header skeleton */}
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center gap-4 max-w-md mx-auto">
            <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-5 w-24 rounded-full bg-gray-200 animate-pulse" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="flex-1 p-6 max-w-md mx-auto w-full space-y-6">
          {/* Section skeletons */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="space-y-3"
            >
              <div className="h-4 w-24 bg-gray-200 rounded-full animate-pulse" />
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="h-14 bg-gray-100 animate-pulse" />
                <div className="h-14 bg-gray-100 animate-pulse border-t border-gray-100" />
                <div className="h-14 bg-gray-100 animate-pulse border-t border-gray-100" />
              </div>
            </motion.div>
          ))}

          {/* Footer skeleton */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center space-y-2 mt-4"
          >
            <div className="h-4 w-32 mx-auto bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 w-40 mx-auto bg-gray-200 rounded-full animate-pulse" />
          </motion.div>
        </div>
      </div>
    );
  }

  // ---------- REAL UI ----------
  return (
    <div className="min-h-screen bg-[#F2F4F8] flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center gap-4 max-w-md mx-auto">
          <button
            onClick={onBack}
            className="text-[#4FC3F7]"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-[#4FC3F7]">{safeTexts.headerTitle}</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 max-w-md mx-auto w-full">
        {/* Account Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <h3 className="text-gray-600 text-sm mb-3 px-2">
            {safeTexts.accountSectionTitle}
          </h3>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-[#4FC3F7]" />
                <span className="text-gray-700">
                  {safeTexts.notificationsLabel}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#4FC3F7]" />
                <span className="text-gray-700">
                  {safeTexts.languageLabel}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-[#4FC3F7]" />
                <span className="text-gray-700">
                  {safeTexts.privacyLabel}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </motion.div>

        {/* Data Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h3 className="text-gray-600 text-sm mb-3 px-2">
            {safeTexts.dataSectionTitle}
          </h3>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <button
              onClick={handleExportData}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-[#4FC3F7]" />
                <div className="text-left">
                  <p className="text-gray-700">
                    {safeTexts.exportDataLabel}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {safeTexts.exportDataSubtitle}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={handleDeleteData}
              className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors border-b border-gray-100"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-red-500" />
                <div className="text-left">
                  <p className="text-red-500">
                    {safeTexts.deleteDataLabel}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {safeTexts.deleteDataSubtitle}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#4FC3F7]" />
                <div className="text-left">
                  <p className="text-gray-700">
                    {safeTexts.privacyPermLabel}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {safeTexts.privacyPermSubtitle}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </motion.div>

        {/* Premium Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h3 className="text-gray-600 text-sm mb-3 px-2">
            {safeTexts.premiumSectionTitle}
          </h3>
          <button
            onClick={onUpgrade}
            className="w-full bg-gradient-to-r from-[#4FC3F7] to-[#81D4FA] rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Zap className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="mb-2">{safeTexts.premiumTitle}</h3>
                <p className="text-white/90 text-sm mb-3">
                  {safeTexts.premiumSubtitle}
                </p>
                <div className="flex items-center gap-2">
                  <span>{safeTexts.premiumCta}</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center space-y-2"
        >
          <p className="text-gray-500 text-sm">
            {safeTexts.footerVersion}
          </p>
          <p className="text-[#4FC3F7] text-sm">
            {safeTexts.footerTagline}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
