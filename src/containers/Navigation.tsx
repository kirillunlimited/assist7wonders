import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Tabs, Tab, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import ROUTES from '../config/routes';
import { Route } from '../types';
import { CurrentGameContext } from './App';

export default function Navigation() {
  const theme = useTheme();
  const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));
  const location = useLocation();
  const { currentGameParams, currentGamePlayers } = useContext(CurrentGameContext);
  const { t } = useTranslation();

  function renderTabs(routes: Route[]): Array<React.ReactNode> {
    return routes.map(route => {
      if (route.routes) {
        return renderTabs(route.routes);
      } else {
        const error =
          route.error && route.error({ game: currentGameParams, players: currentGamePlayers });
        return error ? null : (
          <Tab
            key={route.id}
            sx={{
              maxWidth: '160px',
              opacity: 1,
              lineHeight: 1.4,
              color: '#fff',
              textShadow: '0px 1px 0 #999',
              '&.Mui-selected': {
                color: '#fff',
              },
            }}
            label={t(route.id)}
            component={Link}
            value={route.path}
            to={route.path}
            style={{
              backgroundColor: route.color,
            }}
          />
        );
      }
    });
  }

  return (
    <AppBar
      component="nav"
      sx={{
        width: { sm: 'auto' },
      }}
      position="static"
    >
      <Tabs
        orientation={bigScreen ? 'vertical' : 'horizontal'}
        sx={{
          height: '100%',
          '& .MuiTabs-indicator': {
            backgroundColor: '#fff',
          },
        }}
        value={location.pathname}
        variant={bigScreen ? 'standard' : 'scrollable'}
        scrollButtons="auto"
      >
        {renderTabs(ROUTES)}
      </Tabs>
    </AppBar>
  );
}
