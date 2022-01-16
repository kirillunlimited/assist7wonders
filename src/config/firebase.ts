import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import "firebase/analytics";
import { FIREBASE_CONFIG } from './constants';

firebase.initializeApp(FIREBASE_CONFIG);
firebase.analytics();

export default firebase;
