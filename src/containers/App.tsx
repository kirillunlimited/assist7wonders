import React, { useEffect, useReducer, useState } from 'react';
import Layout from '../components/Layout';
import RouteWrapper from '../components/RouteWrapper';
import MainMenu from './MainMenu';
import Navigation from './Navigation';
import Router from './Router';
import ResetGame from './ResetGame';
import AddonsMenu from './AddonsMenu';
import LanguageMenu from './LanguageMenu';
import AuthMenu from './AuthMenu';
import { CircularProgress } from '@material-ui/core';

import playersReducer, { Action as PlayersAction } from '../reducers/players';
import gamesReducer, { Action as GameAction } from '../reducers/game';
import userReducer, { Action as UserAction } from '../reducers/user';
import { Player, Game, User } from '../types';
import { GAME_BOILERPLATE } from '../config/game';
import ROUTES from '../config/routes';
import { makeStyles } from '@material-ui/core/styles';
import firebase from '../config/firebase';
import { saveAll, saveAddons, savePlayers, getLastSavedGame } from '../utils/sync';

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
  loading: {
    alignItems: 'center'
  },
  loader: {
    margin: '0 auto'
  }
});

export default function App() {
  const [game, gameDispatch] = useReducer(gamesReducer, GAME_BOILERPLATE);
  const [players, playersDispatch] = useReducer(playersReducer, []);
  const [user, userDispatch] = useReducer(userReducer, { uid: '' });
  const [isReady, setIsReady] = useState(false)
  const classes = useStyles();

  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      const uid = user?.uid || '';
      userDispatch({ type: 'SET_UID', payload: uid });
      if (!isReady) {
        restoreLastGame();
      }
      setIsReady(true);
    });
    return () => unregisterAuthObserver();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isReady) {
      savePlayers(user.uid, game.gameId, players);
    }
  }, [players]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isReady) {
      saveAddons(user.uid, game.gameId, game.addons);
      playersDispatch({ type: 'GAME_UPDATE', payload: game });
    }
  }, [game]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleLogIn(userId: string) {
    saveAll(userId, game.gameId, game.addons, players);
  }

  function handleLogOut() {
    /** Reset game */
    const gameId = Date.now();
    init(gameId, [], []);
  }

  function restoreLastGame() {
    const { gameId, addons, players } = getLastSavedGame();
    init(gameId, addons, players);
  }

  function init(gameId: number, addons: string[] = [], players: Player[] = []) {
    gameDispatch({ type: 'UPDATE', payload: { gameId, addons } });
    playersDispatch({ type: 'SET', payload: players });
  }

  return (
    <div className={`${classes.app} ${!isReady ? classes.loading : ''}`}>
      <GameContext.Provider value={{ state: game, dispatch: gameDispatch }}>
        <UserContext.Provider value={{ state: user, dispatch: userDispatch }}>
          <PlayersContext.Provider value={{ state: players, dispatch: playersDispatch }}>
              <Layout>
                {isReady ? <>
                  <Navigation />
                  <MainMenu>
                    <ResetGame />
                    <AddonsMenu />
                    <LanguageMenu />
                    <AuthMenu
                      onLogIn={handleLogIn}
                      onLogOut={handleLogOut}
                    />
                  </MainMenu>
                  <RouteWrapper>
                    <Router routes={ROUTES} />
                  </RouteWrapper>
                </> : <CircularProgress className={classes.loader}/>}
              </Layout>
          </PlayersContext.Provider>
        </UserContext.Provider>
      </GameContext.Provider>
    </div>
  );
}
