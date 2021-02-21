import { getFlatTotal, getScienceTotal, getTreasuryTotal } from './score';

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

  test('should count sum of some values', () => {
    expect(
      getFlatTotal({
        military: 1,
        treasury: 6,
        wonders: 5,
        civilian: 4,
        commerce: 9,
        guild: 0,
        compass: 0,
        tablet: 0,
        gear: 0,
        wildcards: 0,
      })
    ).toEqual(19);
  });

  test('should return negative value', () => {
    expect(
      getFlatTotal({
        military: -3,
        treasury: 0,
        wonders: 0,
        civilian: -7,
        commerce: 0,
        guild: 0,
        compass: 0,
        tablet: 0,
        gear: 0,
        wildcards: 0,
      })
    ).toEqual(-10);
  });

  test('should ignore science points', () => {
    expect(
      getFlatTotal({
        military: 1,
        treasury: 0,
        wonders: 0,
        civilian: 0,
        commerce: 0,
        guild: 0,
        compass: 1,
        tablet: 1,
        gear: 1,
        wildcards: 0,
      })
    ).toEqual(1);
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
