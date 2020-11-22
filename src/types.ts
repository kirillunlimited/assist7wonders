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
}

export interface IRoute {
	title: string;
	path: string;
	scores: Array<TScoreKeys>;
}