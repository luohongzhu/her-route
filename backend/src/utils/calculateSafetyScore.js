// src/utils/calculateSafetyScore.js

export function calculateSafetyScore({
  lampCount,
  lightingScore,
  userVoteSum,
  userVoteCount
}) {
  const baseLighting =
    lampCount === 0 ? 0.1 : lightingScore;

  // no user votes yet → lighting only
  if (userVoteCount === 0) {
    return baseLighting;
  }

  const avgVote = userVoteSum / userVoteCount; // [-1, 1]
  const normalizedUser = (avgVote + 1) / 2;   // [0, 1]

  const combined =
    baseLighting * 0.7 +
    normalizedUser * 0.3;

  // hard floor safeguard
  return Math.max(0.1, combined);
}