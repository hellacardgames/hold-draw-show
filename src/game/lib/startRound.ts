import {
  emitEventToOtherPlayers,
  emitEventToPlayer,
  shuffle,
  takeLastItems,
  updatePlayer,
} from "@hellacardgames/lib";
import { CARDS_PER_HAND } from "../constants.js";
import { calculateHandRankInfo } from "./calculateHandRankInfo.js";
import type { Card } from "../types/Card.js";
import type { StartedGame } from "../types/Game.js";

export function startRound(game: StartedGame): StartedGame {
  let deck = shuffle([...game.deck, ...game.players.flatMap((p) => p.hand)]);

  for (const player of game.players) {
    let hand: readonly Card[];
    ({ collection: deck, items: hand } = takeLastItems(deck, CARDS_PER_HAND));

    const handRankInfo = calculateHandRankInfo(hand);

    game = updatePlayer(game, player.id, (p) => ({
      ...p,
      status: "selectingHolds",
      hand,
      handRankInfo,
      heldCardIndices: [],
    }));

    game = emitEventToPlayer(game, player.id, {
      type: "playerHandInitialized",
      hand,
      handRankInfo,
    });
    game = emitEventToOtherPlayers(game, player.id, {
      type: "otherPlayerHandInitialized",
      username: player.username,
      hand: hand.map(() => null),
    });
  }

  game = { ...game, deck };

  return game;
}
