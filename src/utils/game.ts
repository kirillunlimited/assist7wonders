import { TAddonGame, TPlayerScoreKey } from '../types';
import compass from '../icons/compass.png';
import tablet from '../icons/tablet.png';
import gear from '../icons/gear.png';
import wildcards from '../icons/wildcard.png';
import shuffle from 'lodash.shuffle';

export const SCORE_ICONS: { [key in TPlayerScoreKey]?: string } = {
  compass,
  tablet,
  gear,
  wildcards,
};

export const getAllScores = (games: TAddonGame[]) => {
  return games.map(addon => addon.scores).flat(2);
};

export const getAllCounters = (games: TAddonGame[]) => {
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
