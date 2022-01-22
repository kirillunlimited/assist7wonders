  import {
  savePlayersToStorage,
  saveGameIdToStorage,
  saveAddonsToStorage,
  getGameIdFromStorage,
  getPlayersFromStorage,
  getAddonsFromStorage,
} from './storage';
import { readUserDataFromDb, saveGameDataToDb } from './database';
import { Player } from '../types';

export function saveAll(userId: string, gameId: number, addons: string[], players: Player[] = []) {
  userId && saveGameDataToDb(userId, gameId, {
    players,
    addons
  });
  saveGameIdToStorage(gameId);
  saveAddonsToStorage(addons);
  savePlayersToStorage(players);
}

export function saveAddons(userId: string, gameId: number, addons: string[]) {
  userId && saveGameDataToDb(userId, gameId, {
    addons,
  });
  saveAddonsToStorage(addons);
}

export function savePlayers(userId: string, gameId: number, players: Player[]) {
  userId && saveGameDataToDb(userId, gameId, {
    players,
  });
  savePlayersToStorage(players);
}

export async function getLastSavedGame(userId?: string) {
  /** Authorized */
  if (userId) {
    const { games } = await readUserDataFromDb(userId);

    if (games) {
      const gameIds = Object.keys(games);
      const gameId = Number(gameIds[gameIds.length - 1]);
      const { addons, players } = games[gameId];
      return {
        gameId,
        addons,
        players
      }
    }
  }

  /** Unauthorized */
  const gameId = getGameIdFromStorage();
  const addons = getAddonsFromStorage();
  const players = getPlayersFromStorage();
  return {
    gameId,
    addons,
    players,
  };
}
