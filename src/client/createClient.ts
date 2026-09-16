import { createClientFactory } from "@hellacardgames/lib";
import type { Manager } from "../manager/createManager.js";
import type { Server } from "../server/createServer.js";

export type Client = ReturnType<typeof createClient>;

export const createClient = createClientFactory<Server, Manager>({
  holdCard: (gameId: string, playerId: string, cardId: string) => ({
    gameId,
    playerId,
    cardId,
  }),
  lockHolds: (gameId: string, playerId: string) => ({
    gameId,
    playerId,
  }),
  reportReadyForNextRound: (gameId: string, playerId: string) => ({
    gameId,
    playerId,
  }),
  unholdCard: (gameId: string, playerId: string, cardId: string) => ({
    gameId,
    playerId,
    cardId,
  }),
});
