import firebase, { isFirebaseOk } from '../config/firebase';
import { SAVE_TIMEOUT } from '../config/constants';
import { debounce } from 'debounce';

const USERS_TABLE = 'users';
const USER_GAMES_TABLE = 'games';

const getUserRef = (uid: string) => firebase.database().ref(`${USERS_TABLE}/${uid}`);

export async function readUserDataFromDb(uid: string) {
  if (!isFirebaseOk) {
    return {};
  }

  if (uid) {
    try {
      const ref = getUserRef(uid);
      const snapshot = await ref.once('value');
      return snapshot.val() || {}
    } catch (error) {
      console.error(error);
      return {};
    }
  }
}

export const saveGameDataToDb = debounce((uid: string, gameId: number, payload: any) => {
  if (!isFirebaseOk) {
    return;
  }

  if (uid) {
    if (typeof gameId !== 'number' || gameId === 0) {
      console.error('🚫 Error while writing data to database --- wrong game id value:', gameId);
      return;
    }
    /** "update" is better than "set" */
    getUserRef(uid)
      .child(`${USER_GAMES_TABLE}/${gameId}`)
      .update(payload);
  }
}, SAVE_TIMEOUT);

export const deleteGameFromDb = debounce((uid: string, gameId: number) => {
  if (!isFirebaseOk) {
    return;
  }

  if (uid) {
    if (typeof gameId !== 'number' || gameId === 0) {
      console.error('🚫 Error while writing data to database --- wrong game id value:', gameId);
      return;
    }
    /** "update" is better than "set" */
    getUserRef(uid)
      .child(`${USER_GAMES_TABLE}/${gameId}`)
      .remove();
  }
}, SAVE_TIMEOUT);
