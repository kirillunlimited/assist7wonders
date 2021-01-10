import React from "react";
import Avatar from '@material-ui/core/Avatar';
import styles from './Profile.module.css';
import {useTheme, makeStyles, Theme} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { blue } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';

export interface IProps {
	name: string;
}

const useStyles = makeStyles((theme: Theme) => ({
	avatar: {
		color: theme.palette.getContrastText(blue[500]),
		backgroundColor: blue[500],
	},
}));

/* Get first 2 capital letters of the name */
const getAvatarText = (name: string) => {
	return name
		.split(' ')
		.reduce((acc, word) => word ? acc + word[0] : acc, '')
		.substring(0,2)
		.toUpperCase();
};

export default function Scores(props: IProps) {
	const classes = useStyles();
	const theme = useTheme();
	const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));
	const avatarText = getAvatarText(props.name);

	return(
		<div className={`${styles.player} ${!bigScreen && styles.sm}`}>
			<Avatar className={classes.avatar} alt={props.name}>{avatarText}</Avatar>
			<div className={styles.name}>
				<Typography variant="body2">
					{props.name}
				</Typography>
			</div>
		</div>
	)
}