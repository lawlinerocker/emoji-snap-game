"use client";
import { CameraProps } from "@/lib/types/camera.types";
import { useCallback, useEffect, useRef, useState } from "react";

export default function CameraFeed({
  onReady,
  onStill,
  preferRearCamera = false,
}: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<
    "idle" | "ready" | "error" | "unsupported"
  >("idle");
  const [message, setMessage] = useState<string>("");

  const supported =
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === "function";

  useEffect(() => {
    return () => {
      const v = videoRef.current;
      const s = (v?.srcObject as MediaStream | null) || null;
      s?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const start = useCallback(async () => {
    if (!supported) {
      setStatus("unsupported");
      setMessage("Camera API not available in this browser.");
      return;
    }
    if (!window.isSecureContext && location.hostname !== "localhost") {
      setStatus("error");
      setMessage("Camera requires HTTPS (or localhost). Open via https.");
      return;
    }

    const tries: MediaStreamConstraints[] = [
      {
        video: {
          facingMode: preferRearCamera
            ? { ideal: "environment" }
            : { ideal: "user" },
        },
        audio: false,
      },
      { video: true, audio: false },
      { video: { width: 640, height: 480 }, audio: false },
    ];

    let stream: MediaStream | null = null;
    for (const c of tries) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(c);
        break;
      } catch {}
    }
    if (!stream) {
      setStatus("error");
      setMessage(
        "Unable to access camera. Check permissions or try another browser."
      );
      return;
    }

    const v = videoRef.current!;
    v.srcObject = stream;
    try {
      await v.play();
    } catch {}
    setStatus("ready");
    setMessage("");
    onReady?.(v);
  }, [onReady, preferRearCamera, supported]);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      if (dataUrl && onStill) onStill(dataUrl);
      setStatus("ready");
      setMessage("");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <video
          ref={videoRef}
          className="w-full h-auto bg-black"
          playsInline
          muted
          autoPlay
        />
        {status !== "ready" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white p-4 text-center">
            <div>
              <p className="mb-3 text-sm">
                {message ||
                  "Tap the button to enable your camera or upload a photo."}
              </p>
              <div className="flex gap-2 justify-center">
                <button onClick={start} className="btn btn-primary">
                  Enable Camera
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
