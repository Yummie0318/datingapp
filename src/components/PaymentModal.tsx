// C:\Users\Yummie03\Desktop\datingapp\src\components\PaymentModal.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, CreditCard, Smartphone } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

export interface PaymentModalProps {
  amount: number;
  type: "energy" | "deep" | string; // flexible for future plans
  onClose: () => void;
  onSuccess: () => void;
}

type Method = "card" | "paypal" | "apple" | "google" | "gcash";

// All strings are plain string values (good for useTranslation)
const defaultTexts = {
  headerTitle: "Complete Payment",
  closeAria: "Close payment",

  amountLabel: "Total Amount",
  planTypeLabel: "Plan type",

  selectMethodLabel: "Select Payment Method",

  methodCardTitle: "Credit / Debit Card",
  methodCardSubtitle: "Visa, Mastercard, Amex",

  methodGCashTitle: "GCash",
  methodGCashSubtitle: "Pay via mobile number",

  methodPaypalTitle: "PayPal",
  methodPaypalSubtitle: "Fast & secure",

  methodAppleTitle: "Apple Pay",
  methodAppleSubtitle: "One-tap payment",

  methodGoogleTitle: "Google Pay",
  methodGoogleSubtitle: "Quick & easy",

  cardNumberPlaceholder: "Card Number",
  cardExpiryPlaceholder: "MM/YY",
  cardCvvPlaceholder: "CVV",

  gcashLabel: "GCash mobile number",
  gcashPlaceholder: "e.g. 09XXXXXXXXX or +639XXXXXXXXX",
  gcashInfo: "You’ll be prompted in your GCash app to confirm the payment.",

  payWithGCashCta: "Pay with GCash",
  payWithAppleCta: "Pay with Apple Pay",
  payWithGoogleCta: "Pay with Google Pay",
  payWithPaypalCta: "Pay with PayPal",
  payWithCardCta: "Pay ${amount}",
  selectMethodCta: "Select a method",

  cancelLabel: "Cancel",
  processingLabel: "Processing...",

  secureNote: "🔒 Secure payment · Your information is encrypted",
};

export function PaymentModal({
  amount,
  type,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<Method | null>(null);
  const [processing, setProcessing] = useState(false);

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // GCash fields
  const [gcashNumber, setGcashNumber] = useState("");

  // i18n
  const { texts, loading: i18nLoading } = useTranslation(
    defaultTexts,
    "paymentModal"
  );
  const safeTexts: typeof defaultTexts =
    !texts || Object.keys(texts).length === 0 || !("headerTitle" in texts)
      ? defaultTexts
      : (texts as typeof defaultTexts);

  const prettyType = String(type).replace("-", " ");
  const isCard = paymentMethod === "card";
  const isGCash = paymentMethod === "gcash";

  const canSubmit =
    !!paymentMethod &&
    !processing &&
    (!isCard ||
      (cardNumber.replace(/\s/g, "").length >= 13 &&
        cardExpiry.length >= 4 &&
        cardCvv.length >= 3)) &&
    (!isGCash || isValidPHMobile(gcashNumber));

  function isValidPHMobile(val: string) {
    // Accepts: 09XXXXXXXXX (11), 9XXXXXXXXX (10), +639XXXXXXXXX (13)
    const v = val.trim();
    return /^(09\d{9}|9\d{9}|\+639\d{9})$/.test(v);
  }

  const handlePayment = () => {
    if (!canSubmit) return;
    setProcessing(true);

    // Simulated payment flow
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 1400);
  };

  const MethodButton = ({
    value,
    title,
    subtitle,
    left,
  }: {
    value: Method;
    title: string;
    subtitle: string;
    left: React.ReactNode;
  }) => {
    const selected = paymentMethod === value;
    return (
      <button
        type="button"
        onClick={() => !processing && setPaymentMethod(value)}
        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
          selected
            ? "border-[#4FC3F7] bg-[#4FC3F7]/10"
            : "border-gray-200 hover:border-[#4FC3F7]/50"
        }`}
        aria-pressed={selected}
        disabled={processing}
      >
        {left}
        <div className="flex-1 text-left">
          <p className="text-gray-900">{title}</p>
          <p className="text-gray-500 text-xs">{subtitle}</p>
        </div>
        {selected && (
          <div className="w-5 h-5 bg-[#4FC3F7] rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        )}
      </button>
    );
  };

  const payCtaText =
    paymentMethod === "gcash"
      ? safeTexts.payWithGCashCta
      : paymentMethod === "apple"
      ? safeTexts.payWithAppleCta
      : paymentMethod === "google"
      ? safeTexts.payWithGoogleCta
      : paymentMethod === "paypal"
      ? safeTexts.payWithPaypalCta
      : paymentMethod === "card"
      ? safeTexts.payWithCardCta.replace(
          "${amount}",
          String(amount.toFixed ? amount.toFixed(2) : amount)
        )
      : safeTexts.selectMethodCta;

  // ---------- SKELETON WHILE TRANSLATIONS LOAD ----------
  if (i18nLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="h-5 w-32 bg-gray-200 rounded-full animate-pulse mb-4" />
          <div className="h-20 w-full bg-gray-100 rounded-2xl animate-pulse mb-4" />
          <div className="space-y-3 mb-4">
            <div className="h-14 w-full bg-gray-100 rounded-2xl animate-pulse" />
            <div className="h-14 w-full bg-gray-100 rounded-2xl animate-pulse" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1 h-11 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="flex-1 h-11 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        </motion.div>
      </div>
    );
  }

  // ---------- REAL UI ----------
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pay-title"
        className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 id="pay-title" className="text-[#4FC3F7]">
            {safeTexts.headerTitle}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 disabled:opacity-50"
            disabled={processing}
            aria-label={safeTexts.closeAria}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount */}
        <div className="bg-gradient-to-r from-[#4FC3F7] to-[#81D4FA] rounded-2xl p-6 text-white text-center mb-6">
          <p className="text-white/80 text-sm mb-1">
            {safeTexts.amountLabel}
          </p>
          <p className="text-4xl">${amount}</p>
          <p className="text-white/80 text-sm mt-2 capitalize">{prettyType}</p>
        </div>

        {/* Methods */}
        <div className="space-y-3 mb-6">
          <p className="text-gray-700 text-sm mb-3">
            {safeTexts.selectMethodLabel}
          </p>

          <MethodButton
            value="card"
            title={safeTexts.methodCardTitle}
            subtitle={safeTexts.methodCardSubtitle}
            left={
              <div className="bg-[#4FC3F7]/10 p-3 rounded-xl">
                <CreditCard className="w-6 h-6 text-[#4FC3F7]" />
              </div>
            }
          />

          <MethodButton
            value="gcash"
            title={safeTexts.methodGCashTitle}
            subtitle={safeTexts.methodGCashSubtitle}
            left={
              <div className="bg-[#0ea5e9]/10 p-3 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-[#0ea5e9] text-white grid place-items-center text-[10px] font-bold">
                  GC
                </div>
              </div>
            }
          />

          <MethodButton
            value="paypal"
            title={safeTexts.methodPaypalTitle}
            subtitle={safeTexts.methodPaypalSubtitle}
            left={
              <div className="bg-blue-100 p-3 rounded-xl">
                <span className="text-blue-600 text-sm font-semibold">
                  PP
                </span>
              </div>
            }
          />

          <MethodButton
            value="apple"
            title={safeTexts.methodAppleTitle}
            subtitle={safeTexts.methodAppleSubtitle}
            left={
              <div className="bg-gray-900 p-3 rounded-xl">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
            }
          />

          <MethodButton
            value="google"
            title={safeTexts.methodGoogleTitle}
            subtitle={safeTexts.methodGoogleSubtitle}
            left={
              <div className="bg-red-100 p-3 rounded-xl">
                <Smartphone className="w-6 h-6 text-red-600" />
              </div>
            }
          />
        </div>

        {/* Card Fields */}
        {isCard && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="space-y-3 mb-6"
          >
            <input
              type="text"
              inputMode="numeric"
              placeholder={safeTexts.cardNumberPlaceholder}
              className="w-full px-4 py-3 bg-[#F2F4F8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4FC3F7]"
              maxLength={19}
              value={cardNumber}
              onChange={(e) =>
                setCardNumber(e.target.value.replace(/[^\d\s]/g, ""))
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                inputMode="numeric"
                placeholder={safeTexts.cardExpiryPlaceholder}
                className="px-4 py-3 bg-[#F2F4F8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4FC3F7]"
                maxLength={5}
                value={cardExpiry}
                onChange={(e) =>
                  setCardExpiry(e.target.value.replace(/[^\d/]/g, ""))
                }
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder={safeTexts.cardCvvPlaceholder}
                className="px-4 py-3 bg-[#F2F4F8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4FC3F7]"
                maxLength={4}
                value={cardCvv}
                onChange={(e) =>
                  setCardCvv(e.target.value.replace(/[^\d]/g, ""))
                }
              />
            </div>
          </motion.div>
        )}

        {/* GCash Fields */}
        {isGCash && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="space-y-3 mb-6"
          >
            <label className="text-sm text-gray-700">
              {safeTexts.gcashLabel}
            </label>
            <input
              type="tel"
              inputMode="numeric"
              placeholder={safeTexts.gcashPlaceholder}
              className={`w-full px-4 py-3 bg-[#F2F4F8] rounded-xl focus:outline-none focus:ring-2 ${
                gcashNumber && !isValidPHMobile(gcashNumber)
                  ? "focus:ring-red-400 ring-red-300"
                  : "focus:ring-[#4FC3F7]"
              }`}
              value={gcashNumber}
              onChange={(e) =>
                setGcashNumber(e.target.value.replace(/[^\d+]/g, ""))
              }
            />
            <p className="text-xs text-gray-500">
              {safeTexts.gcashInfo}
            </p>
          </motion.div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={processing}
            className="flex-1 py-4 border-2 border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {safeTexts.cancelLabel}
          </button>
          <button
            onClick={handlePayment}
            disabled={!canSubmit}
            className="flex-1 py-4 bg-gradient-to-r from-[#4FC3F7] to-[#81D4FA] text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
          >
            {processing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {safeTexts.processingLabel}
              </div>
            ) : (
              payCtaText
            )}
          </button>
        </div>

        {/* Security Note */}
        <p className="text-gray-400 text-xs text-center mt-4">
          {safeTexts.secureNote}
        </p>
      </motion.div>
    </div>
  );
}
