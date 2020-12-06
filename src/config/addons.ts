import {IAddons, TAddonsConfig, TScoreKeys} from '../types';

const ADDONS: TAddonsConfig = [
	{
		key: 'cities',
		label: 'Cities',
		scores: ['cities', 'debt']
	},
	{
		key: 'leaders',
		label: 'Leaders',
		scores: ['leaders']
	}
];

/** Get scores view availability based on toggled addons */
export function isScoresAvailable(scores: TScoreKeys[], addons: IAddons) {
	const addon = ADDONS.find(addon => scores.every(score => addon.scores.includes(score)));

	if (addon) {
		const activeAddons = (Object.keys(addons) as Array<keyof IAddons>).filter(addon => addons[addon]);
		return activeAddons.includes(addon.key);
	}

	return true;
}

export default ADDONS;