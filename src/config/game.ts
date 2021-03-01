import { TGame, TAddonGame } from '../types';
import base from './addons/base';
import cities from './addons/cities';
import leaders from './addons/leaders';

export const BASE_GAME: TAddonGame = base;
export const ADDONS: TAddonGame[] = [cities, leaders];
export const GAME_BOILERPLATE: TGame = {
  maxPlayers: 0,
  addons: [],
  wonders: [],
  scores: [],
};
