import type { StartedGame } from "../types/Game.js";

export function areAllPlayersReadyToDraw(game: StartedGame): boolean {
  return game.players
    .map((p) => p.status === "readyToDraw")
    .reduce((previous, current) => previous && current, true);
}
