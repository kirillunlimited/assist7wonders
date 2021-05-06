import { Game, AddonGame } from '../types';
import base from './addons/base';
import leaders from './addons/leaders';
import cities from './addons/cities';
import babel from './addons/babel';
import armada from './addons/armada';
import wonderPack from './addons/wonder_pack';

export const BASE_GAME: AddonGame = base;
export const ADDONS: AddonGame[] = [leaders, cities, babel, armada, wonderPack];
export const GAME_BOILERPLATE: Game = {
  maxPlayers: 0,
  addons: [],
  wonders: [],
  scores: [],
};
