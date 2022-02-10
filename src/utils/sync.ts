import { saveGamesToStorage, getGamesFromStorage } from './storage';
import { getUserGamesFromDb, saveUserGamesToDb, addGamesToDb } from './database';
import { GamesState } from '../types';

// TODO: Get rid of this file

export function getSavedGames(): GamesState {
  return getGamesFromStorage();
}

export function saveGames(games: GamesState) {
  saveGamesToStorage(games)
}

export function getUserData(userId: string) {
  return getUserGamesFromDb(userId);
}

export async function saveUserData(userId: string, games: GamesState) {
  saveUserGamesToDb(userId, games);
}

export async function addGames(userId: string, games: GamesState) {
  addGamesToDb(userId, games);
};
