"use client";

import { useRouter } from "next/navigation";
import { ChatScreen } from "@/components/ChatScreen";
import type { Match } from "@/components/DiscoverMatches";

export default function ChatPage() {
  const router = useRouter();

  // In a real app you’d pull the match from state, params, or server.
  const mockMatch: Match = {
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
  };

  return <ChatScreen match={mockMatch} onBack={() => router.back()} />;
}
