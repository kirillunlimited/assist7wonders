import React, { useContext } from 'react';
import { TableContainer, Table, TableRow, TableCell, TableBody, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Profile from '../components/Profile';
import Counter from '../components/Counter';
import { PlayerScoreKey, Player, GameScore } from '../types';
import { PlayersContext } from './App';
import { getNeighborScores } from '../utils/game';

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
  const playersContext = useContext(PlayersContext);
  const classes = useStyles();

  function handleChange(name: string, scoreKey: PlayerScoreKey, value: number) {
    playersContext.dispatch({ type: 'UPDATE', payload: { name, scoreKey, value } });
  }

  function getSum(player: Player, players: Player[], playerIndex: number): number {
    return props.score.sum
      ? props.score.sum(player.score, getNeighborScores(players, playerIndex))
      : 0;
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
                {props.score.counters.map(counter => (
                  <Counter
                    key={counter.id}
                    counter={counter.id}
                    value={player.score[counter.id] || 0}
                    onChange={(value: number) => handleChange(player.name, counter.id, value)}
                    min={counter.min}
                    max={counter.max}
                  />
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
