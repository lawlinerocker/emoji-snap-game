import { Point } from "face-api.js";
import {
  earLeft,
  earRight,
  earBoth,
  mar,
  smileWidth,
  browRaise,
  mouthDownturn,
} from "./faceMetrics";
import { TH } from "@/lib/enum/threshold";
import { EmojiTargets, ExpressionName } from "./enum";
import { Expressions } from "./types/expression.types";

const safe = (v: number | undefined | null) => (typeof v === "number" ? v : 0);

export function isSmilingFA(pts: Point[] | null, exp: Expressions | null) {
  if (safe(exp?.happy) >= TH.smileProb) return true;
  if (!pts) return false;
  return smileWidth(pts) >= TH.smileWidth;
}

export function isMouthOpenFA(pts: Point[] | null, exp: Expressions | null) {
  if (safe(exp?.surprised) >= TH.surpriseProb) return true;
  if (!pts) return false;
  return mar(pts) >= TH.mar;
}

export function isWinkingLeftFA(pts: Point[] | null) {
  if (!pts) return false;
  const l = earLeft(pts),
    r = earRight(pts);
  const asym = l / Math.max(r, 1e-6);
  return (l < TH.winkClosed && r > TH.eyeOpen) || asym < TH.winkAsymRatio;
}

export function isWinkingRightFA(pts: Point[] | null) {
  if (!pts) return false;
  const l = earLeft(pts),
    r = earRight(pts);
  const asym = r / Math.max(l, 1e-6);
  return (r < TH.winkClosed && l > TH.eyeOpen) || asym < TH.winkAsymRatio;
}

export function isEyesClosedFA(pts: Point[] | null, exp: Expressions | null) {
  if (!pts) return false;

  const l = earLeft(pts);
  const r = earRight(pts);
  const avg = (l + r) / 2;
  const sym = Math.abs(l - r);

  const bothStrictClosed = l < TH.eyesClosedClosed && r < TH.eyesClosedClosed;

  const bothAvgClosed = avg < TH.eyesClosedBoth && sym < TH.eyesSymDiff;

  const notSurprised = (exp?.surprised ?? 0) < 0.4;

  return (bothStrictClosed || bothAvgClosed) && notSurprised;
}

export function isFrowningFA(pts: Point[] | null, exp: Expressions | null) {
  if (safe(exp?.sad) >= TH.frownProb || safe(exp?.angry) >= TH.frownProb)
    return true;
  if (!pts) return false;

  const isDown = mouthDownturn(pts) > TH.downturn;
  const notOpen = mar(pts) < 0.3;
  const notWide = smileWidth(pts) < TH.smileWidth * 0.96;
  return isDown && notOpen && notWide;
}

export function isRaisedBrowFA(pts: Point[] | null, exp: Expressions | null) {
  if (safe(exp?.surprised) >= TH.browRaiseProb) return true;
  if (!pts) return false;
  return browRaise(pts) > TH.browRaise && earBoth(pts) > 0.2;
}

export function checkByTarget(
  target: EmojiTargets,
  pts: Point[] | null,
  exp: Expressions | null
): boolean {
  switch (target) {
    case "smile":
      return isSmilingFA(pts, exp);
    case "mouthOpen":
      return isMouthOpenFA(pts, exp);
    case "winkLeft":
      return isWinkingLeftFA(pts);
    case "winkRight":
      return isWinkingRightFA(pts);
    case "eyesClosed":
      return isEyesClosedFA(pts, exp);
    case "frown":
      return isFrowningFA(pts, exp);
    case "raisedBrow":
      return isRaisedBrowFA(pts, exp);
    default:
      return false;
  }
}

export function expressionsForTarget(
  target: EmojiTargets
): ExpressionName[] | null {
  switch (target) {
    case "smile":
      return [ExpressionName.Happy];
    case "mouthOpen":
      return [ExpressionName.Surprised];
    case "frown":
      return [ExpressionName.Sad, ExpressionName.Angry];
    case "raisedBrow":
      return [ExpressionName.Surprised];
    case "winkLeft":
    case "winkRight":
    case "eyesClosed":
      return null;
    default:
      return null;
  }
}
