"use client";
import { useEffect, useRef, useState } from "react";

export function useWebcam() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        const v = document.createElement("video");
        v.playsInline = true;
        v.muted = true;
        v.srcObject = stream;
        await v.play();
        videoRef.current = v;
        setReady(true);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e?.message || "camera error");
        }
      }
    })();
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return { videoRef, ready, error };
}
