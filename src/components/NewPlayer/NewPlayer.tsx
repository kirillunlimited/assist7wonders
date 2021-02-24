import * as React from 'react';
import { useState } from 'react';
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

interface IProps {
  names: string[];
  wonders: string[];
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

  function isAddButtonDisabled() {
    return Boolean(!name || isNameValid(name) || !wonder || props.wonders.includes(wonder));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    props.handleSubmit(name, wonder);

    /* Reset */
    setName('');
    setWonder('');
  }

  function toggleDialog(value: boolean) {
    setIsDialogOpened(value);
  }

  function isNameValid(name: string) {
    return props.names.map(name => name.toLowerCase()).includes(name.toLowerCase());
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
                error={isNameValid(name)}
                helperText={isNameValid(name) ? t('playerAlreadyExists') : ''}
                onChange={event => setName(event.target.value)}
              />
            </div>
            <div className={classes.wondersSelect}>
              <WonderSelect
                value={wonder}
                selectedWonders={props.wonders}
                variant="outlined"
                onSelect={setWonder}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button color="primary" type="submit" disabled={isAddButtonDisabled()}>
              {t('add')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
