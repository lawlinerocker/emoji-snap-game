"use client";
import { useEffect, useRef, useState } from "react";
import CameraFeed from "@/components/CameraFeed";
import Countdown from "@/components/Countdown";
import ScoreBadge from "@/components/ScoreBadge";
import { fetchRandomEmoji } from "@/lib/game";
import { pushHistory } from "@/lib/storage";
import { useCountdown } from "@/hooks/useCountdown";
import { useFaceAPI } from "@/hooks/useFaceAPI";
import { checkByTarget, expressionsForTarget } from "@/lib/targetFaceAPI";
import EmojiTarget from "@/components/EmojiTarget";
import ExpressionBars from "@/components/ExpressionBars";
import { EmojiTargets } from "@/lib/enum";
import { Point } from "face-api.js";
import { Expressions } from "@/lib/types/expression.types";

export default function PlayPage() {
  const [target, setTarget] = useState<EmojiTargets>(EmojiTargets.Smile);
  const [emoji, setEmoji] = useState<string>("🙂");

  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [stillDataUrl, setStillDataUrl] = useState<string | null>(null);

  const [status, setStatus] = useState<
    "idle" | "countdown" | "snap" | "result"
  >("idle");
  const [passed, setPassed] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frozenDetRef = useRef<{
    landmarks68: Point[] | null;
    expressions: Expressions | null;
  } | null>(null);

  const [sounds, setSounds] = useState<{
    success: HTMLAudioElement;
    fail: HTMLAudioElement;
  } | null>(null);

  const { landmarks68, expressions, analyzeImage } = useFaceAPI(video);

  const { remaining, start } = useCountdown();
  const finishedOnceRef = useRef(false);

  const lastGoodRef = useRef<Point[] | null>(null);
  useEffect(() => {
    if (status === "countdown" && landmarks68) {
      const matched = checkByTarget(target, landmarks68, expressions ?? null);
      if (matched) lastGoodRef.current = landmarks68;
    }
    if (status !== "countdown") lastGoodRef.current = null;
  }, [status, landmarks68, expressions, target]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!stillDataUrl) {
        frozenDetRef.current = null;
        return;
      }
      const det = await analyzeImage(stillDataUrl);
      if (cancelled) return;
      frozenDetRef.current = det
        ? { landmarks68: det.landmarks68, expressions: det.expressions }
        : { landmarks68: null, expressions: null };
    })();
    return () => {
      cancelled = true;
    };
  }, [stillDataUrl, analyzeImage]);

  async function pickRandom() {
    const { emoji, target } = await fetchRandomEmoji();
    setEmoji(emoji);
    setTarget(target);
  }
  useEffect(() => {
    void pickRandom();
  }, []);

  useEffect(() => {
    const success = new Audio("/sounds/success.wav");
    const fail = new Audio("/sounds/fail.wav");
    setSounds({ success, fail });
  }, []);

  function checkPassFA(pts: Point[] | null, exp: Expressions) {
    return checkByTarget(target, pts, exp);
  }

  function captureDataUrlFromVideo(): string | undefined {
    if (!video || !canvasRef.current) return;
    const c = canvasRef.current;
    c.width = video.videoWidth;
    c.height = video.videoHeight;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(video, 0, 0);
    return c.toDataURL("image/jpeg", 0.85);
  }

  function onStart() {
    finishedOnceRef.current = false;
    setPassed(false);
    setStillDataUrl(null);
    setStatus("countdown");
    start(3);
  }

  useEffect(() => {
    if (status !== "countdown") return;
    if (remaining > 0) return;
    if (finishedOnceRef.current) return;
    finishedOnceRef.current = true;
    void onCountdownDone();
  }, [status, remaining]);

  useEffect(() => {
    if (!expressions) return;
    console.log(
      "Expressions:",
      Object.entries(expressions)
        .map(([k, v]) => `${k}: ${(v ?? 0).toFixed(2)}`)
        .join(" | ")
    );
  }, [expressions]);

  async function onCountdownDone() {
    setStatus("snap");

    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r))
    );

    if (video) {
      const pts = lastGoodRef.current ?? landmarks68 ?? null;
      const ok = checkPassFA(pts, expressions ?? {});
      const dataUrl = captureDataUrlFromVideo();
      pushHistory({
        ts: new Date().toISOString(),
        emoji,
        passed: !!ok,
        dataUrl,
      });
      if (ok) sounds?.success.play();
      else sounds?.fail.play();
      setPassed(!!ok);
      setStatus("result");
      return;
    }

    if (stillDataUrl) {
      const det = await analyzeImage(stillDataUrl);
      const ok = det ? checkPassFA(det.landmarks68, det.expressions) : false;
      pushHistory({
        ts: new Date().toISOString(),
        emoji,
        passed: !!ok,
        dataUrl: stillDataUrl,
      });
      if (ok) sounds?.success.play();
      else sounds?.fail.play();
      setPassed(!!ok);
      setStatus("result");
      return;
    }

    pushHistory({ ts: new Date().toISOString(), emoji, passed: false });
    sounds?.fail.play();
    setPassed(false);
    setStatus("result");
  }

  async function nextRound() {
    setStatus("idle");
    setPassed(false);
    setStillDataUrl(null);
    await pickRandom();
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <EmojiTarget emoji={emoji} />
            <span className="opacity-70">Match this pose</span>
          </div>
          {status === "result" && <ScoreBadge passed={passed} />}
        </div>

        <CameraFeed onReady={setVideo} onStill={setStillDataUrl} />

        <div className="mt-4 flex items-center gap-3">
          {status === "idle" && (
            <button className="btn btn-primary" onClick={onStart}>
              Start
            </button>
          )}
          {status === "countdown" && <Countdown seconds={remaining} />}
          {status === "result" && (
            <button className="btn" onClick={nextRound}>
              Next
            </button>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="card min-w-0">
        <h2 className="font-semibold mb-2">Debug</h2>

        <ExpressionBars
          expressions={expressions}
          highlight={expressionsForTarget(target) ?? []}
          title={`Live expressions — target: ${target}`}
        />
        {stillDataUrl && (
          <div className="mt-3 text-sm opacity-80">
            <div className="mb-1">Uploaded image fallback:</div>
            <img
              src={stillDataUrl}
              alt="uploaded"
              className="w-full max-w-xs rounded-lg border"
            />
          </div>
        )}
        <p className="text-xs opacity-70 mt-3">
          Using <code>face-api.js</code> metrics. Tweak thresholds in{" "}
          <code>lib/targetsFaceAPI.ts</code>.
        </p>
      </div>
    </div>
  );
}
