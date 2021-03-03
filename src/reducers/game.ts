import { TGame, IGameScore } from '../types';
import { ADDONS, BASE_GAME } from '../config/game';

const UPDATE = 'UPDATE';

interface IUpdateAction {
  type: typeof UPDATE;
  payload: {
    addons: string[];
  };
}

export type TAction = IUpdateAction;

const reducer = (state: TGame, action: TAction) => {
  switch (action.type) {
    case UPDATE:
      const addons = ADDONS.filter(addon => action.payload.addons.includes(addon.id));
      const addonScores = addons.reduce((scores, addon) => {
        if (addon) {
          return [...scores, ...addon.scores];
        }
        return scores;
      }, [] as IGameScore[]);
      const addonWonders = addons.reduce((wonders, addon) => {
        if (addon) {
          return [...wonders, ...addon.wonders];
        }
        return wonders;
      }, [] as string[]);

      const maxPlayers = [BASE_GAME, ...addons].reduce((max, addon) => {
        if (addon.maxPlayers > max) {
          return addon.maxPlayers;
        }
        return max;
      }, 0);
      return {
        maxPlayers,
        addons: action.payload.addons,
        wonders: [...BASE_GAME.wonders, ...addonWonders],
        scores: [...BASE_GAME.scores, ...addonScores],
      };
    default:
      return state;
  }
};

export default reducer;
