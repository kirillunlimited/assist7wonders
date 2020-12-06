import * as React from 'react';
import {Link} from "react-router-dom";
import {TRoutes, TPlayers, IAddons} from "../../types";
import { useLocation } from 'react-router-dom'
import {AppBar, Tabs, Tab} from '@material-ui/core';
import {useState, useEffect} from "react";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	indicator: {
		backgroundColor: '#FFF'
	},
	tab: {
		opacity: 1,
		textShadow: '0px 1px 0 #999'
	}
});

interface IProps {
	routes: TRoutes;
	players: TPlayers;
	addons: IAddons;
}

function getFilteredRoutes(routes: TRoutes, players: TPlayers, addons: IAddons) {
	return routes.reduce((routes: TRoutes, route) => {
		const targetRoute = {...route};

		if (targetRoute.routes) {
			// Nested routes
			targetRoute.routes = getFilteredRoutes(targetRoute.routes, players, addons);
		}
		if (targetRoute.available && targetRoute.available({players, addons}) === false) {
			// Skip route
			return routes;
		}
		routes.push(targetRoute);
		return routes;
	}, []);
}

export default function Navigation(props: IProps) {
	const classes = useStyles();
	const location = useLocation();

	const [filteredRoutes, setFilteredRoutes] = useState(props.routes);

	useEffect(() => {
		setFilteredRoutes(getFilteredRoutes(props.routes, props.players, props.addons));
	}, [props.routes, props.players, props.addons]);

	function renderTabs(routes: TRoutes): Array<React.ReactNode> {
		return routes.map(route => {
			if (route.routes) {
				return renderTabs(route.routes);
			} else {
				return <Tab
					key={route.key}
					className={classes.tab}
					label={route.label}
					component={Link}
					value={route.path}
					to={route.path}
					style={{
						backgroundColor: route.color
					}}
				/>
			}
		});
	}

	return(
		<AppBar position="static">
			<Tabs
				classes={{
					indicator: classes.indicator
				}}
				value={location.pathname}
				variant="scrollable"
				scrollButtons="auto"
			>
				{renderTabs(filteredRoutes)}
			</Tabs>
		</AppBar>
	)
}