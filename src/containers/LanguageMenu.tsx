import React, { useEffect, useState } from 'react';
import { IconButton, Tooltip, Menu, MenuItem, Radio, RadioGroup, Badge } from '@mui/material';
import { Language } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export default function MainMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setSelectedLanguage(i18n.language || window.localStorage.i18nextLng);
  }, [i18n.language]);

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
        <Badge
          badgeContent={selectedLanguage.toUpperCase()}
          color="secondary"
          sx={{
            '& .MuiBadge-badge': {
              top: 8,
              right: 8,
            },
          }}
        >
          <IconButton color="inherit" onClick={handleOpenContextMenu}>
            <Language />
          </IconButton>
        </Badge>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseContextMenu}
      >
        <RadioGroup value={selectedLanguage}>
          {Object.keys(i18n.store.data).map(language => (
            <MenuItem key={language} onClick={() => handleChange(language)}>
              <Radio value={language} />
              {t(language)}
            </MenuItem>
          ))}
        </RadioGroup>
      </Menu>
    </div>
  );
}
