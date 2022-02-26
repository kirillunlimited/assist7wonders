import { AddonGameParams, Player, PlayerScoreKey, PlayerScore, GameScore, GamesState, GameState, GamesDict, GameParams } from '../types';
import compass from '../img/compass.png';
import tablets from '../img/tablets.png';
import gears from '../img/gears.png';
import wildcards from '../img/wildcards.png';
import masks from '../img/masks.png';
import mostcards from '../img/mostcards.png';
import swapcards from '../img/swapcards.png';
import shuffle from 'lodash.shuffle';
import { ADDONS, BASE_GAME } from '../config/game';

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
      players: (game.players || []).reduce((playersDict, player, index) => ({
        ...playersDict,
        [player.name]: {
          index,
          score: player.score,
          wonder: player.wonder,
        }
      }), {}),
      addons: game.addons || [],
      modified: game.modified,
    }
  }), {});
}

// TODO: unit test
export function mapGamesObjectToArray(games: GamesDict = {}): GamesState {
  /** Find the game with the biggest modified value */
  let lastGameId: number = -1;

  return Object.keys(games)
    .map(gameId => {
      const game = games[gameId];
      lastGameId = game.modified > lastGameId ? game.modified : lastGameId;

      return {
        gameId: Number(gameId),
        modified: game.modified,
        addons: (game.addons || []).filter(addon => addon),
        players: Object.keys(game.players || {})
          .filter(player => player)
          .sort((firstPlayerName, secondPlayerName) => game.players[firstPlayerName].index - game.players[secondPlayerName].index)
          .map(playerName => ({
            name: playerName,
            score: game?.players?.[playerName]?.score,
            wonder: game?.players?.[playerName]?.wonder,
          })),
      }
    })
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

/** TODO: move these methods to helpers and add unit tests */
export const getWondersByAddons = (gameAddons: string[]) => {
  const addons = ADDONS.filter(addon => gameAddons.includes(addon.name));
  const addonWonders = addons.reduce((wonders, addon) => {
    if (addon) {
      return [...wonders, ...addon.wonders];
    }
    return wonders;
  }, [] as string[]);

  return [...BASE_GAME.wonders, ...addonWonders];
}

export const getMaxPlayersByAddons = (gameAddons: string[]) => {
  const addons = ADDONS.filter(addon => gameAddons.includes(addon.name));
  return [BASE_GAME, ...addons].reduce((max, addon) => {
    if (addon.maxPlayers > max) {
      return addon.maxPlayers;
    }
    return max;
  }, 0);
}

export const mapHistoryGameToCurrentGame = (game: GameState) => {
  const gameAddons = game.addons || []
  const addons = ADDONS.filter(addon => gameAddons.includes(addon.name));
  const addonScores = addons.reduce((scores, addon) => {
    if (addon) {
      return [...scores, ...addon.scores];
    }
    return scores;
  }, [] as GameScore[]);

  const wonders = getWondersByAddons(gameAddons);
  const maxPlayers = getMaxPlayersByAddons(gameAddons);

  return {
    gameId: game.gameId,
    modified: game.modified,
    maxPlayers,
    addons: gameAddons,
    wonders,
    scores: mergeScores([...BASE_GAME.scores, ...addonScores]),
  };
}

export const getCurrentGameState = (games: GamesState): GameParams => {
  const lastGame = games.find(game => game.isLast) || {
    gameId: Date.now(),
    modified: Date.now(),
    players: [],
    addons: [],
    isLast: true,
  }

  return mapHistoryGameToCurrentGame(lastGame);
}

export const getCurrentGamePlayers = (games: GamesState): Player[] => {
  return games.find(game => game.isLast)?.players || [];
}

/** Slice extra players if new limit is less than before */
export const updatePlayersCount = (players: Player[], maxPlayers: number): Player[] => {
  return players.slice(0, maxPlayers);
};

/** Change selected wonders if they are no longer available due to addons change */
export const updateSelectedWonders = (players: Player[], wonders: string[]): Player[] => {
  const selectedWonders = players.map(player => player.wonder);
  return [
    ...players.map(player => {
      if (!wonders.includes(player.wonder)) {
        const shuffledWonders = shuffleWonders(wonders).filter(
          wonder => !selectedWonders.includes(wonder)
        );
        return {
          ...player,
          wonder: shuffledWonders[0],
        };
      }
      return player;
    }),
  ];
};

export function getNewGameByLastGame(gameId: number, games: GamesState): GameState {
  /** Take params from last game or set it empty */
  const lastGame = games.find(game => game.isLast);

  const addons = lastGame?.addons;
  const players = lastGame?.players?.map(player => {
    return {
      ...player,
      score: Object.keys(player.score)?.reduce((acc, counterKey) => {
        return {
          ...acc,
          [counterKey]: 0,
        }
      }, {} as PlayerScore),
    }
  });

  const params = {
    addons: addons || [],
    players: players || []
  };

  return {
    ...params,
    gameId,
    modified: Date.now(),
    isLast: true
  };
}
