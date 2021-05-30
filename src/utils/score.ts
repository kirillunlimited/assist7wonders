import { PlayerScore } from '../types';

const SCIENCE_KEYS = ['compass', 'tablet', 'gear'];
const WILDCARD_SCIENCE_KEY = 'wildcards';
const MASK_SCIENCE_KEY = 'masks';
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
    getScienceTotal(playerScore, neighborScores) +
    getTreasuryTotal(playerScore)
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

function getScienceScore(scienceScores: number[]): number {
  const min = Math.min(...scienceScores);
  const sum = scienceScores.reduce((sum, score) => sum + score ** 2, 0);
  return sum + min * 7;
}

function getMaskPossibilities(
  scienceScores: number[],
  neighborScienceScores: number[][],
  masks: number
): number {
  const score = getScienceScore(scienceScores);
  if (masks === 0) {
    return score;
  }

  const [compasses, tablets, gears] = scienceScores;
  let maxScore = score;

  const [nc, nt, ng] = neighborScienceScores.reduce(
    (acc, neighborScore) => {
      neighborScore.forEach((score, index) => {
        acc[index] += score;
      });
      return acc;
    },
    [0, 0, 0] as number[]
  );

  const maxCompasses = Math.min(masks, nc);
  for (let dc = 0; dc <= maxCompasses; dc++) {
    const maxTablets = Math.min(masks - dc, nt);
    for (let dt = 0; dt <= maxTablets; dt++) {
      const dg = Math.min(masks - dc - dt, ng);
      const s = getScienceScore([compasses + dc, tablets + dt, gears + dg]);
      if (s > maxScore) {
        maxScore = s;
      }
    }
  }
  return maxScore;
}

function getAllPossibilities(
  scienceScores: number[],
  neighborScienceScores: number[][],
  wildcards: number,
  masks: number
): number {
  const score = getScienceScore(scienceScores);
  if (wildcards === 0 && masks === 0) {
    return score;
  }

  const [compasses, tablets, gears] = scienceScores;
  let maxScore = score;

  for (let dc = 0; dc <= wildcards; dc++) {
    for (let dt = 0; dt <= wildcards - dc; dt++) {
      const dg = wildcards - dc - dt;
      const s = getMaskPossibilities(
        [compasses + dc, tablets + dt, gears + dg],
        neighborScienceScores,
        masks
      );
      if (s > maxScore) {
        maxScore = s;
      }
    }
  }
  return maxScore;
}

export function getScienceTotal(playerScore: PlayerScore, neighborScores: PlayerScore[]): number {
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
  return getAllPossibilities(scienceScores, neighborScienceScores, wildcards, masks);
}

export function getTreasuryTotal(playerScore: PlayerScore): number {
  return playerScore.treasury ? Math.trunc(playerScore.treasury / 3) : 0;
}

export function isMinValue(value: number, min?: number): boolean {
  return min !== undefined && value <= min;
}

export function isMaxValue(value: number, max?: number): boolean {
  return max !== undefined && value >= max;
}
