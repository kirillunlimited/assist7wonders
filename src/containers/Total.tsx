import React, { useContext } from 'react';
import { GamesContext, CurrentGameContext } from './App';
import { GameParams, GameState } from '../types';
import Results from '../components/Results';
import { getGameParamsByGameState } from '../utils/games';
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
  const gamesContext = useContext(GamesContext);
  const {currentGameParams, currentGameState, currentGamePlayers} = useContext(CurrentGameContext);
  const { t } = useTranslation();

  function getGameParams(game: GameState): GameParams {
    return getGameParamsByGameState(game);
  }

  function getHistoryGames() {
    return gamesContext.state.filter(game => game.gameId !== currentGameParams.gameId);
  }

  function handleHistoryGameDelete(gameId: number) {
    const games = gamesContext.state.filter(game => game.gameId !== gameId);
    gamesContext.dispatch({type: 'SET_GAMES', payload: games});
  }

  return (
    <div>
      <Results
        players={currentGamePlayers}
        game={currentGameParams}
        modified={currentGameState.modified}
      />
      {getHistoryGames().length > 0 && <div className={classes.history}>
        <Typography variant="h2" className={classes.title}>
          {t('history')}
        </Typography>
        {getHistoryGames().map(game => <Results
          className={classes.historyItem}
          key={game.gameId}
          players={game.players}
          game={getGameParams(game)}
          modified={currentGameState.modified}
          onDelete={() => handleHistoryGameDelete(game.gameId)}
        />)}
      </div>}
    </div>
  );
}
