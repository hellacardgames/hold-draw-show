export { createClient } from "./createClient.js";
import type { Client } from "./createClient.js";

export type { Client };

export type CreateGameResult = Awaited<ReturnType<Client["createGame"]>>;
export type GetClientStateAndClearEventsResult = Awaited<
  ReturnType<Client["getClientStateAndClearEvents"]>
>;
export type GetEventsAndClearAcknowledgedResult = Awaited<
  ReturnType<Client["getEventsAndClearAcknowledged"]>
>;
export type GetJoinableGamesResult = Awaited<
  ReturnType<Client["getJoinableGames"]>
>;
export type HoldCardResult = Awaited<ReturnType<Client["holdCard"]>>;
export type JoinGameResult = Awaited<ReturnType<Client["joinGame"]>>;
export type LeaveGameResult = Awaited<ReturnType<Client["leaveGame"]>>;
export type ReportReadyForNextRoundResult = Awaited<
  ReturnType<Client["reportReadyForNextRound"]>
>;
export type ReportReadyToDrawResult = Awaited<
  ReturnType<Client["reportReadyToDraw"]>
>;
export type SendChatResult = Awaited<ReturnType<Client["sendChat"]>>;
export type StartGameResult = Awaited<ReturnType<Client["startGame"]>>;
export type UnholdCardResult = Awaited<ReturnType<Client["unholdCard"]>>;

export type {
  Card,
  ChatMessage,
  ClientState,
  GameEvent,
} from "../game/index.js";
