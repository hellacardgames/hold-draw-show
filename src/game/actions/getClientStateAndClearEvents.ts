import { getClientStateAndClearEventsFactory } from "@hellacardgames/lib";
import { CARDS_PER_HAND } from "../constants.js";
import type { ClientState } from "../types/ClientState.js";
import type { Game } from "../types/Game.js";
import type { Player } from "../types/Player.js";

export const getClientStateAndClearEvents = getClientStateAndClearEventsFactory<
  Game,
  ClientState
>((game, player) => ({
  status: game.status,
  gameId: game.id,
  playerId: player.id,
  username: player.username,
  players: game.players.map((p) => ({
    username: p.username,
    status: p.status,
    hand: getPlayerHand(p),
    handRankInfo: getPlayerHandRankInfo(p),
    heldCardIndices: p.heldCardIndices,
    score: p.score,
  })),
  expiresAt: game.expiresAt,
  chatMessages: game.chatMessages,
  hand: player.hand,
  handRankInfo: player.handRankInfo,
  roundsCompleted: game.roundsCompleted,
}));

function getPlayerHand(player: Player) {
  switch (player.status) {
    case "selectingHolds":
    case "readyToDraw":
      return Array.from({ length: CARDS_PER_HAND }, () => null);
    case "waitingForGameToStart":
    case "reviewingOutcome":
    case "readyForNextRound":
      return player.hand;
  }
}

function getPlayerHandRankInfo(player: Player) {
  switch (player.status) {
    case "selectingHolds":
    case "readyToDraw":
      return null;
    case "waitingForGameToStart":
    case "reviewingOutcome":
    case "readyForNextRound":
      return player.handRankInfo;
  }
}
