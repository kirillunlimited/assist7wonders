import { Route, Player } from '../types';
import Players from '../containers/Players/Players';
import Total from '../containers/Total/Total';
import Router from '../containers/Router/Router';
import { getAllRoutes } from '../utils/router';

const routes: Route[] = [
  {
    path: '/',
    id: 'players',
    exact: true,
    component: Players,
  },
  {
    path: '/scores',
    id: 'scores',
    component: Router,
  },
  {
    path: '/total',
    id: 'total',
    exact: true,
    component: Total,
    error: ({ players }: { players: Player[] }) => (players.length <= 1 ? 'notEnoughPlayers' : ''),
  },
];

export default getAllRoutes(routes);
