import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'react-router-dom';
import { Typography, Alert } from '@mui/material';
import { Route as RouteType } from '../types';
import { CurrentGameContext } from './App';

const sxTitle = {
  fontSize: '1.5em',
  textTransform: 'uppercase',
  fontWeight: 500,
  letterSpacing: 0,
  mb: 1,
  '&:last-child': {
    mb: 0,
  },
};

export default function Router({ routes }: { routes: RouteType[] }) {
  const { t } = useTranslation();
  return (
    <Switch>
      {routes.map(route => (
        <RouteWithSubRoutes {...route} key={route.id} />
      ))}
      <Route
        component={() => (
          <Typography variant="h1" sx={{ ...sxTitle }}>
            {t('pageNotFound')}
          </Typography>
        )}
      />
    </Switch>
  );
}

function RouteWithSubRoutes(route: RouteType) {
  const { currentGameParams, currentGamePlayers } = useContext(CurrentGameContext);
  const { t } = useTranslation();

  const error =
    route.error && route.error({ game: currentGameParams, players: currentGamePlayers });

  return (
    <div>
      {route.exact && (
        <Typography variant="h1" sx={{ ...sxTitle }}>
          {t(route.id)}
        </Typography>
      )}
      {error ? (
        <Alert sx={{ mt: 2 }} severity="warning">
          {t(error)}
        </Alert>
      ) : (
        <Route
          path={route.path}
          exact={route.exact}
          render={props => <route.component {...props} routes={route.routes} />}
        />
      )}
    </div>
  );
}
