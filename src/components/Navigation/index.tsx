import * as React from 'react';
import {Link} from "react-router-dom";
import ROUTES from './../../routes';
import {IRoutes, IAddons} from "../../types";
import { useLocation } from 'react-router-dom'
import {AppBar, Tabs, Tab} from '@material-ui/core';
import {Redirect} from "react-router-dom";
import {useState, useEffect} from "react";

interface IProps {
	addons: IAddons;
}

const DEFAULT_ROUTE = '/';

export default function Navigation(props: IProps) {
	const location = useLocation();
	const [isRouteAvailable, setIsRouteAvailable] = useState(true);
	const [currentPath, setCurrentPath] = useState(DEFAULT_ROUTE);

	useEffect(() => {
		const routeKey = (Object.keys(ROUTES) as Array<keyof IRoutes>).find(route => {
			return ROUTES[route].path === location.pathname;
		});

		let isAvailable = true;

		if (routeKey) {
			const route = ROUTES[routeKey];
			isAvailable = route.addon ? Boolean(props.addons[route.addon]) : true;
		}

		setIsRouteAvailable(isAvailable);
		setCurrentPath(isAvailable ? location.pathname : DEFAULT_ROUTE);
	}, [location, props.addons]);

	return(
		<AppBar position="static">
			{!isRouteAvailable && <Redirect to={DEFAULT_ROUTE} />}

			<Tabs value={currentPath} variant="scrollable" scrollButtons="auto">
				<Tab
					label="Главная"
					component={Link}
					value="/"
					to="/"
				/>
				{(Object.keys(ROUTES) as Array<keyof IRoutes>)
					.filter(route => {
						const addonKey = ROUTES[route].addon;
						return addonKey ? props.addons[addonKey] : true;
					})
					.map(route =>
						<Tab
							key={route}
							label={ROUTES[route].title}
							component={Link}
							value={ROUTES[route].path}
							to={ROUTES[route].path}
						/>
					)
				}
				<Tab
					label="Итог"
					component={Link}
					value="/total"
					to="/total"
				/>
			</Tabs>
		</AppBar>
	)
}