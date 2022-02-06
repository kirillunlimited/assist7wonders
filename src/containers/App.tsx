import React, { useEffect, useReducer, useState, useMemo } from 'react';
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

import gamesReducer, { Action as GamesAction } from '../reducers/games';
import userReducer, { Action as UserAction } from '../reducers/user';
import { Player, GameParams, User, GamesState } from '../types';
import ROUTES from '../config/routes';
import { makeStyles } from '@material-ui/core/styles';
import firebase, {isFirebaseOk} from '../config/firebase';
import { saveGames, getSavedGames } from '../utils/sync';
import { getCurrentGameState, getCurrentGamePlayers } from '../reducers/games';

type GamesContextProps = {
  state: GamesState;
  dispatch: (action: GamesAction) => void;
}

type UserContextProps = {
  state: User;
  dispatch: (action: UserAction) => void;
};

export const UserContext = React.createContext({} as UserContextProps);
export const GamesContext = React.createContext({} as GamesContextProps);
export const CurrentGameContext = React.createContext({} as {
  currentGameState: GameParams,
  currentGamePlayers: Player[]
});

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
  const [user, userDispatch] = useReducer(userReducer, { uid: '' });
  const [games, gamesDispatch] = useReducer(gamesReducer, []);
  const [isReady, setIsReady] = useState(false)
  const classes = useStyles();

  const lastGameState = useMemo(() => getCurrentGameState(games), [games]);
  const lastGamePlayers = useMemo(() => getCurrentGamePlayers(games), [games]);

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
      saveGames(user.uid, games);
    }
  }, [games]); // eslint-disable-line react-hooks/exhaustive-deps

  async function restoreUserData() {
    if (user.uid) {
      const savedGames = await getSavedGames(user.uid);
      if (isReady) {
        // Not init: keep current game, restore all games from db as history
        savedGames && gamesDispatch({ type: 'SET_GAMES', payload: [
          ...games,
          ...savedGames.map(game => ({
            ...game,
            isLast: false,
          }))
        ] });
      } else {
        // Init: restore last game and history from db
        savedGames && gamesDispatch({ type: 'SET_GAMES', payload: savedGames });
      }
    } else {
      // Not init and no uid - restore game from localStorage
      !isReady && restoreLastGame();
    }
  }

  function handleLogOut() {
    /** Reset game */
    gamesDispatch({ type: 'SET_GAMES', payload: []})

    const gameId = Date.now();
    gamesDispatch({ type: 'ADD_GAME', payload: {
      gameId
    }})
  }

  async function restoreLastGame() {
    const games = await getSavedGames();
    if (games?.length) {
      games && gamesDispatch({ type: 'SET_GAMES', payload: games });
    } else {
      gamesDispatch({
        type: 'ADD_GAME',
        payload: {
          gameId: Date.now(),
        }
      });
    }
  }

  return (
    <div className={`${classes.app} ${!isReady ? classes.loading : ''}`}>
      <GamesContext.Provider value={{ state: games, dispatch: gamesDispatch }}>
        <UserContext.Provider value={{ state: user, dispatch: userDispatch }}>
          <CurrentGameContext.Provider value={{ currentGameState: lastGameState, currentGamePlayers: lastGamePlayers }}>
            <Layout>
              {isReady ? <>
                <Navigation />
                <MainMenu>
                  <ResetGame />
                  <AddonsMenu />
                  <LanguageMenu />
                  {isFirebaseOk && <AuthMenu
                    onLogOut={handleLogOut}
                  />}
                </MainMenu>
                <RouteWrapper>
                  <Router routes={ROUTES} />
                </RouteWrapper>
              </> : <CircularProgress className={classes.loader}/>}
            </Layout>
          </CurrentGameContext.Provider>
        </UserContext.Provider>
      </GamesContext.Provider>
    </div>
  );
}
