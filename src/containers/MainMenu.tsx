import React from 'react';
import { AppBar, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ResetGame from './ResetGame';
import AddonsMenu from './AddonsMenu';
import LanguageMenu from './LanguageMenu';
import AuthMenu from './AuthMenu';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  return (
    <AppBar>
      <Toolbar>
        <div className={classes.logoWrapper}>
          <img className={classes.logo} src={logo} alt={t('7wonders')} srcSet={`${logo2x} 2x`} />
        </div>

        <ResetGame />
        <AddonsMenu />
        <LanguageMenu />
        <AuthMenu />
      </Toolbar>
    </AppBar>
  );
}
