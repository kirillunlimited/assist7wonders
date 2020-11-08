import {IScore} from "./types";

const SCIENCE_KEYS = [
	'compass',
	'tablet',
	'gear'
] as Array<keyof IScore>;

export function getSum(playerScore: IScore): number {
	return getFlatSum(playerScore) + getScienceSum(playerScore);
}

export function getFlatSum(playerScore: IScore): number {
	return (Object.keys(playerScore) as Array<keyof IScore>).reduce((sum, key) => {
		if (!SCIENCE_KEYS.includes(key)) {
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