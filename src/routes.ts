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
	},
	cities: {
		title: 'CITIES',
		path: '/cities',
		scores: ['cities'],
		addon: 'cities'
	},
	debt: {
		title: 'DEBT',
		path: '/debt',
		scores: ['debt'],
		addon: 'cities',
		max: 0
	},
	leaders: {
		title: 'LEADERS',
		path: '/leaders',
		scores: ['leaders'],
		addon: 'leaders'
	}
};

export default ROUTES;