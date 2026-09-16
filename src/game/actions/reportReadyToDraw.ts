import {
  emitEvent,
  emitEventToOtherPlayers,
  emitEventToPlayer,
  shuffle,
  takeLastItemFromCollection,
  updatePlayer,
} from "@hellacardgames/lib";
import { EXPIRY_EXTENSION_MS } from "../constants.js";
import { areAllPlayersReadyToDraw } from "../lib/areAllPlayersReadyToDraw.js";
import { calculateHandRankInfo } from "../lib/calculateHandRankInfo.js";
import { getPointsFromHandRankInfo } from "../lib/getPointsFromHandRankInfo.js";
import { transitionGameToCompleted } from "../lib/transitionGameToCompleted.js";
import type { Game } from "../types/Game.js";
import type { Card } from "../types/Card.js";

export function reportReadyToDraw(game: Game, playerId: string) {
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
    status: "readyToDraw",
  }));

  game = emitEventToPlayer(game, player.id, {
    type: "playerReadyToDraw",
  });
  game = emitEventToOtherPlayers(game, player.id, {
    type: "otherPlayerReadyToDraw",
    username: player.username,
  });

  if (areAllPlayersReadyToDraw(game)) {
    const unheldCards = game.players.flatMap((p) =>
      p.hand.filter((_, index) => !p.heldCardIndices.includes(index)),
    );

    let deck = shuffle([...game.deck, ...unheldCards]);

    for (const player of game.players) {
      const hand = player.hand.map((card, index) => {
        if (!player.heldCardIndices.includes(index)) {
          let newCard: Card;
          ({ collection: deck, item: newCard } =
            takeLastItemFromCollection(deck));
          return newCard;
        }
        return card;
      });

      const handRankInfo = calculateHandRankInfo(hand);
      const points = handRankInfo ? getPointsFromHandRankInfo(handRankInfo) : 0;
      const score = player.score + points;

      game = updatePlayer(game, player.id, (p) => ({
        ...p,
        status: "reviewingOutcome",
        hand,
        handRankInfo,
        score,
      }));

      game = emitEventToPlayer(game, player.id, {
        type: "playerDrewCards",
        hand,
        handRankInfo,
        score,
      });
      game = emitEventToOtherPlayers(game, player.id, {
        type: "otherPlayerDrewCards",
        username: player.username,
        hand,
        handRankInfo,
        score,
      });
    }

    game = { ...game, deck };

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
