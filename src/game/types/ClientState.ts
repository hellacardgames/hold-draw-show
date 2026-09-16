import type { HandRankInfo } from "../lib/calculateHandRankInfo.js";
import type { Card } from "./Card.js";
import type { ChatMessage } from "./ChatMessage.js";
import type { PlayerStatus } from "./PlayerStatus.js";

export type ClientState = {
  readonly status: "created" | "started" | "completed" | "forfeited";
  readonly gameId: string;
  readonly playerId: string;
  readonly player: Player;
  readonly otherPlayers: readonly OtherPlayer[];
  readonly adminUsername: string;
  readonly expiresAt: number;
  readonly chatMessages: readonly ChatMessage[];
  readonly roundsCompleted: number;
};

type Player = {
  readonly username: string;
  readonly status: PlayerStatus;
  readonly hand: readonly Card[];
  readonly handRankInfo: HandRankInfo | null;
  readonly heldCardIndices: readonly number[];
  readonly score: number;
};

type OtherPlayer = {
  readonly username: string;
  readonly status: PlayerStatus;
  readonly hand: readonly Card[] | readonly null[];
  readonly handRankInfo: HandRankInfo | null;
  readonly heldCardIndices: readonly number[];
  readonly score: number;
};
