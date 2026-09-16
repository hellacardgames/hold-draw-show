import {
  getClientStateAndClearEventsFactory,
  requirePlayer,
} from "@hellacardgames/lib";
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
  player: {
    username: player.username,
    status: player.status,
    hand: player.hand,
    handRankInfo: player.handRankInfo,
    heldCardIndices: player.heldCardIndices,
    score: player.score,
  },
  otherPlayers: game.players
    .filter((p) => p.id !== player.id)
    .map((otherPlayer) => ({
      username: otherPlayer.username,
      status: otherPlayer.status,
      hand: getOtherPlayerHand(otherPlayer),
      handRankInfo: getOtherPlayerHandRankInfo(otherPlayer),
      heldCardIndices: otherPlayer.heldCardIndices,
      score: otherPlayer.score,
    })),
  adminUsername: requirePlayer(game, game.adminId).player.username,
  expiresAt: game.expiresAt,
  chatMessages: game.chatMessages,
  roundsCompleted: game.roundsCompleted,
}));

function getOtherPlayerHand(player: Player) {
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

function getOtherPlayerHandRankInfo(player: Player) {
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
