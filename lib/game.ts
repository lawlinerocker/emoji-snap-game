import { EmojiTargets } from "./enum";

export async function fetchRandomEmoji(): Promise<{
  emoji: string;
  target: EmojiTargets;
}> {
  const r = await fetch("/api/emoji", { cache: "no-store" });
  const j = await r.json();
  return { emoji: j.emoji as string, target: j.target as EmojiTargets };
}
