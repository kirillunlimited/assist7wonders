import { Game, AddonGame } from '../types';
import base from './addons/base';
import leaders from './addons/leaders';
import cities from './addons/cities';
import babel from './addons/babel';
import armada from './addons/armada';
import wonderPack from './addons/wonder_pack';
import catan from './addons/catan';

export const BASE_GAME: AddonGame = base;
export const ADDONS: AddonGame[] = [leaders, cities, babel, armada, wonderPack, catan];
export const GAME_BOILERPLATE: Game = {
  gameId: '',
  maxPlayers: 0,
  addons: [],
  wonders: [],
  scores: [],
};
