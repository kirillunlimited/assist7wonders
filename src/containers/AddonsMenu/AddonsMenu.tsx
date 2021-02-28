import React, { useState, useContext } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ExtensionIcon from '@material-ui/icons/Extension';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { GameContext } from '../App/App';
import { addons } from '../../config/game';

const useStyles = makeStyles(() => ({
  checkbox: {
    marginLeft: '-11px',
  },
}));

export default function MainMenu() {
  const gameContext = useContext(GameContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const classes = useStyles();
  const { t } = useTranslation();

  function handleOpenContextMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleCloseContextMenu() {
    setAnchorEl(null);
  }

  function handleMenuItemClick(event: React.MouseEvent, addon: string, isAdd: boolean) {
    const selectedAddons = gameContext.state.addons;
    gameContext.dispatch({
      type: 'INIT',
      payload: isAdd
        ? { addons: [...selectedAddons, addon] }
        : { addons: selectedAddons.filter(selectedAddon => selectedAddon !== addon) },
    });
  }

  return (
    <div>
      <Tooltip title={t('addons') || ''}>
        <IconButton color="inherit" onClick={handleOpenContextMenu}>
          <ExtensionIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseContextMenu}
      >
        {addons.map(addon => (
          <MenuItem
            key={addon.id}
            onClick={e =>
              handleMenuItemClick(e, addon.id, !gameContext.state.addons.includes(addon.id))
            }
          >
            <Checkbox
              classes={{
                root: classes.checkbox,
              }}
              checked={gameContext.state.addons.includes(addon.id)}
            />
            {t(addon.id)}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
