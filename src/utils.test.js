import {getFlatSum, getScienceSum} from './utils';

describe('getFlatSum', () => {
  test('should return zero', () => {
    expect(getFlatSum({
      military: 0,
      treasury: 0,
      wonders: 0,
      civilian: 0,
      commerce: 0,
      guild: 0,
      compass: 0,
      tablet: 0,
      gear: 0
    })).toEqual(0);
  });

  test('should return sum of some values', () => {
    expect(getFlatSum({
      military: 1,
      treasury: 6,
      wonders: 5,
      civilian: 4,
      commerce: 9,
      guild: 0,
      compass: 0,
      tablet: 0,
      gear: 0
    })).toEqual(25);
  });

  test('should return negative value', () => {
    expect(getFlatSum({
      military: -3,
      treasury: 0,
      wonders: 0,
      civilian: -7,
      commerce: 0,
      guild: 0,
      compass: 0,
      tablet: 0,
      gear: 0
    })).toEqual(-10);
  });

  test('should ignore science points', () => {
    expect(getFlatSum({
      military: 1,
      treasury: 0,
      wonders: 0,
      civilian: 0,
      commerce: 0,
      guild: 0,
      compass: 1,
      tablet: 1,
      gear: 1
    })).toEqual(1);
  });
});

describe('getScienceSum', () => {
  test('should ignore normal points and return zero', () => {
    expect(getScienceSum({
      military: 3,
      treasury: 0,
      wonders: 10,
      civilian: 5,
      commerce: 0,
      guild: 0,
      compass: 0,
      tablet: 0,
      gear: 0
    })).toEqual(0);
  });

  test('should return sum of science points', () => {
    expect(getScienceSum({
      military: 0,
      treasury: 0,
      wonders: 0,
      civilian: 0,
      commerce: 0,
      guild: 0,
      compass: 2,
      tablet: 2,
      gear: 2
    })).toEqual(26);
  });

  test('should return sum of another science points', () => {
    expect(getScienceSum({
      military: 0,
      treasury: 0,
      wonders: 0,
      civilian: 0,
      commerce: 0,
      guild: 0,
      compass: 1,
      tablet: 2,
      gear: 3
    })).toEqual(21);
  });
});