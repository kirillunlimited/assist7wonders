import React, { useState, useEffect, useReducer } from 'react';
import './App.css';
import Navigation from '../Navigation/Navigation';
import { IPlayer, TGame } from '../../types';
import Router from '../Router/Router';
import {
  savePlayersToStorage,
  saveAddonsToStorage,
  getPlayersFromStorage,
  getAddonsFromStorage,
} from '../../utils/storage';
import playersReducer, { TAction as TPlayersAction } from '../../reducers/players';
import gamesReducer, { TAction as TGameAction } from '../../reducers/game';
import Layout from '../../components/Layout/Layout';
import RouteWrapper from '../../components/RouteWrapper/RouteWrapper';
import MainMenu from '../MainMenu/MainMenu';
import { GAME_BOILERPLATE } from '../../config/game';
import ROUTES from '../../config/routes';

interface IPlayersContextProps {
  state: IPlayer[];
  dispatch: (action: TPlayersAction) => void;
}

interface IGameContextProps {
  state: TGame;
  dispatch: (action: TGameAction) => void;
}

export const PlayersContext = React.createContext({} as IPlayersContextProps);
export const GameContext = React.createContext({} as IGameContextProps);

export default function App() {
  const [game, gameDispatch] = useReducer(gamesReducer, GAME_BOILERPLATE);
  const [players, playersDispatch] = useReducer(playersReducer, []);
  const [isReady, setIsReady] = useState(false);

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
    <div className="App">
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
