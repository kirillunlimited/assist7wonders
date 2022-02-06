import { saveGamesToStorage, getGamesFromStorage } from './storage';
import { getUserGamesFromDb, saveUserGamesToDb } from './database';
import { GamesState } from '../types';

export function getSavedGames(): GamesState {
  return getGamesFromStorage();
}

export function saveGames(games: GamesState) {
  saveGamesToStorage(games)
}

export function getUserData(userId: string): Promise<GamesState> {
  return getUserGamesFromDb(userId);
}

export async function saveUserData(userId: string, games: GamesState) {
  saveUserGamesToDb(userId, games);
}
