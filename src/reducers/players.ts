import {IAddons, TPlayers, TScoreKeys} from "../types";

const scoreTemplate = {
	military: 0,
	treasury: 0,
	wonders: 0,
	civilian: 0,
	commerce: 0,
	guild: 0,
	compass: 0,
	tablet: 0,
	gear: 0,
	cities: 0,
	debt: 0,
	leaders: 0
};

const INIT = 'INIT';
const ADD = 'ADD';
const DELETE = 'DELETE';
const UPDATE = 'UPDATE';
const RESET = 'RESET';
const SET_ADDON = 'SET_ADDON';

interface IInitAction {
	type: typeof INIT;
	payload: TPlayers;
}

interface IAddAction {
	type: typeof ADD;
	payload: string;
}

interface IDeleteAction {
	type: typeof DELETE;
	payload: string;
}

interface IUpdateAction {
	type: typeof UPDATE;
	payload: {
		name: string;
		scoreKey: TScoreKeys;
		value: number;
	};
}

interface IResetAction {
	type: typeof RESET;
}

interface ISetAddonAction {
	type: typeof SET_ADDON;
	payload: IAddons;
}

export type TAction = IInitAction | IAddAction | IDeleteAction | IUpdateAction | IResetAction | ISetAddonAction;

const reducer = (state: TPlayers, action: TAction) => {
	switch(action.type) {
		case INIT:
			return [
				...action.payload
			];
		case ADD:
			if (action.payload) {
				return [
					...state, {
						name: action.payload,
						score: {
							...scoreTemplate
						}
					}
				]
			}
			return state;
		case DELETE:
			if (action.payload) {
				return [
					...state.filter(player => {
						return player.name !== action.payload
					})
				];
			}
			return state;
		case UPDATE:
			const {name, scoreKey, value} = action.payload;

			const player = state.find(player => player.name === name);

			if (player) {
				return [
					...state.map(player => {
						if (player.name === name) {
							return {
								...player,
								score: {
									...player.score,
									[scoreKey]: value
								}
							};
						} else {
							return player;
						}
					}),
				];
			}
			return state;
		case RESET:
			return [
				...state.map(player => {
					return {
						...player,
						score: {
							...scoreTemplate
						}
					}
				}),
			];
		case SET_ADDON:
			// TODO
			// const disabledAddonsScore = action.payload.addons.reduce((score, addon) => {
			// 	if (!addon) {
			// 		score[addon] = 0;
			// 	}
			// 	return score;
			// }, {});
			//
			// return {
			// 	...state.map(player => {
			// 		return {
			// 			...player,
			// 			score: {
			// 				...player.score,
			// 				...disabledAddonsScore
			// 			}
			// 		}
			// 	}),
			// }
			return state;
		default:
			return state;
	}
}

export default reducer;