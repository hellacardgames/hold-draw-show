import type { ClientState, GameEvent } from "../client/index.js";

export function applyEvent(
  previousState: ClientState,
  event: GameEvent,
): ClientState {
  switch (event.type) {
    case "adminChanged":
      return {
        ...previousState,
        adminUsername: event.username,
      };
    case "chat":
      return {
        ...previousState,
        chatMessages: [...previousState.chatMessages, event.message],
      };
    case "expirationUpdated":
      return { ...previousState, expiresAt: event.expiresAt };
    case "gameCompleted":
      return { ...previousState, status: "completed" };
    case "gameForfeited":
      return { ...previousState, status: "forfeited" };
    case "gameStarted":
      return { ...previousState, status: "started" };
    case "otherPlayerHandInitialized":
      return {
        ...previousState,
        otherPlayers: previousState.otherPlayers.map((p) => {
          if (p.username === event.username) {
            return {
              ...p,
              status: "selectingHolds",
              hand: event.hand,
              handRankInfo: null,
              heldCardIndices: [],
            };
          }
          return p;
        }),
      };
    case "otherPlayerHeldCard":
      return {
        ...previousState,
        otherPlayers: previousState.otherPlayers.map((p) => {
          if (p.username === event.username) {
            return {
              ...p,
              heldCardIndices: [...p.heldCardIndices, event.index],
            };
          }
          return p;
        }),
      };
    case "otherPlayerJoined":
      return {
        ...previousState,
        otherPlayers: [
          ...previousState.otherPlayers,
          {
            username: event.username,
            status: "waitingForGameToStart",
            hand: [],
            handRankInfo: null,
            heldCardIndices: [],
            score: 0,
          },
        ],
      };
    case "otherPlayerLeft":
      return {
        ...previousState,
        otherPlayers: [
          ...previousState.otherPlayers.filter(
            (p) => p.username !== event.username,
          ),
        ],
      };
    case "otherPlayerLockedHolds":
      return {
        ...previousState,
        otherPlayers: previousState.otherPlayers.map((p) => {
          if (p.username === event.username) {
            return { ...p, status: "holdsLocked" };
          }
          return p;
        }),
      };
    case "otherPlayerReadyForNextRound":
      return {
        ...previousState,
        otherPlayers: previousState.otherPlayers.map((p) => {
          if (p.username === event.username) {
            return { ...p, status: "readyForNextRound" };
          }
          return p;
        }),
      };
    case "otherPlayerShowedHand":
      return {
        ...previousState,
        otherPlayers: previousState.otherPlayers.map((p) => {
          if (p.username === event.username) {
            return {
              ...p,
              status: "reviewingOutcome",
              hand: event.hand,
              handRankInfo: event.handRankInfo,
              score: event.score,
            };
          }
          return p;
        }),
      };
    case "otherPlayerUnheldCard":
      return {
        ...previousState,
        otherPlayers: previousState.otherPlayers.map((p) => {
          if (p.username === event.username) {
            return {
              ...p,
              heldCardIndices: p.heldCardIndices.filter(
                (i) => i !== event.index,
              ),
            };
          }
          return p;
        }),
      };
    case "playerHandInitialized":
      return {
        ...previousState,
        player: {
          ...previousState.player,
          status: "selectingHolds",
          hand: event.hand,
          handRankInfo: event.handRankInfo,
          heldCardIndices: [],
        },
      };
    case "playerHeldCard":
      return {
        ...previousState,
        player: {
          ...previousState.player,
          heldCardIndices: [
            ...previousState.player.heldCardIndices,
            event.index,
          ],
        },
      };
    case "playerLockedHolds":
      return {
        ...previousState,
        player: {
          ...previousState.player,
          status: "holdsLocked",
        },
      };
    case "playerReadyForNextRound":
      return {
        ...previousState,
        player: {
          ...previousState.player,
          status: "readyForNextRound",
        },
      };
    case "playerShowedHand":
      return {
        ...previousState,
        player: {
          ...previousState.player,
          status: "reviewingOutcome",
          hand: event.hand,
          handRankInfo: event.handRankInfo,
          score: event.score,
        },
      };
    case "playerUnheldCard":
      return {
        ...previousState,
        player: {
          ...previousState.player,
          heldCardIndices: previousState.player.heldCardIndices.filter(
            (i) => i !== event.index,
          ),
        },
      };
    case "roundCompleted":
      return {
        ...previousState,
        roundsCompleted: previousState.roundsCompleted + 1,
      };
  }
}
