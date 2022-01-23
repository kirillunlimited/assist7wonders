import React, { useContext } from 'react';
import { PlayersContext, GameContext, HistoryContext } from './App';
import { HistoryGame } from '../types';
import Results from '../components/Results';
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
  const historyContext = useContext(HistoryContext);
  const { t } = useTranslation();

  function getGame(game: HistoryGame) {
    return updateAction(game.gameId, game.addons || []);
  }

  return (
    <div>
      <Results
        players={playersContext.state}
        game={gameContext.state}
      />
      {historyContext.state.length && <div className={classes.history}>
        <Typography variant="h2" className={classes.title}>
          {t('history')}
        </Typography>
        {historyContext.state.map(game => <Results
          className={classes.historyItem}
          key={game.gameId}
          players={game.players}
          game={getGame(game)}
        />)}
      </div>}
    </div>
  );
}
