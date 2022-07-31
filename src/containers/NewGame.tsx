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
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { getNewGameByLastGame } from '../utils/games';
import { GamesContext, CurrentGameContext } from './App';

export default function NewGame() {
  const gamesContext = useContext(GamesContext);
  const { currentGameState } = useContext(CurrentGameContext);
  const [isConfirmOpened, setIsConfirmOpened] = useState(false);
  const { t } = useTranslation();

  function handleOpenConfirm() {
    setIsConfirmOpened(true);
  }

  function handleCloseConfirm() {
    setIsConfirmOpened(false);
  }

  function handleNewGameStart() {
    const gameId = Date.now();
    const newGame = getNewGameByLastGame(gameId, currentGameState);
    gamesContext.dispatch({
      type: 'ADD_GAME',
      payload: {
        game: newGame,
      },
    });
    handleCloseConfirm();
  }

  return (
    <div>
      <Tooltip title={t('newGame') as string}>
        <IconButton onClick={handleOpenConfirm} color="inherit">
          <Add />
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
          <Button onClick={handleNewGameStart} color="primary" autoFocus>
            {t('yes')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
