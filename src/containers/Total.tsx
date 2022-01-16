import React, { useContext } from 'react';
import { PlayersContext, GameContext } from './App';
import Results from '../components/Results';

export default function Total() {
  const playersContext = useContext(PlayersContext);
  const gameContext = useContext(GameContext);

  return (
    <div>
      <Results
        players={playersContext.state}
        game={gameContext.state}
      />
    </div>
  );
}
