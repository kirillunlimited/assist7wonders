import React from "react";
import Avatar from '@material-ui/core/Avatar';
import styles from './Profile.module.css';
import {useTheme} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export interface IProps {
	name: string;
}

export default function Scores(props: IProps) {
	const theme = useTheme();
	const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));
	return(
		<div className={`${styles.player} ${!bigScreen && styles.sm}`}>
			<Avatar>{props.name[0]}</Avatar>
			<span className={styles.name}>{props.name}</span>
		</div>
	)
}