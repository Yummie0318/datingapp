"use client";

import { useRouter } from "next/navigation";
import { LivelynessCheck, LivelinessResult } from "@/components/LivelynessCheck";

export default function LivelynessPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/profilecreation");
  };

  const handleComplete = (result: LivelinessResult) => {
    // result = { granted: boolean, durationMs: number, startedAt: number }
    console.log("Liveness result:", result);
    // TODO: send to backend
    router.push("/audio"); // replace with your next route
  };

  return <LivelynessCheck onBack={handleBack} onComplete={handleComplete} />;
}
