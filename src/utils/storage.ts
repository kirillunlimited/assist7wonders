import { debounce } from 'debounce';
import { Player } from '../types';
import { nanoid } from 'nanoid'

const SAVE_TIMEOUT = 500;

const saveToStorage = (key: string, data: string | Object) => {
  if (typeof data === 'string') {
    localStorage.setItem(key, data);
    return;
  }
  localStorage.setItem(key, JSON.stringify(data));
};

export const savePlayersToStorage = debounce((players: Player[]) => {
  saveToStorage('players', players);
}, SAVE_TIMEOUT);

export const saveGameIdToStorage = debounce((gameId: string) => {
  saveToStorage('gameId', gameId);
}, SAVE_TIMEOUT);

export const saveAddonsToStorage = debounce((addons: string[]) => {
  saveToStorage('addons', addons);
}, SAVE_TIMEOUT);

export function getGameIdFromStorage(): string {
  return localStorage.getItem('gameId') || nanoid();
}

export function getPlayersFromStorage(): Player[] {
  const playersString = localStorage.getItem('players');

  if (playersString) {
    return JSON.parse(playersString);
  }

  return [];
}

export function getAddonsFromStorage(): string[] {
  const addonsString = localStorage.getItem('addons');

  if (addonsString) {
    return JSON.parse(addonsString);
  }

  return [];
}
