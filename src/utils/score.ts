import { getScienceTotal } from './science';
import {
  AddonGameParams,
  Player,
  PlayerScoreKey,
  PlayerScore,
  GameScore,
  GameScoreSumResult,
} from '../types';
import compass from '../img/compass.png';
import tablets from '../img/tablets.png';
import gears from '../img/gears.png';
import wildcards from '../img/wildcards.png';
import masks from '../img/masks.png';
import mostcards from '../img/mostcards.png';
import swapcards from '../img/swapcards.png';

export const SCIENCE_KEYS = ['gears', 'compass', 'tablets'];
export const SWAPCARD_SCIENCE_KEY = 'swapcards';
export const MOSTCARD_SCIENCE_KEY = 'mostcards';
export const WILDCARD_SCIENCE_KEY = 'wildcards';
export const MASK_SCIENCE_KEY = 'masks';
const TREASURY_KEY = 'treasury';

const EXCLUDE_FLAT_SUM_KEYS = [
  ...SCIENCE_KEYS,
  SWAPCARD_SCIENCE_KEY,
  MOSTCARD_SCIENCE_KEY,
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

export const SCORE_ICONS: { [key in PlayerScoreKey]?: string } = {
  compass,
  tablets,
  gears,
  wildcards,
  masks,
  mostcards,
  swapcards,
};

export const getAllScores = (games: AddonGameParams[]): GameScore[] => {
  const allScores = games.map(addon => addon.scores).flat();
  return mergeScores(allScores);
};

/** Merge counters of duplicates */
export const mergeScores = (scores: GameScore[]): GameScore[] => {
  return scores.reduce((uniqueScores, score) => {
    /** Score was already processed */
    if (uniqueScores.find(uniqueScore => uniqueScore.id === score.id)) {
      return uniqueScores;
    }

    /** Merge counters if there are more than 1 copy of the score */
    const copies = scores.filter(uniqueScore => uniqueScore.id === score.id);
    if (copies.length > 1) {
      const allScoreCounters = copies.map(copy => copy.counters).flat();
      return [
        ...uniqueScores,
        {
          ...score,
          counters: allScoreCounters,
        },
      ];
    }

    return [...uniqueScores, score];
  }, [] as GameScore[]);
};

export function getNeighborScores(players: Player[], currentPlayerIndex: number): PlayerScore[] {
  const leftNeighborScore = (players[currentPlayerIndex - 1] || players[players.length - 1]).score;
  const rightNeighborScore = (players[currentPlayerIndex + 1] || players[0]).score;
  return [leftNeighborScore, rightNeighborScore];
}

/** Get actual player score by toggled addons */
export function getPlayerScoreByGame(
  playerScore: PlayerScore,
  gameScores: GameScore[]
): PlayerScore {
  const gameCounters = gameScores.map(score => score.counters).flat();
  return gameCounters.reduce((result, counter) => {
    return {
      ...result,
      [counter.id]: playerScore[counter.id],
    };
  }, {});
}

export const getAllCounters = (games: AddonGameParams[]) => {
  const scores = getAllScores(games);
  return scores.reduce((counters, score) => {
    const result: { [key: string]: number } = {};
    score.counters.forEach(counter => {
      result[counter.id] = 0;
    });
    return {
      ...counters,
      ...result,
    };
  }, {});
};
