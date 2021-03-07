import { getAllScores, getAllCounters, shuffleWonders } from './game';
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
