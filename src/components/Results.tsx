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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { Player, PlayerScore, GameParams } from '../types';
import { getTotal } from '../utils/score';
import { getNeighborScores, getPlayerScoreByGame } from '../utils/score';

type Props = {
  players: Player[];
  game: GameParams;
  modified: number;
  onDelete?: () => void;
} & React.HTMLAttributes<HTMLElement>;

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '48px'
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
  const [isDialogOpened, setIsDialogOpened] = useState(false);
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

  function getGameDate(ms: number): string {
    const userLocale = navigator.languages && navigator.languages.length
      ? navigator.languages[0]
      : navigator.language;
    const date = new Date(ms);
    const dateString = date.toLocaleString(userLocale, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
    return dateString;
  }

  function toggleDialog(show: boolean): void {
    setIsDialogOpened(show);
  }

  function handleDeleteConfirm(): void {
    props.onDelete?.();
  }

  return (
    <div className={props.className}>
       <header className={classes.header}>
         <Typography variant="body2">{getGameDate(props.modified)}</Typography>
        {props.onDelete && <IconButton aria-label="delete" onClick={() => toggleDialog(true)}>
          <Delete />
        </IconButton>}
      </header>
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

      <Dialog open={isDialogOpened} onClose={() => toggleDialog(false)}>
        <DialogTitle disableTypography>
          <Typography variant="h6"> {t('deleteGame')}</Typography>
        </DialogTitle>
          <DialogContent>
            {t('deleteGameDescription')}
          </DialogContent>
          <DialogActions>
          <Button onClick={() => toggleDialog(false)} color="primary">
            {t('no')}
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
            {t('yes')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
