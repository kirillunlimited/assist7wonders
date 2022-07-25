import { PlayerScore, GameScore, GameState, GameParams } from '../types';
import { ADDONS, BASE_GAME } from '../config/game';
import {mergeScores} from './score';
import {getWondersByAddons, shuffleWonders} from './wonders';
import {getMaxPlayersByAddons} from './players';

export const emptyGameState =  {
    gameId: Date.now(),
    modified: Date.now(),
    players: [],
    addons: [],
  };

export const getLastGameState = (games: GameState[]): GameState => {
  const game = games.reduce((prev: GameState | null, current: GameState) => {
    if (!prev) {
      return current;
    }
    return (prev?.gameId > current.gameId) ? prev : current;
  }, null);

  return game || emptyGameState;
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
  };
}
