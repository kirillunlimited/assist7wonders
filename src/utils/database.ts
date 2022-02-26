import firebase, { isFirebaseOk } from '../config/firebase';
import { GamesState, GameState, PlayerScoreKey } from '../types';
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

export const readLastGame = async(userId?: string): Promise<GameState | null> => {
  if (!isFirebaseOk) {
    return null;
  }

  if (!userId) {
    return null;
  }

  const gamesRef = getUserRef(userId)
    .child(`${USER_GAMES_TABLE}`)
    .orderByChild('isLast')
    .equalTo(true);
  const snapshot = await gamesRef.once('value');
  const games = snapshot.val() || null;
  return mapGamesObjectToArray(games)[0];
}

export const updatePlayerScore = (userId: string, gameId: number, name: string, scoreKey: PlayerScoreKey, value: number) => {
  if (!isFirebaseOk) {
    return;
  }

  if (userId) {
    getUserRef(userId)
      .child(`${USER_GAMES_TABLE}`)
      .update({
        [`${gameId}/players/${name}/score/${scoreKey}`]: value
      });
  }
}

export const addGameToDb = (userId: string, gameId: number, game: GameState) => {
  if (!isFirebaseOk) {
    return;
  }

  if (userId) {
    const gamesObject = mapGamesArrayToObject([game]);

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
