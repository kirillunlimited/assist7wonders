import * as React from 'react';
import {Link} from "react-router-dom";
import ROUTES from './../../routes';
import {IRoutes, IAddons} from "../../types";
import { useLocation } from 'react-router-dom'
import {AppBar, Tabs, Tab} from '@material-ui/core';

interface IProps {
	addons: IAddons;
}

export default function Navigation(props: IProps) {
	const location = useLocation();

	return(
		<AppBar position="static">
			<Tabs value={location.pathname} variant="scrollable" scrollButtons="auto">
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