import { Game, AddonGame } from '../types';
import base from './addons/base';
import cities from './addons/cities';
import leaders from './addons/leaders';

export const BASE_GAME: AddonGame = base;
export const ADDONS: AddonGame[] = [cities, leaders];
export const GAME_BOILERPLATE: Game = {
  maxPlayers: 0,
  addons: [],
  wonders: [],
  scores: [],
};
