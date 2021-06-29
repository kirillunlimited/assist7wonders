import { AddonGame, Player, PlayerScoreKey, PlayerScore, GameScore } from '../types';
import compass from '../img/compass.png';
import tablet from '../img/tablet.png';
import gear from '../img/gear.png';
import wildcard from '../img/wildcard.png';
import mask from '../img/mask.png';
import shuffle from 'lodash.shuffle';

export const SCORE_ICONS: { [key in PlayerScoreKey]?: string } = {
  compass,
  tablet,
  gear,
  wildcard,
  mask,
};

export const getAllScores = (games: AddonGame[]): GameScore[] => {
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
  const leftNeighbor = (players[currentPlayerIndex - 1] || players[players.length - 1]).score;
  const rightNeighbor = (players[currentPlayerIndex + 1] || players[0]).score;
  return [leftNeighbor, rightNeighbor];
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
