import {
  getAvatarText,
  getMaxPlayersByAddons,
  updatePlayersCount,
  updateSelectedWonders,
} from './players';
import { BASE_GAME } from '../config/game';
import cities from '../config/addons/cities';

describe('getAvatarText', () => {
  test('should return empty string', () => {
    expect(getAvatarText('')).toEqual('');
  });
  test('should return 1 letter', () => {
    expect(getAvatarText('Jean')).toEqual('J');
  });
  test('should return 2 letters', () => {
    expect(getAvatarText('Jean Claud')).toEqual('JC');
    expect(getAvatarText('Jean Claud Van Damme')).toEqual('JC');
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