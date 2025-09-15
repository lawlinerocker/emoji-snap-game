"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import * as faceapi from "face-api.js";
import { Expressions } from "@/lib/types/expression.types";

export function useFaceAPI(video: HTMLVideoElement | null) {
  const [ready, setReady] = useState(false);
  const [landmarks68, setLandmarks68] = useState<faceapi.Point[] | null>(null);
  const [expressions, setExpressions] = useState<Expressions | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await faceapi.tf.setBackend("webgl");
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]);
      if (cancelled) return;
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!video || !ready) return;

    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 224,
      scoreThreshold: 0.4,
    });

    const loop = async () => {
      const det = await faceapi
        .detectSingleFace(video, options)
        .withFaceLandmarks()
        .withFaceExpressions();

      if (det) {
        const exp = det.expressions as Expressions;
        setLandmarks68(det.landmarks.positions);
        setExpressions(exp);

        console.log(
          "Face expressions:",
          Object.entries(exp)
            .map(([k, v]) => `${k}: ${(v ?? 0).toFixed(2)}`)
            .join(" | ")
        );
      } else {
        setLandmarks68(null);
        setExpressions(null);
        console.log("No face detected");
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [video, ready]);

  const analyzeImage = useCallback(
    async (src: File | Blob | string | HTMLImageElement) => {
      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 224,
        scoreThreshold: 0.4,
      });

      const toImg = async (): Promise<HTMLImageElement> => {
        if (typeof src === "string") {
          return await new Promise((res, rej) => {
            const i = new Image();
            i.onload = () => res(i);
            i.onerror = rej;
            i.src = src;
          });
        } else if (src instanceof HTMLImageElement) {
          return src;
        } else {
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(String(r.result));
            r.onerror = reject;
            r.readAsDataURL(src);
          });
          return await new Promise((res, rej) => {
            const i = new Image();
            i.onload = () => res(i);
            i.onerror = rej;
            i.src = dataUrl;
          });
        }
      };

      const img = await toImg();
      const det = await faceapi
        .detectSingleFace(img, options)
        .withFaceLandmarks()
        .withFaceExpressions();

      if (det) {
        setLandmarks68(det.landmarks.positions);
        setExpressions(det.expressions as Expressions);
        return {
          landmarks68: det.landmarks.positions,
          expressions: det.expressions as Expressions,
        };
      } else {
        setLandmarks68(null);
        setExpressions(null);
        return null;
      }
    },
    []
  );

  return { ready, landmarks68, expressions, analyzeImage };
}
