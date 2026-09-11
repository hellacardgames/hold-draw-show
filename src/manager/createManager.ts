import { createManagerFactory } from "@hellacardgames/lib";
import {
  createGame,
  getClientStateAndClearEvents,
  getEventsAndClearAcknowledged,
  holdCard,
  joinGame,
  leaveGame,
  MAX_PLAYERS,
  reportReadyForNextRound,
  reportReadyToDraw,
  sendChat,
  startGame,
  unholdCard,
} from "../game/index.js";

export type Manager = ReturnType<typeof createManager>;

export const createManager = createManagerFactory({
  maxPlayers: MAX_PLAYERS,
  createGame,
  getClientStateAndClearEvents,
  getEventsAndClearAcknowledged,
  joinGame,
  leaveGame,
  sendChat,
  startGame,
  gameplayActions: {
    holdCard,
    reportReadyForNextRound,
    reportReadyToDraw,
    unholdCard,
  },
});
