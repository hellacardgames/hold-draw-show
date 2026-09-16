import type { HandRankInfo } from "../lib/calculateHandRankInfo.js";
import type { Card } from "./Card.js";
import type { ChatMessage } from "./ChatMessage.js";

export type GameEvent =
  | {
      readonly type: "adminChanged";
      readonly id: string;
      readonly username: string;
    }
  | {
      readonly type: "chat";
      readonly id: string;
      readonly message: ChatMessage;
    }
  | {
      readonly type: "expirationUpdated";
      readonly id: string;
      readonly expiresAt: number;
    }
  | {
      readonly type: "gameCompleted";
      readonly id: string;
    }
  | {
      readonly type: "gameForfeited";
      readonly id: string;
    }
  | {
      readonly type: "gameStarted";
      readonly id: string;
    }
  | {
      readonly type: "otherPlayerDrewCards";
      readonly id: string;
      readonly username: string;
      readonly hand: readonly Card[];
      readonly handRankInfo: HandRankInfo | null;
      readonly score: number;
    }
  | {
      readonly type: "otherPlayerHandInitialized";
      readonly id: string;
      readonly username: string;
      readonly hand: readonly null[];
    }
  | {
      readonly type: "otherPlayerHeldCard";
      readonly id: string;
      readonly username: string;
      readonly index: number;
    }
  | {
      readonly type: "otherPlayerJoined";
      readonly id: string;
      readonly username: string;
    }
  | {
      readonly type: "otherPlayerLeft";
      readonly id: string;
      readonly username: string;
    }
  | {
      readonly type: "otherPlayerReadyForNextRound";
      readonly id: string;
      readonly username: string;
    }
  | {
      readonly type: "otherPlayerReadyToDraw";
      readonly id: string;
      readonly username: string;
    }
  | {
      readonly type: "otherPlayerUnheldCard";
      readonly id: string;
      readonly username: string;
      readonly index: number;
    }
  | {
      readonly type: "playerDrewCards";
      readonly id: string;
      readonly hand: readonly Card[];
      readonly handRankInfo: HandRankInfo | null;
      readonly score: number;
    }
  | {
      readonly type: "playerHandInitialized";
      readonly id: string;
      readonly hand: readonly Card[];
      readonly handRankInfo: HandRankInfo | null;
    }
  | {
      readonly type: "playerHeldCard";
      readonly id: string;
      readonly index: number;
    }
  | {
      readonly type: "playerReadyForNextRound";
      readonly id: string;
    }
  | {
      readonly type: "playerReadyToDraw";
      readonly id: string;
    }
  | {
      readonly type: "playerUnheldCard";
      readonly id: string;
      readonly index: number;
    }
  | {
      readonly type: "roundCompleted";
      readonly id: string;
    };
