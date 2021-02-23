import React, { useState, useContext } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import ExtensionIcon from '@material-ui/icons/Extension';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import { AddonsContext, PlayersContext } from '../App/App';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { IAddons } from '../../types';
import ADDONS from '../../config/addons';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1,
    fontWeight: 'bold',
    fontSize: '24px',
    textAlign: 'left',
    padding: '0 12px',
  },
}));

export default function MainMenu() {
  const classes = useStyles();
  const playersContext = useContext(PlayersContext);
  const addonsContext = useContext(AddonsContext);

  const [isConfirmOpened, setIsConfirmOpened] = useState(false);

  function handleOpenConfirm() {
    setIsConfirmOpened(true);
  }

  function handleCloseConfirm() {
    setIsConfirmOpened(false);
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  function handleOpenContextMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleCloseContextMenu() {
    setAnchorEl(null);
  }

  function onAddonToggle(event: React.ChangeEvent<HTMLInputElement>, addon: keyof IAddons) {
    addonsContext.dispatch({ type: 'TOGGLE', payload: { addon, value: event.target.checked } });
  }

  function onResetGame() {
    playersContext.dispatch({ type: 'RESET' });
    handleCloseConfirm();
  }

  return (
    <AppBar>
      <Toolbar>
        <Typography variant="body1" className={classes.title}>
          7 Wonders
        </Typography>
        <Tooltip title="Новая игра">
          <IconButton onClick={handleOpenConfirm} color="inherit">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <Dialog
          open={isConfirmOpened}
          onClose={handleCloseConfirm}
          aria-labelledby="alert-dialog-title"
        >
          <DialogTitle>Начать новую игру?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Результаты игроков будут сброшены, а выбранные чудеса света будут перемешаны. Вы
              уверены?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirm} color="primary">
              Нет
            </Button>
            <Button onClick={onResetGame} color="primary" autoFocus>
              Да
            </Button>
          </DialogActions>
        </Dialog>

        <Tooltip title="Дополнения">
          <IconButton
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
            onClick={handleOpenContextMenu}
          >
            <ExtensionIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseContextMenu}
      >
        {ADDONS.map(addon => (
          <MenuItem key={addon.key}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={addonsContext.state[addon.key]}
                  name={addon.key}
                  onChange={e => onAddonToggle(e, addon.key)}
                />
              }
              label={addon.label}
            />
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
}
