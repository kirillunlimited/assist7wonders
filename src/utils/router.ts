import { getAllScores } from './game';
import { IGameScore, IRoute } from '../types';
import Scores from '../containers/Scores/Scores';

export function getAllRoutes(routes: IRoute[]): IRoute[] {
  const scores = getAllScores();
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

function convertScoresToRoutes(scores: IGameScore[] = [], parentPath: string): IRoute[] {
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
