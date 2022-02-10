import firebase, { isFirebaseOk } from '../config/firebase';
import { SAVE_TIMEOUT } from '../config/constants';
import { debounce } from 'debounce';
import { GamesState, GameState } from '../types';
import { mapGamesArrayToObject, mapGamesObjectToArray } from '../utils/game';

const USERS_TABLE = 'users';
const USER_GAMES_TABLE = 'games';

const getUserRef = (userId: string) => firebase.database().ref(`${USERS_TABLE}/${userId}`);

export async function getUserGamesFromDb(userId: string): Promise<GamesState> {
  if (!isFirebaseOk) {
    return [];
  }

  const ref = getUserRef(userId);
  const snapshot = await ref.once('value');
  const { games } = snapshot.val() || {};
  return mapGamesObjectToArray(games);
}

export const saveUserGamesToDb = debounce((userId: string, games: GameState[]) => {
  if (!isFirebaseOk) {
    return;
  }

  if (userId) {
    const gamesObject = mapGamesArrayToObject(games);

    getUserRef(userId)
      .child(`${USER_GAMES_TABLE}`)
      .set(gamesObject);
  }
}, SAVE_TIMEOUT);

export const addGamesToDb = (userId: string, games: GameState[]) => {
  if (!isFirebaseOk) {
    return;
  }

  if (userId) {
    const gamesObject = mapGamesArrayToObject(games);

    getUserRef(userId)
      .child(`${USER_GAMES_TABLE}`)
      .update(gamesObject);
  }
}

export const deleteGameFromDb = (userId: string, gameId: number) => {
  if (!isFirebaseOk) {
    return;
  }

  getUserRef(userId)
    .child(`${USER_GAMES_TABLE}/${gameId}`)
    .remove();
}
