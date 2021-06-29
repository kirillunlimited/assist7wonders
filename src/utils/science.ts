import { PlayerScore, GameScoreSumResult } from '../types';
import {
  SCIENCE_KEYS,
  MOSTCARD_SCIENCE_KEY,
  WILDCARD_SCIENCE_KEY,
  MASK_SCIENCE_KEY,
} from './score';

export function getScienceTotal(
  playerScore: PlayerScore,
  neighborScores: PlayerScore[]
): GameScoreSumResult {
  const scienceScores = SCIENCE_KEYS.reduce((scienceScores, key) => {
    return [...scienceScores, playerScore[key] || 0];
  }, [] as number[]);
  const mostcards = playerScore[MOSTCARD_SCIENCE_KEY] || 0;
  const wildcards = playerScore[WILDCARD_SCIENCE_KEY] || 0;
  const masks = playerScore[MASK_SCIENCE_KEY] || 0;
  const neighborScienceScores = neighborScores.map(neighborScore => {
    return SCIENCE_KEYS.reduce((acc, key) => {
      return [...acc, neighborScore[key] || 0];
    }, [] as number[]);
  });

  /**
   * MOSTCARDS -> AGANICE -> WILDCARDS -> MASKS
   */

  const mostcardPossibilities = getMostcardPossibilities(scienceScores, mostcards);
  const wildcardPossibilities = getWildcardPossibilities(mostcardPossibilities, wildcards);
  const maskPossibilities = getMaskPossibilities(
    wildcardPossibilities,
    neighborScienceScores,
    masks
  );
  const { result, possibility } = getBestSciencePossibility(maskPossibilities);
  const calculations = getScienceCalculations(possibility, result);
  return { result, calculations };
}

/** From Armada addon */
export function getMostcardPossibilities(scienceScores: number[], mostcards: number) {
  if (mostcards === 0) {
    return [scienceScores];
  }

  let max = scienceScores[0];
  let maxIndexes = [0];

  for (let i = 1; i < scienceScores.length; i++) {
    if (scienceScores[i] === max) {
      maxIndexes.push(i);
    } else if (scienceScores[i] > max) {
      maxIndexes = [i];
      max = scienceScores[i];
    }
  }

  const possibilities = [];
  for (let index = 0; index < maxIndexes.length; index++) {
    const maxIndex = maxIndexes[index];
    const possibility = [...scienceScores];
    possibility[maxIndex] = max + mostcards;
    possibilities.push(possibility);
  }

  return possibilities;
}

export function getAganicePossibilities() {}

export function getWildcardPossibilities(scienceScores: number[][], wildcards: number): number[][] {
  if (wildcards === 0) {
    return scienceScores;
  }

  const possibilities: number[][] = [];
  scienceScores.forEach(score => {
    const [gears, compass, tablets] = score;

    for (let dg = 0; dg <= wildcards; dg++) {
      for (let dc = 0; dc <= wildcards - dg; dc++) {
        const dt = wildcards - dg - dc;
        possibilities.push([gears + dg, compass + dc, tablets + dt]);
      }
    }
  });
  return possibilities;
}

/** From Cities addon */
export function getMaskPossibilities(
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
    const [gears, compass, tablets] = score;
    const maxGear = Math.min(masks, ng);
    for (let dg = 0; dg <= maxGear; dg++) {
      const maxCompass = Math.min(masks - dg, nc);
      for (let dc = 0; dc <= maxCompass; dc++) {
        const dt = Math.min(masks - dg - dc, nt);
        possibilities.push([gears + dg, compass + dc, tablets + dt]);
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
