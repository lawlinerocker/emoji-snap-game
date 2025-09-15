"use client";
export default function Countdown({ seconds = 3 }: { seconds?: number }) {
  return <div className="text-5xl font-bold tabular-nums">{seconds}</div>;
}
