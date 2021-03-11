import React, { useState, useContext } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import { GameContext, PlayersContext } from '../App/App';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import AddonsMenu from './../AddonsMenu/AddonsMenu';
import LanguageMenu from './../LanguageMenu/LanguageMenu';
import { useTranslation } from 'react-i18next';
import logo from '../../img/logo.png';
import logo2x from '../../img/logo2x.png';

const useStyles = makeStyles(() => ({
  logoWrapper: {
    flexGrow: 1,
    textAlign: 'left',
  },
  logo: {
    display: 'block',
    maxHeight: '48px',
  },
}));

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
            <RefreshIcon />
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
