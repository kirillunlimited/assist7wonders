import firebase, { isFirebaseOk } from '../config/firebase';
import { SAVE_TIMEOUT } from '../config/constants';
import { debounce } from 'debounce';
import { GamesState, GameState } from '../types';

const USERS_TABLE = 'users';
const USER_GAMES_TABLE = 'games';

const getUserRef = (userId: string) => firebase.database().ref(`${USERS_TABLE}/${userId}`);

export async function getUserGamesFromDb(userId: string): Promise<GamesState> {
  if (!isFirebaseOk) {
    return [];
  }

  const ref = getUserRef(userId);
  const snapshot = await ref.once('value');
  const { games } = snapshot.val();
  return games || [];
}

export const saveUserGamesToDb = debounce((userId: string, games: GameState[]) => {
  if (!isFirebaseOk) {
    return;
  }

  if (userId) {
    getUserRef(userId)
      .child(`${USER_GAMES_TABLE}`)
      .set(games);
  }
}, SAVE_TIMEOUT);
