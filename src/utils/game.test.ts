import {
  shuffleWonders,
  getAvatarText,
  getWondersByAddons,
  getMaxPlayersByAddons,
  emptyGameState,
  getLastGameState,
  getGameParamsByGameState,
  updatePlayersCount,
  updateSelectedWonders,
  getNewGameByLastGame
} from './game';
import { mergeScores } from './score';
import { BASE_GAME } from '../config/game';
import leaders from '../config/addons/leaders';
import cities from '../config/addons/cities';

describe('shuffleWonders', () => {
  test('should return empty array', () => {
    expect(shuffleWonders([])).toEqual([]);
  });
  test('should contain the same elements', () => {
    const arr = ['a', 'b', 'c', 'd', 'e', 'f'];
    expect(shuffleWonders(arr).sort()).toEqual(arr);
  });
});

describe('getAvatarText', () => {
  test('should return empty string', () => {
    expect(getAvatarText('')).toEqual('');
  });
  test('should return 1 letter', () => {
    expect(getAvatarText('Jean')).toEqual('J');
  });
  test('should return 2 letters', () => {
    expect(getAvatarText('Jean Claud')).toEqual('JC');
    expect(getAvatarText('Jean Claud Van Damme')).toEqual('JC');
  });
});

describe('getWondersByAddons', () => {
  test('should return empty array', () => {
    expect(getWondersByAddons([])).toEqual(BASE_GAME.wonders);
  });
  test('should ignore invalid addons', () => {
    expect(getWondersByAddons(['invalid addon'])).toEqual(BASE_GAME.wonders);
  });
  test('should return proper wonders array', () => {
    expect(getWondersByAddons([leaders.name])).toEqual([...BASE_GAME.wonders, ...leaders.wonders]);
    expect(getWondersByAddons([leaders.name, cities.name])).toEqual([...BASE_GAME.wonders, ...leaders.wonders, ...cities.wonders]);
  });
});

describe('getMaxPlayersByAddons', () => {
  test('should return base game maxPlayers values', () => {
    expect(getMaxPlayersByAddons([])).toEqual(BASE_GAME.maxPlayers);
  });
  test('should return the biggest maxPlayers value', () => {
    expect(getMaxPlayersByAddons(['Leaders', 'Cities'])).toEqual(cities.maxPlayers);
  });
});

describe('getLastGameState', () => {
  test('should return empty game state', () => {
    expect(getLastGameState([])).toEqual(emptyGameState);
  });
  test('should return last game state', () => {
    expect(getLastGameState([
      {
        addons: [],
        gameId: 0,
        isLast: false,
        modified: 0,
        players: []
      },
      {
        addons: [],
        gameId: 1,
        isLast: true,
        modified: 1,
        players: []
      },
    ])).toEqual({
        addons: [],
        gameId: 1,
        isLast: true,
        modified: 1,
        players: []
      })
  });
});

describe('getGameParamsByGameState', () => {
  test('should return proper gameParams without addons', () => {
    expect(getGameParamsByGameState({
      gameId: 0,
      addons: [],
      players: [],
      isLast: true,
      modified: 0
    })).toEqual({
      gameId: 0,
      maxPlayers: BASE_GAME.maxPlayers,
      addons: [],
      wonders: BASE_GAME.wonders,
      scores: BASE_GAME.scores
    })
  });
  test('should return proper gameParams with addons', () => {
    expect(getGameParamsByGameState({
      gameId: 0,
      addons: [leaders.name],
      players: [],
      isLast: true,
      modified: 0
    })).toEqual({
      gameId: 0,
      maxPlayers: BASE_GAME.maxPlayers,
      addons: [leaders.name],
      wonders: [...BASE_GAME.wonders, ...leaders.wonders],
      scores: mergeScores([...BASE_GAME.scores, ...leaders.scores]),
    })
  });
});

describe('updatePlayersCount', () => {
  test('should return empty array', () => {
    expect(updatePlayersCount([], 0)).toEqual([]);
  });
  test('should slice players array', () => {
    expect(updatePlayersCount([
      {
        name: 'player1',
        wonder: 'wonder1',
        score: {},
      },
      {
        name: 'player2',
        wonder: 'wonder2',
        score: {},
      }
    ], 1))
    .toEqual([
      {
        name: 'player1',
        wonder: 'wonder1',
        score: {},
      }
    ]);
  });
});

describe('updateSelectedWonders', () => {
  test('should return same players array', () => {
    expect(updateSelectedWonders([
      {
        name: 'player1',
        wonder: 'wonder1',
        score: {},
      },
      {
        name: 'player2',
        wonder: 'wonder2',
        score: {},
      }
    ], ['wonder1', 'wonder2'])).toEqual([
      {
        name: 'player1',
        wonder: 'wonder1',
        score: {},
      },
      {
        name: 'player2',
        wonder: 'wonder2',
        score: {},
      }
    ])
  });

  test('should return players array with changed wonders', () => {
    const result = updateSelectedWonders([
      {
        name: 'player1',
        wonder: 'wonder1',
        score: {},
      },
      {
        name: 'player2',
        wonder: 'wonder2',
        score: {},
      }
    ], ['wonder3', 'wonder4']);

    expect(result[0].wonder).not.toEqual('wonder1');
    expect(result[1].wonder).not.toEqual('wonder2');
  });
});

describe('getNewGameByLastGame', () => {
  test('should return new gameState', () => {
    const lastGameState = {
      gameId: 0,
      addons: ['addon1'],
      players: [{
        name: 'player1',
        wonder: 'wonder1',
        score: {
          point1: 1,
          point2: 2,
        },
      }],
      isLast: true,
      modified: 0
    };
    const newGameState = getNewGameByLastGame(1, lastGameState);

    expect(newGameState.gameId).toEqual(1);
    expect(newGameState.addons).toEqual(lastGameState.addons);
    expect(newGameState.players[0].name).toEqual(lastGameState.players[0].name);
    expect(newGameState.players[0].wonder).not.toEqual(lastGameState.players[0].wonder);
    expect(newGameState.players[0].score).toEqual({
      point1: 0,
      point2: 0
    });
    expect(newGameState.isLast).toBeTruthy();
    expect(newGameState.modified).toEqual(1);
  });
});
