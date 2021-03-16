import { Game, AddonGame } from '../types';
import base from './addons/base';
import cities from './addons/cities';
import leaders from './addons/leaders';
import armada from './addons/armada';
import wonderPack from './addons/wonder_pack';

export const BASE_GAME: AddonGame = base;
export const ADDONS: AddonGame[] = [cities, leaders, armada, wonderPack];
export const GAME_BOILERPLATE: Game = {
  maxPlayers: 0,
  addons: [],
  wonders: [],
  scores: [],
};
