"use client";

import { useRouter } from "next/navigation";
import { AuidioCheck, AudioSampleResult } from "@/components/AuidioCheck";

export default function AudioPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/livelyness");
  };

  const handleComplete = (result: AudioSampleResult) => {
    // result = { granted, durationMs, blobUrl, mimeType }
    console.log("Audio sample:", result);
    // TODO: upload blob to your backend:
    // fetch("/api/upload-audio", { method: "POST", body: await (await fetch(result.blobUrl!)).blob() })
    router.push("/aianalyzer"); // or next step
  };

  return <AuidioCheck onBack={handleBack} onComplete={handleComplete} />;
}
