import type { StartedGame } from "../types/Game.js";

export function allPlayersLockedHolds(game: StartedGame): boolean {
  return game.players
    .map((p) => p.status === "holdsLocked")
    .reduce((previous, current) => previous && current, true);
}
