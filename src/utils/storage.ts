import {debounce} from "debounce";
import {IAddons, IPlayer} from "../types";
import {addonsTemplate} from '../App';

const SAVE_TIMEOUT = 500;

const saveToStorage = (key: string, data: Object) => {
	localStorage.setItem(key, JSON.stringify(data));
}

export const savePlayersToStorage = debounce((players: IPlayer[]) => {
	saveToStorage('players', players);
}, SAVE_TIMEOUT);

export const saveAddonsToStorage = debounce((addons: IAddons) => {
	saveToStorage('addons', addons);
}, SAVE_TIMEOUT);

export function getPlayersFromStorage(): IPlayer[] {
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