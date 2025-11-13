"use client";

import { useRouter } from "next/navigation";
import { AuidioCheck, AudioSampleResult } from "@/components/AuidioCheck";

export default function AudioPage() {
  const router = useRouter();

  const handleBack = () => router.push("/livelyness");

  const handleComplete = (result: AudioSampleResult) => {
    console.log("Audio sample:", result);

    // TODO: upload blob to backend
    // const blob = await (await fetch(result.blobUrl!)).blob();
    // await fetch("/api/upload-audio", { method: "POST", body: blob });

    router.push("/aianalyzer");
  };

  return <AuidioCheck onBack={handleBack} onComplete={handleComplete} />;
}
