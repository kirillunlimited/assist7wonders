import { HistoryState } from '../types';

const SET_HISTORY = 'SET_HISTORY';

type SetHistoryAction = {
  type: typeof SET_HISTORY;
  payload: HistoryState;
};

export type Action = SetHistoryAction;

const reducer = (state: HistoryState, action: Action) => {
  switch (action.type) {
    case SET_HISTORY:
      return action.payload;
    default:
      return state;
  }
};

export default reducer;
