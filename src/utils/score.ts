import { IPlayerScore, IGameScore } from '../types';

const SCIENCE_KEYS = ['compass', 'tablet', 'gear'];
const WILDCARD_SCIENCE_KEY = 'wildcards';
const TREASURY_KEY = 'treasury';

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

function getScienceScore(scienceScores: number[]): number {
  const min = Math.min(...scienceScores);
  const sum = scienceScores.reduce((sum, score) => sum + score ** 2, 0);
  return sum + min * 7;
}

function getWildcardPossibilities(scienceScores: number[], wildcards: number): number {
  const score = getScienceScore(scienceScores);
  if(wildcards === 0) {
    return score;
  }

  const [compasses, tablets, gears] = scienceScores;
  let maxScore = score;
  for(let dc = 0; dc <= wildcards; dc++) 
  for(let dt = 0; dt <= wildcards-dc; dt++) {
    const dg = wildcards - dc - dt;
    const s = getScienceScore([compasses+dc, tablets+dt, gears+dg]);
    if(s > maxScore) {
      maxScore = s;
    }
  }
  return maxScore;
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

export function isMinValue(value: number, min?: number): boolean {
  return min !== undefined && value <= min;
}

export function isMaxValue(value: number, max?: number): boolean {
  return max !== undefined && value >= max;
}
