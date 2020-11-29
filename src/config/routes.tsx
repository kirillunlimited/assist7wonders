import React, {useContext} from 'react';
import { Route, Switch } from 'react-router-dom';
import {IAddons, IPlayer, IRoute, IRoutes, TScoreKeys} from "../types";
import {IProps as IScoresProps} from '../containers/Scores/Scores';

import Home from '../containers/Home/Home';
import Scores from '../containers/Scores/Scores';
import Total from '../containers/Total/Total';

import {AddonsContext, PlayersContext} from "../containers/App/App";
import {isScoresAvailable} from './addons'

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
				component: ({players, addons}: {players: IPlayer[], addons: IAddons}) => RenderScoresRoute({
					scores: ['military']
				}, ['military'], players, addons),
				available: ({players, addons}: {players: IPlayer[], addons: IAddons}) => isScoreRouteAvailable(['military'], players, addons)
			},
			{
				path: '/scores/treasury',
				key: 'treasury',
				label: 'Treasury',
				title: 'Treasury',
				exact: true,
				component: ({players, addons}: {players: IPlayer[], addons: IAddons}) => RenderScoresRoute({
					scores: ['treasury']
				}, ['treasury'], players, addons),
				available: ({players, addons}: {players: IPlayer[], addons: IAddons}) => isScoreRouteAvailable(['treasury'], players, addons)
			},
			{
				path: '/scores/wonders',
				key: 'wonders',
				label: 'Wonders',
				title: 'Wonders',
				exact: true,
				component: ({players, addons}: {players: IPlayer[], addons: IAddons}) => RenderScoresRoute({
				  scores: ['wonders']
				}, ['wonders'], players, addons),
				available: ({players, addons}: {players: IPlayer[], addons: IAddons}) => isScoreRouteAvailable(['wonders'], players, addons)
			},
			{
				path: '/scores/civilian',
				key: 'civilian',
				label: 'Civilian',
				title: 'Civilian',
				exact: true,
				component: ({players, addons}: {players: IPlayer[], addons: IAddons}) => RenderScoresRoute({
				  scores: ['civilian']
				}, ['civilian'], players, addons),
				available: ({players, addons}: {players: IPlayer[], addons: IAddons}) => isScoreRouteAvailable(['civilian'], players, addons)
			},
			{
				path: '/scores/commerce',
				key: 'commerce',
				label: 'Commerce',
				title: 'Commerce',
				exact: true,
				component: ({players, addons}: {players: IPlayer[], addons: IAddons}) => RenderScoresRoute({
				  scores: ['commerce']
				}, ['commerce'], players, addons),
				available: ({players, addons}: {players: IPlayer[], addons: IAddons}) => isScoreRouteAvailable(['commerce'], players, addons)
			},
			{
				path: '/scores/guild',
				key: 'guild',
				label: 'Guild',
				title: 'Guild',
				exact: true,
				component: ({players, addons}: {players: IPlayer[], addons: IAddons}) => RenderScoresRoute({
				  scores: ['guild']
				}, ['guild'], players, addons),
				available: ({players, addons}: {players: IPlayer[], addons: IAddons}) => isScoreRouteAvailable(['guild'], players, addons)
			},
			{
				path: '/scores/science',
				key: 'science',
				label: 'Science',
				title: 'Science',
				exact: true,
				component: ({players, addons}: {players: IPlayer[], addons: IAddons}) => RenderScoresRoute({
				  scores: ['compass', 'tablet', 'gear']
				}, ['compass', 'tablet', 'gear'], players, addons),
				available: ({players, addons}: {players: IPlayer[], addons: IAddons}) => isScoreRouteAvailable(['compass', 'tablet', 'gear'], players, addons)
			},
			{
				path: '/scores/cities',
				key: 'cities',
				label: 'Cities',
				title: 'Cities',
				exact: true,
				component: ({players, addons}: {players: IPlayer[], addons: IAddons}) => RenderScoresRoute({
					scores: ['cities']
				}, ['cities'], players, addons),
				available: ({players, addons}: {players: IPlayer[], addons: IAddons}) => isScoreRouteAvailable(['cities'], players, addons)
			},
			{
				path: '/scores/debt',
				key: 'debt',
				label: 'Debt',
				title: 'Debt',
				exact: true,
				component: ({players, addons}: {players: IPlayer[], addons: IAddons}) => RenderScoresRoute({
					scores: ['debt'],
					max: 0
				}, ['debt'], players, addons),
				available: ({players, addons}: {players: IPlayer[], addons: IAddons}) => isScoreRouteAvailable(['debt'], players, addons)
			},
			{
				path: '/scores/leaders',
				key: 'leaders',
				label: 'Leaders',
				title: 'Leaders',
				exact: true,
				component: ({players, addons}: {players: IPlayer[], addons: IAddons}) => RenderScoresRoute({
					scores: ['leaders']
				}, ['leaders'], players, addons),
				available: ({players, addons}: {players: IPlayer[], addons: IAddons}) => isScoreRouteAvailable(['leaders'], players, addons)
			}
		]
	},
	{
		path: '/total',
		key: 'total',
		label: 'Total',
		title: 'Total',
		exact: true,
		component: ({players}: {players: IPlayer[]}) => RouteRenderer(Total, players),
		available: ({players}: {players: IPlayer[]}) => isRouteAvailable(players)
	}
];

export default ROUTES;

function RouteWithSubRoutes(route: IRoute) {
	const playersContext = useContext(PlayersContext);
	const addonsContext = useContext(AddonsContext);

	return (
		<div>
		  {route.title && <h1>{route.title}</h1>}
		  <Route
			path={route.path}
			exact={route.exact}
			render={props => <route.component
				{...props}
				routes={route.routes}
				players={playersContext.state}
				addons={addonsContext.state}
			/>}
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

function isRouteAvailable(players: IPlayer[]) {
	return players.length > 1;
}

function RenderScoresRoute(props: IScoresProps, scores: TScoreKeys[], players: IPlayer[], addons: IAddons) {
	return isRouteAvailable(players)
		? isScoresAvailable(scores, addons)
			? Scores(props)
			: <h2>Дополнение отключено</h2>
		: <h2>Добавьте больше игроков</h2>;
}

function RouteRenderer(Component: Function, players: IPlayer[]) {
	return isRouteAvailable(players) ? <Component /> : <h2>Добавьте больше игроков</h2>;
}

/** Needed for navigation menu render */
function isScoreRouteAvailable(scores: TScoreKeys[], players: IPlayer[], addons: IAddons) {
	return isRouteAvailable(players) ? isScoresAvailable(scores, addons) : false;
}