"use client";

import { useRouter } from "next/navigation";
import { SignupScreenForm, SignupData } from "@/components/SignupScreenForm";

export default function SignupPage() {
  const router = useRouter();

  const handleBack = () => {
    // Go back to home or previous page
    router.back();
  };

  const handleContinue = (data: SignupData) => {
    console.log("User signed up:", data);
    // Navigate to the Permissions page
    router.push("/permission"); // make sure this matches your folder name in /app
  };

  return <SignupScreenForm onBack={handleBack} onContinue={handleContinue} />;
}
