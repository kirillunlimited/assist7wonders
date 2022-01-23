import React, { useContext, useEffect, useState } from 'react';
import { PlayersContext, GameContext, UserContext } from './App';
import { Player } from '../types';
import Results from '../components/Results';
import { getSavedGames } from '../utils/sync';
import { updateAction } from '../reducers/game';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  history: {
    marginTop: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  historyItem: {
    marginTop: '8px'
  }
}));

export default function Total() {
  const classes = useStyles();
  const playersContext = useContext(PlayersContext);
  const gameContext = useContext(GameContext);
  const userContext = useContext(UserContext);
  const [games, setGames] = useState([] as { gameId: number, addons: string[], players: Player[] }[]);
  const { t } = useTranslation();

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
      {games.length && <div className={classes.history}>
        <Typography variant="h2" className={classes.title}>
          {t('history')}
        </Typography>
        {games.map(game => <Results
          className={classes.historyItem}
          key={game.gameId}
          players={game.players}
          game={getGame(game)}
        />)}
      </div>}
    </div>
  );
}
