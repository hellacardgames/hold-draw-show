import type { Card } from "../types/Card.js";

export type HandRankInfo = {
  readonly rank: HandRank;
  readonly cards: readonly Card[];
};

type HandRank =
  | "jacksOrBetter" // 1
  | "twoPair" // 2
  | "threeOfAKind" // 3
  | "straight" // 4
  | "flush" // 6
  | "fullHouse" // 9
  | "fourOfAKind" // 25
  | "straightFlush" // 50
  | "royalFlush"; // 250

export function calculateHandRankInfo(
  cards: readonly Card[],
): HandRankInfo | null {
  if (isFlush(cards)) {
    if (isStraight(cards)) {
      if (cards.find((c) => c.rank === "A")) {
        return { rank: "royalFlush", cards };
      }
      return { rank: "straightFlush", cards };
    }
    return { rank: "flush", cards };
  }
  let winningCards: readonly Card[] | null;
  winningCards = findFourOfAKind(cards);
  if (winningCards) {
    return { rank: "fourOfAKind", cards: winningCards };
  }
  if (isFullHouse(cards)) {
    return { rank: "fullHouse", cards };
  }
  if (isStraight(cards)) {
    return { rank: "straight", cards };
  }
  winningCards = findThreeOfAKind(cards);
  if (winningCards) {
    return { rank: "threeOfAKind", cards: winningCards };
  }
  winningCards = findTwoPair(cards);
  if (winningCards) {
    return { rank: "twoPair", cards: winningCards };
  }
  winningCards = findJacksOrBetter(cards);
  if (winningCards) {
    return { rank: "jacksOrBetter", cards: winningCards };
  }
  return null;
}

function isFlush(cards: readonly Card[]): boolean {
  for (let i = 1; i < cards.length; i++) {
    if (cards[i]!.suit !== cards[0]!.suit) {
      return false;
    }
  }
  return true;
}

function isStraight(cards: readonly Card[]): boolean {
  return (
    isStraightByRanks(cards, ranksHighAce) ||
    isStraightByRanks(cards, ranksLowAce)
  );
}

function isStraightByRanks(
  cards: readonly Card[],
  ranks: typeof ranksHighAce | typeof ranksLowAce,
): boolean {
  const sortedCards = [...cards].sort(
    (a, b) => ranks.indexOf(a.rank) - ranks.indexOf(b.rank),
  );
  for (let i = 1; i < sortedCards.length; i++) {
    if (
      ranks.indexOf(sortedCards[i]!.rank) -
        ranks.indexOf(sortedCards[i - 1]!.rank) !==
      1
    ) {
      return false;
    }
  }
  return true;
}

function findFourOfAKind(cards: readonly Card[]): readonly Card[] | null {
  const map = new Map<Rank, number>();
  for (const card of cards) {
    const count = (map.get(card.rank) ?? 0) + 1;
    if (count === 4) {
      return cards.filter((c) => c.rank === card.rank);
    }
    map.set(card.rank, count);
  }
  return null;
}

function isFullHouse(cards: readonly Card[]): boolean {
  // This implementation assumes that better hands have been ruled out.
  const set = new Set<Rank>();
  for (const card of cards) {
    set.add(card.rank);
  }
  return set.size === 2;
}

function findThreeOfAKind(cards: readonly Card[]): readonly Card[] | null {
  // This implementation assumes that better hands have been ruled out.
  const map = new Map<Rank, number>();
  for (const card of cards) {
    const count = (map.get(card.rank) ?? 0) + 1;
    if (count === 3) {
      return cards.filter((c) => c.rank === card.rank);
    }
    map.set(card.rank, count);
  }
  return null;
}

function findTwoPair(cards: readonly Card[]): readonly Card[] | null {
  // This implementation assumes that better hands have been ruled out.
  const map = new Map<Rank, Card[]>();
  for (const card of cards) {
    const cardsOfRank = map.get(card.rank) ?? [];
    cardsOfRank.push(card);
    map.set(card.rank, cardsOfRank);
  }
  if (map.size === 3) {
    return [...map.values()]
      .filter((cardsOfRank) => cardsOfRank.length !== 1)
      .flat();
  }
  return null;
}

function findJacksOrBetter(cards: readonly Card[]): readonly Card[] | null {
  // This implementation assumes that better hands have been ruled out.
  const jackIndex = ranksHighAce.indexOf("J");
  const map = new Map<Rank, number>();
  for (const card of cards) {
    const count = (map.get(card.rank) ?? 0) + 1;
    if (count === 2 && ranksHighAce.indexOf(card.rank) >= jackIndex) {
      return cards.filter((c) => c.rank === card.rank);
    }
    map.set(card.rank, count);
  }
  return null;
}

type Rank = (typeof ranksHighAce)[number];

const ranksHighAce = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
] as const;

const ranksLowAce = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
] as const;
