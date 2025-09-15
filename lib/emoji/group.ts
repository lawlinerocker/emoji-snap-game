import { EmojiTargets } from "@/lib/enum";

export const GROUPS: Record<EmojiTargets, string[]> = {
  smile: [
    "smile",
    "grinning",
    "grin",
    "smiley",
    "blush",
    "heart_eyes",
    "kissing_smiling_eyes",
  ],
  mouthOpen: ["open_mouth", "astonished", "scream", "hushed", "yawning_face"],
  winkLeft: ["wink", "stuck_out_tongue_winking_eye"],
  winkRight: ["zany_face"],
  eyesClosed: ["sleeping", "sleepy", "relieved"],
  frown: [
    "slightly_frowning_face",
    "frowning_face",
    "disappointed",
    "pensive",
    "worried",
  ],
  raisedBrow: ["face_with_raised_eyebrow", "face_with_monocle"],
} as const;
