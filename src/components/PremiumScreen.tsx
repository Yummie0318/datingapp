// C:\Users\Yummie03\Desktop\datingapp\src\components\PremiumScreen.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Zap, Infinity, Heart, Sparkles, Check } from "lucide-react";
import { PaymentModal } from "@/components/PaymentModal";
import { useTranslation } from "../hooks/useTranslation";

export interface PremiumScreenProps {
  onBack: () => void;
  onPurchase: (amount: number, type: "energy" | "deep") => void;
}

type PlanType = "energy" | "deep";

// Default English texts (all strings – OK for useTranslation)
const defaultTexts = {
  // Header
  backAria: "Back",
  headerTitle: "Upgrade Your Experience",
  headerSubtitle: "Find your perfect match faster with AI-powered insights",

  // Energy Pack
  energyPlanTitle: "Energy Pack",
  energyPlanSubtitle: "Get 10 extra matches today",
  energyPlanPrice: "$9.99",
  energyPlanPriceNote: "one-time",
  energyFeat1: "10 additional matches",
  energyFeat2: "24-hour access",
  energyButtonLabel: "Buy Energy Pack",

  // Deep AI plan
  deepBadge: "Most Popular",
  deepPlanTitle: "Deep AI Research",
  deepPlanSubtitle: "Full-power AI matching",
  deepPlanPrice: "$1000",
  deepPlanPriceNote: "one-time",
  deepFeature1: "Unlimited daily matches",
  deepFeature2: "Advanced AI compatibility analysis",
  deepFeature3: "Priority matching algorithm",
  deepFeature4: "See who liked you",
  deepFeature5: "Unlimited rewinds",
  deepFeature6: "Ad-free experience",
  deepFeature7: "Premium badges",
  deepFeature8: "Deep personality insights",
  revenueSplit: "Revenue: 20% App · 80% AI Provider",
  deepButtonLabel: "Get Deep AI Research",

  // Footer / guarantees
  guaranteeTitle: "30-day money-back guarantee",
  guaranteeSubtitle: "Cancel anytime · Secure payment",
};

export function PremiumScreen({ onBack, onPurchase }: PremiumScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);

  // payment modal state
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentType, setPaymentType] = useState<PlanType | null>(null);

  // i18n
  const { texts, loading: i18nLoading } = useTranslation(
    defaultTexts,
    "premiumScreen"
  );

  const safeTexts: typeof defaultTexts =
    !texts || Object.keys(texts).length === 0 || !("headerTitle" in texts)
      ? defaultTexts
      : (texts as typeof defaultTexts);

  const deepFeatures = [
    safeTexts.deepFeature1,
    safeTexts.deepFeature2,
    safeTexts.deepFeature3,
    safeTexts.deepFeature4,
    safeTexts.deepFeature5,
    safeTexts.deepFeature6,
    safeTexts.deepFeature7,
    safeTexts.deepFeature8,
  ];

  const openPayment = (amount: number, type: PlanType) => {
    setPaymentAmount(amount);
    setPaymentType(type);
    setShowPayment(true);
  };

  const handleSuccess = () => {
    if (paymentType) {
      onPurchase(paymentAmount, paymentType);
    }
    setShowPayment(false);
    setPaymentType(null);
  };

  // ---------- SKELETON WHILE TRANSLATIONS LOAD ----------
  if (i18nLoading) {
    return (
      <div className="min-h-screen bg-[#F2F4F8] flex flex-col">
        <div className="bg-gradient-to-r from-[#4FC3F7] to-[#81D4FA] p-6 text-white">
          <div className="max-w-md mx-auto">
            <div className="w-6 h-6 rounded-full bg-white/40 animate-pulse mb-4" />
            <div className="h-6 w-48 bg-white/60 rounded-full animate-pulse mb-2" />
            <div className="h-4 w-64 bg-white/40 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="flex-1 p-6 max-w-md mx-auto w-full -mt-6 space-y-4">
          <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4 animate-pulse">
            <div className="h-5 w-32 bg-gray-200 rounded-full" />
            <div className="h-4 w-40 bg-gray-100 rounded-full" />
            <div className="h-10 w-full bg-gray-200 rounded-2xl" />
          </div>
          <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4 animate-pulse">
            <div className="h-5 w-40 bg-gray-200 rounded-full" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-4 w-full bg-gray-100 rounded-full" />
              <div className="h-4 w-full bg-gray-100 rounded-full" />
              <div className="h-4 w-full bg-gray-100 rounded-full" />
              <div className="h-4 w-full bg-gray-100 rounded-full" />
            </div>
            <div className="h-10 w-full bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // ---------- REAL UI ----------
  return (
    <div className="min-h-screen bg-[#F2F4F8] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4FC3F7] to-[#81D4FA] p-6 text-white">
        <button
          onClick={onBack}
          className="mb-6"
          aria-label={safeTexts.backAria}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-4"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <Sparkles className="w-10 h-10" />
            </div>
          </motion.div>
          <h2 className="mb-2">{safeTexts.headerTitle}</h2>
          <p className="text-white/90">{safeTexts.headerSubtitle}</p>
        </div>
      </div>

      {/* Plans */}
      <div className="flex-1 p-6 max-w-md mx-auto w-full -mt-6">
        {/* Energy Pack */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`bg-white rounded-3xl shadow-lg p-6 mb-4 border-2 ${
            selectedPlan === "energy" ? "border-amber-400" : "border-transparent"
          }`}
          onClick={() => setSelectedPlan("energy")}
          role="button"
          aria-pressed={selectedPlan === "energy"}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-6 h-6 text-amber-500" fill="currentColor" />
                <h3 className="text-gray-900">{safeTexts.energyPlanTitle}</h3>
              </div>
              <p className="text-gray-600 text-sm">
                {safeTexts.energyPlanSubtitle}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl text-[#4FC3F7]">
                {safeTexts.energyPlanPrice}
              </p>
              <p className="text-gray-400 text-xs">
                {safeTexts.energyPlanPriceNote}
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <Check className="w-4 h-4 text-[#4FC3F7]" />
              <span>{safeTexts.energyFeat1}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <Check className="w-4 h-4 text-[#4FC3F7]" />
              <span>{safeTexts.energyFeat2}</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              openPayment(9.99, "energy");
            }}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 rounded-2xl hover:shadow-lg transition-shadow"
          >
            {safeTexts.energyButtonLabel}
          </button>
        </motion.div>

        {/* Deep AI Research */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`bg-gradient-to-br from-[#4FC3F7] to-[#81D4FA] rounded-3xl shadow-xl p-6 text-white relative overflow-hidden border-2 ${
            selectedPlan === "deep" ? "border-white/60" : "border-transparent"
          }`}
          onClick={() => setSelectedPlan("deep")}
          role="button"
          aria-pressed={selectedPlan === "deep"}
        >
          {/* Badge */}
          <div className="absolute -top-2 -right-2 bg-white text-[#4FC3F7] px-4 py-1 rounded-full text-xs rotate-12 shadow-lg">
            {safeTexts.deepBadge}
          </div>

          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Infinity className="w-6 h-6" />
                <h3>{safeTexts.deepPlanTitle}</h3>
              </div>
              <p className="text-white/90 text-sm">
                {safeTexts.deepPlanSubtitle}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl">{safeTexts.deepPlanPrice}</p>
              <p className="text-white/70 text-xs">
                {safeTexts.deepPlanPriceNote}
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-3">
              {deepFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Split Info */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 mb-6">
            <p className="text-white/80 text-xs text-center">
              {safeTexts.revenueSplit}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              openPayment(1000, "deep");
            }}
            className="w-full bg-white text-[#4FC3F7] py-4 rounded-2xl hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5" />
            <span>{safeTexts.deepButtonLabel}</span>
          </button>

          {/* Decorative Elements */}
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/5 rounded-full" />
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
        </motion.div>

        {/* Money-back guarantee */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-6 space-y-2"
        >
          <p className="text-gray-600 text-sm">{safeTexts.guaranteeTitle}</p>
          <p className="text-gray-400 text-xs">
            {safeTexts.guaranteeSubtitle}
          </p>
        </motion.div>
      </div>

      {/* Payment Modal */}
      {showPayment && paymentType && (
        <PaymentModal
          amount={paymentAmount}
          type={paymentType}
          onClose={() => setShowPayment(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
