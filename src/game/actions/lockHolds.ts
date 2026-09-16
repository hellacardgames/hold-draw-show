import {
  emitEvent,
  emitEventToOtherPlayers,
  emitEventToPlayer,
  updatePlayer,
} from "@hellacardgames/lib";
import { EXPIRY_EXTENSION_MS } from "../constants.js";
import { allPlayersLockedHolds } from "../lib/allPlayersLockedHolds.js";
import { drawCardsAndShowHands } from "../lib/drawCardsAndShowHands.js";
import { transitionGameToCompleted } from "../lib/transitionGameToCompleted.js";
import type { Game } from "../types/Game.js";

export function lockHolds(game: Game, playerId: string) {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" } as const;
  }
  if (game.status !== "started") {
    return { success: false, error: "invalidStatus" } as const;
  }
  if (player.status !== "selectingHolds") {
    return { success: false, error: "invalidPlayerStatus" } as const;
  }

  game = updatePlayer(game, player.id, (p) => ({
    ...p,
    status: "holdsLocked",
  }));

  game = emitEventToPlayer(game, player.id, {
    type: "playerLockedHolds",
  });
  game = emitEventToOtherPlayers(game, player.id, {
    type: "otherPlayerLockedHolds",
    username: player.username,
  });

  if (allPlayersLockedHolds(game)) {
    game = drawCardsAndShowHands(game);

    game = { ...game, roundsCompleted: game.roundsCompleted + 1 };
    game = emitEvent(game, { type: "roundCompleted" });

    if (game.roundsCompleted === 10) {
      game = transitionGameToCompleted(game);
      game = emitEvent(game, { type: "gameCompleted" });
    }

    game = { ...game, expiresAt: Date.now() + EXPIRY_EXTENSION_MS };
    game = emitEvent(game, {
      type: "expirationUpdated",
      expiresAt: game.expiresAt,
    });
  }

  return { success: true, game: game } as const;
}
