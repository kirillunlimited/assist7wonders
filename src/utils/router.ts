import { BASE_GAME, ADDONS } from '../config/game';
import { getAllScores } from './score';
import { GameScore, Route } from '../types';
import Scores from '../containers/Scores';

const SCORES_ROUTE = 'scores';

function convertScoresToRoutes(scores: GameScore[] = [], parentPath: string): Route[] {
  return scores.map(score => ({
    ...score,
    path: parentPath + '/' + score.id,
    exact: true,
    component: () => Scores({ score }),
    error: ({ players, game }) => {
      return !game.scores.some(gameScore => gameScore.id === score.id)
        ? 'expansionIsDisabled'
        : players.length <= 1
        ? 'notEnoughPlayers'
        : '';
    },
  }));
}

export function getAllRoutes(routes: Route[]): Route[] {
  const scores = getAllScores([BASE_GAME, ...ADDONS]);
  return routes.map(route => {
    if (route.id === SCORES_ROUTE) {
      return {
        ...route,
        routes: convertScoresToRoutes(scores, route.path),
      };
    } else {
      return route;
    }
  });
}

export function getRouteByPathname(
  pathname: string,
  routes: Route[],
  prefix: string = ''
): Route | null {
  for (const route of routes) {
    if (route.exact && (pathname === route.path || pathname === prefix + route.path)) {
      return route;
    }
    if (route.routes) {
      const result = getRouteByPathname(pathname, route.routes, route.path);
      if (result) {
        return result;
      }
    }
  }
  return null;
}
