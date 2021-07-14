import {
  getNeighborScienceScores,
  getScienceTotal,
  getMostcardPossibilities,
  getSwapcardPossibilities,
  getWildcardPossibilities,
  getMaskPossibilities,
} from './science';

describe('getNeighborScienceScores', () => {
  test('should merge neighbor science scores into single number array and ignoring other counters', () => {
    expect(
      getNeighborScienceScores([
        {
          civilian: 1,
          commerce: 1,
          compass: 6,
          gears: 0,
          guild: 1,
          military: 1,
          tablets: 1,
          treasury: 1,
          wonders: 1,
        },
        {
          civilian: 1,
          commerce: 1,
          compass: 4,
          gears: 3,
          guild: 1,
          military: 1,
          tablets: 5,
          treasury: 1,
          wonders: 1,
        },
      ])
    ).toEqual([3, 10, 6]);
  });
});

describe('getMostcardPossibilities', () => {
  test('should return same science scores if there are no mostcards', () => {
    expect(getMostcardPossibilities([[1, 1, 1]], 0)).toEqual([[1, 1, 1]]);
  });
  test('should add mostcards to the biggest science score', () => {
    expect(getMostcardPossibilities([[1, 2, 3]], 1)).toEqual([[1, 2, 4]]);
    expect(getMostcardPossibilities([[1, 2, 3]], 2)).toEqual([[1, 2, 5]]);
    expect(getMostcardPossibilities([[1, 2, 3]], 3)).toEqual([[1, 2, 6]]);
  });
  test('should get all possibilities if there are equal science points', () => {
    expect(getMostcardPossibilities([[1, 1, 1]], 1)).toEqual([
      [2, 1, 1],
      [1, 2, 1],
      [1, 1, 2],
    ]);
    expect(getMostcardPossibilities([[1, 1, 1]], 2)).toEqual([
      [3, 1, 1],
      [1, 3, 1],
      [1, 1, 3],
    ]);
  });
});

describe('getSwapcardPossibilities', () => {
  test('should return same science scores if there are no swapcards', () => {
    expect(getSwapcardPossibilities([[1, 1, 1]], 0)).toEqual([[1, 1, 1]]);
  });
  test('should count possibilities with 1 swapcard', () => {
    expect(getSwapcardPossibilities([[1, 1, 1]], 1)).toEqual([
      [2, 0, 1],
      [2, 1, 0],
      [1, 1, 1],
      [0, 2, 1],
      [1, 2, 0],
      [0, 1, 2],
      [1, 0, 2],
    ]);
    expect(getSwapcardPossibilities([[1, 2, 3]], 1)).toEqual([
      [2, 1, 3],
      [2, 2, 2],
      [1, 2, 3],
      [0, 3, 3],
      [1, 3, 2],
      [0, 2, 4],
      [1, 1, 4],
    ]);
  });
  test('should count possibilities with 2 swapcards', () => {
    expect(getSwapcardPossibilities([[1, 1, 1]], 2)).toEqual([
      [3, 0, 0],
      [2, 0, 1],
      [2, 1, 0],
      [1, 1, 1],
      [0, 3, 0],
      [0, 2, 1],
      [1, 2, 0],
      [0, 0, 3],
      [0, 1, 2],
      [1, 0, 2],
    ]);
    expect(getSwapcardPossibilities([[1, 2, 3]], 2)).toEqual([
      [3, 0, 3],
      [3, 1, 2],
      [2, 1, 3],
      [3, 2, 1],
      [2, 2, 2],
      [1, 2, 3],
      [0, 4, 2],
      [0, 3, 3],
      [1, 4, 1],
      [1, 3, 2],
      [0, 1, 5],
      [0, 2, 4],
      [1, 0, 5],
      [1, 1, 4],
    ]);
  });
  test('should count possibilities with 3 swapcards', () => {
    expect(getSwapcardPossibilities([[1, 1, 1]], 3)).toEqual([
      [3, 0, 0],
      [2, 0, 1],
      [2, 1, 0],
      [1, 1, 1],
      [0, 3, 0],
      [0, 2, 1],
      [1, 2, 0],
      [0, 0, 3],
      [0, 1, 2],
      [1, 0, 2],
    ]);
    expect(getSwapcardPossibilities([[1, 2, 3]], 3)).toEqual([
      [4, 0, 2],
      [3, 0, 3],
      [4, 1, 1],
      [3, 1, 2],
      [2, 1, 3],
      [4, 2, 0],
      [3, 2, 1],
      [2, 2, 2],
      [1, 2, 3],
      [0, 5, 1],
      [0, 4, 2],
      [0, 3, 3],
      [1, 5, 0],
      [1, 4, 1],
      [1, 3, 2],
      [0, 0, 6],
      [0, 1, 5],
      [0, 2, 4],
      [1, 0, 5],
      [1, 1, 4],
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
    expect(getWildcardPossibilities([[1, 2, 3]], 2)).toEqual([
      [1, 2, 5],
      [1, 3, 4],
      [1, 4, 3],
      [2, 2, 4],
      [2, 3, 3],
      [3, 2, 3],
    ]);
  });
  test('should count possibilities with 3 wildcards', () => {
    expect(getWildcardPossibilities([[1, 1, 1]], 3)).toEqual([
      [1, 1, 4],
      [1, 2, 3],
      [1, 3, 2],
      [1, 4, 1],
      [2, 1, 3],
      [2, 2, 2],
      [2, 3, 1],
      [3, 1, 2],
      [3, 2, 1],
      [4, 1, 1],
    ]);
    expect(getWildcardPossibilities([[1, 2, 3]], 3)).toEqual([
      [1, 2, 6],
      [1, 3, 5],
      [1, 4, 4],
      [1, 5, 3],
      [2, 2, 5],
      [2, 3, 4],
      [2, 4, 3],
      [3, 2, 4],
      [3, 3, 3],
      [4, 2, 3],
    ]);
  });
});

describe('getMaskPossibilities', () => {
  test('should return same science scores if there are no masks', () => {
    expect(getMaskPossibilities([[1, 1, 1]], [1, 1, 1], 0)).toEqual([[1, 1, 1]]);
  });
  test('should return same science scores if there are no neighbor science points', () => {
    expect(getMaskPossibilities([[1, 1, 1]], [0, 0, 0], 1)).toEqual([[1, 1, 1]]);
  });
  test('should count possibilities with 1 mask', () => {
    expect(getMaskPossibilities([[1, 1, 1]], [1, 1, 1], 1)).toEqual([
      [1, 1, 2],
      [1, 2, 1],
      [2, 1, 1],
    ]);
    expect(getMaskPossibilities([[1, 2, 3]], [1, 1, 1], 1)).toEqual([
      [1, 2, 4],
      [1, 3, 3],
      [2, 2, 3],
    ]);
  });
  test('should count possibilities with 2 masks', () => {
    expect(getMaskPossibilities([[1, 1, 1]], [0, 0, 1], 2)).toEqual([[1, 1, 2]]);
    expect(getMaskPossibilities([[1, 1, 1]], [1, 1, 1], 2)).toEqual([
      [1, 2, 2],
      [2, 1, 2],
      [2, 2, 1],
    ]);
    expect(getMaskPossibilities([[1, 2, 3]], [1, 1, 1], 2)).toEqual([
      [1, 3, 4],
      [2, 2, 4],
      [2, 3, 3],
    ]);
    expect(getMaskPossibilities([[1, 1, 1]], [2, 2, 2], 2)).toEqual([
      [1, 1, 3],
      [1, 2, 2],
      [1, 3, 1],
      [2, 1, 2],
      [2, 2, 1],
      [3, 1, 1],
    ]);
    expect(getMaskPossibilities([[1, 2, 3]], [2, 2, 2], 2)).toEqual([
      [1, 2, 5],
      [1, 3, 4],
      [1, 4, 3],
      [2, 2, 4],
      [2, 3, 3],
      [3, 2, 3],
    ]);
  });
  test('should count possibilities with 3 masks', () => {
    expect(getMaskPossibilities([[1, 1, 1]], [1, 1, 1], 3)).toEqual([[2, 2, 2]]);
    expect(getMaskPossibilities([[1, 2, 3]], [1, 1, 1], 3)).toEqual([[2, 3, 4]]);
    expect(getMaskPossibilities([[1, 1, 1]], [2, 2, 2], 3)).toEqual([
      [1, 2, 3],
      [1, 3, 2],
      [2, 1, 3],
      [2, 2, 2],
      [2, 3, 1],
      [3, 1, 2],
      [3, 2, 1],
    ]);
    expect(getMaskPossibilities([[1, 2, 3]], [2, 2, 2], 3)).toEqual([
      [1, 3, 5],
      [1, 4, 4],
      [2, 2, 5],
      [2, 3, 4],
      [2, 4, 3],
      [3, 2, 4],
      [3, 3, 3],
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
