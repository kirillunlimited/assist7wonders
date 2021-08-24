/** GAME */
export type CoreGame = {
  maxPlayers: number;
  wonders: string[];
  scores: GameScore[];
};
export type Game = CoreGame & {
  addons: string[];
};
export type AddonGame = CoreGame & {
  name: string;
};
export type GameScore = {
  id: string;
  color: string;
  counters: {
    id: string;
    min?: number;
    max?: number;
  }[];
  sum?: (score: PlayerScore, neighborScores: PlayerScore[]) => GameScoreSumResult;
};
export type GameScoreSumResult = { result: number; calculations: string };

/** PLAYERS */
export type Player = {
  name: string;
  wonder: string;
  score: PlayerScore;
};
export type PlayerScore = {
  [key: string]: number | undefined;
};
export type PlayerScoreKey = keyof PlayerScore;

/** ROUTING */
export type Route = {
  id: string;
  path: string;
  exact?: boolean;
  routes?: Route[];
  color?: string;
  component: Function;
  error?: ({ game, players }: { game: Game; players: Player[] }) => string;
};

export type User = {
  uid: string;
};
