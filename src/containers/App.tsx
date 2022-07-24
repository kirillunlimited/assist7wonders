import React, { useEffect, useReducer, useState, useMemo } from 'react';
import Layout from '../components/Layout';
import RouteWrapper from '../components/RouteWrapper';
import MainMenu from './MainMenu';
import Navigation from './Navigation';
import Router from './Router';
import ResetGame from './ResetGame';
import AddonsMenu from './AddonsMenu';
import LanguageMenu from './LanguageMenu';
import { CircularProgress } from '@material-ui/core';

import gamesReducer, { Action as GamesAction } from '../reducers/games';
import { Player, GameParams, GameState } from '../types';
import ROUTES from '../config/routes';
import { makeStyles } from '@material-ui/core/styles';
import { getGameParamsByGameState, getCurrentGamePlayers, getNewGameByLastGame, getLastGameState } from '../utils/game';
import { getGamesFromStorage, saveGamesToStorage } from '../utils/storage';

type GamesContextProps = {
  state: GameState[];
  dispatch: (action: GamesAction) => void;
}

export const GamesContext = React.createContext({} as GamesContextProps);
export const CurrentGameContext = React.createContext({} as {
  currentGameParams: GameParams,
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
  const [games, gamesDispatch] = useReducer(gamesReducer, []);
  const [isReady, setIsReady] = useState(false)
  const classes = useStyles();

  const lastGameState = useMemo(() => getLastGameState(games), [games]);
  const lastGameParams = useMemo(() => getGameParamsByGameState(lastGameState), [lastGameState]);
  const lastGamePlayers = useMemo(() => getCurrentGamePlayers(games), [games]);

  useEffect(() => {
    /** Restore last games */
    const savedGames = getGamesFromStorage();
    gamesDispatch({ type: 'SET_GAMES', payload: savedGames});

    /** Init games array in storage if there was no data */
    if (!savedGames.length) {
      startNewGame();
    }

    setIsReady(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isReady) {
      saveGamesToStorage(games);
    }
  }, [games]); // eslint-disable-line react-hooks/exhaustive-deps


  function startNewGame() {
    const gameId = Date.now();
    const newGame = getNewGameByLastGame(gameId, games);
    gamesDispatch({ type: 'ADD_GAME', payload: {
      game: newGame,
    }});
  }

  return (
    <div className={`${classes.app} ${!isReady ? classes.loading : ''}`}>
      <GamesContext.Provider value={{ state: games, dispatch: gamesDispatch }}>
          <CurrentGameContext.Provider value={{ currentGameParams: lastGameParams, currentGamePlayers: lastGamePlayers }}>
            <Layout>
              {isReady ? <>
                <Navigation />
                <MainMenu>
                  <ResetGame />
                  <AddonsMenu />
                  <LanguageMenu />
                </MainMenu>
                <RouteWrapper>
                  <Router routes={ROUTES} />
                </RouteWrapper>
              </> : <CircularProgress className={classes.loader}/>}
            </Layout>
          </CurrentGameContext.Provider>
      </GamesContext.Provider>
    </div>
  );
}
