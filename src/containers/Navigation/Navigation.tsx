import * as React from 'react';
import {Link} from "react-router-dom";
import {IRoutes, IAddons} from "../../types";
import { useLocation } from 'react-router-dom'
import {AppBar, Tabs, Tab} from '@material-ui/core';

interface IProps {
	routes: IRoutes;
	addons: IAddons;
}

export default function Navigation(props: IProps) {
	const location = useLocation();

	function renderTabs(routes: IRoutes): Array<React.ReactNode> {
		return routes.map(route => {
			if (route.routes) {
				return renderTabs(route.routes);
			} else {
				return <Tab
					disabled={route.available && route.available(props.addons) === false}
					key={route.key}
					label={route.label}
					component={Link}
					value={route.path}
					to={route.path}
				/>
			}
		});
	}

	return(
		<AppBar position="static">
			<Tabs value={location.pathname} variant="scrollable" scrollButtons="auto">
				{renderTabs(props.routes)}
			</Tabs>
		</AppBar>
	)
}