import React, { useEffect, useReducer, useRef } from 'react';
import Layout from '../components/Layout';
import RouteWrapper from '../components/RouteWrapper';
import MainMenu from './MainMenu';
import Navigation from './Navigation';
import Router from './Router';
import {
  savePlayersToStorage,
  saveGameIdToStorage,
  saveAddonsToStorage,
  getGameIdFromStorage,
  getPlayersFromStorage,
  getAddonsFromStorage,
} from '../utils/storage';
import playersReducer, { Action as PlayersAction } from '../reducers/players';
import gamesReducer, { Action as GameAction } from '../reducers/game';
import userReducer, { Action as UserAction } from '../reducers/user';
import { Player, Game, User } from '../types';
import { GAME_BOILERPLATE } from '../config/game';
import ROUTES from '../config/routes';
import { makeStyles } from '@material-ui/core/styles';
import firebase from '../config/firebase';
import { readUserDataFromDb, saveGameDataToDb } from '../utils/firebase';

type PlayersContextProps = {
  state: Player[];
  dispatch: (action: PlayersAction) => void;
};

type GameContextProps = {
  state: Game;
  dispatch: (action: GameAction) => void;
};

type UserContextProps = {
  state: User;
  dispatch: (action: UserAction) => void;
};

export const PlayersContext = React.createContext({} as PlayersContextProps);
export const GameContext = React.createContext({} as GameContextProps);
export const UserContext = React.createContext({} as UserContextProps);

const useStyles = makeStyles({
  app: {
    display: 'flex',
    height: '100%',
    textAlign: 'center',
  },
});

export default function App() {
  const [game, gameDispatch] = useReducer(gamesReducer, GAME_BOILERPLATE);
  const [players, playersDispatch] = useReducer(playersReducer, []);
  const [user, userDispatch] = useReducer(userReducer, { uid: '' });
  const isReady = useRef(false);
  const classes = useStyles();

  useEffect(() => {
    if (isReady.current) {
      savePlayers(players);
    }
  }, [players]);

  useEffect(() => {
    if (isReady.current) {
      saveGame(game.gameId, game.addons);
      playersDispatch({ type: 'GAME_UPDATE', payload: game });
    }
  }, [game]);

  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async user => {
      const uid = user?.uid || '';
      userDispatch({ type: 'SET_UID', payload: uid });

      // Logout
      if (isReady.current && !uid) {
        resetGame();
        return;
      }

      const { gameId, addons, players } = (await getLastSavedGame(uid)) || {};
      saveGameId(gameId);
      initGame(gameId, addons);
      initPlayers(players);

      isReady.current = true;
    });
    return () => unregisterAuthObserver();
  }, []);

  function initGame(gameId: number, addons: string[] = []): void {
    gameDispatch({ type: 'UPDATE', payload: { gameId, addons } });
  }

  function initPlayers(payload: Player[] = []): void {
    playersDispatch({ type: 'SET', payload });
  }

  function saveGameId(gameId: number) {
    saveGameDataToDb(user.uid, gameId, {
      players,
      game
    });
    saveGameIdToStorage(gameId);
  }

  function saveGame(gameId: number, addons: string[]) {
    saveGameDataToDb(user.uid, gameId, {
      players,
      addons,
    });
    saveGameIdToStorage(gameId);
    saveAddonsToStorage(game.addons);
  }

  function savePlayers(players: Player[]) {
    saveGameDataToDb(user.uid, game.gameId, {
      players,
      addons: game.addons,
    });
    savePlayersToStorage(players);
  }

  function resetGame() {
    const gameId = Date.now();
    saveGameId(gameId);
    initGame(gameId, []);
    initPlayers([]);
  }

  async function getLastSavedGame(uid: string) {
    /** Authorized */
    if (uid) {
      const { games } = await readUserDataFromDb(uid);
      const gameIds = Object.keys(games);
      const gameId = Number(gameIds[gameIds.length - 1]);
      const { addons, players } = games[gameId];
      return {
        gameId,
        addons,
        players
      }
    }

    /** Unauthorized */
    const gameId = getGameIdFromStorage();
    const addons = getAddonsFromStorage();
    const players = getPlayersFromStorage();
    return {
      gameId,
      addons,
      players,
    };
  }

  return (
    <div className={classes.app}>
      <GameContext.Provider value={{ state: game, dispatch: gameDispatch }}>
        <UserContext.Provider value={{ state: user, dispatch: userDispatch }}>
          <PlayersContext.Provider value={{ state: players, dispatch: playersDispatch }}>
            {isReady && (
              <Layout>
                <>
                  <Navigation />
                  <MainMenu />
                  <RouteWrapper>
                    <Router routes={ROUTES} />
                  </RouteWrapper>
                </>
              </Layout>
            )}
          </PlayersContext.Provider>
        </UserContext.Provider>
      </GameContext.Provider>
    </div>
  );
}
