import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {IAddons, TPlayers, IRoute, TRoutes, TScoreKeys} from "../types";
import {IProps as IScoresProps} from '../containers/Scores/Scores';

import Home from '../containers/Home/Home';
import Scores from '../containers/Scores/Scores';
import Total from '../containers/Total/Total';

import {isScoresAvailable} from './addons';

interface IRouteContexts {
	contexts: {
		players: TPlayers;
		addons: IAddons;
	}
}

const MESSAGES = {
	NOT_ENOUGH_PLAYERS: 'Недостаточно игроков. Добавьте не менее 2 игроков.',
	ADDON_IS_OFF: 'Дополнение отключено.'
}

const ROUTES: TRoutes = [
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
				component: ({players, addons}: {players: TPlayers, addons: IAddons}) => RenderScores({
					scores: ['military']
				}, ['military'], players, addons),
				available: ({players, addons}: {players: TPlayers, addons: IAddons}) => isScoreRouteAvailable(['military'], players, addons),
				color: '#D81F25'
			},
			{
				path: '/scores/treasury',
				key: 'treasury',
				label: 'Treasury',
				title: 'Treasury',
				exact: true,
				component: ({players, addons}: {players: TPlayers, addons: IAddons}) => RenderScores({
					scores: ['treasury']
				}, ['treasury'], players, addons),
				available: ({players, addons}: {players: TPlayers, addons: IAddons}) => isScoreRouteAvailable(['treasury'], players, addons),
				color: '#AA8E69'
			},
			{
				path: '/scores/wonders',
				key: 'wonders',
				label: 'Wonders',
				title: 'Wonders',
				exact: true,
				component: ({players, addons}: {players: TPlayers, addons: IAddons}) => RenderScores({
				  scores: ['wonders']
				}, ['wonders'], players, addons),
				available: ({players, addons}: {players: TPlayers, addons: IAddons}) => isScoreRouteAvailable(['wonders'], players, addons),
				color: '#E8C44A'
			},
			{
				path: '/scores/civilian',
				key: 'civilian',
				label: 'Civilian',
				title: 'Civilian',
				exact: true,
				component: ({players, addons}: {players: TPlayers, addons: IAddons}) => RenderScores({
				  scores: ['civilian']
				}, ['civilian'], players, addons),
				available: ({players, addons}: {players: TPlayers, addons: IAddons}) => isScoreRouteAvailable(['civilian'], players, addons),
				color: '#2376CF'
			},
			{
				path: '/scores/commerce',
				key: 'commerce',
				label: 'Commerce',
				title: 'Commerce',
				exact: true,
				component: ({players, addons}: {players: TPlayers, addons: IAddons}) => RenderScores({
				  scores: ['commerce']
				}, ['commerce'], players, addons),
				available: ({players, addons}: {players: TPlayers, addons: IAddons}) => isScoreRouteAvailable(['commerce'], players, addons),
				color: '#E8A33C'
			},
			{
				path: '/scores/guild',
				key: 'guild',
				label: 'Guild',
				title: 'Guild',
				exact: true,
				component: ({players, addons}: {players: TPlayers, addons: IAddons}) => RenderScores({
				  scores: ['guild']
				}, ['guild'], players, addons),
				available: ({players, addons}: {players: TPlayers, addons: IAddons}) => isScoreRouteAvailable(['guild'], players, addons),
				color: '#91288F'
			},
			{
				path: '/scores/science',
				key: 'science',
				label: 'Science',
				title: 'Science',
				exact: true,
				component: ({players, addons}: {players: TPlayers, addons: IAddons}) => RenderScores({
				  scores: ['compass', 'tablet', 'gear']
				}, ['compass', 'tablet', 'gear'], players, addons),
				available: ({players, addons}: {players: TPlayers, addons: IAddons}) => isScoreRouteAvailable(['compass', 'tablet', 'gear'], players, addons),
				color: '#006118'
			},
			{
				path: '/scores/cities',
				key: 'cities',
				label: 'Cities',
				title: 'Cities',
				exact: true,
				component: ({players, addons}: {players: TPlayers, addons: IAddons}) => RenderScores({
					scores: ['cities']
				}, ['cities'], players, addons),
				available: ({players, addons}: {players: TPlayers, addons: IAddons}) => isScoreRouteAvailable(['cities'], players, addons),
				color: '#545454'
			},
			{
				path: '/scores/debt',
				key: 'debt',
				label: 'Debt',
				title: 'Debt',
				exact: true,
				component: ({players, addons}: {players: TPlayers, addons: IAddons}) => RenderScores({
					scores: ['debt'],
					max: 0
				}, ['debt'], players, addons),
				available: ({players, addons}: {players: TPlayers, addons: IAddons}) => isScoreRouteAvailable(['debt'], players, addons),
				color: '#8F7B66'
			},
			{
				path: '/scores/leaders',
				key: 'leaders',
				label: 'Leaders',
				title: 'Leaders',
				exact: true,
				component: ({players, addons}: {players: TPlayers, addons: IAddons}) => RenderScores({
					scores: ['leaders']
				}, ['leaders'], players, addons),
				available: ({players, addons}: {players: TPlayers, addons: IAddons}) => isScoreRouteAvailable(['leaders'], players, addons),
				color: '#BCBCBC'
			}
		]
	},
	{
		path: '/total',
		key: 'total',
		label: 'Total',
		title: 'Total',
		exact: true,
		component: ({players}: {players: TPlayers}) => RenderRoute(Total, players),
		available: ({players}: {players: TPlayers}) => isRouteAvailable(players)
	}
];

export default ROUTES;

export function RenderRoutes({ routes, players, addons }: { routes: TRoutes, players: TPlayers, addons: IAddons}) {
	return (
		<Switch>
			{routes.map(route => <RouteWithSubRoutes
				{...route}
				key={route.key}
				contexts={{players, addons}}
			/>)}
			<Route component={() => <h1>Страница не найдена</h1>} />
		</Switch>
	);
}

function RouteWithSubRoutes(payload: IRoute & IRouteContexts) {
	const {players, addons} = payload.contexts;
	return (
		<div>
		  {payload.title && <h1>{payload.title}</h1>}
		  <Route
			path={payload.path}
			exact={payload.exact}
			render={props => <payload.component
				{...props}
				routes={payload.routes}
				players={players}
				addons={addons}
			/>}
		  />
		</div>
	);
}

function isRouteAvailable(players: TPlayers): boolean {
	return players.length > 1;
}

/** Needed for navigation menu render */
function isScoreRouteAvailable(scores: TScoreKeys[], players: TPlayers, addons: IAddons): boolean {
	return isRouteAvailable(players) ? isScoresAvailable(scores, addons) : false;
}

function RenderScores(props: IScoresProps, scores: TScoreKeys[], players: TPlayers, addons: IAddons) {
	return isRouteAvailable(players)
		? isScoresAvailable(scores, addons)
			? Scores(props)
			: <h2>{MESSAGES.ADDON_IS_OFF}</h2>
		: <h2>{MESSAGES.NOT_ENOUGH_PLAYERS}</h2>;
}

function RenderRoute(Component: Function, players: TPlayers) {
	return isRouteAvailable(players) ? <Component /> : <h2>{MESSAGES.NOT_ENOUGH_PLAYERS}</h2>;
}