  import {
  savePlayersToStorage,
  saveGameIdToStorage,
  saveAddonsToStorage,
  getGameIdFromStorage,
  getPlayersFromStorage,
  getAddonsFromStorage,
} from './storage';
import { readUserDataFromDb, saveGameDataToDb } from './database';
import { Player, HistoryGame } from '../types';

export function saveAll(userId: string, gameId: number, addons: string[], players: Player[] = []): void {
  userId && saveGameDataToDb(userId, gameId, {
    players,
    addons
  });
  saveGameIdToStorage(gameId);
  saveAddonsToStorage(addons);
  savePlayersToStorage(players);
}

export function saveAddons(userId: string, gameId: number, addons: string[]): void {
  userId && saveGameDataToDb(userId, gameId, {
    addons,
  });
  saveAddonsToStorage(addons);
}

export function savePlayers(userId: string, gameId: number, players: Player[]): void {
  userId && saveGameDataToDb(userId, gameId, {
    players,
  });
  savePlayersToStorage(players);
}

export function getLastSavedGame(): {
  gameId: number,
  addons: string[],
  players: Player[]
} {
  const gameId = getGameIdFromStorage();
  const addons = getAddonsFromStorage();
  const players = getPlayersFromStorage();
  return {
    gameId,
    addons,
    players,
  };
}

export async function getHistoryGames(userId: string): Promise<HistoryGame[]> {
  if (userId) {
    const { games } = await readUserDataFromDb(userId);
    return Object.keys(games).map(gameId => ({
      ...games[gameId],
      gameId: Number(gameId),
    }))
  }
  return [];
}
