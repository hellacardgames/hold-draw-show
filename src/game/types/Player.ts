import type { HandRankInfo } from "../lib/calculateHandRankInfo.js";
import type { Card } from "./Card.js";
import type { GameEvent } from "./GameEvent.js";

export type Player = {
  readonly id: string;
  readonly userId: string;
  readonly username: string;
  readonly events: readonly GameEvent[];
  readonly status:
    | "waitingForGameToStart"
    | "selectingHolds"
    | "readyToDraw"
    | "reviewingOutcome"
    | "readyForNextRound";
  readonly hand: readonly Card[];
  readonly handRankInfo: HandRankInfo | null;
  readonly heldCardIndices: readonly number[];
  readonly score: number;
};
