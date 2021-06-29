import { PlayerScore, GameScoreSumResult } from '../types';
import { getScienceTotal } from './science';

export const SCIENCE_KEYS = ['gears', 'compass', 'tablets'];
export const MOSTCARD_SCIENCE_KEY = 'mostcards';
export const WILDCARD_SCIENCE_KEY = 'wildcards';
export const MASK_SCIENCE_KEY = 'masks';
const TREASURY_KEY = 'treasury';

const EXCLUDE_FLAT_SUM_KEYS = [
  ...SCIENCE_KEYS,
  WILDCARD_SCIENCE_KEY,
  MASK_SCIENCE_KEY,
  TREASURY_KEY,
];

export function getTotal(playerScore: PlayerScore, neighborScores: PlayerScore[]): number {
  return (
    getFlatTotal(playerScore) +
    getScienceTotal(playerScore, neighborScores).result +
    getTreasuryTotal(playerScore).result
  );
}

export function getFlatTotal(playerScore: PlayerScore): number {
  return Object.keys(playerScore).reduce((sum, key) => {
    if (!EXCLUDE_FLAT_SUM_KEYS.includes(key)) {
      sum += playerScore[key] || 0;
    }
    return sum;
  }, 0);
}

export function getTreasuryTotal(playerScore: PlayerScore): GameScoreSumResult {
  const result = playerScore.treasury ? Math.trunc(playerScore.treasury / 3) : 0;
  return {
    result,
    calculations: `Σ <strong>${result.toString()}</strong>`,
  };
}

export function isMinValue(value: number, min?: number): boolean {
  return min !== undefined && value <= min;
}

export function isMaxValue(value: number, max?: number): boolean {
  return max !== undefined && value >= max;
}
