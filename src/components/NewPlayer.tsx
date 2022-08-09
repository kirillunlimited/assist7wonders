import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { Close, PersonAdd } from '@mui/icons-material';
import WonderSelect from './WonderSelect';
import { useTranslation } from 'react-i18next';
import { shuffleWonders } from '../utils/wonders';

export type Props = {
  names: string[];
  wonders: string[];
  selectedWonders: string[];
  isMax: boolean;
  onSubmit: (name: string, wonder: string) => void;
};

export default function NewPlayer(props: Props) {
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
  }, [props.selectedWonders, isDialogOpened, getRandomWonder]);

  const toggleDialog = useCallback(
    (show: boolean) => {
      setIsDialogOpened(show);

      if (show) {
        /* Set random wonder on open */
        setWonder(getRandomWonder());
      } else {
        /* Reset wonder on close */
        setWonder('');
      }
    },
    [getRandomWonder]
  );

  useEffect(() => {
    if (props.isMax) {
      toggleDialog(false);
    }
  }, [props.isMax, toggleDialog]);

  function isAddButtonEnabled() {
    return !props.isMax && isNameValid(name) && isWonderValid(wonder);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    props.onSubmit(name, wonder);

    /* Reset */
    setName('');
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
        disabled={props.isMax}
        startIcon={<PersonAdd />}
        variant="contained"
        color="primary"
        aria-label="add"
        onClick={() => toggleDialog(true)}
      >
        {t('newPlayer')}
      </Button>

      <Dialog open={isDialogOpened} onClose={() => toggleDialog(false)}>
        <DialogTitle
          sx={{
            margin: 0,
            padding: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {t('newPlayer')}
          <IconButton aria-label="close" onClick={() => toggleDialog(false)}>
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
            <Box
              sx={{
                marginTop: 2,
              }}
            >
              <WonderSelect
                value={wonder}
                wonders={props.wonders}
                selectedWonders={props.selectedWonders}
                variant="outlined"
                onSelect={setWonder}
              />
            </Box>
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
