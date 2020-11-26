import * as React from 'react';
import {Link} from "react-router-dom";
import ROUTES from './../../config/routes';
import {IRoutes} from "../../types";
import { useLocation } from 'react-router-dom'
import {AppBar, Tabs, Tab} from '@material-ui/core';
import {Redirect} from "react-router-dom";
import {useState, useEffect, useContext} from "react";
import {AddonsContext} from "../App/App";

const DEFAULT_ROUTE = '/';

export default function Navigation() {
	const addonsContext = useContext(AddonsContext);

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
			isAvailable = route.addon ? Boolean(addonsContext.state[route.addon]) : true;
		}

		setIsRouteAvailable(isAvailable);
		setCurrentPath(isAvailable ? location.pathname : DEFAULT_ROUTE);
	}, [location, addonsContext.state]);

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
						return addonKey ? addonsContext.state[addonKey] : true;
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