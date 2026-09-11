import type { HandRankInfo } from "./calculateHandRankInfo.js";

const handRankPoints = {
  jacksOrBetter: 1,
  twoPair: 2,
  threeOfAKind: 3,
  straight: 4,
  flush: 6,
  fullHouse: 9,
  fourOfAKind: 25,
  straightFlush: 50,
  royalFlush: 250,
} as const;

export function getPointsFromHandRankInfo(handRankInfo: HandRankInfo): number {
  return handRankPoints[handRankInfo.rank];
}
