import { TBaseGame, IGameScore } from '../types';
import { baseGame, addons as configAddons } from '../config/game';

const INIT = 'INIT';
const SET_WONDERS = 'SET_WONDERS';

interface IInitAction {
  type: typeof INIT;
  payload: {
    addons: string[];
  };
}

interface ISetWondersAction {
  type: typeof SET_WONDERS;
  payload: string[];
}

export type TAction = IInitAction | ISetWondersAction;

const reducer = (state: TBaseGame, action: TAction) => {
  switch (action.type) {
    case INIT:
      const addons = configAddons.filter(configAddon =>
        action.payload.addons.includes(configAddon.id)
      );
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
      return {
        ...baseGame,
        addons: action.payload.addons,
        wonders: [...baseGame.wonders, ...addonWonders],
        scores: [...baseGame.scores, ...addonScores],
      };
    case SET_WONDERS:
      return {
        ...state,
        wonders: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
