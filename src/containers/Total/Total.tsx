import * as React from 'react';
import { PlayerScore } from '../../types';
import { getTotal } from '../../utils/score';
import { useState, useEffect, useContext } from 'react';
import { PlayersContext, GameContext } from '../App/App';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
  head: {
    backgroundColor: '#eee',
  },
  headerCell: {
    fontWeight: 'bold',
  },
  scoresHead: {
    textAlign: 'center',
  },
  score: {
    color: '#FFF',
    textAlign: 'center',
  },
  sum: {
    textAlign: 'center',
  },
  medal: {
    fontSize: '1.5em',
    lineHeight: 0,
    paddingRight: 0,
  },
});

export default function Total() {
  const playersContext = useContext(PlayersContext);
  const gameContext = useContext(GameContext);
  const classes = useStyles();
  const [winner, setWinner] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const bestPlayer = playersContext.state.reduce(
      (acc, player) => {
        const playerSum = getTotal(player.score, gameContext.state.scores);

        if (acc.name === '' || playerSum > acc.score) {
          acc = {
            name: player.name,
            score: playerSum,
          };
        }
        return acc;
      },
      { name: '', score: 0 }
    );
    const winner = bestPlayer ? bestPlayer.name : '';
    setWinner(winner);
  }, [playersContext.state, gameContext.state.scores]);

  return (
    <TableContainer>
      <Table>
        <TableHead className={classes.head}>
          <TableRow>
            <TableCell />
            <TableCell className={classes.headerCell}>{t('player')}</TableCell>
            <TableCell
              className={`${classes.headerCell} ${classes.scoresHead}`}
              colSpan={gameContext.state.scores.length}
            >
              {t('scores')}
            </TableCell>
            <TableCell className={`${classes.headerCell} ${classes.scoresHead}`}>Σ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {playersContext.state.map((player, index) => (
            <TableRow key={index}>
              <TableCell className={classes.medal}>{winner === player.name ? '🏆' : ''}</TableCell>
              <TableCell>
                <Typography variant="body2">{player.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {player.wonder}
                </Typography>
              </TableCell>
              {gameContext.state.scores.map(score => (
                <TableCell
                  key={score.id}
                  className={classes.score}
                  style={{ backgroundColor: score.color }}
                >
                  {score.sum
                    ? score.sum(player.score)
                    : player.score[score.id as keyof PlayerScore]}
                </TableCell>
              ))}
              <TableCell className={classes.sum}>
                {getTotal(player.score, gameContext.state.scores)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
