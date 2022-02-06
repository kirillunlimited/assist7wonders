  import {
  saveGamesToStorage,
  getGamesFromStorage,
} from './storage';
import {
  readUserDataFromDb,
  saveGamesToDb,
} from './database';
import { GameState } from '../types';

export function saveGames(userId: string, games: GameState[]) {
  userId && saveGamesToDb(userId, games);
  saveGamesToStorage(games)
}

export async function getSavedGames(userId?: string): Promise<GameState[]> {
  if (userId) {
    const { games } = await readUserDataFromDb(userId);
    return games || [];
  } else {
    return getGamesFromStorage();
  }
}
