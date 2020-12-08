import * as React from 'react';
import Box from "@material-ui/core/Box";
import {useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

interface IProps {
	children: JSX.Element,
}

export default function Layout(props: IProps) {
	const theme = useTheme();
	const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));

	return (
		<Box width="100%" display="flex" flexDirection={bigScreen ? 'row' : 'column'}>
			{props.children}
		</Box>
	)
}
