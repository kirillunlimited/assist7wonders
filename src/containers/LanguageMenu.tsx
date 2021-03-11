import React, { useState } from 'react';
import { IconButton, Tooltip, Menu, MenuItem, Radio, RadioGroup } from '@material-ui/core';
import { Language } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  radio: {
    marginLeft: '-11px',
  },
});

export default function MainMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const classes = useStyles();
  const { t, i18n } = useTranslation();

  function handleOpenContextMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleCloseContextMenu() {
    setAnchorEl(null);
  }

  function handleChange(language: string) {
    i18n.changeLanguage(language);
    handleCloseContextMenu();
  }

  return (
    <div>
      <Tooltip title={t('language') || ''}>
        <IconButton color="inherit" onClick={handleOpenContextMenu}>
          <Language />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseContextMenu}
      >
        <RadioGroup value={i18n.language || window.localStorage.i18nextLng}>
          {Object.keys(i18n.store.data).map(language => (
            <MenuItem key={language} onClick={() => handleChange(language)}>
              <Radio
                classes={{
                  root: classes.radio,
                }}
                value={language}
              />
              {t(language)}
            </MenuItem>
          ))}
        </RadioGroup>
      </Menu>
    </div>
  );
}
