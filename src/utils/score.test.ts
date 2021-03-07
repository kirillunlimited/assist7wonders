import {
  getFlatTotal,
  getScienceTotal,
  getTotal,
  getTreasuryTotal,
  isMaxValue,
  isMinValue,
} from './score';
import base from '../config/addons/base';

describe('getTotal', () => {
  const gameScores = base.scores;

  test('should return zero', () => {
    expect(
      getTotal(
        {
          military: 0,
          treasury: 0,
          wonders: 0,
          civilian: 0,
          commerce: 0,
          guild: 0,
          compass: 0,
          tablet: 0,
          gear: 0,
          wildcards: 0,
        },
        gameScores
      )
    ).toEqual(0);
  });
  test('should count sum', () => {
    expect(
      getTotal(
        {
          military: 1,
          treasury: 1,
          wonders: 1,
          civilian: 1,
          commerce: 1,
          guild: 1,
          compass: 1,
          tablet: 1,
          gear: 1,
          wildcards: 1,
        },
        gameScores
      )
    ).toEqual(18);
  });
  test('should ignore disabled addons scores', () => {
    expect(
      getTotal(
        {
          military: 1,
          treasury: 1,
          wonders: 1,
          civilian: 1,
          commerce: 1,
          guild: 1,
          compass: 1,
          tablet: 1,
          gear: 1,
          wildcards: 1,
          leaders: 1,
          debt: -10,
          cities: 1,
        },
        gameScores
      )
    ).toEqual(18);
  });
});

describe('getFlatTotal', () => {
  test('should return zero', () => {
    expect(
      getFlatTotal({
        military: 0,
        treasury: 0,
        wonders: 0,
        civilian: 0,
        commerce: 0,
        guild: 0,
        compass: 0,
        tablet: 0,
        gear: 0,
        wildcards: 0,
      })
    ).toEqual(0);
  });

  test('should count sum', () => {
    expect(
      getFlatTotal({
        military: 1,
        treasury: 0,
        wonders: 5,
        civilian: 4,
        commerce: 10,
        guild: 2,
        compass: 0,
        tablet: 0,
        gear: 0,
        wildcards: 0,
      })
    ).toEqual(22);
    expect(
      getFlatTotal({
        military: -1,
        treasury: 0,
        wonders: 9,
        civilian: 2,
        commerce: 0,
        guild: 5,
        compass: 0,
        tablet: 0,
        gear: 0,
        wildcards: 0,
      })
    ).toEqual(15);
  });

  test('should return negative value', () => {
    expect(
      getFlatTotal({
        military: -3,
        treasury: 0,
        wonders: 0,
        civilian: 0,
        commerce: 0,
        guild: 0,
        compass: 0,
        tablet: 0,
        gear: 0,
        wildcards: 0,
      })
    ).toEqual(-3);
  });

  test('should ignore treasury points', () => {
    expect(
      getFlatTotal({
        military: 1,
        treasury: 1,
        wonders: 1,
        civilian: 1,
        commerce: 1,
        guild: 1,
        compass: 0,
        tablet: 0,
        gear: 0,
        wildcards: 0,
      })
    ).toEqual(5);
  });

  test('should ignore science points', () => {
    expect(
      getFlatTotal({
        military: 1,
        treasury: 0,
        wonders: 1,
        civilian: 1,
        commerce: 1,
        guild: 1,
        compass: 1,
        tablet: 1,
        gear: 1,
        wildcards: 0,
      })
    ).toEqual(5);
  });
});

describe('getScienceTotal', () => {
  test('should ignore normal points', () => {
    expect(
      getScienceTotal({
        military: 3,
        treasury: 0,
        wonders: 10,
        civilian: 5,
        commerce: 0,
        guild: 0,
        compass: 0,
        tablet: 0,
        gear: 0,
        wildcards: 0,
      })
    ).toEqual(0);
  });

  test('should count sum of science points without wildcards', () => {
    expect(
      getScienceTotal({
        compass: 2,
        tablet: 2,
        gear: 2,
        wildcards: 0,
      })
    ).toEqual(26);
    expect(
      getScienceTotal({
        compass: 1,
        tablet: 2,
        gear: 3,
        wildcards: 0,
      })
    ).toEqual(21);
  });

  test('should count science points with 1 wildcard', () => {
    expect(
      getScienceTotal({
        compass: 1,
        tablet: 2,
        gear: 3,
        wildcards: 1,
      })
    ).toEqual(31);
    expect(
      getScienceTotal({
        compass: 2,
        tablet: 2,
        gear: 3,
        wildcards: 1,
      })
    ).toEqual(38);
  });

  test('should count science points with 2 wildcards', () => {
    expect(
      getScienceTotal({
        compass: 1,
        tablet: 2,
        gear: 3,
        wildcards: 2,
      })
    ).toEqual(38);
    expect(
      getScienceTotal({
        compass: 2,
        tablet: 2,
        gear: 2,
        wildcards: 2,
      })
    ).toEqual(38);
    expect(
      getScienceTotal({
        compass: 2,
        tablet: 2,
        gear: 3,
        wildcards: 2,
      })
    ).toEqual(48);
  });
});

describe('getTreasuryTotal', () => {
  test('should count sum of treasury points', () => {
    expect(
      getTreasuryTotal({
        military: 1,
        treasury: 1,
        wonders: 0,
        civilian: 0,
        commerce: 1,
        guild: 0,
        compass: 1,
        tablet: 0,
        gear: 1,
        wildcards: 0,
      })
    ).toEqual(0);
    expect(
      getTreasuryTotal({
        military: 1,
        treasury: 3,
        wonders: 0,
        civilian: 0,
        commerce: 1,
        guild: 0,
        compass: 1,
        tablet: 0,
        gear: 1,
        wildcards: 0,
      })
    ).toEqual(1);
    expect(
      getTreasuryTotal({
        military: 0,
        treasury: 7,
        wonders: 0,
        civilian: 1,
        commerce: 0,
        guild: 1,
        compass: 0,
        tablet: 1,
        gear: 0,
        wildcards: 0,
      })
    ).toEqual(2);
  });
});

describe('isMinValue', () => {
  test('should be truthy', () => {
    expect(isMinValue(0, 0)).toEqual(true);
    expect(isMinValue(-10, 0)).toEqual(true);
  });
  test('should be falsy', () => {
    expect(isMinValue(0, -10)).toEqual(false);
    expect(isMinValue(10, 0)).toEqual(false);
  });
});

describe('isMaxValue', () => {
  test('should be truthy', () => {
    expect(isMaxValue(0, 0)).toEqual(true);
    expect(isMaxValue(10, 0)).toEqual(true);
  });
  test('should be falsy', () => {
    expect(isMaxValue(0, 10)).toEqual(false);
    expect(isMaxValue(-10, 0)).toEqual(false);
  });
});
