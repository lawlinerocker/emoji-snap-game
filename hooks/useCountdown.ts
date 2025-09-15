"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export function useCountdown() {
  const [remaining, setRemaining] = useState(0);
  const runningRef = useRef(false);
  const deadlineRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  const start = useCallback((seconds: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    deadlineRef.current = Date.now() + seconds * 1000;
    runningRef.current = true;
    setRemaining(seconds);

    timerRef.current = window.setInterval(() => {
      const ms = deadlineRef.current - Date.now();
      if (ms <= 0) {
        setRemaining(0);
        runningRef.current = false;
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      } else {
        setRemaining(Math.ceil(ms / 1000));
      }
    }, 100);
  }, []);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    runningRef.current = false;
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return {
    remaining,
    isRunning: () => runningRef.current,
    start,
    stop,
    getDeadline: () => deadlineRef.current,
  };
}
