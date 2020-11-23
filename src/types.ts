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
	leaders: number;
}

export type TScoreKeys = keyof IScore;

export type ScienceParts = {
	gear: number;
	compass: number;
	tablet: number;
}

export interface IPlayer {
	name: string;
	score: IScore
}

export interface IRoutes {
	military: IRoute;
	treasury: IRoute;
	wonders: IRoute;
	civilian: IRoute;
	commerce: IRoute;
	guild: IRoute;
	science: IRoute;
	cities: IRoute;
	leaders: IRoute;
}

export interface IRoute {
	title: string;
	path: string;
	scores: Array<TScoreKeys>;
	addon?: keyof IAddons;
}

export interface IAddons {
	cities: boolean;
	leaders: boolean;
}

export interface IAddonsConfig {
	cities: IAddonConfig;
	leaders: IAddonConfig;
}

export interface IAddonConfig {
	label: string;
}