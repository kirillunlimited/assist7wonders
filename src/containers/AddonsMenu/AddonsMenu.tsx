import React, { useState, useContext } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ExtensionIcon from '@material-ui/icons/Extension';
import Tooltip from '@material-ui/core/Tooltip';
import { AddonsContext } from '../App/App';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import { IAddons } from '../../types';
import ADDONS from '../../config/addons';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  checkbox: {
    marginLeft: '-11px',
  },
}));

export default function MainMenu() {
  const addonsContext = useContext(AddonsContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const classes = useStyles();
  const { t } = useTranslation();

  function handleOpenContextMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleCloseContextMenu() {
    setAnchorEl(null);
  }

  function handleMenuItemClick(event: React.MouseEvent, addon: keyof IAddons) {
    addonsContext.dispatch({
      type: 'TOGGLE',
      payload: { addon, value: !addonsContext.state[addon] },
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
        {ADDONS.map(addon => (
          <MenuItem key={addon.id} onClick={e => handleMenuItemClick(e, addon.id)}>
            <Checkbox
              classes={{
                root: classes.checkbox,
              }}
              checked={addonsContext.state[addon.id]}
            />
            {t(addon.id)}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
