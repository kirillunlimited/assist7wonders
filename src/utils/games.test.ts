import {
  emptyGameState,
  getLastGameState,
  getGameParamsByGameState,
  getNewGameByLastGame,
} from './games';
import { mergeScores } from './score';
import { BASE_GAME } from '../config/game';
import leaders from '../config/addons/leaders';

describe('getLastGameState', () => {
  test('should return empty game state', () => {
    expect(getLastGameState([])).toEqual(emptyGameState);
  });
  test('should return last game state', () => {
    expect(
      getLastGameState([
        {
          addons: [],
          gameId: 0,
          modified: 0,
          players: [],
        },
        {
          addons: [],
          gameId: 2,
          modified: 2,
          players: [],
        },
        {
          addons: [],
          gameId: 1,
          modified: 1,
          players: [],
        },
      ])
    ).toEqual({
      addons: [],
      gameId: 2,
      modified: 2,
      players: [],
    });
  });
});

describe('getGameParamsByGameState', () => {
  test('should return proper gameParams without addons', () => {
    expect(
      getGameParamsByGameState({
        gameId: 0,
        addons: [],
        players: [],
        modified: 0,
      })
    ).toEqual({
      gameId: 0,
      maxPlayers: BASE_GAME.maxPlayers,
      addons: [],
      wonders: BASE_GAME.wonders,
      scores: BASE_GAME.scores,
    });
  });
  test('should return proper gameParams with addons', () => {
    expect(
      getGameParamsByGameState({
        gameId: 0,
        addons: [leaders.name],
        players: [],
        modified: 0,
      })
    ).toEqual({
      gameId: 0,
      maxPlayers: BASE_GAME.maxPlayers,
      addons: [leaders.name],
      wonders: [...BASE_GAME.wonders, ...leaders.wonders],
      scores: mergeScores([...BASE_GAME.scores, ...leaders.scores]),
    });
  });
});

describe('getNewGameByLastGame', () => {
  test('should return empty gameState', () => {
    expect(getNewGameByLastGame(1, null)).toEqual({
      gameId: 1,
      addons: [],
      players: [],
      modified: 1,
    });
  });
  test('should return new gameState', () => {
    const lastGameState = {
      gameId: 0,
      addons: ['addon1'],
      players: [
        {
          name: 'player1',
          wonder: 'wonder1',
          score: {
            point1: 1,
            point2: 2,
          },
        },
      ],
      modified: 0,
    };
    const newGameState = getNewGameByLastGame(1, lastGameState);

    expect(newGameState.gameId).toEqual(1);
    expect(newGameState.addons).toEqual(lastGameState.addons);
    expect(newGameState.players[0].name).toEqual(lastGameState.players[0].name);
    expect(newGameState.players[0].wonder).not.toEqual(lastGameState.players[0].wonder);
    expect(newGameState.players[0].score).toEqual({
      point1: 0,
      point2: 0,
    });
    expect(newGameState.modified).toEqual(1);
  });
});
