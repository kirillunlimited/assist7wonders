import {
  getAvatarText,
  getMaxPlayersByAddons,
  updatePlayersCount,
  getPlayersWithUpdatedWonders,
  getPlayersWithShuffledWonders,
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
    expect(
      updatePlayersCount(
        [
          {
            name: 'player1',
            wonder: 'wonder1',
            score: {},
          },
          {
            name: 'player2',
            wonder: 'wonder2',
            score: {},
          },
        ],
        1
      )
    ).toEqual([
      {
        name: 'player1',
        wonder: 'wonder1',
        score: {},
      },
    ]);
  });
});

describe('getPlayersWithUpdatedWonders', () => {
  test('should return same players array', () => {
    expect(
      getPlayersWithUpdatedWonders(
        [
          {
            name: 'player1',
            wonder: 'wonder1',
            score: {},
          },
          {
            name: 'player2',
            wonder: 'wonder2',
            score: {},
          },
        ],
        ['wonder1', 'wonder2']
      )
    ).toEqual([
      {
        name: 'player1',
        wonder: 'wonder1',
        score: {},
      },
      {
        name: 'player2',
        wonder: 'wonder2',
        score: {},
      },
    ]);
  });

  test('should return players array with changed wonders', () => {
    const result = getPlayersWithUpdatedWonders(
      [
        {
          name: 'player1',
          wonder: 'wonder1',
          score: {},
        },
        {
          name: 'player2',
          wonder: 'wonder2',
          score: {},
        },
      ],
      ['wonder3', 'wonder4']
    );

    expect(result[0].wonder).not.toEqual('wonder1');
    expect(result[1].wonder).not.toEqual('wonder2');
  });
});

describe('getPlayersWithShuffledWonders', () => {
  test('should return empty players array', () => {
    expect(getPlayersWithShuffledWonders([], [])).toEqual([]);
  });
  test('should shuffle selected wonders', () => {
    const result = getPlayersWithShuffledWonders(
      [
        {
          name: 'player1',
          wonder: BASE_GAME.wonders[0],
          score: {},
        },
        {
          name: 'player2',
          wonder: BASE_GAME.wonders[1],
          score: {},
        },
      ],
      BASE_GAME.wonders
    );
    const shuffledWonders = result.map(player => player.wonder);
    expect(BASE_GAME.wonders).toContain(shuffledWonders[0]);
    expect(BASE_GAME.wonders).toContain(shuffledWonders[1]);
  });
});
