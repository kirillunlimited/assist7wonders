import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import WonderSelect from '../WonderSelect/WonderSelect';
import { useTranslation } from 'react-i18next';
import { shuffleWonders } from '../../utils/game';

interface IProps {
  names: string[];
  wonders: string[];
  selectedWonders: string[];
  isMax: boolean;
  handleSubmit: (name: string, wonder: string) => void;
}

const useStyles = makeStyles(theme => ({
  newPlayerButton: {
    position: 'fixed',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
  },
  wondersSelect: {
    marginTop: theme.spacing(2),
  },
}));

export default function NewPlayer(props: IProps) {
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
  }, [getRandomWonder]); // eslint-disable-line react-hooks/exhaustive-deps

  function isAddButtonEnabled() {
    return !props.isMax && isNameValid(name) && isWonderValid(wonder);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    props.handleSubmit(name, wonder);

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
      <Tooltip title={t('newPlayer') || ''}>
        <Fab
          className={classes.newPlayerButton}
          aria-label="add"
          onClick={() => toggleDialog(true)}
        >
          <PersonAddIcon />
        </Fab>
      </Tooltip>

      <Dialog open={isDialogOpened} onClose={() => toggleDialog(false)}>
        <DialogTitle>{t('newPlayer')}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <div>
              <TextField
                label={t('name')}
                value={name}
                variant="outlined"
                autoFocus
                error={isNameExists(name)}
                helperText={isNameExists(name) ? t('playerAlreadyExists') : ''}
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
            <Button color="primary" type="submit" disabled={!isAddButtonEnabled()}>
              {t('add')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
