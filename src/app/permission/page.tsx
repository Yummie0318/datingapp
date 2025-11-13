"use client";

import { useRouter } from "next/navigation";
import { PermissionsScreen, PermissionsData } from "@/components/PermissionsScreen";

export default function PermissionPage() {
  const router = useRouter();

  const handleBack = () => {
    // Go back to signup page
    router.back(); // or router.push("/signup")
  };

  const handleContinue = (permissions: PermissionsData) => {
    console.log("Permissions accepted:", permissions);
    // Navigate to profile creation page
    router.push("/profilecreation");
  };

  return <PermissionsScreen onBack={handleBack} onContinue={handleContinue} />;
}
