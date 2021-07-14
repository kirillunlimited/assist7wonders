import {
  getAllScores,
  mergeScores,
  getNeighborScores,
  getPlayerScoreByGame,
  getAllCounters,
  shuffleWonders,
  getAvatarText,
} from './game';
import { BASE_GAME } from '../config/game';

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
