import Score from "../../components/Score/Score";
import React, {useContext} from "react";
import {TScoreKey} from "../../types";
import {PlayersContext} from "../App/App";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Profile from '../../components/Profile/Profile';
import styles from './Scores.module.css';

export interface IProps {
	scores: TScoreKey[];
	max?: number;
}

export default function Scores(props: IProps) {
	const playersContext = useContext(PlayersContext);

	function onChange(name: string, scoreKey: TScoreKey, value: number) {
		playersContext.dispatch({type: 'UPDATE', payload: {name, scoreKey, value}});
	}

	return(
		<TableContainer>
			<Table>
				<TableBody>
					{playersContext.state.map((player) =>
						<TableRow key={player.name}>
							<TableCell className={styles.td}>
								<Profile name={player.name} />
							</TableCell>
							<TableCell className={styles.td}>
								{props.scores.map((scoreKey, index, arr) =>
									<Score
										key={scoreKey}
										scoreKey={scoreKey}
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