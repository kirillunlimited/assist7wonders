import { Player } from '../types';
import { shuffleWonders, getWondersByAddons } from './wonders';
import { ADDONS, BASE_GAME } from '../config/game';

/* Get first 2 capital letters of the name */
export function getAvatarText(name: string): string {
  return name
    .split(' ')
    .reduce((acc, word) => (word ? acc + word[0] : acc), '')
    .substring(0, 2)
    .toUpperCase();
}

/* Get the greatest maxPlayers value from selected addons */
export const getMaxPlayersByAddons = (gameAddons: string[]): number => {
  const addons = ADDONS.filter(addon => gameAddons.includes(addon.name));
  return [BASE_GAME, ...addons].reduce((max, addon) => {
    if (addon.maxPlayers > max) {
      return addon.maxPlayers;
    }
    return max;
  }, 0);
}

/** Slice extra players if new limit is less than before */
export const updatePlayersCount = (players: Player[], maxPlayers: number): Player[] => {
  return players.slice(0, maxPlayers);
};

/** Change selected wonders if they are no longer available due to addons change */
export const updateSelectedWonders = (players: Player[], wonders: string[]): Player[] => {
  const selectedWonders = players.map(player => player.wonder);
  return [
    ...players.map(player => {
      if (!wonders.includes(player.wonder)) {
        const shuffledWonders = shuffleWonders(wonders).filter(
          wonder => !selectedWonders.includes(wonder)
        );
        return {
          ...player,
          wonder: shuffledWonders[0],
        };
      }
      return player;
    }),
  ];
};

export const getPlayersWithShuffledWonders = (players: Player[], addons: string[]): Player[] => {
  const wonders = getWondersByAddons(addons);
  const shuffledWonders = shuffleWonders(wonders);

  return players.map((player, index) => {
    return {
      ...player,
      wonder: shuffledWonders[index],
    }
  });
}
