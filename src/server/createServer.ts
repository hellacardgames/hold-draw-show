import { z } from "zod";
import { createServerFactory } from "@hellacardgames/lib";
import { createManager } from "../manager/index.js";

export type Server = ReturnType<typeof createServer>;

export const createServer = createServerFactory(createManager, {
  holdCard: z
    .object({
      gameId: z.string(),
      playerId: z.string(),
      cardId: z.string(),
    })
    .transform(
      ({ gameId, playerId, cardId }) => [gameId, playerId, cardId] as const,
    ),

  reportReadyForNextRound: z
    .object({
      gameId: z.string(),
      playerId: z.string(),
    })
    .transform(({ gameId, playerId }) => [gameId, playerId] as const),

  reportReadyToDraw: z
    .object({
      gameId: z.string(),
      playerId: z.string(),
    })
    .transform(({ gameId, playerId }) => [gameId, playerId] as const),

  unholdCard: z
    .object({
      gameId: z.string(),
      playerId: z.string(),
      cardId: z.string(),
    })
    .transform(
      ({ gameId, playerId, cardId }) => [gameId, playerId, cardId] as const,
    ),
});
