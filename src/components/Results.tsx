import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { Player, PlayerScore, GameParams } from '../types';
import { getTotal } from '../utils/score';
import { getNeighborScores, getPlayerScoreByGame } from '../utils/game';

type Props = {
  players: Player[];
  game: GameParams;
  onDelete?: () => void;
} & React.HTMLAttributes<HTMLElement>;

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  head: {
    backgroundColor: '#eee',
  },
  headCell: {
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

  function getGameDate(gameId: number) {
    const date = new Date(gameId);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  return (
    <div className={props.className}>
      {props.onDelete && <header className={classes.header}>
        <span>{getGameDate(props.game.gameId)}</span>
        <IconButton aria-label="delete" onClick={props.onDelete}>
          <Delete />
        </IconButton>
      </header>}
      <TableContainer>
        <Table>
          <TableHead className={classes.head}>
            <TableRow>
              <TableCell />
              <TableCell className={classes.headCell}>{t('player')}</TableCell>
              <TableCell
                className={`${classes.headCell} ${classes.scoresHead}`}
                colSpan={props.game.scores.length}
              >
                {t('scores')}
              </TableCell>
              <TableCell className={`${classes.headCell} ${classes.scoresHead}`}>Σ</TableCell>
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
    </div>
  );
}
