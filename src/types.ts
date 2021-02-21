export interface IScore {
  military: number;
  treasury: number;
  wonders: number;
  civilian: number;
  commerce: number;
  guild: number;
  compass: number;
  tablet: number;
  gear: number;
  wildcards: number;
  cities: number;
  debt: number;
  leaders: number;
}

export type TScoreKey = keyof IScore;

export type ScienceParts = {
  gear: number;
  compass: number;
  tablet: number;
};

interface IPlayer {
  name: string;
  score: IScore;
}

export type TPlayers = IPlayer[];

export interface IRoute {
  path: string;
  key: string;
  label?: string;
  title?: string;
  exact?: boolean;
  component: Function;
  routes?: TRoutes;
  available?: Function;
  color?: string;
  sum?: Function;
}

export type TRoutes = IRoute[];

export interface IAddons {
  cities: boolean;
  leaders: boolean;
}

export interface IAddonConfig {
  key: keyof IAddons;
  label: string;
  scores: TScoreKey[];
}

export type TAddonsConfig = IAddonConfig[];
