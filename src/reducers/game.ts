import { Game, GameScore } from '../types';
import { ADDONS, BASE_GAME } from '../config/game';
import { mergeScores } from '../utils/game';

const UPDATE = 'UPDATE';
const SET_GAME_ID = 'SET_GAME_ID';

type UpdateAction = {
  type: typeof UPDATE;
  payload: {
    gameId?: number;
    addons: string[];
  };
};

type SetGameIdAction= {
  type: typeof SET_GAME_ID;
  payload: {
    gameId: number;
  }
}

export type Action = UpdateAction | SetGameIdAction;

const reducer = (state: Game, action: Action) => {
  switch (action.type) {
    case UPDATE:
      const addons = ADDONS.filter(addon => action.payload.addons.includes(addon.name));
      const addonScores = addons.reduce((scores, addon) => {
        if (addon) {
          return [...scores, ...addon.scores];
        }
        return scores;
      }, [] as GameScore[]);
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
        gameId: action.payload.gameId || state.gameId,
        maxPlayers,
        addons: action.payload.addons,
        wonders: [...BASE_GAME.wonders, ...addonWonders],
        scores: mergeScores([...BASE_GAME.scores, ...addonScores]),
      };
    case SET_GAME_ID:
      return {
        ...state,
        gameId: action.payload.gameId
      };
    default:
      return state;
  }
};

export default reducer;
