import type { StartedGame } from "../types/Game.js";

export function areAllPlayersReadyForNextRound(game: StartedGame): boolean {
  return game.players
    .map((p) => p.status === "readyForNextRound")
    .reduce((previous, current) => previous && current, true);
}
