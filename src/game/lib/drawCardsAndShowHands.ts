import {
  emitEventToOtherPlayers,
  emitEventToPlayer,
  shuffle,
  takeLastItem,
  updatePlayer,
} from "@hellacardgames/lib";
import { calculateHandRankInfo } from "./calculateHandRankInfo.js";
import { getPointsFromHandRankInfo } from "./getPointsFromHandRankInfo.js";
import type { Card } from "../types/Card.js";
import type { StartedGame } from "../types/Game.js";

export function drawCardsAndShowHands(game: StartedGame): StartedGame {
  const unheldCards = game.players.flatMap((p) =>
    p.hand.filter((_, index) => !p.heldCardIndices.includes(index)),
  );

  let deck = shuffle([...game.deck, ...unheldCards]);

  for (const player of game.players) {
    const hand = player.hand.map((card, index) => {
      if (!player.heldCardIndices.includes(index)) {
        let newCard: Card;
        ({ collection: deck, item: newCard } = takeLastItem(deck));
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
      type: "playerShowedHand",
      hand,
      handRankInfo,
      score,
    });
    game = emitEventToOtherPlayers(game, player.id, {
      type: "otherPlayerShowedHand",
      username: player.username,
      hand,
      handRankInfo,
      score,
    });
  }

  game = { ...game, deck };

  return game;
}
