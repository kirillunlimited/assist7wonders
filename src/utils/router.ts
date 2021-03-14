import { BASE_GAME, ADDONS } from '../config/game';
import { getAllScores } from './game';
import { GameScore, Route } from '../types';
import Scores from '../containers/Scores';

export function getAllRoutes(routes: Route[]): Route[] {
  const scores = getAllScores([BASE_GAME, ...ADDONS]);
  return routes.map(route => {
    if (route.id === 'scores') {
      return {
        ...route,
        routes: convertScoresToRoutes(scores, route.path),
      };
    } else {
      return route;
    }
  });
}

function convertScoresToRoutes(scores: GameScore[] = [], parentPath: string): Route[] {
  return scores.map(score => ({
    ...score,
    path: parentPath + '/' + score.id,
    exact: true,
    component: () => Scores({ score }),
    error: ({ players, game }) => {
      return !game.scores.some(gameScore => gameScore.id === score.id)
        ? 'addonIsDisabled'
        : players.length <= 1
        ? 'notEnoughPlayers'
        : '';
    },
  }));
}
