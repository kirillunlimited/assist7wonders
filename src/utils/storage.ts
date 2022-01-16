import { debounce } from 'debounce';
import { Player } from '../types';

// TODO: move to common constants
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

export const saveGameIdToStorage = debounce((gameId: number) => {
  saveToStorage('gameId', gameId);
}, SAVE_TIMEOUT);

export const saveAddonsToStorage = debounce((addons: string[]) => {
  saveToStorage('addons', addons);
}, SAVE_TIMEOUT);

export function getGameIdFromStorage(): number {
  return Number(localStorage.getItem('gameId')) || Date.now();
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
