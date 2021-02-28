import { IRoute } from '../../types';
import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { GameContext, PlayersContext } from '../App/App';
import { getRoutes } from '../../utils/router';

const useStyles = makeStyles({
  title: {
    fontSize: '30px',
    fontWeight: 'bold',
    marginBottom: '0.5em',
    '&:last-child': {
      marginBottom: 0,
    },
  },
});

export function Router() {
  const routes = getRoutes();
  return Routes({ routes });
}

export default function Routes({ routes }: { routes: IRoute[] }) {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Switch>
      {routes.map(route => (
        <RouteWithSubRoutes {...route} key={route.id} />
      ))}
      <Route
        component={() => (
          <Typography variant="h1" className={classes.title}>
            {t('pageNotFound')}
          </Typography>
        )}
      />
    </Switch>
  );
}

function RouteWithSubRoutes(route: IRoute) {
  const classes = useStyles();
  const gameContext = useContext(GameContext);
  const playersContext = useContext(PlayersContext);
  const { t } = useTranslation();

  const error =
    route.error && route.error({ game: gameContext.state, players: playersContext.state });

  return (
    <div>
      {route.exact && (
        <Typography variant="h1" className={classes.title}>
          {t(route.id)}
        </Typography>
      )}
      {error ? (
        <Typography variant="subtitle1">{t(error)}</Typography>
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
