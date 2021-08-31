import React, { useState, useEffect, useReducer } from 'react';
import Layout from '../components/Layout';
import RouteWrapper from '../components/RouteWrapper';
import MainMenu from './MainMenu';
import Navigation from './Navigation';
import Router from './Router';
import {
  savePlayersToStorage,
  saveAddonsToStorage,
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
      saveAddons(game.addons);
      playersDispatch({ type: 'GAME_UPDATE', payload: game });
    }
  }, [game]);

  useEffect(() => {
    initGame();
  }, []);

  function initGame(): void {
    firebase.auth().onAuthStateChanged(async userData => {
      const uid = userData?.uid || '';
      userDispatch({ type: 'SET_UID', payload: uid });

      const { addons, players } = (await getSavedData(uid)) || {};
      initAddons(addons);
      await initPlayers(players);

      setIsReady(true);
    });
  }

  function initAddons(addons: string[] = []): void {
    gameDispatch({ type: 'UPDATE', payload: { addons } });
  }

  function initPlayers(payload: Player[] = []): void {
    playersDispatch({ type: 'SET', payload });
  }

  function savePlayers(players: Player[]) {
    saveUserDataToDb(user.uid, {
      players,
      addons: game.addons,
    });
    savePlayersToStorage(players);
  }

  function saveAddons(addons: string[]) {
    saveUserDataToDb(user.uid, {
      players,
      addons,
    });
    saveAddonsToStorage(game.addons);
  }

  async function getSavedData(uid: string) {
    /** Authorized */
    if (uid) {
      return readUserDataFromDb(uid);
    }

    /** Unauthorized */
    const addons = getAddonsFromStorage();
    const players = getPlayersFromStorage();
    return {
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
