import { PlayerScore, GameScoreSumResult } from '../types';
import {
  SCIENCE_KEYS,
  SWAPCARD_SCIENCE_KEY,
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
  const swapcards = playerScore[SWAPCARD_SCIENCE_KEY] || 0;
  const mostcards = playerScore[MOSTCARD_SCIENCE_KEY] || 0;
  const wildcards = playerScore[WILDCARD_SCIENCE_KEY] || 0;
  const masks = playerScore[MASK_SCIENCE_KEY] || 0;
  const neighborScienceScores = neighborScores.reduce(
    (result, neighborScore) => {
      const scienceScore = SCIENCE_KEYS.reduce((acc, key) => {
        return [...acc, neighborScore[key] || 0];
      }, [] as number[]);
      scienceScore.forEach((score, index) => {
        result[index] += score;
      });
      return result;
    },
    [0, 0, 0] as number[]
  );

  /** MOSTCARDS -> SWAPCARDS -> WILDCARDS -> MASKS */
  let possibilities: number[][] = [scienceScores];
  const possibilityHandlers = [
    (possibilities: number[][]) => getMostcardPossibilities(possibilities, mostcards),
    (possibilities: number[][]) => getSwapcardPossibilities(possibilities, swapcards),
    (possibilities: number[][]) => getWildcardPossibilities(possibilities, wildcards),
    (possibilities: number[][]) =>
      getMaskPossibilities(possibilities, neighborScienceScores, masks),
  ];
  for (const handler of possibilityHandlers) {
    possibilities = handler(possibilities);
  }

  const { result, possibility } = getBestSciencePossibility(possibilities);
  const calculations = getScienceCalculations(possibility, result);
  return { result, calculations };
}

export function getMostcardPossibilities(scienceScores: number[][], mostcards: number): number[][] {
  if (mostcards === 0) {
    return scienceScores;
  }

  const possibilities: number[][] = [];

  scienceScores.forEach(score => {
    let max = score[0];
    let maxIndexes = [0];

    for (let i = 1; i < score.length; i++) {
      if (score[i] === max) {
        maxIndexes.push(i);
      } else if (score[i] > max) {
        maxIndexes = [i];
        max = score[i];
      }
    }

    for (let index = 0; index < maxIndexes.length; index++) {
      const maxIndex = maxIndexes[index];
      const possibility = [...score];
      possibility[maxIndex] = max + mostcards;
      possibilities.push(possibility);
    }
  });

  return possibilities;
}

export function getSwapcardPossibilities(scienceScores: number[][], swapcards: number): number[][] {
  if (swapcards === 0) {
    return scienceScores;
  }

  const memo: Record<string, number> = {};

  for (const score of scienceScores) {
    /** If number of science cards is less than a number of swapcards, then decrease the number of swapcards */
    const sum = score.reduce((a, b) => a + b);
    if (swapcards >= sum) {
      return getSwapcardPossibilities([score], sum - 1);
    }

    score.forEach((pivot, pivotIndex) => {
      const rest = [];
      for (let i = 0; i < score.length; i++) {
        if (i === pivotIndex) {
          continue;
        }
        rest.push({
          index: i,
          value: score[i],
        });
      }

      for (let restValue0 = 0; restValue0 <= rest[0].value; restValue0++) {
        for (let restValue1 = 0; restValue1 <= rest[1].value; restValue1++) {
          const diff1 = rest[0].value - restValue0;
          const diff2 = rest[1].value - restValue1;
          if (diff1 + diff2 > swapcards) {
            continue;
          }
          const result = [];
          result[pivotIndex] = pivot + diff1 + diff2;
          result[rest[0].index] = restValue0;
          result[rest[1].index] = restValue1;

          const memoKey = result.join('-');
          memo[memoKey] = (memo[memoKey] || 0) + 1;
        }
      }
    });
  }

  return Object.keys(memo).map(score => score.split('-').map(element => Number(element)));
}

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

export function getMaskPossibilities(
  scienceScores: number[][],
  neighborScienceScores: number[],
  masks: number
): number[][] {
  if (masks === 0) {
    return scienceScores;
  }

  const possibilities: number[][] = [];
  const [ng, nc, nt] = neighborScienceScores;

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
