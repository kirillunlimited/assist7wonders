import React, { useState, useContext } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ExtensionIcon from '@material-ui/icons/Extension';
import Tooltip from '@material-ui/core/Tooltip';
import { AddonsContext } from '../App/App';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { IAddons } from '../../types';
import ADDONS from '../../config/addons';
import { useTranslation } from 'react-i18next';

export default function MainMenu() {
  const addonsContext = useContext(AddonsContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();

  function handleOpenContextMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleCloseContextMenu() {
    setAnchorEl(null);
  }

  function onAddonToggle(event: React.ChangeEvent<HTMLInputElement>, addon: keyof IAddons) {
    addonsContext.dispatch({ type: 'TOGGLE', payload: { addon, value: event.target.checked } });
  }

  return (
    <>
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
        {ADDONS.map(addon => (
          <MenuItem key={addon.id}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={addonsContext.state[addon.id]}
                  name={t(addon.id)}
                  onChange={e => onAddonToggle(e, addon.id)}
                />
              }
              label={t(addon.id)}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
