"use client";

import { useRouter } from "next/navigation";
import { DiscoverMatches, Match } from "@/components/DiscoverMatches";

export default function DiscoverPage() {
  const router = useRouter();

  return (
    <DiscoverMatches
      onViewProfile={(m: Match) => {
        // navigate to a profile page
        router.push(`/profile`);
      }}
      onSettings={() => router.push("/settings")}
      onUpgrade={() => router.push("/upgrade")}
      // Keep this for analytics or tracking if needed — no navigation
      onAIQuestions={() => {
        console.log("AI Questions opened");
      }}
      onShowMatchHistory={() => router.push("/matchhistory")}
    />
  );
}
