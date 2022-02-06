import React, { useContext } from 'react';
import { TableContainer, Table, TableRow, TableCell, TableBody, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Profile from '../components/Profile';
import Counter from '../components/Counter';
import { PlayerScoreKey, Player, GameScore, GameScoreSumResult } from '../types';
import { CurrentGameContext, GamesContext } from './App';
import { getNeighborScores, getPlayerScoreByGame } from '../utils/game';

type Props = {
  score: GameScore;
};

const useStyles = makeStyles({
  tr: {
    '&:last-child td': {
      borderBottom: 'none',
    }
  },
  td: {
    '&:first-child': {
      paddingLeft: 0,
    },
    '&:last-child': {
      paddingRight: 0,
      whiteSpace: 'nowrap',
      textAlign: 'center',
    },
  },
  empty: {
    width: '100%',
    padding: 0,
  },
});

export default function Scores(props: Props) {
  const gamesContext = useContext(GamesContext);
  const {currentGameState, currentGamePlayers} = useContext(CurrentGameContext);
  const classes = useStyles();

  function handleChange(name: string, scoreKey: PlayerScoreKey, value: number) {
    gamesContext.dispatch({ type: 'SET_PLAYER_SCORE', payload: { gameId: currentGameState.gameId, name, scoreKey, value } });
  }

  function getSum(player: Player, players: Player[], playerIndex: number): GameScoreSumResult {
    const playerScore = getPlayerScoreByGame(player.score, currentGameState.scores);
    return props.score.sum
      ? props.score.sum(playerScore, getNeighborScores(players, playerIndex))
      : { result: 0, calculations: '' };
  }

  function renderCounter(
    player: Player,
    counter: { id: string; min?: number; max?: number }
  ): React.ReactNode | null {
    const playerScore = getPlayerScoreByGame(player.score, currentGameState.scores);
    const isVisible = Object.keys(playerScore).includes(counter.id);

    if (isVisible) {
      return (
        <Counter
          key={counter.id}
          counter={counter.id}
          value={player.score[counter.id] || 0}
          onChange={(value: number) => handleChange(player.name, counter.id, value)}
          min={counter.min}
          max={counter.max}
        />
      );
    }
    return null;
  }

  function renderPlayerScore(player: Player, playerIndex: number): React.ReactNode | null {
    const { calculations }: GameScoreSumResult = getSum(player, currentGamePlayers, playerIndex);
    return (
      <div>
        {props.score.counters.map(counter => renderCounter(player, counter))}
        {calculations ? (
          <Chip
            label={
              <span
                dangerouslySetInnerHTML={{
                  __html: calculations,
                }}
              />
            }
          />
        ) : null}
      </div>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableBody>
          {currentGamePlayers.map((player, playerIndex) => (
            <TableRow className={classes.tr} key={player.name}>
              <TableCell className={classes.td}>
                <Profile name={player.name} />
              </TableCell>
              <TableCell className={`${classes.td} ${classes.empty}`} />
              <TableCell className={classes.td}>{renderPlayerScore(player, playerIndex)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
