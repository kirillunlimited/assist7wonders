import { TPlayerScoreKey } from '../types';
import compass from '../icons/compass.png';
import tablet from '../icons/tablet.png';
import gear from '../icons/gear.png';
import wildcards from '../icons/wildcard.png';
import { BASE_GAME, ADDONS } from '../config/game';
import shuffle from 'lodash.shuffle';

export const getAllScores = () => {
  return [...BASE_GAME.scores, ADDONS.map(addon => addon.scores)].flat(2);
};

export const getAllCounters = () => {
  const scores = getAllScores();
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

export const SCORE_ICONS: { [key in TPlayerScoreKey]?: string } = {
  compass,
  tablet,
  gear,
  wildcards,
};

export function shuffleWonders(wonders: string[]): string[] {
  return shuffle(wonders);
}
