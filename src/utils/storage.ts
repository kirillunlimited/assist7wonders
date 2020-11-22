import {debounce} from "debounce";
import {IPlayer} from "../types";

export const savePlayersToStorage = debounce((players: IPlayer[]) => {
	localStorage.setItem('players', JSON.stringify(players));
}, 500);

export function getPlayersFromStorage(): IPlayer[] {
	const playersString = localStorage.getItem('players');

	if (playersString) {
		return JSON.parse(playersString);
	}

	return [];
}