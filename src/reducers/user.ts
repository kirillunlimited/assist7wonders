import { User } from '../types';

const SET_UID = 'SET_UID';

type SetUidAction = {
  type: typeof SET_UID;
  payload: string;
};

export type Action = SetUidAction;

const reducer = (state: User, action: Action) => {
  switch (action.type) {
    case SET_UID:
      return {
        ...state,
        uid: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
