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

export const updateAction = (gameId: number, payloadAddons: string[]): Game => {
  const addons = ADDONS.filter(addon => payloadAddons.includes(addon.name));
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
    gameId: gameId,
    maxPlayers,
    addons: payloadAddons,
    wonders: [...BASE_GAME.wonders, ...addonWonders],
    scores: mergeScores([...BASE_GAME.scores, ...addonScores]),
  };
}

const reducer = (state: Game, action: Action) => {
  switch (action.type) {
    case UPDATE:
      return updateAction(action.payload.gameId || state.gameId, action.payload.addons);
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
