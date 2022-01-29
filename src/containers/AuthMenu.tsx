import React, { useState, useEffect, useContext } from 'react';
import { IconButton, Tooltip, Dialog, DialogTitle, DialogContent, Snackbar } from '@material-ui/core';
import { Person, ExitToApp } from '@material-ui/icons';
import { StyledFirebaseAuth } from 'react-firebaseui';
import { useTranslation } from 'react-i18next';
import { UserContext } from './App';
import firebase from '../config/firebase';

type Props = {
  onLogIn: (userId: string) => void;
  onLogOut: () => void;
}

export default function AuthMenu(props: Props) {
  const userContext = useContext(UserContext);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [isAuthInfoVisible, setIsAuthInfoVisible] = useState(false);
  const { t } = useTranslation();

  const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      signInSuccessWithAuthResult: (authResult: any) => {
        props.onLogIn(authResult?.user?.uid);
        handleCloseModal();
        setIsAuthInfoVisible(true);
        return false;
      },
    },
  };

  useEffect(() => {
    setIsSignedIn(Boolean(userContext.state.uid))
  }, [userContext.state.uid]);

  function handleSignOut() {
    props.onLogOut();
    firebase.auth().signOut();
    setIsAuthInfoVisible(true);
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

  function handleClick(): void{
    isSignedIn ? handleSignOut() : handleOpenModal();
  }

  function renderIcon() {
    return isSignedIn ? <ExitToApp /> : <Person />;
  }

  function handleAuthInfoClose(event: React.SyntheticEvent | React.MouseEvent, reason?: string): void {
    if (reason === 'clickaway') {
      return;
    }
    setIsAuthInfoVisible(false);
  }

  function authInfoDescription(): string {
    if (isSignedIn) {
      const name = userContext.state.displayName || userContext.state.email || userContext.state.uid;
      return t('logInInfo', { name })
    }
    return t('logOutInfo');
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

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={isAuthInfoVisible}
        autoHideDuration={6000}
        onClose={handleAuthInfoClose}
        message={
          <span
            dangerouslySetInnerHTML={{
              __html: authInfoDescription(),
            }}
          />
        }
      />
    </div>
  );
}
