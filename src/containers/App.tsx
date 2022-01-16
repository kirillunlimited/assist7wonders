import React, { useState, useEffect, useReducer, useCallback } from 'react';
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
import firebase, { readUserDataFromDb, saveUserDataToDb } from '../config/firebase';

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
  const [isReady, setIsReady] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    if (isReady) {
      savePlayers(players);
    }
  }, [players]);

  useEffect(() => {
    if (isReady) {
      saveGame(game.gameId, game.addons);
      playersDispatch({ type: 'GAME_UPDATE', payload: game });
    }
  }, [game]);

  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async user => {
      const uid = user?.uid || '';
      userDispatch({ type: 'SET_UID', payload: uid });

      const { gameId, addons, players } = (await getSavedData(uid)) || {};
      saveGameId(gameId);
      initGame(gameId, addons);
      initPlayers(players);

      setIsReady(true);
    });
    return () => unregisterAuthObserver();
  }, []);

  function initGame(gameId: string, addons: string[] = []): void {
    gameDispatch({ type: 'UPDATE', payload: { gameId, addons } });
  }

  function initPlayers(payload: Player[] = []): void {
    playersDispatch({ type: 'SET', payload });
  }

  function saveGameId(gameId: string) {
    saveUserDataToDb(user.uid, {
      gameId,
      players,
      game
    });
    saveGameIdToStorage(gameId);
  }

  function saveGame(gameId: string, addons: string[]) {
    saveUserDataToDb(user.uid, {
      gameId,
      players,
      addons,
    });
    saveGameIdToStorage(gameId);
    saveAddonsToStorage(game.addons);
  }

  function savePlayers(players: Player[]) {
    saveUserDataToDb(user.uid, {
      gameId: game.gameId,
      players,
      addons: game.addons,
    });
    savePlayersToStorage(players);
  }

  async function getSavedData(uid: string) {
    /** Authorized */
    if (uid) {
      return readUserDataFromDb(uid);
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
