import React, {useContext} from 'react';
import { Route, Switch } from 'react-router-dom';
import {IAddons, IRoute, IRoutes, TScoreKeys} from "../types";
import {IProps as IScoresProps} from '../containers/Scores/Scores';

import Home from '../containers/Home/Home';
import Scores from '../containers/Scores/Scores';
import Total from '../containers/Total/Total';

import {AddonsContext} from "../containers/App/App";
import {isScoreAvailable} from './addons'

const ROUTES: IRoutes = [
	{
		path: '/',
		key: 'root',
		label: 'Главная',
		title: '7 Wonders',
		exact: true,
		component: Home
	},
	{
		path: '/scores',
		key: 'scores',
		component: RenderRoutes,
		routes: [
		{
			path: '/scores/military',
			key: 'military',
			label: 'Military',
			title: 'Military',
			exact: true,
			component: () => Scores({
				scores: ['military']
			})
		},
		{
			path: '/scores/treasury',
			key: 'treasury',
			label: 'Treasury',
			title: 'Treasury',
			exact: true,
			component: () => Scores({
				scores: ['treasury']
			})
		},
		{
			path: '/scores/wonders',
			key: 'wonders',
			label: 'Wonders',
			title: 'Wonders',
			exact: true,
			component: () => Scores({
			  scores: ['wonders']
			})
		},
		{
			path: '/scores/civilian',
			key: 'civilian',
			label: 'Civilian',
			title: 'Civilian',
			exact: true,
			component: () => Scores({
			  scores: ['civilian']
			})
		},
		{
			path: '/scores/commerce',
			key: 'commerce',
			label: 'Commerce',
			title: 'Commerce',
			exact: true,
			component: () => Scores({
			  scores: ['commerce']
			})
		},
		{
			path: '/scores/guild',
			key: 'guild',
			label: 'Guild',
			title: 'Guild',
			exact: true,
			component: () => Scores({
			  scores: ['guild']
			})
		},
		{
			path: '/scores/science',
			key: 'science',
			label: 'Science',
			title: 'Science',
			exact: true,
			component: () => Scores({
			  scores: ['compass', 'tablet', 'gear']
			})
		},
		{
			path: '/scores/cities',
			key: 'cities',
			label: 'Cities',
			title: 'Cities',
			exact: true,
			component: ({addons}: {addons: IAddons}) => RenderScoresRoute({
				scores: ['cities']
			}, 'cities', addons),
			available: (addons: IAddons) => isScoreRouteAvailable('cities', addons)
		},
		{
			path: '/scores/debt',
			key: 'debt',
			label: 'Debt',
			title: 'Debt',
			exact: true,
			component: ({addons}: {addons: IAddons}) => RenderScoresRoute({
				scores: ['debt'],
		  		max: 0
			}, 'debt', addons),
			available: (addons: IAddons) => isScoreRouteAvailable('debt', addons)
		},
		{
			path: '/scores/leaders',
			key: 'leaders',
			label: 'Leaders',
			title: 'Leaders',
			exact: true,
			component: ({addons}: {addons: IAddons}) => RenderScoresRoute({
				scores: ['leaders']
			}, 'leaders', addons),
			available: (addons: IAddons) => isScoreRouteAvailable('leaders', addons)
			}
		]
	},
	{
		path: '/total',
		key: 'total',
		label: 'Total',
		title: 'Total',
		exact: true,
		component: Total
	}
];

export default ROUTES;

function RouteWithSubRoutes(route: IRoute) {
	const addonsContext = useContext(AddonsContext);

	return (
		<div>
		  {route.title && <h1>{route.title}</h1>}
		  <Route
			path={route.path}
			exact={route.exact}
			render={props => <route.component {...props} addons={addonsContext.state} routes={route.routes} />}
		  />
		</div>
	);
}

export function RenderRoutes({ routes }: { routes: IRoutes}) {
	return (
		<Switch>
			{routes.map(route => {
				return <RouteWithSubRoutes {...route} key={route.key} />;
			})}
			<Route component={() => <h1>Страница не найдена</h1>} />
		</Switch>
	);
}

function RenderScoresRoute(props: IScoresProps, score: TScoreKeys, addons: IAddons) {
	return isScoreAvailable(score, addons) ? Scores(props) : <h2>Дополнение отключено</h2>;
}

/** Needed for navigation menu render */
function isScoreRouteAvailable(score: TScoreKeys, addons: IAddons) {
	return isScoreAvailable(score, addons);
}