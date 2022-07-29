import React, { useState, useEffect, useCallback } from 'react';
import { Snackbar, Button, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import * as serviceWorkerRegistration from '../serviceWorkerRegistration';

const useStyles = makeStyles({
  version: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
  }
});

export default function VersionControl() {
  const [showReload, setShowReload] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const classes = useStyles();
  const { t } = useTranslation();

  const onSWUpdate = useCallback((registration: ServiceWorkerRegistration) => {
    setShowReload(true);
    setWaitingWorker(registration.waiting);
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
  }, [waitingWorker]);

  useEffect(() => {
    serviceWorkerRegistration.register({ onUpdate: onSWUpdate });
  }, [onSWUpdate]);

  /* Update service worker on manual page reload */
  function reloadPage() {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
    setShowReload(false);
    window.location.reload();
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={showReload}
        message={t('newVersion')}
        onClick={reloadPage}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={reloadPage}
          >
            {t('update')}
          </Button>
        }
      />
      <Typography className={classes.version} variant='caption'>{process.env.REACT_APP_VERSION}</Typography>
    </div>
  );
}
