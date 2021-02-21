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

interface IProps {
  names: Array<string>;
  handleSubmit: (name: string) => void;
}

const useStyles = makeStyles(theme => ({
  newPlayerButton: {
    position: 'fixed',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
  },
}));

export default function NewPlayer(props: IProps) {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [isDialogOpened, setIsDialogOpened] = useState(false);

  function isAddButtonDisabled() {
    return Boolean(!name || props.names.includes(name));
  }

  function toggleDialog(value: boolean) {
    setIsDialogOpened(value);
  }

  return (
    <div>
      <Tooltip title="Новый игрок">
        <Fab
          className={classes.newPlayerButton}
          aria-label="add"
          onClick={() => toggleDialog(true)}
        >
          <PersonAddIcon />
        </Fab>
      </Tooltip>

      <Dialog open={isDialogOpened} onClose={() => toggleDialog(false)}>
        <DialogTitle>Новый игрок</DialogTitle>
        <form
          onSubmit={e => {
            e.preventDefault();
            props.handleSubmit(name);
            setName('');
          }}
        >
          <DialogContent>
            <TextField
              label="Имя"
              onChange={event => setName(event.target.value)}
              value={name}
              variant="outlined"
              autoFocus
            />
          </DialogContent>
          <DialogActions>
            <Button color="primary" type="submit" disabled={isAddButtonDisabled()}>
              Добавить
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
