import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { IAddons, TPlayers, IRoute, TRoutes, TScoreKey } from '../types';
import { IProps as IScoresProps } from '../containers/Scores/Scores';
import Players from '../containers/Players/Players';
import Scores from '../containers/Scores/Scores';
import Total from '../containers/Total/Total';
import Typography from '@material-ui/core/Typography';
import { getTreasuryTotal, getScienceTotal } from '../utils/score';
import { isScoresAvailable } from './addons';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

interface IRouteContexts {
  contexts: {
    players: TPlayers;
    addons: IAddons;
  };
}

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

export const ScoreRoutes: TRoutes = [
  {
    path: '/scores/military',
    id: 'military',
    exact: true,
    component: ({ players, addons }: { players: TPlayers; addons: IAddons }) =>
      RenderScores(
        {
          key: 'military',
          scores: ['military'],
        },
        ['military'],
        players,
        addons
      ),
    available: ({ players, addons }: { players: TPlayers; addons: IAddons }) =>
      isScoreRouteAvailable(['military'], players, addons),
    color: '#D81F25',
  },
  {
    path: '/scores/treasury',
    id: 'treasury',
    exact: true,
    component: ({ players, addons }: { players: TPlayers; addons: IAddons }) =>
      RenderScores(
        {
          key: 'treasury',
          scores: ['treasury'],
          isSumVisible: true,
        },
        ['treasury'],
        players,
        addons
      ),
    available: ({ players, addons }: { players: TPlayers; addons: IAddons }) =>
      isScoreRouteAvailable(['treasury'], players, addons),
    color: '#AA8E69',
    sum: getTreasuryTotal,
  },
  {
    path: '/scores/wonders',
    id: 'wonders',
    exact: true,
    component: ({ players, addons }: { players: TPlayers; addons: IAddons }) =>
      RenderScores(
        {
          key: 'wonders',
          scores: ['wonders'],
        },
        ['wonders'],
        players,
        addons
      ),
    available: ({ players, addons }: { players: TPlayers; addons: IAddons }) =>
      isScoreRouteAvailable(['wonders'], players, addons),
    color: '#E8C44A',
  },
  {
    path: '/scores/civilian',
    id: 'civilian',
    exact: true,
    component: ({ players, addons }: { players: TPlayers; addons: IAddons }) =>
      RenderScores(
        {
          key: 'civilian',
          scores: ['civilian'],
        },
        ['civilian'],
        players,
        addons
      ),
    available: ({ players, addons }: { players: TPlayers; addons: IAddons }) =>
      isScoreRouteAvailable(['civilian'], players, addons),
    color: '#2376CF',
  },
  {
    path: '/scores/commerce',
    id: 'commerce',
    exact: true,
    component: ({ players, addons }: { players: TPlayers; addons: IAddons }) =>
      RenderScores(
        {
          key: 'commerce',
          scores: ['commerce'],
        },
        ['commerce'],
        players,
        addons
      ),
    available: ({ players, addons }: { players: TPlayers; addons: IAddons }) =>
      isScoreRouteAvailable(['commerce'], players, addons),
    color: '#E8A33C',
  },
  {
    path: '/scores/guild',
    id: 'guild',
    exact: true,
    component: ({ players, addons }: { players: TPlayers; addons: IAddons }) =>
      RenderScores(
        {
          key: 'guild',
          scores: ['guild'],
        },
        ['guild'],
        players,
        addons
      ),
    available: ({ players, addons }: { players: TPlayers; addons: IAddons }) =>
      isScoreRouteAvailable(['guild'], players, addons),
    color: '#91288F',
  },
  {
    path: '/scores/science',
    id: 'science',
    exact: true,
    component: ({ players, addons }: { players: TPlayers; addons: IAddons }) =>
      RenderScores(
        {
          key: 'science',
          scores: ['compass', 'tablet', 'gear', 'wildcards'],
          isSumVisible: true,
        },
        ['compass', 'tablet', 'gear', 'wildcards'],
        players,
        addons
      ),
    available: ({ players, addons }: { players: TPlayers; addons: IAddons }) =>
      isScoreRouteAvailable(['compass', 'tablet', 'gear'], players, addons),
    color: '#006118',
    sum: getScienceTotal,
  },
  {
    path: '/scores/cities',
    id: 'cities',
    exact: true,
    component: ({ players, addons }: { players: TPlayers; addons: IAddons }) =>
      RenderScores(
        {
          key: 'cities',
          scores: ['cities'],
        },
        ['cities'],
        players,
        addons
      ),
    available: ({ players, addons }: { players: TPlayers; addons: IAddons }) =>
      isScoreRouteAvailable(['cities'], players, addons),
    color: '#545454',
  },
  {
    path: '/scores/debt',
    id: 'debt',
    exact: true,
    component: ({ players, addons }: { players: TPlayers; addons: IAddons }) =>
      RenderScores(
        {
          key: 'debt',
          scores: ['debt'],
          max: 0,
        },
        ['debt'],
        players,
        addons
      ),
    available: ({ players, addons }: { players: TPlayers; addons: IAddons }) =>
      isScoreRouteAvailable(['debt'], players, addons),
    color: '#8F7B66',
  },
  {
    path: '/scores/leaders',
    id: 'leaders',
    exact: true,
    component: ({ players, addons }: { players: TPlayers; addons: IAddons }) =>
      RenderScores(
        {
          key: 'leaders',
          scores: ['leaders'],
        },
        ['leaders'],
        players,
        addons
      ),
    available: ({ players, addons }: { players: TPlayers; addons: IAddons }) =>
      isScoreRouteAvailable(['leaders'], players, addons),
    color: '#BCBCBC',
  },
];

const ROUTES: TRoutes = [
  {
    path: '/',
    id: 'players',
    exact: true,
    component: Players,
  },
  {
    path: '/scores',
    id: 'scores',
    component: RenderRoutes,
    routes: ScoreRoutes,
  },
  {
    path: '/total',
    id: 'total',
    exact: true,
    component: ({ players }: { players: TPlayers }) => RenderRoute(Total, players),
    available: ({ players }: { players: TPlayers }) => isRouteAvailable(players),
  },
];

export default ROUTES;

export function RenderRoutes({
  routes,
  players,
  addons,
}: {
  routes: TRoutes;
  players: TPlayers;
  addons: IAddons;
}) {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Switch>
      {routes.map(route => (
        <RouteWithSubRoutes {...route} key={route.id} contexts={{ players, addons }} />
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

function RouteWithSubRoutes(payload: IRoute & IRouteContexts) {
  const { players, addons } = payload.contexts;
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div>
      {payload.exact && (
        <Typography variant="h1" className={classes.title}>
          {t(payload.id)}
        </Typography>
      )}
      <Route
        path={payload.path}
        exact={payload.exact}
        render={props => (
          <payload.component {...props} routes={payload.routes} players={players} addons={addons} />
        )}
      />
    </div>
  );
}

function isRouteAvailable(players: TPlayers): boolean {
  return players.length > 1;
}

/** Needed for navigation menu render */
function isScoreRouteAvailable(scores: TScoreKey[], players: TPlayers, addons: IAddons): boolean {
  return isRouteAvailable(players) ? isScoresAvailable(scores, addons) : false;
}

function RenderScores(
  props: IScoresProps,
  scores: TScoreKey[],
  players: TPlayers,
  addons: IAddons
) {
  const { t } = useTranslation();
  return isRouteAvailable(players) ? (
    isScoresAvailable(scores, addons) ? (
      Scores(props)
    ) : (
      <Typography variant="subtitle1">{t('addonIsDisabled')}</Typography>
    )
  ) : (
    <Typography variant="subtitle1">{t('notEnoughPlayers')}</Typography>
  );
}

function RenderRoute(Component: Function, players: TPlayers) {
  const { t } = useTranslation();
  return isRouteAvailable(players) ? (
    <Component />
  ) : (
    <Typography variant="subtitle1">{t('notEnoughPlayers')}</Typography>
  );
}
