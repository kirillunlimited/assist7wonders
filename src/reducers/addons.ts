import { IAddons } from '../types';

export const addonsTemplate: IAddons = {
  cities: false,
  leaders: false,
};

const INIT = 'INIT';
const TOGGLE = 'TOGGLE';

interface IInitAction {
  type: typeof INIT;
  payload: IAddons;
}

interface IToggleAction {
  type: typeof TOGGLE;
  payload: {
    addon: keyof IAddons;
    value: boolean;
  };
}

export type TAction = IInitAction | IToggleAction;

const reducer = (state: IAddons, action: TAction) => {
  switch (action.type) {
    case INIT:
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
