import React, { useState, useContext } from 'react';
import { IconButton, Tooltip, Menu, MenuItem, Checkbox } from '@material-ui/core';
import { Extension } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { ADDONS } from '../config/game';
import { GamesContext, CurrentGameContext } from './App';

const useStyles = makeStyles({
  checkbox: {
    marginLeft: '-11px',
  },
});

export default function MainMenu() {
  const gamesContext = useContext(GamesContext);
  const {currentGameState} = useContext(CurrentGameContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const classes = useStyles();
  const { t } = useTranslation();

  function handleOpenContextMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleCloseContextMenu() {
    setAnchorEl(null);
  }

  function handleMenuItemClick(_: React.MouseEvent, addon: string, isAdd: boolean) {
    if (!currentGameState) {
      return;
    }
    const selectedAddons = currentGameState?.addons || [];
    const addons = isAdd ? [...selectedAddons, addon] : selectedAddons.filter(selectedAddon => selectedAddon !== addon)
    gamesContext.dispatch({
      type: 'UPDATE_ADDONS',
      payload: {
        gameId: currentGameState?.gameId,
        addons,
      }
    });
  }

  return (
    <div>
      <Tooltip title={t('addons') || ''}>
        <IconButton color="inherit" onClick={handleOpenContextMenu}>
          <Extension />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseContextMenu}
      >
        {ADDONS.map(addon => (
          <MenuItem
            key={addon.name}
            onClick={e =>
              handleMenuItemClick(e, addon.name, !currentGameState?.addons?.includes(addon.name))
            }
          >
            <Checkbox
              classes={{
                root: classes.checkbox,
              }}
              checked={currentGameState?.addons?.includes(addon.name)}
            />
            {t(addon.name)}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
