import * as React from 'react';
import {Link} from "react-router-dom";
import ROUTES from './../../routes';
import {IRoutes} from "../../types";
import { useLocation } from 'react-router-dom'
import styles from './Navigation.module.css';

import {AppBar, Tabs, Tab} from '@material-ui/core';

export default function Navigation() {
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
				{(Object.keys(ROUTES) as Array<keyof IRoutes>).map(route =>
					<Tab
						key={route}
						label={ROUTES[route].title}
						component={Link}
						value={ROUTES[route].path}
						to={ROUTES[route].path}
						classes={{root: styles.root}}
					/>
				)}
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