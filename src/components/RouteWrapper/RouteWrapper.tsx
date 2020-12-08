import * as React from 'react';
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import {makeStyles, useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

interface IProps {
	children: JSX.Element,
}

const useStyles = makeStyles((theme) => ({
	card: {
		padding: theme.spacing(2),
		[theme.breakpoints.up('sm')]: {
			margin: theme.spacing(4),
		},
	}
}));

export default function RouteWrapper(props: IProps) {
	const classes = useStyles();
	const theme = useTheme();
	const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));

	return (
		<Box width="100%">
			<Container maxWidth="md" disableGutters>
				{bigScreen ? <Card className={classes.card} elevation={3}>
					{props.children}
				</Card> : <div className={classes.card}>
					{props.children}
				</div>}
			</Container>
		</Box>
	)
}
