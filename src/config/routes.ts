import { Route, Player } from '../types';
import Players from '../containers/Players';
import Total from '../containers/Total';
import Router from '../containers/Router';
import { getAllRoutes } from '../utils/router';

const routes: Route[] = [
  {
    path: '/',
    id: 'players',
    exact: true,
    color: '#3F51B5',
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
    color: '#795548',
    error: ({ players }: { players: Player[] }) => (players.length <= 1 ? 'notEnoughPlayers' : ''),
  },
];

export default getAllRoutes(routes);
