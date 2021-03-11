import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
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
import { makeStyles } from '@material-ui/core/styles';
import AddonsMenu from './AddonsMenu';
import LanguageMenu from './LanguageMenu';
import { useTranslation } from 'react-i18next';
import { GameContext, PlayersContext } from './App';
import logo from '../img/logo.png';
import logo2x from '../img/logo2x.png';

const useStyles = makeStyles({
  logoWrapper: {
    flexGrow: 1,
    textAlign: 'left',
  },
  logo: {
    display: 'block',
    maxHeight: '48px',
  },
});

export default function MainMenu() {
  const classes = useStyles();
  const playersContext = useContext(PlayersContext);
  const gameContext = useContext(GameContext);
  const [isConfirmOpened, setIsConfirmOpened] = useState(false);
  const { t } = useTranslation();

  function handleOpenConfirm() {
    setIsConfirmOpened(true);
  }

  function handleCloseConfirm() {
    setIsConfirmOpened(false);
  }

  function onResetGame() {
    playersContext.dispatch({ type: 'RESET', payload: gameContext.state });
    handleCloseConfirm();
  }

  return (
    <AppBar>
      <Toolbar>
        <div className={classes.logoWrapper}>
          <img className={classes.logo} src={logo} alt={t('7wonders')} srcSet={`${logo2x} 2x`} />
        </div>
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
          <DialogTitle>{t('startNewGame?')}</DialogTitle>
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

        <AddonsMenu />
        <LanguageMenu />
      </Toolbar>
    </AppBar>
  );
}
