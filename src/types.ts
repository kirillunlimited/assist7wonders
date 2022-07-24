/** GAME */
export type CoreGameParams = {
  maxPlayers: number;
  wonders: string[];
  scores: GameScore[];
};
export type GameParams = CoreGameParams & {
  gameId: number;
  addons: string[];
};
export type AddonGameParams = CoreGameParams & {
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

export type GameState = {
  gameId: number;
  addons: string[];
  players: Player[];
  isLast: boolean;
  modified: number;
};

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
  error?: ({ game, players }: { game: GameParams; players: Player[] }) => string;
};

/** USER */
export type User = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
};
