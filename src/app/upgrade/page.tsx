"use client";

import { useRouter } from "next/navigation";
import { PremiumScreen } from "@/components/PremiumScreen";

export default function UpgradePage() {
  const router = useRouter();

  return (
    <PremiumScreen
      onBack={() => router.back()}
      onPurchase={(amount, type) => {
        // This is called AFTER a successful modal payment.
        alert(`Payment successful! Activated: ${type} — $${amount}`);
        // e.g., router.push("/thanks") or set a premium flag in your store
      }}
    />
  );
}
