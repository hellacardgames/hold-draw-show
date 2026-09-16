import {
  emitEvent,
  emitEventToOtherPlayers,
  emitEventToPlayer,
  updatePlayer,
} from "@hellacardgames/lib";
import { EXPIRY_EXTENSION_MS } from "../constants.js";
import { areAllPlayersReadyForNextRound } from "../lib/areAllPlayersReadyForNextRound.js";
import { startRound } from "../lib/startRound.js";
import type { Game } from "../types/Game.js";

export function reportReadyForNextRound(game: Game, playerId: string) {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" } as const;
  }
  if (game.status !== "started") {
    return { success: false, error: "invalidStatus" } as const;
  }
  if (player.status !== "reviewingOutcome") {
    return { success: false, error: "invalidPlayerStatus" } as const;
  }

  game = updatePlayer(game, player.id, (p) => ({
    ...p,
    status: "readyForNextRound",
  }));

  game = emitEventToPlayer(game, player.id, {
    type: "playerReadyForNextRound",
  });
  game = emitEventToOtherPlayers(game, player.id, {
    type: "otherPlayerReadyForNextRound",
    username: player.username,
  });

  if (areAllPlayersReadyForNextRound(game)) {
    game = startRound(game);

    game = { ...game, expiresAt: Date.now() + EXPIRY_EXTENSION_MS };
    game = emitEvent(game, {
      type: "expirationUpdated",
      expiresAt: game.expiresAt,
    });
  }

  return { success: true, game: game } as const;
}
