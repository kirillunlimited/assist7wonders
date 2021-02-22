import { IScore, TScoreKey } from '../types';

const SCIENCE_KEYS = ['compass', 'tablet', 'gear'] as TScoreKey[];
const WILDCARD_SCIENCE_KEY = 'wildcards';
const TREASURY_KEY = 'treasury';

const scienceMemo: {
  [key: string]: number;
} = {
  '0:0:0:0': 0,
};

export function getTotal(playerScore: IScore): number {
  return getFlatTotal(playerScore) + getScienceTotal(playerScore) + getTreasuryTotal(playerScore);
}

export function getFlatTotal(playerScore: IScore): number {
  return (Object.keys(playerScore) as Array<TScoreKey>).reduce((sum, key) => {
    if (!SCIENCE_KEYS.includes(key) && key !== WILDCARD_SCIENCE_KEY && key !== TREASURY_KEY) {
      sum += playerScore[key];
    }
    return sum;
  }, 0);
}

function getScienceSum(scienceScores: number[]): number {
  const memoKey: string = [...scienceScores.sort(), 0].join(':');

  if (memoKey in scienceMemo) {
    return scienceMemo[memoKey];
  }

  const min = Math.min(...scienceScores);
  const sum = scienceScores.reduce((sum, score) => sum + score ** 2, 0);
  return sum + min * 7;
}

function getWildcardPossibilities(scienceScores: number[], wildcards: number): number {
  const memoKey: string = [...scienceScores.sort(), wildcards].join(':');

  if (memoKey in scienceMemo) {
    return scienceMemo[memoKey];
  }

  if (wildcards <= 0) {
    scienceMemo[memoKey] = getScienceSum(scienceScores);
    return scienceMemo[memoKey];
  }

  const possibilities = scienceScores.reduce((acc, score, index) => {
    return [
      ...acc,
      getWildcardPossibilities(
        [...scienceScores.slice(0, index), score + 1, ...scienceScores.slice(index + 1)],
        wildcards - 1
      ),
    ];
  }, [] as number[]);

  scienceMemo[memoKey] = Math.max(...possibilities);

  return scienceMemo[memoKey];
}

export function getScienceTotal(playerScore: IScore): number {
  const scienceScores = SCIENCE_KEYS.reduce((scienceScores, key) => {
    return [...scienceScores, playerScore[key]];
  }, [] as number[]);
  const wildcards = playerScore[WILDCARD_SCIENCE_KEY];
  return getWildcardPossibilities(scienceScores, wildcards);
}

export function getTreasuryTotal(playerScore: IScore): number {
  return Math.trunc(playerScore.treasury / 3);
}
