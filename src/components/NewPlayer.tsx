import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@material-ui/core';
import { Close, PersonAdd } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import WonderSelect from './WonderSelect';
import { useTranslation } from 'react-i18next';
import { shuffleWonders } from '../utils/game';

export type Props = {
  names: string[];
  wonders: string[];
  selectedWonders: string[];
  isMax: boolean;
  onSubmit: (name: string, wonder: string) => void;
};

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(2),
  },
  title: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  wondersSelect: {
    marginTop: theme.spacing(2),
  },
}));

export default function NewPlayer(props: Props) {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [wonder, setWonder] = useState('');
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const { t } = useTranslation();

  const getRandomWonder = useCallback(() => {
    return (
      shuffleWonders(props.wonders).filter(wonder => !props.selectedWonders.includes(wonder))[0] ||
      ''
    );
  }, [props.wonders, props.selectedWonders]);

  useEffect(() => {
    if (isDialogOpened) {
      setWonder(getRandomWonder());
    }
  }, [props.selectedWonders]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (props.isMax) {
      toggleDialog(false);
    }
  }, [props.isMax]); // eslint-disable-line react-hooks/exhaustive-deps

  function isAddButtonEnabled() {
    return !props.isMax && isNameValid(name) && isWonderValid(wonder);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    props.onSubmit(name, wonder);

    /* Reset */
    setName('');
  }

  function toggleDialog(show: boolean) {
    setIsDialogOpened(show);

    if (show) {
      /* Set random wonder on open */
      setWonder(getRandomWonder());
    } else {
      /* Reset wonder on close */
      setWonder('');
    }
  }

  function isNameValid(name: string): boolean {
    return Boolean(name && !isNameExists(name));
  }

  function isNameExists(name: string): boolean {
    return props.names.map(name => name.toLowerCase()).includes(name.toLowerCase());
  }

  function isWonderValid(wonder: string): boolean {
    return Boolean(wonder && !props.selectedWonders.includes(wonder));
  }

  return (
    <div>
      <Button
        className={classes.button}
        disabled={props.isMax}
        startIcon={<PersonAdd />}
        variant="contained"
        color="primary"
        aria-label="add"
        onClick={() => toggleDialog(true)}
      >
        {t('newPlayerButton')}
      </Button>

      <Dialog open={isDialogOpened} onClose={() => toggleDialog(false)}>
        <DialogTitle disableTypography className={classes.title}>
          <Typography variant="h6"> {t('newPlayer')}</Typography>
          <IconButton
            className={classes.closeButton}
            aria-label="close"
            onClick={() => toggleDialog(false)}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <form aria-label="New Player" onSubmit={handleSubmit}>
          <DialogContent>
            <div>
              <TextField
                aria-label="Name"
                label={t('name')}
                value={name}
                variant="outlined"
                autoFocus
                error={isNameExists(name)}
                helperText={isNameExists(name) ? t('playerAlreadyExists') : ''}
                FormHelperTextProps={{
                  'aria-label': 'Error message',
                }}
                onChange={event => setName(event.target.value)}
              />
            </div>
            <div className={classes.wondersSelect}>
              <WonderSelect
                value={wonder}
                wonders={props.wonders}
                selectedWonders={props.selectedWonders}
                variant="outlined"
                onSelect={setWonder}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button role="submit" color="primary" type="submit" disabled={!isAddButtonEnabled()}>
              {t('add')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
