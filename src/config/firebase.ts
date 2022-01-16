import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { debounce } from 'debounce';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
};

firebase.initializeApp(config);

const USERS_TABLE = 'users';
const USER_GAMES_TABLE = 'games';

const getUserRef = (uid: string) => firebase.database().ref(`${USERS_TABLE}/${uid}`);

// TODO: move to common constants
const SAVE_TIMEOUT = 500;

export async function readUserDataFromDb(uid: string) {
  if (uid) {
    try {
      const ref = getUserRef(uid);
      const snapshot = await ref.once('value');
      return snapshot.val();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

// make it debounce
export const saveGameDataToDb = debounce((uid: string, gameId: number, payload: any) => {
  if (uid) {
    if (typeof gameId !== 'number' || gameId === 0) {
      console.error('🚫 Error while writing data to database --- wrong game id value:', gameId);
    }
    /** "update" is better than "set" */
    getUserRef(uid)
      .child(`${USER_GAMES_TABLE}/${gameId}`)
      .update(payload);
  }
}, SAVE_TIMEOUT);

export default firebase;
