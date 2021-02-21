import { IScore, TScoreKey } from '../types';

const SCIENCE_KEYS = ['compass', 'tablet', 'gear'] as TScoreKey[];
const WILDCARD_SCIENCE_KEY = 'wildcards';
const TREASURY_KEY = 'treasury';

export function getTotalSum(playerScore: IScore): number {
  return getFlatSum(playerScore) + getScienceTotalSum(playerScore) + getTreasurySum(playerScore);
}

export function getFlatSum(playerScore: IScore): number {
  return (Object.keys(playerScore) as Array<TScoreKey>).reduce((sum, key) => {
    if (!SCIENCE_KEYS.includes(key) && key !== WILDCARD_SCIENCE_KEY && key !== TREASURY_KEY) {
      const value = playerScore[key];
      sum += value;
    }
    return sum;
  }, 0);
}

export function getSum(playerScore: IScore, scoreKey: TScoreKey): number {
  return playerScore[scoreKey];
}

export function getScienceSum(playerScore: IScore): number {
  let { sum, min } = SCIENCE_KEYS.reduce(
    ({ sum, min }, key) => {
      sum += playerScore[key] ** 2;
      min = Math.min(min, playerScore[key]);
      return { sum, min };
    },
    { sum: 0, min: playerScore[SCIENCE_KEYS[0]] }
  );

  return sum + min * 7;
}

export function getWildcardPossibilities(playerScore: IScore, wildcards: number): number[] {
  if (wildcards <= 0) {
    return [getScienceSum(playerScore)];
  }
  return SCIENCE_KEYS.reduce((sum, key) => {
    const value = playerScore[key];
    return [
      ...sum,
      Math.max(
        ...getWildcardPossibilities(
          {
            ...playerScore,
            [key]: value + 1,
          },
          wildcards - 1
        )
      ),
    ];
  }, [] as number[]);
}

export function getScienceTotalSum(playerScore: IScore): number {
  const wildcards = playerScore[WILDCARD_SCIENCE_KEY];
  return Math.max(...getWildcardPossibilities(playerScore, wildcards));
}

export function getTreasurySum(playerScore: IScore): number {
  return Math.trunc(playerScore.treasury / 3);
}
