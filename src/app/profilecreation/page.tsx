"use client";

import { useRouter } from "next/navigation";
import { ProfileCreationScreen, ProfileData } from "@/components/ProfileCreationScreen";

export default function ProfileCreationPage() {
  const router = useRouter();

  const handleBack = () => {
    // Navigate back to permissions page
    router.push("/permission");
  };

  const handleContinue = (profile: ProfileData) => {
    console.log("Profile saved:", profile);
    // You can save the profile to backend or context here
    // Then navigate to next page
    router.push("/livelyness");
  };

  return (
    <ProfileCreationScreen
      onBack={handleBack}
      onContinue={handleContinue}
    />
  );
}
