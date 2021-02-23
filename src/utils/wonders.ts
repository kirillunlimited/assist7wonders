import { TWonders } from '../types';
import shuffle from 'lodash.shuffle';

export function shuffleWonders(wonders: TWonders): TWonders {
  return shuffle(wonders);
}
