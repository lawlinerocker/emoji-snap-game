import { euclideanDistance, Point } from "face-api.js";
import { XYLike } from "./types/face-metrics.types";

const toArr = (q: XYLike): [number, number] => [q.x, q.y];

function dist(a: XYLike, b: XYLike): number {
  return euclideanDistance(toArr(a), toArr(b));
}

const p = (pts: Point[], i: number) => pts[i];

export function earRight(pts: Point[]) {
  const [p36, p37, p38, p39, p40, p41] = [36, 37, 38, 39, 40, 41].map((i) =>
    p(pts, i)
  );
  const vert = dist(p37, p41) + dist(p38, p40);
  const horz = dist(p36, p39);
  return vert / (2 * horz);
}

export function earLeft(pts: Point[]) {
  const [p42, p43, p44, p45, p46, p47] = [42, 43, 44, 45, 46, 47].map((i) =>
    p(pts, i)
  );
  const vert = dist(p43, p47) + dist(p44, p46);
  const horz = dist(p42, p45);
  return vert / (2 * horz);
}

export function earBoth(pts: Point[]) {
  return (earLeft(pts) + earRight(pts)) / 2;
}

export function mar(pts: Point[]) {
  const v =
    (dist(p(pts, 50), p(pts, 58)) +
      dist(p(pts, 52), p(pts, 56)) +
      dist(p(pts, 51), p(pts, 57))) /
    3;
  const w = dist(p(pts, 48), p(pts, 54));
  return v / w;
}

export function smileWidth(pts: Point[]) {
  const mouthW = dist(p(pts, 48), p(pts, 54));
  const eyeSpan = dist(p(pts, 36), p(pts, 45));
  return mouthW / eyeSpan;
}

export function browRaise(pts: Point[]) {
  const leftEyeCenter = {
    x: (p(pts, 36).x + p(pts, 39).x) / 2,
    y: (p(pts, 36).y + p(pts, 39).y) / 2,
  };
  const rightEyeCenter = {
    x: (p(pts, 42).x + p(pts, 45).x) / 2,
    y: (p(pts, 42).y + p(pts, 45).y) / 2,
  };

  const eyeSpan = dist(p(pts, 36), p(pts, 45)) || 1;
  const leftRaise = dist(p(pts, 19), leftEyeCenter) / eyeSpan;
  const rightRaise = dist(p(pts, 24), rightEyeCenter) / eyeSpan;
  return (leftRaise + rightRaise) / 2;
}

export function mouthDownturn(pts: Point[]) {
  const mouthL = p(pts, 48),
    mouthR = p(pts, 54);
  const noseBase = p(pts, 33);
  const leftDrop = mouthL.y - noseBase.y;
  const rightDrop = mouthR.y - noseBase.y;
  const eyeSpan = dist(p(pts, 36), p(pts, 45)) || 1;
  return (leftDrop + rightDrop) / 2 / eyeSpan;
}
