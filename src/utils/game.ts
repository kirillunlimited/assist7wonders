import { AddonGameParams, Player, PlayerScoreKey, PlayerScore, GameScore, GamesState, GamesDict } from '../types';
import compass from '../img/compass.png';
import tablets from '../img/tablets.png';
import gears from '../img/gears.png';
import wildcards from '../img/wildcards.png';
import masks from '../img/masks.png';
import mostcards from '../img/mostcards.png';
import swapcards from '../img/swapcards.png';
import shuffle from 'lodash.shuffle';

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


// TODO: unit test
export function mapGamesArrayToObject(games: GamesState = []): GamesDict {
  return games.reduce((acc, game) => ({
    ...acc,
    [game.gameId]: {
      players: game.players || [],
      addons: game.addons || [],
      modified: game.modified,
      isLast: game.isLast || false,
    }
  }), {});
}

// TODO: unit test
export function mapGamesObjectToArray(games: GamesDict = {}): GamesState {
  return Object.keys(games).map(gameId => ({
    gameId: Number(gameId),
    modified: games[gameId].modified,
    addons: (games[gameId].addons || []).filter(addon => addon),
    players: (games[gameId].players || []).filter(player => player),
    isLast: games[gameId].isLast || false,
  }));
}

// TODO: unit test
/** Keep games with greater "modified" value (later game is more relevant) */
export function mergeGameArrays(games: GamesState): GamesState {
  let dict: Record<string, {
    index: number;
    modified: number;
  }> = {};

  /** Find the game with the biggest modified value */
  let lastGameId: number = -1;

  return games
    .reduce((acc, game) => {
      lastGameId = game.modified > lastGameId ? game.modified : lastGameId;
      if (dict[game.gameId]) {
        if (dict[game.gameId].modified > game.modified) {
          return acc;
        } else {
          acc[dict[game.gameId].index] = game;

          dict[game.gameId] = {
            index: acc.length,
            modified: game.modified,
          };

          return acc;
        }
      }

      dict[game.gameId] = {
        index: acc.length,
        modified: game.modified,
      };

      return [
        ...acc,
        game
      ];
    }, [] as GamesState)
    .map(game => {
      if (game.modified === lastGameId) {
        return {
          ...game,
          isLast: true
        }
      }
      return {
        ...game,
        isLast: false
      }
    })
}
