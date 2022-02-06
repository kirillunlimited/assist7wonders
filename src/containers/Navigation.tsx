import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Tabs, Tab, useMediaQuery } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import ROUTES from '../config/routes';
import { Route } from '../types';
import { CurrentGameContext } from './App';

const useStyles = makeStyles(theme => ({
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
    },
  },
  indicator: {
    backgroundColor: '#FFF',
  },
  tab: {
    maxWidth: '160px',
    opacity: 1,
    lineHeight: 1.4,
    textShadow: '0px 1px 0 #999',
  },
}));

export default function Navigation() {
  const classes = useStyles();
  const theme = useTheme();
  const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));
  const location = useLocation();
  const {currentGameState, currentGamePlayers} = useContext(CurrentGameContext);
  const { t } = useTranslation();

  function renderTabs(routes: Route[]): Array<React.ReactNode> {
    return routes.map(route => {
      if (route.routes) {
        return renderTabs(route.routes);
      } else {
        const error =
          route.error && route.error({ game: currentGameState, players: currentGamePlayers });
        return error ? null : (
          <Tab
            key={route.id}
            className={classes.tab}
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
    <AppBar component="nav" className={classes.appBar} position="static">
      <Tabs
        orientation={bigScreen ? 'vertical' : 'horizontal'}
        classes={{
          indicator: classes.indicator,
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
