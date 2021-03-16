import { Game, AddonGame } from '../types';
import base from './addons/base';
import cities from './addons/cities';
import leaders from './addons/leaders';
import armada from './addons/armada';

export const BASE_GAME: AddonGame = base;
export const ADDONS: AddonGame[] = [cities, leaders, armada];
export const GAME_BOILERPLATE: Game = {
  maxPlayers: 0,
  addons: [],
  wonders: [],
  scores: [],
};
