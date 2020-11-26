import {IAddons} from "../types";

export const addonsTemplate: IAddons = {
	cities: false,
	leaders: false
};

interface IAction {
	type: string;
	payload?: any;
}

const reducer = (state: IAddons, action: IAction) => {
	switch(action.type) {
		case 'init':
			return {
				...action.payload
			};
		case 'toggle':
			return {
				...state,
				[action.payload.addon]: action.payload.value
			};
		default:
			return state;
	}
}

export default reducer;