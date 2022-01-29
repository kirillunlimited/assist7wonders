import { User } from '../types';

const SET_USER = 'SET_USER';

type SetUidAction = {
  type: typeof SET_USER;
  payload: {
    uid: string;
    email?: string | null;
    displayName?: string | null;
  }
};

export type Action = SetUidAction;

const reducer = (state: User, action: Action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        uid: action.payload.uid,
        email: action.payload?.email,
        displayName: action.payload?.displayName,
      };
    default:
      return state;
  }
};

export default reducer;
