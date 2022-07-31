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
              color: theme => theme.palette.primary.contrastText,
              textShadow: theme => `1px 1px 2px ${theme.palette.text.secondary}`,
              py: 0,
              '&.Mui-selected': {
                color: theme => theme.palette.primary.contrastText,
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
        position: 'static',
        width: { xs: 'auto', sm: 160 },
      }}
      elevation={4}
    >
      <Tabs
        orientation={bigScreen ? 'vertical' : 'horizontal'}
        sx={{
          height: '100%',
          '& .MuiTabs-indicator': {
            backgroundColor: theme => theme.palette.background.paper,
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
