import {
  addItemToCollection,
  emitEvent,
  updatePlayer,
} from "@hellacardgames/lib";
import type { Game } from "../types/Game.js";

export function holdCard(game: Game, playerId: string, cardId: string) {
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
  const cardIndex = player.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) {
    return { success: false, error: "cardNotFound" } as const;
  }
  if (player.heldCardIndices.includes(cardIndex)) {
    return { success: false, error: "cardAlreadyHeld" } as const;
  }

  game = updatePlayer(game, player.id, (p) => ({
    ...p,
    heldCardIndices: addItemToCollection(p.heldCardIndices, cardIndex),
  }));

  game = emitEvent(game, {
    type: "playerHeldCard",
    username: player.username,
    index: cardIndex,
  });

  return { success: true, game: game } as const;
}
