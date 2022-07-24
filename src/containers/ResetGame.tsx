import React, { useState, useContext } from 'react';
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
} from '@material-ui/core';
import { Refresh } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { GamesContext } from './App';
import { getNewGameByLastGame } from '../utils/game';

export default function MainMenu() {
  const gamesContext = useContext(GamesContext);
  const [isConfirmOpened, setIsConfirmOpened] = useState(false);
  const { t } = useTranslation();

  function handleOpenConfirm() {
    setIsConfirmOpened(true);
  }

  function handleCloseConfirm() {
    setIsConfirmOpened(false);
  }

  function onResetGame() {
    const gameId = Date.now();
    const newGame = getNewGameByLastGame(gameId, gamesContext.state);
    gamesContext.dispatch({
      type: 'ADD_GAME',
      payload: {
        game: newGame,
      }
    });
    handleCloseConfirm();
  }

  return (
    <div>
      <Tooltip title={t('newGame') as string}>
        <IconButton onClick={handleOpenConfirm} color="inherit">
          <Refresh />
        </IconButton>
      </Tooltip>
      <Dialog
        open={isConfirmOpened}
        onClose={handleCloseConfirm}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle>{t('newGame')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('startNewGameDescription')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="primary">
            {t('no')}
          </Button>
          <Button onClick={onResetGame} color="primary" autoFocus>
            {t('yes')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
