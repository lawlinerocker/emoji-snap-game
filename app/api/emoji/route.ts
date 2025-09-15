import { NextResponse } from "next/server";
import * as emoji from "node-emoji";
import { buildEmojiPool, pickRandom } from "@/lib/emoji/pool";

// export const dynamic = "force-dynamic";

export function GET() {
  const pool = buildEmojiPool();
  const item = pickRandom(pool);
  const char = emoji.get(item.name);
  return NextResponse.json({
    name: item.name,
    emoji: char,
    target: item.target,
  });
}
