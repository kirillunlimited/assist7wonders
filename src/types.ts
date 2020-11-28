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

export interface IPlayer {
	name: string;
	score: IScore
}

export interface IRoute {
	path: string;
	key: string;
	label?: string;
	title?: string;
	exact?: boolean,
	component: Function;
	routes?: IRoutes;
	available?: Function;
}

export type IRoutes = Array<IRoute>;

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
	scores: Array<TScoreKeys>;
}