import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import "firebase/analytics";
import { FIREBASE_CONFIG } from './constants';

export const isFirebaseOk = Object.values(FIREBASE_CONFIG).every(value => value);

if (isFirebaseOk) {
  firebase.initializeApp(FIREBASE_CONFIG);
  firebase.analytics();
} else {
  console.warn('⚠️ Firebase init error: configuration is missing some parameters.');
}

export default firebase;
