import shuffle from 'lodash.shuffle';
import { ADDONS, BASE_GAME } from '../config/game';

export function shuffleWonders(wonders: string[]): string[] {
  return shuffle(wonders);
}

export const getWondersByAddons = (gameAddons: string[]): string[] => {
  const addons = ADDONS.filter(addon => gameAddons.includes(addon.name));
  const addonWonders = addons.reduce((wonders, addon) => {
    return [...wonders, ...addon.wonders];
  }, [] as string[]);

  return [...BASE_GAME.wonders, ...addonWonders];
}
