import * as React from 'react';
import Box from "@material-ui/core/Box";
import {makeStyles, useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

interface IProps {
	children: JSX.Element,
}

const useStyles = makeStyles(theme => ({
	layout: {
		paddingTop: '56px',
		[theme.breakpoints.up('sm')]: {
			paddingTop: '64px',
		},
	},
}));

export default function Layout(props: IProps) {
	const classes = useStyles();
	const theme = useTheme();
	const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));

	return (
		<Box
			width="100%"
			display="flex"
			flexDirection={bigScreen ? 'row' : 'column'}
			className={classes.layout}
		>
			{props.children}
		</Box>
	)
}
