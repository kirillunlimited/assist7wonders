import { GameParams, GameScore, GamesState, GameState, Player, PlayerScore, PlayerScoreKey } from '../types';
import { ADDONS, BASE_GAME } from '../config/game';
import { mergeScores } from '../utils/game';
import { getAllCounters, shuffleWonders } from '../utils/game';

const counters = getAllCounters([BASE_GAME, ...ADDONS]);

/** Games */
const SET_GAMES = 'SET_GAMES';
const ADD_GAME = 'ADD_GAME';

/** Addons */
const UPDATE_ADDONS = 'UPDATE_ADDONS';

/** Players */
const ADD_PLAYER = 'ADD_PLAYER';
const SET_PLAYERS = 'SET_PLAYERS';
const DELETE_PLAYER = 'DELETE_PLAYER';
const RESTORE_PLAYER = 'RESTORE_PLAYER';
const SET_PLAYER_SCORE = 'SET_PLAYER_SCORE';
const SET_PLAYER_WONDER = 'SET_PLAYER_WONDER';

type SetGamesAction = {
  type: typeof SET_GAMES;
  payload: GamesState;
};

type AddGameAction = {
  type: typeof ADD_GAME;
  payload: {
    gameId: number;
  };
}

type UpdateAddonsAction = {
  type: typeof UPDATE_ADDONS;
  payload: {
    gameId: number;
    addons: string[];
  }
}

type AddPlayerAction = {
  type: typeof ADD_PLAYER;
  payload: {
    gameId: number;
    name: string;
    wonder: string;
  };
}

type SetPlayersAction = {
  type: typeof SET_PLAYERS;
  payload: {
    gameId: number;
    players: Player[]
  }
}

type DeletePlayerAction = {
  type: typeof DELETE_PLAYER;
  payload: {
    gameId: number;
    name: string;
  };
}

type RestorePlayerAction = {
  type: typeof RESTORE_PLAYER;
  payload: {
    gameId: number;
    player: Player;
    index: number;
  }
}

type SetPlayerScoreAction = {
  type: typeof SET_PLAYER_SCORE;
  payload: {
    gameId: number;
    name: string;
    scoreKey: PlayerScoreKey;
    value: number;
  };
}

type SetPlayerWonderActions = {
  type: typeof SET_PLAYER_WONDER;
  payload: {
    gameId: number;
    name: string;
    wonder: string;
  }
}

export type Action = SetGamesAction | AddGameAction | UpdateAddonsAction | AddPlayerAction | SetPlayersAction | DeletePlayerAction | RestorePlayerAction | SetPlayerScoreAction | SetPlayerWonderActions;

/** TODO: move these methods to helpers and add unit tests */
const getWondersByAddons = (gameAddons: string[]) => {
  const addons = ADDONS.filter(addon => gameAddons.includes(addon.name));
  const addonWonders = addons.reduce((wonders, addon) => {
    if (addon) {
      return [...wonders, ...addon.wonders];
    }
    return wonders;
  }, [] as string[]);

  return [...BASE_GAME.wonders, ...addonWonders];
}

const getMaxPlayersByAddons = (gameAddons: string[]) => {
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
const updatePlayersCount = (players: Player[], maxPlayers: number): Player[] => {
  return players.slice(0, maxPlayers);
};

/** Change selected wonders if they are no longer available due to addons change */
const updateSelectedWonders = (players: Player[], wonders: string[]): Player[] => {
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

const reducer = (state: GamesState, action: Action) => {
  switch (action.type) {
    case SET_GAMES:
      return action.payload;
    case ADD_GAME:
      const {gameId} = action.payload;

      /** Take params from last game or set it empty */
      const lastGame = state.find(game => game.isLast);

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

      return [
        ...state.map(game => ({
          ...game,
          isLast: false
        })),
        {
          ...params,
          gameId,
          modified: Date.now(),
          isLast: true
        }
      ];
    case UPDATE_ADDONS: {
      const {gameId, addons} = action.payload;
      return state.map(game => {
        if (game.gameId === gameId) {
          const wonders = getWondersByAddons(addons);
          const maxPlayers = getMaxPlayersByAddons(addons);
          return {
            ...game,
            players: updateSelectedWonders(updatePlayersCount(game.players, maxPlayers), wonders),
            addons,
            modified: Date.now(),
          }
        }
        return game;
      });
    }
    case ADD_PLAYER: {
      const {gameId, name, wonder} = action.payload;
      return state.map(game => {
        if (game.gameId === gameId) {
          return {
            ...game,
            modified: Date.now(),
            players: [
              ...game.players,
              {
                name,
                wonder,
                score: {
                  ...counters,
                },
              }
            ]
          }
        }
        return game;
      });
    }
    case SET_PLAYERS: {
      const {gameId, players} = action.payload;
      return state.map(game => {
        if (game.gameId === gameId) {
          return {
            ...game,
            modified: Date.now(),
            players,
          }
        }
        return game;
      });
    }
    case DELETE_PLAYER: {
      const {gameId, name} = action.payload;
      return state.map(game => {
        if (game.gameId === gameId) {
          return {
            ...game,
            modified: Date.now(),
            players: game.players.filter(player => player.name !== name),
          }
        }
        return game;
      });
    }
    case RESTORE_PLAYER: {
      const {gameId, player, index} = action.payload;

      if (player && index >= 0) {
        return state.map(game => {
          if (game.gameId === gameId) {
            return {
              ...game,
              modified: Date.now(),
              players: [...game.players.slice(0, index), player, ...game.players.slice(index)]
            }
          }
          return game;
        });
      }
      return state;
    }
    case SET_PLAYER_SCORE: {
      const {gameId, name, scoreKey, value} = action.payload;
      return state.map(game => {
        if (game.gameId === gameId) {
          return {
            ...game,
            modified: Date.now(),
            players: game.players.map(player => {
              if (player.name === name) {
                return {
                  ...player,
                  score: {
                    ...player.score,
                    [scoreKey]: value,
                  },
                }
              }
              return player;
            })
          }
        }
        return game;
      });
    }
    case SET_PLAYER_WONDER: {
      const {gameId, name, wonder} = action.payload;
      return state.map(game => {
        if (game.gameId === gameId) {
          return {
            ...game,
            modified: Date.now(),
            players: game.players.map(player => {
              if (player.name === name) {
                return {
                  ...player,
                  wonder
                }
              }
              return player;
            })
          }
        }
        return game;
      });
    }
    default:
      return state;
  }
};

export default reducer;
