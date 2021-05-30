import React, { useContext } from 'react';
import { TableContainer, Table, TableRow, TableCell, TableBody, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Profile from '../components/Profile';
import Counter from '../components/Counter';
import { PlayerScoreKey, Player, GameScore } from '../types';
import { GameContext, PlayersContext } from './App';
import { getNeighborScores, getPlayerScoreByGame } from '../utils/game';

type Props = {
  score: GameScore;
};

const useStyles = makeStyles({
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
  const gameContext = useContext(GameContext);
  const playersContext = useContext(PlayersContext);
  const classes = useStyles();

  function handleChange(name: string, scoreKey: PlayerScoreKey, value: number) {
    playersContext.dispatch({ type: 'UPDATE', payload: { name, scoreKey, value } });
  }

  function getSum(player: Player, players: Player[], playerIndex: number): number {
    const playerScore = getPlayerScoreByGame(player.score, gameContext.state.scores);
    return props.score.sum
      ? props.score.sum(playerScore, getNeighborScores(players, playerIndex))
      : 0;
  }

  function renderCounter(
    player: Player,
    counter: { id: string; min?: number; max?: number }
  ): React.ReactNode | null {
    const playerScore = getPlayerScoreByGame(player.score, gameContext.state.scores);
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

  return (
    <TableContainer>
      <Table>
        <TableBody>
          {playersContext.state.map((player, playerIndex) => (
            <TableRow key={player.name}>
              <TableCell className={classes.td}>
                <Profile name={player.name} />
              </TableCell>
              <TableCell className={`${classes.td} ${classes.empty}`} />
              <TableCell className={classes.td}>
                {props.score.sum ? (
                  <Chip label={`Σ ${getSum(player, playersContext.state, playerIndex)}`} />
                ) : null}
                {props.score.counters.map(counter => renderCounter(player, counter))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
