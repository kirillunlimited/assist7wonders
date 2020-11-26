import {IPlayer} from "../types";

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

interface IAction {
	type: string;
	payload?: any;
}

const reducer = (state: IPlayer[], action: IAction) => {
	switch(action.type) {
		case 'init':
			return [
				...action.payload
			];
		case 'add':
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
		case 'delete':
			if (action.payload) {
				return [
					...state.filter(player => {
						return player.name !== action.payload
					})
				];
			}
			return state;
		case 'update':
			const player = state.find(player => player.name === action.payload.name);

			if (player) {
				return [
					...state.map(player => {
						if (player.name === action.payload.name) {
							return {
								...player,
								score: {
									...player.score,
									[action.payload.scoreKey]: action.payload.value
								}
							};
						} else {
							return player;
						}
					}),
				];
			}
			return state;
		case 'reset':
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
		case 'setAddon':
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