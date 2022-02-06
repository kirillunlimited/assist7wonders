import firebase, { isFirebaseOk } from '../config/firebase';
import { SAVE_TIMEOUT } from '../config/constants';
import { debounce } from 'debounce';
import { GameState } from '../types';

const USERS_TABLE = 'users';
const USER_GAMES_TABLE = 'games';

const getUserRef = (userId: string) => firebase.database().ref(`${USERS_TABLE}/${userId}`);

export async function readUserDataFromDb(userId: string) {
  if (!isFirebaseOk) {
    return {};
  }

  if (userId) {
    try {
      const ref = getUserRef(userId);
      const snapshot = await ref.once('value');
      return snapshot.val() || {}
    } catch (error) {
      console.error(error);
      return {};
    }
  }
}

export const saveGamesToDb = debounce((userId: string, games: GameState[]) => {
  if (!isFirebaseOk) {
    return;
  }

  if (userId) {
    getUserRef(userId)
      .child(`${USER_GAMES_TABLE}`)
      .set(games);
  }
}, SAVE_TIMEOUT);
