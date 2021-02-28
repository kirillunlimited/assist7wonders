import { IPlayer, TPlayerScoreKey, ICoreGame } from '../types';
import { getAllCounters, shuffleWonders } from '../utils/game';

const counters = getAllCounters();

const SET = 'SET';
const ADD = 'ADD';
const DELETE = 'DELETE';
const UPDATE = 'UPDATE';
const RESET = 'RESET';
const SET_WONDER = 'SET_WONDER';
const REFRESH_WONDERS = 'REFRESH_WONDERS';

interface ISetAction {
  type: typeof SET;
  payload: IPlayer[];
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
    scoreKey: TPlayerScoreKey;
    value: number;
  };
}

interface IResetAction {
  type: typeof RESET;
  payload: ICoreGame;
}

interface ISetWonderAction {
  type: typeof SET_WONDER;
  payload: {
    name: string;
    wonder: string;
  };
}

interface IRefreshWondersAction {
  type: typeof REFRESH_WONDERS;
  payload: {
    wonders: string[];
  };
}

export type TAction =
  | ISetAction
  | IAddAction
  | IDeleteAction
  | IUpdateAction
  | IResetAction
  | ISetWonderAction
  | IRefreshWondersAction;

const reducer = (state: IPlayer[], action: TAction) => {
  switch (action.type) {
    case SET:
      return [...action.payload];
    case ADD:
      const { name, wonder } = action.payload;

      return [
        ...state,
        {
          name,
          wonder,
          score: {
            ...counters,
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
      const { wonders } = action.payload;
      const shuffledWonders = shuffleWonders(wonders);
      return [
        ...state.map((player, index) => {
          return {
            ...player,
            wonder: shuffledWonders[index],
            score: {
              ...counters,
            },
          };
        }),
      ];
    case SET_WONDER: {
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

    /** Change selected wonders if they are no longer available due to addons change */
    case REFRESH_WONDERS: {
      const { wonders } = action.payload;
      const selectedWonders = state.map(player => player.wonder);

      return [
        ...state.map(player => {
          if (!wonders.includes(player.wonder)) {
            const shuffledWonders = shuffleWonders(action.payload.wonders).filter(
              wonder => !selectedWonders.includes(wonder)
            );
            return {
              ...player,
              wonder: shuffledWonders[0],
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
