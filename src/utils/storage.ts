import { debounce } from 'debounce';
import { Player } from '../types';

const SAVE_TIMEOUT = 500;

const saveToStorage = (key: string, data: Object) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const savePlayersToStorage = debounce((players: Player[]) => {
  saveToStorage('players', players);
}, SAVE_TIMEOUT);

export const saveAddonsToStorage = debounce((addons: string[]) => {
  saveToStorage('addons', addons);
}, SAVE_TIMEOUT);

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
