import { AddonGame, Player, PlayerScoreKey, PlayerScore } from '../types';
import compass from '../img/compass.png';
import tablet from '../img/tablet.png';
import gear from '../img/gear.png';
import wildcards from '../img/wildcard.png';
import shuffle from 'lodash.shuffle';

export const SCORE_ICONS: { [key in PlayerScoreKey]?: string } = {
  compass,
  tablet,
  gear,
  wildcards,
};

export const getAllScores = (games: AddonGame[]) => {
  return games.map(addon => addon.scores).flat(2);
};

export const getAllCounters = (games: AddonGame[]) => {
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

export function shuffleWonders(wonders: string[]): string[] {
  return shuffle(wonders);
}

/* Get first 2 capital letters of the name */
export function getAvatarText(name: string): string {
  return name
    .split(' ')
    .reduce((acc, word) => (word ? acc + word[0] : acc), '')
    .substring(0, 2)
    .toUpperCase();
}

export function getNeighborScores(players: Player[], currentPlayerIndex: number): PlayerScore[] {
  const leftNeighbor = (players[currentPlayerIndex - 1] || players[players.length - 1]).score;
  const rightNeighbor = (players[currentPlayerIndex + 1] || players[0]).score;
  return [leftNeighbor, rightNeighbor];
}
