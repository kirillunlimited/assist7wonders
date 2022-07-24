import {
  getAllScores,
  mergeScores,
  getNeighborScores,
  getPlayerScoreByGame,
  getAllCounters,
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
import { BASE_GAME } from '../config/game';
import leaders from '../config/addons/leaders';
import cities from '../config/addons/cities';

describe('getAllScores', () => {
  test('should return empty array', () => {
    expect(getAllScores([])).toEqual([]);
  });
  test('should contain same ids', () => {
    const scoreIds = getAllScores([BASE_GAME]).map(score => score.id);
    const expectedScoreIds = BASE_GAME.scores.map(score => score.id);
    expect(scoreIds).toEqual(expectedScoreIds);
  });
});

describe('mergeScores', () => {
  test('should merge counters of scores with the same ids', () => {
    expect(
      mergeScores([
        {
          id: '1',
          color: '1',
          counters: [
            {
              id: 'counter-1-1',
              min: 0,
              max: 10,
            },
          ],
        },
        {
          id: '2',
          color: '2',
          counters: [
            {
              id: 'conter-2',
              min: 0,
              max: 10,
            },
          ],
        },
        {
          id: '1',
          color: '1',
          counters: [
            {
              id: 'conter-1-2',
              min: 0,
              max: 10,
            },
          ],
        },
      ])
    ).toEqual([
      {
        id: '1',
        color: '1',
        counters: [
          {
            id: 'counter-1-1',
            min: 0,
            max: 10,
          },
          {
            id: 'conter-1-2',
            min: 0,
            max: 10,
          },
        ],
      },
      {
        id: '2',
        color: '2',
        counters: [
          {
            id: 'conter-2',
            min: 0,
            max: 10,
          },
        ],
      },
    ]);
  });
});

describe('getNeighborScores', () => {
  test('should return scores of left and right players', () => {
    expect(
      getNeighborScores(
        [
          {
            name: '1',
            wonder: '1',
            score: {
              civilian: 10,
              commerce: 0,
              compass: 1,
              gears: 0,
              guild: 10,
              military: 0,
              tablets: 1,
              treasury: 3,
              wonders: 10,
            },
          },
          {
            name: '2',
            wonder: '2',
            score: {
              civilian: 1,
              commerce: 1,
              compass: 1,
              gears: 1,
              guild: 1,
              military: 1,
              tablets: 1,
              treasury: 1,
              wonders: 1,
            },
          },
          {
            name: '3',
            wonder: '3',
            score: {
              civilian: 5,
              commerce: 5,
              compass: 1,
              gears: 0,
              guild: 0,
              military: 0,
              tablets: 1,
              treasury: 6,
              wonders: 10,
            },
          },
        ],
        1
      )
    ).toEqual([
      {
        civilian: 10,
        commerce: 0,
        compass: 1,
        gears: 0,
        guild: 10,
        military: 0,
        tablets: 1,
        treasury: 3,
        wonders: 10,
      },
      {
        civilian: 5,
        commerce: 5,
        compass: 1,
        gears: 0,
        guild: 0,
        military: 0,
        tablets: 1,
        treasury: 6,
        wonders: 10,
      },
    ]);
  });
});

describe('getPlayerScoreByGame', () => {
  test('should return actual player score by toggled addons', () => {
    expect(
      getPlayerScoreByGame(
        {
          cities: 0,
          civilian: 0,
          commerce: 0,
          compass: 0,
          debt: 0,
          gears: 0,
          guild: 0,
          leaders: 0,
          masks: 0,
          military: 0,
          tablets: 0,
          treasury: 0,
          wildcards: 0,
          wonders: 0,
        },
        BASE_GAME.scores
      )
    ).toEqual({
      civilian: 0,
      commerce: 0,
      compass: 0,
      gears: 0,
      guild: 0,
      military: 0,
      tablets: 0,
      treasury: 0,
      wildcards: 0,
      wonders: 0,
    });
  });
});

describe('getAllCounters', () => {
  test('should return empty object', () => {
    expect(getAllCounters([])).toMatchObject({});
  });
  test('should return object with same counter-id keys', () => {
    const counterIds = Object.keys(getAllCounters([BASE_GAME]));
    const expectedCounterIds = BASE_GAME.scores
      .map(score => score.counters.map(counter => counter.id))
      .flat();
    expect(counterIds).toEqual(expectedCounterIds);
  });
  test('should return object with zero values', () => {
    const counterValues = Object.values(getAllCounters([BASE_GAME]));
    expect(counterValues).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });
});

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
