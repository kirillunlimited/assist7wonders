import { getScienceTotal, getMostcardPossibilities, getWildcardPossibilities } from './science';

describe('getMostcardPossibilities', () => {
  test('should return same science scores if there are no mostcards', () => {
    expect(getMostcardPossibilities([1, 1, 1], 0)).toEqual([[1, 1, 1]]);
  });
  test('should add mostcards to the biggest number', () => {
    expect(getMostcardPossibilities([1, 2, 1], 1)).toEqual([[1, 3, 1]]);
    expect(getMostcardPossibilities([1, 2, 1], 2)).toEqual([[1, 4, 1]]);
  });
  test('should get all possibilities if there are equal numbers', () => {
    expect(getMostcardPossibilities([1, 1, 1], 1)).toEqual([
      [2, 1, 1],
      [1, 2, 1],
      [1, 1, 2],
    ]);
  });
});

describe('getWildcardPossibilities', () => {
  test('should return same science scores if there are no wildcards', () => {
    expect(getWildcardPossibilities([[1, 1, 1]], 0)).toEqual([[1, 1, 1]]);
  });
  test('should count possibilities with 1 wildcard', () => {
    expect(getWildcardPossibilities([[1, 1, 1]], 1)).toEqual([
      [1, 1, 2],
      [1, 2, 1],
      [2, 1, 1],
    ]);
    expect(getWildcardPossibilities([[1, 1, 2]], 1)).toEqual([
      [1, 1, 3],
      [1, 2, 2],
      [2, 1, 2],
    ]);
    expect(getWildcardPossibilities([[1, 2, 3]], 1)).toEqual([
      [1, 2, 4],
      [1, 3, 3],
      [2, 2, 3],
    ]);
  });
  test('should count possibilities with 2 wildcards', () => {
    expect(getWildcardPossibilities([[1, 1, 1]], 2)).toEqual([
      [1, 1, 3],
      [1, 2, 2],
      [1, 3, 1],
      [2, 1, 2],
      [2, 2, 1],
      [3, 1, 1],
    ]);
    expect(getWildcardPossibilities([[1, 1, 2]], 2)).toEqual([
      [1, 1, 4],
      [1, 2, 3],
      [1, 3, 2],
      [2, 1, 3],
      [2, 2, 2],
      [3, 1, 2],
    ]);
    expect(getWildcardPossibilities([[1, 2, 3]], 2)).toEqual([
      [1, 2, 5],
      [1, 3, 4],
      [1, 4, 3],
      [2, 2, 4],
      [2, 3, 3],
      [3, 2, 3],
    ]);
  });
});

describe('getScienceTotal', () => {
  test('should ignore normal points', () => {
    expect(
      getScienceTotal(
        {
          military: 3,
          treasury: 4,
          wonders: 10,
          civilian: 20,
          commerce: 7,
          guild: 12,
          compass: 0,
          tablets: 0,
          gears: 0,
          wildcards: 0,
        },
        []
      ).result
    ).toEqual(0);
  });

  test('should count sum of science points without wildcards, masks and mostcards', () => {
    expect(
      getScienceTotal(
        {
          compass: 2,
          tablets: 2,
          gears: 2,
          wildcards: 0,
          masks: 0,
          mostcards: 0,
        },
        []
      ).result
    ).toEqual(26);
    expect(
      getScienceTotal(
        {
          compass: 1,
          tablets: 2,
          gears: 3,
          wildcards: 0,
          masks: 0,
          mostcards: 0,
        },
        []
      ).result
    ).toEqual(21);
  });

  test('should count science points with 1 wildcard', () => {
    expect(
      getScienceTotal(
        {
          compass: 1,
          tablets: 1,
          gears: 1,
          wildcards: 1,
          masks: 0,
          mostcards: 0,
        },
        []
      ).result
    ).toEqual(13);
    expect(
      getScienceTotal(
        {
          compass: 1,
          tablets: 1,
          gears: 2,
          wildcards: 1,
          masks: 0,
          mostcards: 0,
        },
        []
      ).result
    ).toEqual(18);
    expect(
      getScienceTotal(
        {
          compass: 1,
          tablets: 2,
          gears: 3,
          wildcards: 1,
          masks: 0,
          mostcards: 0,
        },
        []
      ).result
    ).toEqual(31);
  });

  test('should count science points with 2 wildcards', () => {
    expect(
      getScienceTotal(
        {
          compass: 1,
          tablets: 1,
          gears: 1,
          wildcards: 2,
          masks: 0,
          mostcards: 0,
        },
        []
      ).result
    ).toEqual(18);
    expect(
      getScienceTotal(
        {
          compass: 1,
          tablets: 1,
          gears: 2,
          wildcards: 2,
          masks: 0,
          mostcards: 0,
        },
        []
      ).result
    ).toEqual(26);
    expect(
      getScienceTotal(
        {
          compass: 1,
          tablets: 2,
          gears: 3,
          wildcards: 2,
          masks: 0,
          mostcards: 0,
        },
        []
      ).result
    ).toEqual(38);
  });
});
