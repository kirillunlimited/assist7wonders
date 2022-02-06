import { debounce } from 'debounce';
import { GameState } from '../types';
import { SAVE_TIMEOUT } from '../config/constants';

const GAMES_STORAGE_KEY = 'games';

const saveToStorage = (key: string, data: string | Object) => {
  if (typeof data === 'string') {
    localStorage.setItem(key, data);
    return;
  }
  localStorage.setItem(key, JSON.stringify(data));
};

export const saveGamesToStorage = debounce((games: GameState[]) => {
  saveToStorage(GAMES_STORAGE_KEY, games);
}, SAVE_TIMEOUT);

export const getGamesFromStorage = () => {
  const gamesString = localStorage.getItem(GAMES_STORAGE_KEY);

  if (gamesString) {
    return JSON.parse(gamesString);
  }

  return [];
}
