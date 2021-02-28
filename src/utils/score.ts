import { IPlayerScore, IGameScore } from '../types';

const SCIENCE_KEYS = ['compass', 'tablet', 'gear'];
const WILDCARD_SCIENCE_KEY = 'wildcards';
const TREASURY_KEY = 'treasury';

const scienceMemo: {
  [key: string]: number;
} = {
  '0:0:0:0': 0,
};

export function getTotal(playerScore: IPlayerScore, gameScores: IGameScore[]): number {
  const gameCounters = gameScores.map(score => score.counters).flat();
  const validPlayerScore = gameCounters.reduce((result, counter) => {
    return {
      ...result,
      [counter.id]: playerScore[counter.id],
    };
  }, {});
  return (
    getFlatTotal(validPlayerScore) +
    getScienceTotal(validPlayerScore) +
    getTreasuryTotal(validPlayerScore)
  );
}

export function getFlatTotal(playerScore: IPlayerScore): number {
  return Object.keys(playerScore).reduce((sum, key) => {
    if (!SCIENCE_KEYS.includes(key) && key !== WILDCARD_SCIENCE_KEY && key !== TREASURY_KEY) {
      sum += playerScore[key] || 0;
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

export function getScienceTotal(playerScore: IPlayerScore): number {
  const scienceScores = SCIENCE_KEYS.reduce((scienceScores, key) => {
    return [...scienceScores, playerScore[key] || 0];
  }, [] as number[]);
  const wildcards = playerScore[WILDCARD_SCIENCE_KEY] || 0;
  return getWildcardPossibilities(scienceScores, wildcards);
}

export function getTreasuryTotal(playerScore: IPlayerScore): number {
  return playerScore.treasury ? Math.trunc(playerScore.treasury / 3) : 0;
}
