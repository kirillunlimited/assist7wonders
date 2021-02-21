import { debounce } from 'debounce';
import { IAddons, TPlayers } from '../types';
import { addonsTemplate } from '../reducers/addons';

const SAVE_TIMEOUT = 500;

const saveToStorage = (key: string, data: Object) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const savePlayersToStorage = debounce((players: TPlayers) => {
  saveToStorage('players', players);
}, SAVE_TIMEOUT);

export const saveAddonsToStorage = debounce((addons: IAddons) => {
  saveToStorage('addons', addons);
}, SAVE_TIMEOUT);

export function getPlayersFromStorage(): TPlayers {
  const playersString = localStorage.getItem('players');

  if (playersString) {
    return JSON.parse(playersString);
  }

  return [];
}

export function getAddonsFromStorage(): IAddons {
  const addonsString = localStorage.getItem('addons');

  if (addonsString) {
    return JSON.parse(addonsString);
  }

  return addonsTemplate;
}
