import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import LanguageIcon from '@material-ui/icons/Language';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import { useTranslation } from 'react-i18next';
import { RadioGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  radio: {
    marginLeft: '-11px',
  },
}));

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
  }

  return (
    <div>
      <Tooltip title={t('language') || ''}>
        <IconButton color="inherit" onClick={handleOpenContextMenu}>
          <LanguageIcon />
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
