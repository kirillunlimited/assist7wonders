import { IAddons, TPlayers, TScoreKey } from '../types';
import ADDONS from '../config/addons';
import { WONDERS } from '../config/wonders';
import { shuffleWonders } from '../utils/wonders';

const scoreTemplate = {
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
  cities: 0,
  debt: 0,
  leaders: 0,
};

const INIT = 'INIT';
const ADD = 'ADD';
const DELETE = 'DELETE';
const UPDATE = 'UPDATE';
const RESET = 'RESET';
const SET_ADDON = 'SET_ADDON';
const SET_WONDER = 'SET_WONDER';

interface IInitAction {
  type: typeof INIT;
  payload: TPlayers;
}

interface IAddAction {
  type: typeof ADD;
  payload: {
    name: string;
    wonder: string;
  };
}

interface IDeleteAction {
  type: typeof DELETE;
  payload: string;
}

interface IUpdateAction {
  type: typeof UPDATE;
  payload: {
    name: string;
    scoreKey: TScoreKey;
    value: number;
  };
}

interface IResetAction {
  type: typeof RESET;
}

interface ISetAddonAction {
  type: typeof SET_ADDON;
  payload: IAddons;
}

interface ISetWonderAction {
  type: typeof SET_WONDER;
  payload: {
    name: string;
    wonder: string;
  };
}

export type TAction =
  | IInitAction
  | IAddAction
  | IDeleteAction
  | IUpdateAction
  | IResetAction
  | ISetAddonAction
  | ISetWonderAction;

const reducer = (state: TPlayers, action: TAction) => {
  switch (action.type) {
    case INIT:
      return [...action.payload];
    case ADD:
      const { name, wonder } = action.payload;

      return [
        ...state,
        {
          name,
          wonder,
          score: {
            ...scoreTemplate,
          },
        },
      ];
    case DELETE:
      return [
        ...state.filter(player => {
          return player.name !== action.payload;
        }),
      ];
    case UPDATE: {
      const { name, scoreKey, value } = action.payload;

      const player = state.find(player => player.name === name);

      if (player) {
        return [
          ...state.map(player => {
            if (player.name === name) {
              return {
                ...player,
                score: {
                  ...player.score,
                  [scoreKey]: value,
                },
              };
            } else {
              return player;
            }
          }),
        ];
      }
      return state;
    }
    case RESET:
      const shuffledWonders = shuffleWonders(WONDERS);
      return [
        ...state.map((player, index) => {
          return {
            ...player,
            wonder: shuffledWonders[index],
            score: {
              ...scoreTemplate,
            },
          };
        }),
      ];
    case SET_ADDON:
      const disabledAddons = ADDONS.filter(addon => {
        return !action.payload[addon.id];
      });

      const scoresDisabledByAddons = disabledAddons.reduce(
        (scores: { [key in TScoreKey]?: number }, addon) => {
          addon.scores.forEach(score => {
            scores[score] = 0;
          });
          return scores;
        },
        {}
      );

      return [
        ...state.map(player => {
          return {
            ...player,
            score: {
              ...player.score,
              ...scoresDisabledByAddons,
            },
          };
        }),
      ];
    case 'SET_WONDER': {
      const { name, wonder } = action.payload;

      return [
        ...state.map(player => {
          if (player.name === name) {
            return {
              ...player,
              wonder,
            };
          } else {
            return player;
          }
        }),
      ];
    }
    default:
      return state;
  }
};

export default reducer;
