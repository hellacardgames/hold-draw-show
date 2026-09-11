import type { HandRankInfo } from "../lib/calculateHandRankInfo.js";
import type { Card } from "./Card.js";
import type { ChatMessage } from "./ChatMessage.js";

export type ClientState = {
  readonly status: "created" | "started" | "completed" | "forfeited";
  readonly gameId: string;
  readonly playerId: string;
  readonly username: string;
  readonly players: readonly Player[];
  readonly expiresAt: number;
  readonly chatMessages: readonly ChatMessage[];
  readonly hand: readonly Card[];
  readonly handRankInfo: HandRankInfo | null;
  readonly roundsCompleted: number;
};

type Player = {
  readonly username: string;
  readonly status:
    | "waitingForGameToStart"
    | "selectingHolds"
    | "readyToDraw"
    | "reviewingOutcome"
    | "readyForNextRound";
  readonly hand: readonly Card[] | readonly null[];
  readonly handRankInfo: HandRankInfo | null;
  readonly heldCardIndices: readonly number[];
  readonly score: number;
};
