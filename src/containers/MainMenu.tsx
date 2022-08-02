import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { AppBar, Toolbar } from '@mui/material';
import { useLocation } from 'react-router-dom';
import routes from '../config/routes';
import { getRouteByPathname } from '../utils/router';

import { useTranslation } from 'react-i18next';
import logo from '../img/logo.png';
import logo2x from '../img/logo2x.png';

type Props = {
  children: React.ReactNode;
};

export default function MainMenu(props: Props) {
  const [currentColor, setCurrentColor] = useState('');
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const currentRoute = getRouteByPathname(location.pathname, routes);
    setCurrentColor(currentRoute?.color || '');
  }, [location]);

  return (
    <AppBar sx={{ backgroundColor: currentColor }}>
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
              maxHeight: '3em',
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
