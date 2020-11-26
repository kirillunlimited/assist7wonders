import Score from "../../components/Score/Score";
import React, {useContext} from "react";
import {TScoreKeys} from "../../types";
import styles from './Scores.module.css';
import {PlayersContext} from "../App/App";

interface IProps {
	// players: Array<IPlayer>;
	scores: Array<TScoreKeys>;
	// handleChange: (name: string, scoreKey: TScoreKeys, value: number) => void;
	max?: number;
}

export default function Scores(props: IProps) {
	const playersContext = useContext(PlayersContext);

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
								handleChange={(value: number) => playersContext.dispatch({type: 'update', payload: {name: player.name, scoreKey, value}})}
								max={props.max}
							/>
						)}
					</div>
				</div>)
			}
		</div>
	)
}