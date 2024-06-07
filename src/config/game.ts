import { AddonGameParams } from '../types';
import base from './addons/base';
import leaders from './addons/leaders';
import cities from './addons/cities';
import babel from './addons/babel';
import armada from './addons/armada';
import wonderPack from './addons/wonder_pack';
import catan from './addons/catan';
import edifice from './addons/edifice';

export const BASE_GAME: AddonGameParams = base;
export const ADDONS: AddonGameParams[] = [leaders, cities, babel, armada, wonderPack, catan, edifice];
