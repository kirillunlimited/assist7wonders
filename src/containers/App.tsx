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
import historyReducer, { Action as HistoryAction } from '../reducers/history';
import { Player, Game, User, HistoryState } from '../types';
import { GAME_BOILERPLATE } from '../config/game';
import ROUTES from '../config/routes';
import { makeStyles } from '@material-ui/core/styles';
import firebase, {isFirebaseOk} from '../config/firebase';
import { saveAll, saveGame, savePlayers, getLastSavedGame, getSavedGames } from '../utils/sync';

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

type HistoryContextProps = {
  state: HistoryState,
  dispatch: (action: HistoryAction) => void;
}

export const PlayersContext = React.createContext({} as PlayersContextProps);
export const GameContext = React.createContext({} as GameContextProps);
export const UserContext = React.createContext({} as UserContextProps);
export const HistoryContext = React.createContext({} as HistoryContextProps);

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
  const [history, historyDispatch] = useReducer(historyReducer, []);
  const [isReady, setIsReady] = useState(false)
  const classes = useStyles();

  useEffect(() => {
    if (isFirebaseOk) {
      const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async (user) => {
        const uid = user?.uid || '';
        userDispatch({ type: 'SET_USER', payload: {
          uid,
          email: user?.email,
          displayName: user?.displayName,
          }
        });
        setIsReady(true);
      });
      return () => unregisterAuthObserver();
    } else {
      setIsReady(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    restoreUserData();
  }, [user.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isReady) {
      savePlayers(user.uid, game.gameId, players);
    }
  }, [players]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isReady) {
      saveGame(user.uid, game.gameId, game.addons);
      playersDispatch({ type: 'GAME_UPDATE', payload: game });
    }
  }, [game]); // eslint-disable-line react-hooks/exhaustive-deps

  async function restoreUserData() {
    if (user.uid) {
      const {current, history} = await getSavedGames(user.uid);
      if (isReady) {
        // Not init: keep current game, restore all games from db as history
        current && history && historyDispatch({ type: 'SET_HISTORY', payload: [
          ...history,
          current,
        ] });
      } else {
        // Init: restore last game and history from db
        current && initGame(current.gameId, current.addons, current.players);
        history && historyDispatch({ type: 'SET_HISTORY', payload: history });
      }
    } else {
      // Not init and no uid - restore game from localStorage
      !isReady && restoreLastGame();
    }
  }

  async function handleLogIn(userId: string) {
    saveAll(userId, game.gameId, game.addons, players);
  }

  function handleLogOut() {
    /** Reset game */
    const gameId = Date.now();
    initGame(gameId, [], []);
  }

  function restoreLastGame() {
    const { gameId, addons, players } = getLastSavedGame();
    initGame(gameId, addons, players);
  }

  function initGame(gameId: number, addons: string[] = [], players: Player[] = []) {
    gameDispatch({ type: 'UPDATE', payload: { gameId, addons } });
    playersDispatch({ type: 'SET', payload: players });
  }

  return (
    <div className={`${classes.app} ${!isReady ? classes.loading : ''}`}>
      <GameContext.Provider value={{ state: game, dispatch: gameDispatch }}>
        <UserContext.Provider value={{ state: user, dispatch: userDispatch }}>
          <PlayersContext.Provider value={{ state: players, dispatch: playersDispatch }}>
            <HistoryContext.Provider value={{ state: history, dispatch: historyDispatch }}>
              <Layout>
                {isReady ? <>
                  <Navigation />
                  <MainMenu>
                    <ResetGame />
                    <AddonsMenu />
                    <LanguageMenu />
                    {isFirebaseOk && <AuthMenu
                      onLogIn={handleLogIn}
                      onLogOut={handleLogOut}
                    />}
                  </MainMenu>
                  <RouteWrapper>
                    <Router routes={ROUTES} />
                  </RouteWrapper>
                </> : <CircularProgress className={classes.loader}/>}
              </Layout>
            </HistoryContext.Provider>
          </PlayersContext.Provider>
        </UserContext.Provider>
      </GameContext.Provider>
    </div>
  );
}
