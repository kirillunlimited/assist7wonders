import React, { useState, useContext } from 'react';
import { IconButton, Tooltip, Menu, MenuItem, Checkbox } from '@mui/material';
import { Extension } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { ADDONS } from '../config/game';
import { GamesContext, CurrentGameContext } from './App';

export default function MainMenu() {
  const gamesContext = useContext(GamesContext);
  const { currentGameParams } = useContext(CurrentGameContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();

  function handleOpenContextMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleCloseContextMenu() {
    setAnchorEl(null);
  }

  function handleMenuItemClick(_: React.MouseEvent, addon: string, isAdd: boolean) {
    if (!currentGameParams) {
      return;
    }
    const selectedAddons = currentGameParams?.addons || [];
    const addons = isAdd
      ? [...selectedAddons, addon]
      : selectedAddons.filter(selectedAddon => selectedAddon !== addon);
    gamesContext.dispatch({
      type: 'UPDATE_ADDONS',
      payload: {
        gameId: currentGameParams?.gameId,
        addons,
      },
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
              handleMenuItemClick(e, addon.name, !currentGameParams?.addons?.includes(addon.name))
            }
          >
            <Checkbox checked={currentGameParams?.addons?.includes(addon.name)} />
            {t(addon.name)}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
