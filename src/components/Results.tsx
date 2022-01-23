import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { Player, PlayerScore, Game } from '../types';
import { getTotal } from '../utils/score';
import { getNeighborScores, getPlayerScoreByGame } from '../utils/game';

type Props = {
  players: Player[];
  game: Game;
} & React.HTMLAttributes<HTMLElement>;

const useStyles = makeStyles(theme => ({
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
    padding: theme.spacing(0, 1),
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
}));

export default function Results(props: Props) {
  const classes = useStyles();
  const [winner, setWinner] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const bestPlayer = props.players.reduce(
      (acc, player, playerIndex) => {
        const playerSum = getTotal(
          getPlayerScoreByGame(player.score, props.game.scores),
          getNeighborScores(props.players, playerIndex)
        );

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
  }, [props.players, props.game.scores]);

  function renderPlayerScores(player: Player, playerIndex: number) {
    return props.game.scores.map(score => {
      const playerScore = getPlayerScoreByGame(player.score, props.game.scores);
      return (
        <TableCell
          key={score.id}
          className={classes.score}
          style={{ backgroundColor: score.color }}
        >
          {score.sum
            ? score.sum(playerScore, getNeighborScores(props.players, playerIndex)).result
            : playerScore[score.id as keyof PlayerScore]}
        </TableCell>
      );
    });
  }

  return (
    <TableContainer className={props.className}>
      <Table>
        <TableHead className={classes.head}>
          <TableRow>
            <TableCell />
            <TableCell className={classes.headerCell}>{t('player')}</TableCell>
            <TableCell
              className={`${classes.headerCell} ${classes.scoresHead}`}
              colSpan={props.game.scores.length}
            >
              {t('scores')}
            </TableCell>
            <TableCell className={`${classes.headerCell} ${classes.scoresHead}`}>Σ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.players.map((player, playerIndex) => (
            <TableRow key={playerIndex}>
              <TableCell className={classes.medal}>{winner === player.name ? '🏆' : ''}</TableCell>
              <TableCell>
                <Typography variant="body2">{player.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {player.wonder}
                </Typography>
              </TableCell>
              {renderPlayerScores(player, playerIndex)}
              <TableCell className={classes.sum}>
                {getTotal(
                  getPlayerScoreByGame(player.score, props.game.scores),
                  getNeighborScores(props.players, playerIndex)
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
