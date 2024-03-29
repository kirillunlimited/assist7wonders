import React, { useContext } from 'react';
import { GamesContext, CurrentGameContext } from './App';
import { GameParams, GameState } from '../types';
import Results from '../components/Results';
import { getGameParamsByGameState } from '../utils/games';

export default function Total() {
  const gamesContext = useContext(GamesContext);
  const { currentGameParams } = useContext(CurrentGameContext);

  function getGameParams(game: GameState): GameParams {
    return getGameParamsByGameState(game);
  }

  function handleHistoryGameDelete(gameId: number) {
    const games = gamesContext.state.filter(game => game.gameId !== gameId);
    gamesContext.dispatch({ type: 'SET_GAMES', payload: games });
  }

  function sortedGames(): GameState[] {
    return gamesContext.state.sort((prevGame, nextGame) => nextGame.gameId - prevGame.gameId);
  }

  return (
    <div>
      {sortedGames().map(game => (
        <Results
          sx={{
            '&:not(:first-of-type)': {
              mt: 2,
            },
          }}
          key={game.gameId}
          players={game.players}
          game={getGameParams(game)}
          modified={game.modified}
          // The current game is not allowed to be deleted
          onDelete={
            currentGameParams.gameId !== game.gameId
              ? () => handleHistoryGameDelete(game.gameId)
              : undefined
          }
        />
      ))}
    </div>
  );
}
