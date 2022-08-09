import React, { useState, useEffect, useCallback } from 'react';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import * as serviceWorkerRegistration from '../serviceWorkerRegistration';

export default function VersionControl() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { t } = useTranslation();

  /* Update service worker on manual page reload */
  const reloadPage = useCallback(() => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
    closeSnackbar();
    window.location.reload();
  }, [waitingWorker, closeSnackbar]);

  const onSWUpdate = useCallback(
    (registration: ServiceWorkerRegistration) => {
      enqueueSnackbar(t('newVersion'), {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        persist: true,
        action: () => (
          <Button variant="contained" size="small" onClick={reloadPage}>
            {t('update')}
          </Button>
        ),
      });
      setWaitingWorker(registration.waiting);
    },
    [enqueueSnackbar, reloadPage, t]
  );

  useEffect(() => {
    serviceWorkerRegistration.register({ onUpdate: onSWUpdate });
  }, [onSWUpdate]);

  return (
    <div>
      <Typography
        sx={{
          position: 'absolute',
          bottom: '0.5em',
          right: '1em',
        }}
        variant="caption"
      >
        {process.env.REACT_APP_VERSION}
      </Typography>
    </div>
  );
}
