import {IRoutes} from "./types";

const ROUTES: IRoutes = {
	military: {
		title: 'MILITARY',
		path: '/military',
		scores: ['military']
	},
	treasury: {
		title: 'TREASURY',
		path: '/treasury',
		scores: ['treasury']
	},
	wonders: {
		title: 'WONDERS',
		path: '/wonders',
		scores: ['wonders']
	},
	civilian: {
		title: 'CIVILIAN',
		path: '/civilian',
		scores: ['civilian']
	},
	commerce: {
		title: 'COMMERCE',
		path: '/commerce',
		scores: ['commerce']
	},
	guild: {
		title: 'GUILD',
		path: '/guild',
		scores: ['guild']
	},
	science: {
		title: 'SCIENCE',
		path: '/science',
		scores: ['compass', 'tablet', 'gear']
	}
};

export default ROUTES;