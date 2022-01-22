import React, { useContext, useEffect, useState } from 'react';
import { PlayersContext, GameContext, UserContext } from './App';
import { Player } from '../types';
import Results from '../components/Results';
import { getSavedGames } from '../utils/sync';
import { updateAction } from '../reducers/game';


export default function Total() {
  const playersContext = useContext(PlayersContext);
  const gameContext = useContext(GameContext);
  const userContext = useContext(UserContext);
  const [games, setGames] = useState([] as { gameId: number, addons: string[], players: Player[] }[]);

  async function restoreGamesList() {
    const gamesDict = await getSavedGames(userContext.state.uid);
    const games = Object.keys(gamesDict).map((gameId: string) => ({
      ...gamesDict[gameId],
      gameId: Number(gameId)
    }))
    setGames(games);
  }

  useEffect(() => {
    restoreGamesList();
  }, []);

  function getGame(game: any) {
    return updateAction(gameContext.state.gameId, gameContext.state.addons);
  }

  return (
    <div>
      <Results
        players={playersContext.state}
        game={gameContext.state}
      />
      {games.map(game => <Results
        key={game.gameId}
        players={game.players}
        game={getGame(game)}
      />)}
    </div>
  );
}
