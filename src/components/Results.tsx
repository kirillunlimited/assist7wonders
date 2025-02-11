import React, { useState, useEffect } from 'react';
import {
  Box,
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
  Tooltip,
} from '@mui/material';
import { AccessTime, Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Player, PlayerScore, GameParams } from '../types';
import { getTotal } from '../utils/score';
import { getNeighborScores, getPlayerScoreByGame } from '../utils/score';
import { SxProps, Theme } from '@mui/material/styles';

type Props = {
  sx?: SxProps<Theme>;
  players: Player[];
  game: GameParams;
  modified: number;
  onDelete?: () => void;
} & React.HTMLAttributes<HTMLElement>;

export default function Results(props: Props) {
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
        const playerTreasury = player.score.treasury;

        if (acc.name === '' || playerSum > acc.score || (playerSum === acc.score && playerTreasury > acc.treasury)) {
          acc = {
            name: player.name,
            score: playerSum,
            treasury: playerTreasury
          };
        }
        return acc;
      },
      { name: '', score: 0, treasury: 0 }
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
          sx={{
            color: theme => theme.palette.primary.contrastText,
            py: 0,
            px: 1,
            textAlign: 'center',
            backgroundColor: score.color,
          }}
        >
          {score.sum
            ? score.sum(playerScore, getNeighborScores(props.players, playerIndex)).result
            : (playerScore[score.id as keyof PlayerScore] || 0)}
        </TableCell>
      );
    });
  }

  function getGameDate(ms: number): string {
    const userLocale =
      navigator.languages && navigator.languages.length
        ? navigator.languages[0]
        : navigator.language;
    const date = new Date(ms);
    const dateString = date.toLocaleString(userLocale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return dateString;
  }

  function toggleDialog(show: boolean): void {
    setIsDialogOpened(show);
  }

  function handleDeleteConfirm(): void {
    props.onDelete?.();
  }

  return (
    <Box sx={props.sx}>
      <Box
        component="header"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '3em',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5em',
            color: theme => theme.palette.text.secondary,
          }}
        >
          <AccessTime fontSize="small" />
          <Typography variant="body2">{getGameDate(props.modified)}</Typography>
        </Box>
        {props.onDelete && (
          <Tooltip title={t('deleteGame') || ''}>
            <IconButton aria-label="delete" onClick={() => toggleDialog(true)}>
              <Delete />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: theme => theme.palette.background.default }}>
            <TableRow
              sx={{
                fontWeight: 'bold',
              }}
            >
              <TableCell />
              <TableCell>{t('player')}</TableCell>
              <TableCell
                sx={{
                  textAlign: 'center',
                }}
                colSpan={props.game.scores.length}
              >
                {t('scores')}
              </TableCell>
              <TableCell
                sx={{
                  textAlign: 'center',
                }}
              >
                Σ
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.players.map((player, playerIndex) => (
              <TableRow key={playerIndex}>
                <TableCell
                  sx={{
                    fontSize: '1.5em',
                    lineHeight: 0,
                    pr: 0,
                  }}
                >
                  {winner === player.name ? '🏆' : ''}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{player.name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {player.wonder}
                  </Typography>
                </TableCell>
                {renderPlayerScores(player, playerIndex)}
                <TableCell sx={{ textAlign: 'center' }}>
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
        <DialogTitle>
          <Typography variant="h6"> {t('deleteGame')}</Typography>
        </DialogTitle>
        <DialogContent>{t('deleteGameDescription')}</DialogContent>
        <DialogActions>
          <Button onClick={() => toggleDialog(false)} color="primary">
            {t('no')}
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
            {t('yes')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
