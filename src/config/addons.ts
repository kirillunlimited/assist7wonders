import { IAddons, TAddonsConfig, TScoreKey } from '../types';

const ADDONS: TAddonsConfig = [
  {
    id: 'cities',
    scores: ['cities', 'debt'],
  },
  {
    id: 'leaders',
    scores: ['leaders'],
  },
];

/** Get scores view availability based on toggled addons */
export function isScoresAvailable(scores: TScoreKey[], addons: IAddons) {
  const addon = ADDONS.find(addon => scores.every(score => addon.scores.includes(score)));

  if (addon) {
    const activeAddons = (Object.keys(addons) as Array<keyof IAddons>).filter(
      addon => addons[addon]
    );
    return activeAddons.includes(addon.id);
  }

  return true;
}

export default ADDONS;
