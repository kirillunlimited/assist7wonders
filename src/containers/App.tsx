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
import { Player, Game } from '../types';
import { GAME_BOILERPLATE } from '../config/game';
import ROUTES from '../config/routes';
import { makeStyles } from '@material-ui/core/styles';

type PlayersContextProps = {
  state: Player[];
  dispatch: (action: PlayersAction) => void;
};

type GameContextProps = {
  state: Game;
  dispatch: (action: GameAction) => void;
};

export const PlayersContext = React.createContext({} as PlayersContextProps);
export const GameContext = React.createContext({} as GameContextProps);

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
  const [isReady, setIsReady] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    savePlayersToStorage(players);
  }, [players]);

  useEffect(() => {
    saveAddonsToStorage(game.addons);
    playersDispatch({ type: 'GAME_UPDATE', payload: game });
  }, [game]);

  useEffect(() => {
    initGame();
    initPlayers();
    setIsReady(true);
  }, []);

  function initGame(): void {
    const addons = getAddonsFromStorage();
    gameDispatch({ type: 'UPDATE', payload: { addons } });
  }

  function initPlayers(): void {
    playersDispatch({ type: 'SET', payload: getPlayersFromStorage() });
  }

  return (
    <div className={classes.app}>
      <GameContext.Provider value={{ state: game, dispatch: gameDispatch }}>
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
      </GameContext.Provider>
    </div>
  );
}
