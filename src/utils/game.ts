import { Player, PlayerScore, GameScore, GameState, GameParams } from '../types';
import shuffle from 'lodash.shuffle';
import { ADDONS, BASE_GAME } from '../config/game';
import {mergeScores} from './score';

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

export const getWondersByAddons = (gameAddons: string[]): string[] => {
  const addons = ADDONS.filter(addon => gameAddons.includes(addon.name));
  const addonWonders = addons.reduce((wonders, addon) => {
    return [...wonders, ...addon.wonders];
  }, [] as string[]);

  return [...BASE_GAME.wonders, ...addonWonders];
}

export const getMaxPlayersByAddons = (gameAddons: string[]): number => {
  const addons = ADDONS.filter(addon => gameAddons.includes(addon.name));
  return [BASE_GAME, ...addons].reduce((max, addon) => {
    if (addon.maxPlayers > max) {
      return addon.maxPlayers;
    }
    return max;
  }, 0);
}

export const emptyGameState =  {
    gameId: Date.now(),
    modified: Date.now(),
    players: [],
    addons: [],
    isLast: true,
  };

export const getLastGameState = (games: GameState[]): GameState => {
  return games.find(game => game.isLast) || emptyGameState;
}

export const getGameParamsByGameState = (game: GameState): GameParams => {
  const gameAddons = game.addons || [];
  const addons = ADDONS.filter(addon => gameAddons.includes(addon.name));
  const addonScores = addons.reduce((scores, addon) => {
    return [...scores, ...addon.scores];
  }, [] as GameScore[]);

  const wonders = getWondersByAddons(gameAddons);
  const maxPlayers = getMaxPlayersByAddons(gameAddons);

  return {
    gameId: game.gameId,
    maxPlayers,
    addons: gameAddons,
    wonders,
    scores: mergeScores([...BASE_GAME.scores, ...addonScores]),
  };
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

/** Take params from last game or set it empty */
export const getNewGameByLastGame = (gameId: number, lastGame: GameState): GameState => {
  const addons = lastGame?.addons;
  const wonders = getWondersByAddons(addons);
  const shuffledWonders = shuffleWonders(wonders);

  const players = lastGame?.players?.map((player, index) => {
    return {
      ...player,
      wonder: shuffledWonders[index],
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
    modified: gameId,
    isLast: true
  };
}
