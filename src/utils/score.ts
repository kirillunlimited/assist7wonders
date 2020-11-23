import {IScore, TScoreKeys} from "../types";

const SCIENCE_KEYS = [
	'compass',
	'tablet',
	'gear'
] as Array<TScoreKeys>;

export function getSum(playerScore: IScore): number {
	return getFlatSum(playerScore) + getScienceSum(playerScore) + getTreasurySum(playerScore);
}

export function getFlatSum(playerScore: IScore): number {
	return (Object.keys(playerScore) as Array<TScoreKeys>).reduce((sum, key) => {
		if (!SCIENCE_KEYS.includes(key) && key !== 'treasury') {
			const value = playerScore[key];
			sum += value;
		}
		return sum;
	}, 0);
}

export function getScienceSum(playerScore: IScore): number {
	let {sum, min} = SCIENCE_KEYS
		.reduce(({sum, min}, key) => {
			sum += playerScore[key] ** 2;
			min = Math.min(min, playerScore[key]);
			return {sum, min};
		}, {sum: 0, min: playerScore[SCIENCE_KEYS[0]]});

	return sum + min * 7;
}

export function getTreasurySum(playerScore: IScore): number {
	return Math.trunc(playerScore.treasury / 3);
}