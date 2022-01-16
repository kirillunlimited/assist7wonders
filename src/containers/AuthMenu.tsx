import React, { useState, useEffect, useContext } from 'react';
import { IconButton, Tooltip, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { Person, ExitToApp } from '@material-ui/icons';
import { StyledFirebaseAuth } from 'react-firebaseui';
import { useTranslation } from 'react-i18next';
import { UserContext } from './App';
import firebase from '../config/firebase';

export default function AuthMenu() {
  const userContext = useContext(UserContext);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const { t } = useTranslation();

  const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      signInSuccessWithAuthResult: () => {
        handleCloseModal();
        return false;
      },
    },
  };

  useEffect(() => {
    setIsSignedIn(Boolean(userContext.state.uid))
  }, [userContext.state.uid]);

  function handleSignOut() {
    firebase.auth().signOut();
  }

  function handleOpenModal() {
    setIsModalOpened(true);
  }

  function handleCloseModal() {
    setIsModalOpened(false);
  }

  function getTooltipTitle(): string {
    return isSignedIn ? t('logout') : t('login');
  }

  function handleClick() {
    isSignedIn ? handleSignOut() : handleOpenModal();
  }

  function renderIcon() {
    return isSignedIn ? <ExitToApp /> : <Person />;
  }

  return (
    <div>
      <Tooltip title={getTooltipTitle()}>
        <IconButton onClick={handleClick} color="inherit">
          {renderIcon()}
        </IconButton>
      </Tooltip>
      <Dialog open={isModalOpened} onClose={handleCloseModal} aria-labelledby="alert-dialog-title">
        <DialogTitle>{t('login')}</DialogTitle>
        <DialogContent>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
