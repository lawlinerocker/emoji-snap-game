export const enum ExpressionName {
  Neutral = "neutral",
  Happy = "happy",
  Sad = "sad",
  Angry = "angry",
  Fearful = "fearful",
  Disgusted = "disgusted",
  Surprised = "surprised",
}

export const EXPRESSION_ORDER: ExpressionName[] = [
  ExpressionName.Neutral,
  ExpressionName.Happy,
  ExpressionName.Sad,
  ExpressionName.Angry,
  ExpressionName.Fearful,
  ExpressionName.Disgusted,
  ExpressionName.Surprised,
];
