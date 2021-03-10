import Counter from '../../components/Counter/Counter';
import React, { useContext } from 'react';
import { PlayerScoreKey, Player, GameScore } from '../../types';
import { PlayersContext } from '../App/App';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Profile from '../../components/Profile/Profile';
import styles from './Scores.module.css';
import Chip from '@material-ui/core/Chip';

export interface IProps {
  score: GameScore;
}

export default function Scores(props: IProps) {
  const playersContext = useContext(PlayersContext);

  function handleChange(name: string, scoreKey: PlayerScoreKey, value: number) {
    playersContext.dispatch({ type: 'UPDATE', payload: { name, scoreKey, value } });
  }

  function getSum(player: Player): number {
    return props.score.sum ? props.score.sum(player.score) : 0;
  }

  return (
    <TableContainer>
      <Table>
        <TableBody>
          {playersContext.state.map(player => (
            <TableRow key={player.name}>
              <TableCell className={styles.td}>
                <Profile name={player.name} />
              </TableCell>
              <TableCell className={`${styles.td} ${styles.empty}`} />
              <TableCell className={styles.td}>
                {props.score.sum ? <Chip label={`Σ ${getSum(player)}`} /> : null}
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
