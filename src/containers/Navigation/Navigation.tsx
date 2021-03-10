import * as React from 'react';
import { Link } from 'react-router-dom';
import { Route } from '../../types';
import { useLocation } from 'react-router-dom';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTranslation } from 'react-i18next';
import ROUTES from '../../config/routes';
import { useContext } from 'react';
import { GameContext, PlayersContext } from '../App/App';

const useStyles = makeStyles(theme => ({
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
      maxWidth: '160px',
    },
  },
  indicator: {
    backgroundColor: '#FFF',
  },
  tab: {
    opacity: 1,
    textShadow: '0px 1px 0 #999',
  },
}));

export default function Navigation() {
  const classes = useStyles();
  const theme = useTheme();
  const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));
  const location = useLocation();
  const gameContext = useContext(GameContext);
  const playersContext = useContext(PlayersContext);
  const { t } = useTranslation();

  function renderTabs(routes: Route[]): Array<React.ReactNode> {
    return routes.map(route => {
      if (route.routes) {
        return renderTabs(route.routes);
      } else {
        const error =
          route.error && route.error({ game: gameContext.state, players: playersContext.state });
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
    <AppBar className={classes.appBar} position="static">
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
