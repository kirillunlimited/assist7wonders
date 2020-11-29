import {IAddons, IAddonsConfig, TScoreKeys} from '../types';

const ADDONS: IAddonsConfig = {
	cities: {
		label: 'Cities',
		scores: ['cities', 'debt']
	},
	leaders: {
		label: 'Leaders',
		scores: ['leaders']
	}
}

/** Get scores view availability based on toggled addons */
export function isScoresAvailable(scores: TScoreKeys[], addons: IAddons) {
	const addon = (Object.keys(ADDONS) as Array<keyof IAddons>)
		.find(addon => scores
			.every(score => ADDONS[addon].scores.includes(score)));

	if (addon) {
		const activeAddons = (Object.keys(addons) as Array<keyof IAddons>).filter(addon => addons[addon]);
		return activeAddons.includes(addon);
	}

	return true;
}

export default ADDONS;