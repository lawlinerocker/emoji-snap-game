import { EmojiTargets } from "@/lib/enum";
import * as emoji from "node-emoji";
import { GROUPS } from "./group";

export function isValidEmojiName(name: string): boolean {
  try {
    const ch = emoji.get(name);
    return typeof ch === "string" && ch.length > 0 && ch !== name;
  } catch {
    return false;
  }
}

export function buildEmojiPool(): Array<{
  name: string;
  target: EmojiTargets;
}> {
  const pool: Array<{ name: string; target: EmojiTargets }> = [];
  (Object.keys(GROUPS) as EmojiTargets[]).forEach((t) => {
    for (const n of GROUPS[t]) {
      if (isValidEmojiName(n)) pool.push({ name: n, target: t });
    }
  });
  if (pool.length === 0)
    pool.push({ name: "smile", target: EmojiTargets.Smile });
  return pool;
}

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
