"use client";

import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProfileDetails } from "@/components/ProfileDetails";
import type { Match } from "@/components/DiscoverMatches";

// Top-level component wraps your logic in Suspense
export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="text-center p-6">Loading profile...</div>}>
      <ProfilePageContent />
    </Suspense>
  );
}

// Actual content component — safe to use useSearchParams() here
function ProfilePageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id"); // expects /profile?id=123

  const mockMatches: Match[] = [
    {
      id: "1",
      name: "Emma",
      age: 26,
      image: "https://images.unsplash.com/photo-1704054006064-2c5b922e7a1e",
      compatibility: 92,
      reason: "Shares your love for adventure and creativity",
      bio: "Creative soul who loves exploring new places and trying new foods. Always up for a spontaneous road trip!",
      interests: ["Travel", "Photography", "Cooking", "Art"],
      languages: ["English", "Spanish"],
      location: "San Francisco, CA",
    },
    {
      id: "2",
      name: "Alex",
      age: 28,
      image: "https://images.unsplash.com/photo-1611695434398-4f4b330623e6",
      compatibility: 88,
      reason: "Similar communication style and values",
      bio: "Tech enthusiast and fitness buff. Love meaningful conversations over coffee.",
      interests: ["Fitness", "Technology", "Reading", "Coffee"],
      languages: ["English", "French"],
      location: "Seattle, WA",
    },
    {
      id: "3",
      name: "Sophia",
      age: 25,
      image: "https://images.unsplash.com/photo-1672462478040-a5920e2c23d8",
      compatibility: 85,
      reason: "Complementary personalities and shared hobbies",
      bio: "Bookworm and music lover. Seeking someone who appreciates quiet evenings and deep conversations.",
      interests: ["Reading", "Music", "Yoga", "Writing"],
      languages: ["English", "Japanese"],
      location: "Portland, OR",
    },
  ];

  const match: Match | undefined = useMemo(() => {
    if (!id) return mockMatches[0]; // fallback if no id
    return mockMatches.find((m) => m.id === id) ?? mockMatches[0];
  }, [id]);

  if (!match) return null;

  return (
    <ProfileDetails
      match={match}
      onBack={() => router.back()}
      onStartChat={() => router.push(`/chat?matchId=${match.id}`)}
    />
  );
}
