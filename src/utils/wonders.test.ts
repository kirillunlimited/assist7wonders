import { shuffleWonders, getWondersByAddons } from './wonders';
import { BASE_GAME } from '../config/game';
import cities from '../config/addons/cities';
import leaders from '../config/addons/leaders';

describe('shuffleWonders', () => {
  test('should return empty array', () => {
    expect(shuffleWonders([])).toEqual([]);
  });
  test('should contain the same elements', () => {
    const arr = ['a', 'b', 'c', 'd', 'e', 'f'];
    expect(shuffleWonders(arr).sort()).toEqual(arr);
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
    expect(getWondersByAddons([leaders.name, cities.name])).toEqual([
      ...BASE_GAME.wonders,
      ...leaders.wonders,
      ...cities.wonders,
    ]);
  });
});
