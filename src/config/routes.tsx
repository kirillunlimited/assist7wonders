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

interface IRouteContexts {
  contexts: {
    players: TPlayers;
    addons: IAddons;
  };
}

const MESSAGES = {
  NOT_ENOUGH_PLAYERS: 'Недостаточно игроков: добавьте не менее 2 игроков',
  ADDON_IS_OFF: 'Дополнение отключено',
};

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
    key: 'military',
    label: 'Military',
    title: 'Military',
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
    key: 'treasury',
    label: 'Treasury',
    title: 'Treasury',
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
    key: 'wonders',
    label: 'Wonders',
    title: 'Wonders',
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
    key: 'civilian',
    label: 'Civilian',
    title: 'Civilian',
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
    key: 'commerce',
    label: 'Commerce',
    title: 'Commerce',
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
    key: 'guild',
    label: 'Guild',
    title: 'Guild',
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
    key: 'science',
    label: 'Science',
    title: 'Science',
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
    key: 'cities',
    label: 'Cities',
    title: 'Cities',
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
    key: 'debt',
    label: 'Debt',
    title: 'Debt',
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
    key: 'leaders',
    label: 'Leaders',
    title: 'Leaders',
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
    key: 'players',
    label: 'Игроки',
    title: 'Игроки',
    exact: true,
    component: Players,
  },
  {
    path: '/scores',
    key: 'scores',
    component: RenderRoutes,
    routes: ScoreRoutes,
  },
  {
    path: '/total',
    key: 'total',
    label: 'Total',
    title: 'Total',
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

  return (
    <Switch>
      {routes.map(route => (
        <RouteWithSubRoutes {...route} key={route.key} contexts={{ players, addons }} />
      ))}
      <Route
        component={() => (
          <Typography variant="h1" className={classes.title}>
            Страница не найдена
          </Typography>
        )}
      />
    </Switch>
  );
}

function RouteWithSubRoutes(payload: IRoute & IRouteContexts) {
  const { players, addons } = payload.contexts;
  const classes = useStyles();

  return (
    <div>
      {payload.title && (
        <Typography variant="h1" className={classes.title}>
          {payload.title}
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
  return isRouteAvailable(players) ? (
    isScoresAvailable(scores, addons) ? (
      Scores(props)
    ) : (
      <Typography variant="subtitle1">{MESSAGES.ADDON_IS_OFF}</Typography>
    )
  ) : (
    <Typography variant="subtitle1">{MESSAGES.NOT_ENOUGH_PLAYERS}</Typography>
  );
}

function RenderRoute(Component: Function, players: TPlayers) {
  return isRouteAvailable(players) ? (
    <Component />
  ) : (
    <Typography variant="subtitle1">{MESSAGES.NOT_ENOUGH_PLAYERS}</Typography>
  );
}
