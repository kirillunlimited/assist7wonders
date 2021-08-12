import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
};

firebase.initializeApp(config);

const USERS_TABLE = 'users';

const getUserRef = (uid: string) => firebase.database().ref(`${USERS_TABLE}/${uid}`);

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

export const saveUserDataToDb = (uid: string, payload: any) => {
  if (uid) {
    getUserRef(uid).set(payload);
  }
};

export default firebase;
