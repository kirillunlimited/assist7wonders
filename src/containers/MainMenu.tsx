import React from 'react';
import { Box } from '@mui/material';
import { AppBar, Toolbar } from '@mui/material';

import { useTranslation } from 'react-i18next';
import logo from '../img/logo.png';
import logo2x from '../img/logo2x.png';

type Props = {
  children: React.ReactNode;
};

export default function MainMenu(props: Props) {
  const { t } = useTranslation();

  return (
    <AppBar>
      <Toolbar>
        <Box
          sx={{
            flexGrow: 1,
            textAlign: 'left',
          }}
        >
          <Box
            component="img"
            sx={{
              display: 'block',
              maxHeight: '48px',
            }}
            src={logo}
            alt={t('7wonders')}
            srcSet={`${logo2x} 2x`}
          />
        </Box>
        {props.children}
      </Toolbar>
    </AppBar>
  );
}
