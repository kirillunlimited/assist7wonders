import { getFlatTotal, getTotal, getTreasuryTotal, isMaxValue, isMinValue } from './score';

describe('getTotal', () => {
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
          tablets: 0,
          gears: 0,
          wildcards: 0,
        },
        []
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
          tablets: 1,
          gears: 1,
          wildcards: 1,
        },
        []
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
        tablets: 0,
        gears: 0,
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
        tablets: 0,
        gears: 0,
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
        tablets: 0,
        gears: 0,
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
        tablets: 0,
        gears: 0,
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
        tablets: 0,
        gears: 0,
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
        tablets: 1,
        gears: 1,
        wildcards: 0,
      })
    ).toEqual(5);
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
        tablets: 0,
        gears: 1,
        wildcards: 0,
      }).result
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
        tablets: 0,
        gears: 1,
        wildcards: 0,
      }).result
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
        tablets: 1,
        gears: 0,
        wildcards: 0,
      }).result
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
