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
	cities: number;
	debt: number;
	leaders: number;
}

export type TScoreKeys = keyof IScore;

export type ScienceParts = {
	gear: number;
	compass: number;
	tablet: number;
}

interface IPlayer {
	name: string;
	score: IScore
}

export type TPlayers = IPlayer[];

export interface IRoute {
	path: string;
	key: string;
	label?: string;
	title?: string;
	exact?: boolean,
	component: Function;
	routes?: TRoutes;
	available?: Function;
}

export type TRoutes = IRoute[];

export interface IAddons {
	cities: boolean;
	leaders: boolean;
}

export interface IAddonConfig {
	key: keyof IAddons;
	label: string;
	scores: Array<TScoreKeys>;
}

export type TAddonsConfig = IAddonConfig[];
