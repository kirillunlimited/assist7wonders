import { IAddons } from '../types';

export const addonsTemplate: IAddons = {
  cities: false,
  leaders: false,
};

const SET = 'SET';
const TOGGLE = 'TOGGLE';

interface ISetAction {
  type: typeof SET;
  payload: IAddons;
}

interface IToggleAction {
  type: typeof TOGGLE;
  payload: {
    addon: keyof IAddons;
    value: boolean;
  };
}

export type TAction = ISetAction | IToggleAction;

const reducer = (state: IAddons, action: TAction) => {
  switch (action.type) {
    case SET:
      return {
        ...action.payload,
      };
    case TOGGLE:
      const { addon, value } = action.payload;
      return {
        ...state,
        [addon]: value,
      };
    default:
      return state;
  }
};

export default reducer;
