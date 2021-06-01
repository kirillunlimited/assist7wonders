import { PlayerScore, GameScoreSumResult } from '../types';

const SCIENCE_KEYS = ['gear', 'compass', 'tablet'];
const WILDCARD_SCIENCE_KEY = 'wildcard';
const MASK_SCIENCE_KEY = 'mask';
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

export function getScienceTotal(
  playerScore: PlayerScore,
  neighborScores: PlayerScore[]
): GameScoreSumResult {
  const scienceScores = SCIENCE_KEYS.reduce((scienceScores, key) => {
    return [...scienceScores, playerScore[key] || 0];
  }, [] as number[]);
  const wildcards = playerScore[WILDCARD_SCIENCE_KEY] || 0;
  const masks = playerScore[MASK_SCIENCE_KEY] || 0;
  const neighborScienceScores = neighborScores.map(neighborScore => {
    return SCIENCE_KEYS.reduce((acc, key) => {
      return [...acc, neighborScore[key] || 0];
    }, [] as number[]);
  });

  /**
   * ARMADA -> AGANICE -> WILDCARDS -> MASKS ->
   */

  const wildcardPossibilities = getWildcardPossibilities(scienceScores, wildcards);
  const maskPossibilities = getMaskPossibilities(
    wildcardPossibilities,
    neighborScienceScores,
    masks
  );
  const { result, possibility } = getBestSciencePossibility(maskPossibilities);
  const calculations = getScienceCalculations(possibility, result);
  return { result, calculations };
}

function getWildcardPossibilities(scienceScores: number[], wildcards: number): number[][] {
  if (wildcards === 0) {
    return [scienceScores];
  }

  const [gear, compass, tablet] = scienceScores;
  const possibilities: number[][] = [];

  for (let dg = 0; dg <= wildcards; dg++) {
    for (let dc = 0; dc <= wildcards - dg; dc++) {
      const dt = wildcards - dg - dc;
      possibilities.push([gear + dg, compass + dc, tablet + dt]);
    }
  }
  return possibilities;
}

function getMaskPossibilities(
  scienceScores: number[][],
  neighborScienceScores: number[][],
  masks: number
): number[][] {
  if (masks === 0) {
    return scienceScores;
  }

  const [ng, nc, nt] = neighborScienceScores.reduce(
    (acc, neighborScore) => {
      neighborScore.forEach((score, index) => {
        acc[index] += score;
      });
      return acc;
    },
    [0, 0, 0] as number[]
  );

  const possibilities: number[][] = [];
  scienceScores.forEach(score => {
    const [gear, compass, tablet] = score;
    const maxGear = Math.min(masks, ng);
    for (let dg = 0; dg <= maxGear; dg++) {
      const maxCompass = Math.min(masks - dg, nc);
      for (let dc = 0; dc <= maxCompass; dc++) {
        const dt = Math.min(masks - dg - dc, nt);
        possibilities.push([gear + dg, compass + dc, tablet + dt]);
      }
    }
  });

  return possibilities;
}

export function getBestSciencePossibility(
  possibilities: number[][]
): { result: number; possibility: number[] } {
  return possibilities.reduce(
    (bestPossibility, possibility) => {
      const result = getScienceScore(possibility);
      if (result > bestPossibility.result) {
        return {
          result,
          possibility,
        };
      }
      return bestPossibility;
    },
    {
      result: 0,
      possibility: [0, 0, 0],
    } as { result: number; possibility: number[] }
  );
}

function getScienceScore(scienceScores: number[]): number {
  const min = Math.min(...scienceScores);
  const sum = scienceScores.reduce((sum, score) => sum + score ** 2, 0);
  return sum + min * 7;
}

function getScienceCalculations(scienceScores: number[], result: number): string {
  const min = Math.min(...scienceScores);
  const sum = scienceScores.reduce((sum, score) => `${sum}${score}<sup>2</sup> + `, '');
  return `${sum}${min} × 7 = <strong>${result}</strong>`;
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
