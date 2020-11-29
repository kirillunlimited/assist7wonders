import Score from "../../components/Score/Score";
import React, {useContext} from "react";
import {TScoreKeys} from "../../types";
import styles from './Scores.module.css';
import {PlayersContext} from "../App/App";

export interface IProps {
	scores: Array<TScoreKeys>;
	max?: number;
}

export default function Scores(props: IProps) {
	const playersContext = useContext(PlayersContext);

	function onChange(name: string, scoreKey: TScoreKeys, value: number) {
		playersContext.dispatch({type: 'UPDATE', payload: {name, scoreKey, value}});
	}

	return(
		<div>
			{playersContext.state.map((player, index) =>
				<div className={styles.player} key={index}>
					<p className={styles.name}>{player.name}</p>
					<div className={styles.scores}>
						{props.scores.map((scoreKey, index, arr) =>
							<Score
								key={index}
								title={arr.length > 1 ? scoreKey : ''}
								value={player.score[scoreKey]}
								handleChange={(value: number) => onChange(player.name, scoreKey, value)}
								max={props.max}
							/>
						)}
					</div>
				</div>)
			}
		</div>
	)
}