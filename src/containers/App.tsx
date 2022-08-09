import React, { useEffect, useReducer, useState, useMemo } from 'react';
import Layout from '../components/Layout';
import RouteWrapper from '../components/RouteWrapper';
import MainMenu from './MainMenu';
import Navigation from './Navigation';
import Router from './Router';
import NewGame from './NewGame';
import AddonsMenu from './AddonsMenu';
import LanguageMenu from './LanguageMenu';
import VersionControl from './VersionControl';
import { Box, CircularProgress } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../config/theme';
import gamesReducer, { Action as GamesAction } from '../reducers/games';
import { Player, GameParams, GameState } from '../types';
import ROUTES from '../config/routes';
import { getGameParamsByGameState, getNewGameByLastGame, getLastGameState } from '../utils/games';
import { getGamesFromStorage, saveGamesToStorage } from '../utils/storage';
import { SnackbarProvider } from 'notistack';

type GamesContextProps = {
  state: GameState[];
  dispatch: (action: GamesAction) => void;
};

export const GamesContext = React.createContext({} as GamesContextProps);
export const CurrentGameContext = React.createContext(
  {} as {
    currentGameState: GameState;
    currentGameParams: GameParams;
    currentGamePlayers: Player[];
  }
);

export default function App() {
  const [games, gamesDispatch] = useReducer(gamesReducer, []);
  const [isReady, setIsReady] = useState(false);

  const lastGameState = useMemo(() => getLastGameState(games), [games]);
  const lastGameParams = useMemo(() => getGameParamsByGameState(lastGameState), [lastGameState]);
  const lastGamePlayers = useMemo(() => lastGameState.players, [lastGameState]);

  useEffect(() => {
    /** Restore games */
    const savedGames = getGamesFromStorage();
    gamesDispatch({ type: 'SET_GAMES', payload: savedGames });

    if (!savedGames.length) {
      /** Start new game */
      const gameId = Date.now();
      const newGame = getNewGameByLastGame(gameId, null);
      gamesDispatch({
        type: 'ADD_GAME',
        payload: {
          game: newGame,
        },
      });
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      saveGamesToStorage(games);
    }
  }, [games, isReady]);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <Box
          sx={{
            display: 'flex',
            height: '100%',
            textAlign: 'center',
            alignItems: isReady ? '' : 'center',
            backgroundColor: theme.palette.background.default,
          }}
        >
          <GamesContext.Provider value={{ state: games, dispatch: gamesDispatch }}>
            <CurrentGameContext.Provider
              value={{
                currentGameState: lastGameState,
                currentGameParams: lastGameParams,
                currentGamePlayers: lastGamePlayers,
              }}
            >
              <Layout>
                {isReady ? (
                  <>
                    <Navigation />
                    <MainMenu>
                      <NewGame />
                      <AddonsMenu />
                      <LanguageMenu />
                    </MainMenu>
                    <RouteWrapper>
                      <Router routes={ROUTES} />
                    </RouteWrapper>
                  </>
                ) : (
                  <CircularProgress
                    sx={{
                      my: 0,
                      mx: 'auto',
                    }}
                  />
                )}
              </Layout>
            </CurrentGameContext.Provider>
          </GamesContext.Provider>
          <VersionControl />
        </Box>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
