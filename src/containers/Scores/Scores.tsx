import Score from "../../components/Score/Score";
import React, {useContext} from "react";
import {TScoreKeys} from "../../types";
import {PlayersContext} from "../App/App";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {makeStyles} from "@material-ui/core/styles";
import Avatar from '@material-ui/core/Avatar';

export interface IProps {
	scores: Array<TScoreKeys>;
	max?: number;
}

const useStyles = makeStyles({
	td: {
		width: '100%'
	},
	tdScore: {
		width: '0.1%',
		whiteSpace: 'nowrap'
	}
});

export default function Scores(props: IProps) {
	const playersContext = useContext(PlayersContext);
	const classes = useStyles();

	function onChange(name: string, scoreKey: TScoreKeys, value: number) {
		playersContext.dispatch({type: 'UPDATE', payload: {name, scoreKey, value}});
	}

	return(

		<TableContainer>
			<Table>
				<TableBody>
					{playersContext.state.map((player) =>
						<TableRow key={player.name}>
							<TableCell className={classes.td}>
								<div>
									<Avatar>{player.name[0]}</Avatar>
									{player.name}
								</div>
							</TableCell>
							<TableCell className={classes.tdScore}>
								{props.scores.map((scoreKey, index, arr) =>
									<Score
										key={scoreKey}
										title={arr.length > 1 ? scoreKey : ''}
										value={player.score[scoreKey]}
										handleChange={(value: number) => onChange(player.name, scoreKey, value)}
										max={props.max}
									/>
								)}
							</TableCell>
						</TableRow>)
					}
				</TableBody>
			</Table>
		</TableContainer>
	)
}