import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import LanguageIcon from '@material-ui/icons/Language';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useTranslation } from 'react-i18next';

export default function MainMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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
    <>
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
        {Object.keys(i18n.store.data).map(language => (
          <MenuItem
            key={language}
            selected={language === (i18n.language || window.localStorage.i18nextLng)}
            onClick={() => handleChange(language)}
          >
            {t(language)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
