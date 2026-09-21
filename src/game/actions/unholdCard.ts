import {
  emitEventToOtherPlayers,
  emitEventToPlayer,
  removeItem,
  tryGetPlayer,
  updatePlayer,
} from "@hellacardgames/lib";
import type { Game } from "../types/Game.js";

export function unholdCard(game: Game, playerId: string, cardId: string) {
  const { player } = tryGetPlayer(game, playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" } as const;
  }
  if (game.status !== "started") {
    return { success: false, error: "invalidStatus" } as const;
  }
  if (player.status !== "selectingHolds") {
    return { success: false, error: "invalidPlayerStatus" } as const;
  }
  const cardIndex = player.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) {
    return { success: false, error: "cardNotFound" } as const;
  }
  if (!player.heldCardIndices.includes(cardIndex)) {
    return { success: false, error: "cardNotHeld" } as const;
  }

  game = updatePlayer(game, player.id, (p) => ({
    ...p,
    heldCardIndices: removeItem(p.heldCardIndices, cardIndex),
  }));

  game = emitEventToPlayer(game, player.id, {
    type: "playerUnheldCard",
    index: cardIndex,
  });
  game = emitEventToOtherPlayers(game, player.id, {
    type: "otherPlayerUnheldCard",
    username: player.username,
    index: cardIndex,
  });

  return { success: true, game: game } as const;
}
