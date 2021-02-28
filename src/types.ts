/** GAME */
export interface ICoreGame {
  maxPlayers: number;
  wonders: string[];
  scores: IGameScore[];
}
export interface IGameScore {
  id: string;
  color: string;
  counters: {
    id: string;
    min?: number;
    max?: number;
  }[];
  sum?: (score: IPlayerScore) => number;
}
export type TBaseGame = ICoreGame & {
  addons: string[];
};
export type TAddonGame = ICoreGame & {
  id: string;
};

/** PLAYERS */
export interface IPlayer {
  name: string;
  wonder: string;
  score: IPlayerScore;
}
export interface IPlayerScore {
  [key: string]: number | undefined;
}
export type TPlayerScoreKey = keyof IPlayerScore;

/** ROUTING */
export interface IRoute {
  id: string;
  path: string;
  exact?: boolean;
  routes?: IRoute[];
  color?: string;
  component: Function;
  error?: ({ game, players }: { game: TBaseGame; players: IPlayer[] }) => string;
}
